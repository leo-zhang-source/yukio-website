import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

// The unchanged, previously published v5.3 asset. Never package an installed
// application or a private backup as a public download.
const expected = {
  filename: 'Yukio-5.3-macOS-arm64.zip',
  bytes: 76480917,
  sha256: '9f674e169273521b0033f0daff19a0af0ebdf0151ea45da702bdce7fd129c700',
};
const input = process.argv[2];
if (!input) throw new Error('Usage: node scripts/prepare-download.mjs /path/to/original-release.zip');
const bytes = readFileSync(input);
const sha256 = (data) => createHash('sha256').update(data).digest('hex');
if (bytes.length !== expected.bytes || sha256(bytes) !== expected.sha256) {
  throw new Error('Input is not the exact published Yukio 5.3 Mac archive. No files were written.');
}
const root = fileURLToPath(new URL('../dist/downloads/', import.meta.url));
mkdirSync(`${root}/mac-arm64`, { recursive: true });
const parts = [];
// Each static asset stays below the hosting provider's 25 MiB file limit.
for (let offset = 0; offset < bytes.length; offset += 16 * 1024 * 1024) {
  const part = bytes.subarray(offset, Math.min(offset + 16 * 1024 * 1024, bytes.length));
  const path = `mac-arm64/${String(parts.length + 1).padStart(2, '0')}.bin`;
  writeFileSync(`${root}/${path}`, part);
  parts.push({ path, bytes: part.length, sha256: sha256(part) });
}
writeFileSync(`${root}/manifest.json`, `${JSON.stringify({
  'mac-arm64': {
    ...expected,
    version: '5.3',
    platform: 'macOS 13+ / Apple silicon',
    type: 'application/zip',
    source: 'https://github.com/leozhang8654/yukio-desktop-pet/releases/tag/v5.3',
    parts,
  },
}, null, 2)}\n`);
writeFileSync(`${root}/SHA256SUMS.txt`, `${expected.sha256}  ${expected.filename}\n`);
console.log(`Prepared the original ${expected.filename}: ${parts.length} parts, ${bytes.length} bytes, SHA-256 matched.`);
