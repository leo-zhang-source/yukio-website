import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { brandCopy } from '../dist/brand-copy.js';
const path = fileURLToPath(new URL('../dist/index.html', import.meta.url));
const html = readFileSync(path, 'utf8');
const locale = process.argv[2] ?? 'en';
if (!['en', 'zh'].includes(locale)) throw new Error('Expected en or zh');
const copy = brandCopy[locale];
let count = 0;
const synced = html.replace(/(<([a-z0-9]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)[\s\S]*?<\/\2>/gi, (full, opening, tag, key) => {
  if (!(key in copy)) return full;
  count++;
  return `${opening}${copy[key]}</${tag}>`;
});
writeFileSync(path, synced);
console.log(`Synced ${count} ${locale} brand labels for the initial HTML render.`);
