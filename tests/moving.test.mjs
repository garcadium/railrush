import test from 'node:test';
import assert from 'node:assert/strict';
import {freshRun,advance,act,addMovingRoute,defaultProgress,parseProgress,validRun} from '../src/simulation.mjs';
const ROOF=5.2;
function setup(){const s=freshRun(1);s.objects=[];s.spawn=1000;return s;}
test('oncoming trains and their rooftop coins travel together faster than scenery',()=>{
 const s=setup();addMovingRoute(s,0);const z=s.objects[0].z,offset=s.objects[1].z-z;
 advance(s);assert.ok(z-s.objects[0].z>15/60);assert.equal(s.objects[1].z-s.objects[0].z,offset);
 assert.ok(validRun(s));assert.equal(new Set(s.objects.filter(o=>o.kind==='train').map(o=>o.lane)).size,2);
});
for(const distance of [0,5000])test(`jump between oncoming roofs at distance ${distance}`,()=>{
 const s=setup();s.distance=distance;s.lane=0;s.x=-3;s.y=ROOF;s.ground=ROOF;addMovingRoute(s,0);
 for(const o of s.objects)o.z-=106;
 act(s,'jump');act(s,'right');let landed=false;
 for(let i=0;i<65;i++){advance(s);assert.ok(s.alive);if(i>10&&s.vy===0&&s.y===ROOF)landed=true;}
 assert.ok(landed);assert.ok(Math.abs(s.x)<.01);
});
test('even Luna cannot jump over an orange train from the ground',()=>{
 for(const character of [0,2])for(const z of [8,12,16,20]){const s=setup();s.character=character;s.objects=[{id:1,kind:'train',lane:1,z,speed:6,length:24}];act(s,'jump');
 for(let i=0;i<100;i++)advance(s);assert.equal(s.alive,false);}
});
test('oncoming train front still catches a runner on the ground',()=>{
 const s=setup();s.objects=[{id:1,kind:'train',lane:1,z:3,speed:6,length:24}];for(let i=0;i<10;i++)advance(s);assert.equal(s.alive,false);
});
test('long moving roofs restore behind the camera and reject invalid speed',()=>{
 const p=defaultProgress();p.active=setup();p.active.objects=[{id:1,kind:'train',lane:1,z:-20,speed:6,length:24}];p.active.y=ROOF;p.active.ground=ROOF;
 assert.deepEqual(parseProgress(JSON.stringify(p)),p);p.active.objects[0].speed=-1;assert.equal(validRun(p.active),false);
});
