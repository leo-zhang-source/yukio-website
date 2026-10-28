import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const html = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
const css = ['style.css','buddy.css','pet-carry.css'].map((name) => readFileSync(resolve(root, 'dist', name), 'utf8')).join('\n');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
if (new Set(ids).size !== ids.length) throw new Error('Duplicate HTML ids');
for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
  if (/^(https?:|data:|mailto:)/.test(match[1])) continue;
  if (!existsSync(resolve(root, 'dist', match[1]))) throw new Error(`Missing asset: ${match[1]}`);
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
console.log(`Validated HTML anchors, unique IDs, local asset references and 24 source animation timelines. Static site: ${(size(resolve(root, 'dist')) / 1048576).toFixed(2)} MiB.`);
