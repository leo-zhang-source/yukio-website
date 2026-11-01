import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
const css = ['taste.css','pet-carry.css','downloads.css'].map((name) => readFileSync(resolve(root, 'dist', name), 'utf8')).join('\n');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate HTML ids');
for (const filename of ['index.html', 'download.html', 'source.html']) {
  const page = readFileSync(resolve(root, 'dist', filename), 'utf8');
  const pageIds = [...page.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  if (new Set(pageIds).size !== pageIds.length) throw new Error(`Duplicate HTML ids: ${filename}`);
  for (const match of page.matchAll(/href="#([^"]+)"/g)) if (!pageIds.includes(match[1])) throw new Error(`Missing anchor in ${filename}: ${match[1]}`);
  for (const match of page.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    if (/^(https?:|data:|mailto:)/.test(match[1])) continue;
    const path = match[1].split(/[?#]/)[0];
    if (!existsSync(resolve(root, 'dist', path))) throw new Error(`Missing asset: ${match[1]}`);
  }
}
for (const match of css.matchAll(/url\(['"]?([^'")]+)['"]?\)/g)) {
  if (!existsSync(resolve(root, 'dist', match[1]))) throw new Error(`Missing CSS asset: ${match[1]}`);
}
for (const match of html.matchAll(/href="#([^"]+)"/g)) if (!ids.includes(match[1])) throw new Error(`Missing anchor: ${match[1]}`);
for (const filename of ['motion.json', 'qianxia-motion.json']) {
  const metadata = JSON.parse(readFileSync(resolve(root, 'dist/assets', filename)));
  if (metadata.states.length !== 12) throw new Error('Expected 12 source animations');
  for (const state of metadata.states) {
    const folder = filename === 'motion.json' ? 'motion' : 'qianxia';
    if (!existsSync(resolve(root, 'dist/assets', folder, state.asset))) throw new Error(`Missing ${state.asset}`);
    if (state.sequence.length !== state.durationsMs.length) throw new Error(`Invalid timing: ${state.id}`);
  }
}
function size(path) { return statSync(path).isDirectory() ? readdirSync(path).reduce((sum, name) => sum + size(resolve(path, name)), 0) : statSync(path).size; }
const packages = JSON.parse(readFileSync(resolve(root, 'dist/downloads/manifest.json'), 'utf8'));
for (const entry of Object.values(packages)) {
  const archiveHash = createHash('sha256');
  let bytes = 0;
  for (const part of entry.parts) {
    const data = readFileSync(resolve(root, 'dist/downloads', part.path));
    if (data.length > 25 * 1048576) throw new Error('Download part exceeds static asset limit');
    if (data.length !== part.bytes || createHash('sha256').update(data).digest('hex') !== part.sha256) throw new Error(`Invalid download part: ${part.path}`);
    archiveHash.update(data);
    bytes += data.length;
  }
  if (bytes !== entry.bytes || archiveHash.digest('hex') !== entry.sha256) throw new Error(`Archive differs from published release: ${entry.filename}`);
}
console.log(`Validated 2 pages and the retired-page redirect, local assets, 24 animation timelines and exact installer SHA-256. Static site: ${(size(resolve(root, 'dist')) / 1048576).toFixed(2)} MiB.`);
