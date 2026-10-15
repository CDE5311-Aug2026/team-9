import fs from 'node:fs';
import assert from 'node:assert/strict';
const assets=JSON.parse(fs.readFileSync('src/v2/assets.json'));
let count=0;
for(const group of Object.values(assets))for(const path of Object.values(group)){assert(path.startsWith('/v2/'));assert(fs.statSync('public'+path).size>0,path);count++;}
for(const file of fs.readdirSync('src/v2').filter(f=>f.endsWith('.tsx'))){const source=fs.readFileSync('src/v2/'+file,'utf8');assert(!source.includes('https://www.figma.com/api/mcp/asset'),file);}
console.log(`Verified ${count} local V2 asset references and no expiring runtime asset URLs.`);
