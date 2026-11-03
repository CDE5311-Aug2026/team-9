import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createServer} from 'vite';
// Use the app's resolver for TypeScript imports and JSON asset manifests.
const server = await createServer({server: {middlewareMode: true, hmr: false, ws: false, watch: null}, appType: 'custom'});
let data;
try {
  data = await server.ssrLoadModule('/src/v3/companionData.ts');
} finally {
  await server.close();
}
const {areaContent, getArea, nearbyArea, recommendationReason} = data;
assert.equal(getArea('Amed, Bali')?.key, 'amed');
assert.equal(getArea('Raja Ampat, Indonesia')?.key, 'raja');
assert.equal(getArea('  RAJA AMPat  ')?.key, 'raja');
assert.equal(getArea('Singapore'), undefined, 'Unknown places must not silently show Amed content');
assert.equal(nearbyArea(-8.336, 115.656, 30)?.key, 'amed');
assert.equal(nearbyArea(-0.423, 130.82, 30)?.key, 'raja');
assert.equal(nearbyArea(1.3521, 103.8198, 30), undefined, 'A distant location must not imply arrival at a dive site');
assert.equal(nearbyArea(-8.336, 115.656, 50000), undefined, 'Uncertain GPS must offer correction instead of a confident location');
assert.equal(nearbyArea(NaN, 115.656, 30), undefined);
assert.notDeepEqual(areaContent.amed.marine, areaContent.raja.marine);
assert.notEqual(areaContent.amed.map, areaContent.raja.map);
assert.notEqual(areaContent.amed.study, areaContent.raja.study);
assert.notEqual(areaContent.amed.dives[0].title, areaContent.raja.dives[0].title);
assert.match(recommendationReason({interests:['Marine life'],experience:'',plan:''}), /marine life/);
assert.doesNotMatch(recommendationReason({interests:[],experience:'',plan:''}), /photography/, 'Skipped personalization must not assert photography interest');
for (const file of fs.readdirSync('public/v3/companion')) assert(fs.statSync('public/v3/companion/' + file).size > 1024, 'Empty or placeholder asset: ' + file);
console.log('Verified location matching, unknown-area fallback, personalized copy and companion assets.');
