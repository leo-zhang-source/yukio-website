import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { brandCopy } from '../dist/brand-copy.js';
const path = fileURLToPath(new URL('../dist/index.html', import.meta.url));
const html = readFileSync(path, 'utf8');
let count = 0;
const synced = html.replace(/(<([a-z0-9]+)\b[^>]*\bdata-i18n="([^"]+)"[^>]*>)[\s\S]*?<\/\2>/gi, (full, opening, tag, key) => {
  if (!(key in brandCopy.zh)) return full;
  count++;
  return `${opening}${brandCopy.zh[key]}</${tag}>`;
});
writeFileSync(path, synced);
console.log(`Synced ${count} Chinese brand labels for the initial HTML render.`);
