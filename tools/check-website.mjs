import {readFileSync,existsSync,readdirSync} from 'node:fs';
import {resolve,dirname} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('website');let checked=0;
for(const name of readdirSync(root).filter(n=>n.endsWith('.html'))){const html=readFileSync(resolve(root,name),'utf8');assert(html.includes('lang="de"'));assert(html.includes('name="viewport"'));const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);assert.equal(ids.length,new Set(ids).size,`${name}: duplicate IDs`);for(const m of html.matchAll(/(?:href|src)="([^"]+)"/g)){const target=m[1];if(/^(https?:|mailto:)/.test(target))continue;if(target.startsWith('#')){assert(!target.slice(1)||ids.includes(target.slice(1)),`${name}: missing ${target}`);continue;}const file=target.split('#')[0];assert(existsSync(resolve(dirname(resolve(root,name)),file)),`${name}: missing ${target}`);checked++;}assert(!html.includes('YOUR_'));}
assert(!readFileSync(resolve(root,'app.js'),'utf8').match(/localStorage|document.cookie|innerHTML|fetch\(/));
console.log(`PASS: ${checked} local links/assets, German metadata, unique anchors and tracker-free script.`);
