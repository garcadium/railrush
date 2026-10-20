import assert from 'node:assert/strict';
const origin='http://localhost:4196';
const htmlResponse=await fetch(origin);assert.equal(htmlResponse.headers.get('cache-control'),'no-store');const html=await htmlResponse.text();
const entry=html.match(/src="(src\/bootstrap\.js\?v=[^"]+)"/)[1],style=html.match(/href="(style\.css\?v=[^"]+)"/)[1];
const seen=new Set();async function visit(relative){const url=new URL(relative,origin);if(seen.has(url.href))return;seen.add(url.href);const response=await fetch(url);assert.equal(response.status,200);assert.equal(response.headers.get('cache-control'),'no-store',url.href);const source=await response.text();for(const match of source.matchAll(/from ['"]((?:\.\/|\.\.\/)[^'"]+)['"]/g)){assert.match(match[1],/\?v=20261016-shopfix$/,`Unversioned import in ${url.pathname}`);await visit(new URL(match[1],url));}}
await visit('/'+entry);await visit('/'+style);console.log(`Cache regression passed: ${seen.size} assets, versioned module graph and no-store headers.`);
