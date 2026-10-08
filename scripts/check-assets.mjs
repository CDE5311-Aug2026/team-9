import { readFile, readdir, stat } from 'node:fs/promises';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const manifest = JSON.parse(await readFile('docs/asset-manifest.json', 'utf8'));
for (const asset of manifest) {
  assert.ok((await stat(join('public/assets', asset.file))).size > 0, `${asset.file} is empty`);
  if (asset.file.endsWith('.svg')) {
    const svg = await readFile(join('public/assets', asset.file), 'utf8');
    assert.match(svg, /<svg[^>]*width="[\d.]+"[^>]*height="[\d.]+"/, `Missing SVG intrinsic dimensions: ${asset.file}`);
  }
}
async function inspect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await inspect(path);
    else if (/\.(tsx?|css)$/.test(path)) {
      const source = await readFile(path, 'utf8');
      assert.doesNotMatch(source, /https:\/\/www\.figma\.com\/api\/mcp\/asset/, `Temporary Figma URL in ${path}`);
      for (const [, asset] of source.matchAll(/['"]\/assets\/([^'"]+)['"]/g)) {
        assert.ok((await stat(join('public/assets', asset))).size > 0, `Missing referenced asset: ${asset}`);
      }
    }
  }
}
await inspect('src');
console.log(`Verified ${manifest.length} original Figma assets, intrinsic SVG dimensions, and local-only asset references.`);
