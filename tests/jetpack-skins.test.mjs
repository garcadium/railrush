import test from 'node:test';import assert from 'node:assert/strict';
import {freshRun,advance,act,defaultProgress,parseProgress} from '../src/simulation.mjs';
import {chooseSkin,skinCharacter} from '../src/skins.mjs';import {CHARACTERS} from '../src/characters.mjs';
function flight(){const s=freshRun(1);s.spawn=1000;s.objects=[{id:1,kind:'jetpack',lane:1,z:.5}];assert.ok(advance(s).includes('jetpack'));return s;}
test('old saved orange rooftop positions are raised to the new roof',()=>{const p=defaultProgress();p.active=freshRun(1);delete p.active.jetpack;p.active.y=3.06;p.active.ground=3.06;p.active.objects=[{id:1,kind:'train',lane:1,z:-2,speed:6,length:24}];const restored=parseProgress(JSON.stringify(p));assert.equal(restored.active.y,5.2);assert.equal(restored.active.ground,5.2);advance(restored.active);assert.ok(restored.active.alive);});
test('jetpack flies above orange trains, generates collectible sky coins and safely lands',()=>{
 const s=flight();s.objects.push({id:2,kind:'train',lane:1,z:15,speed:6,length:24});let high=false;
 for(let i=0;i<600;i++){advance(s);assert.ok(s.alive);if(s.y>7.8)high=true;}
 assert.ok(high);assert.ok(s.coins>10);assert.equal(s.jetpack,0);assert.equal(s.jetLanding,false);assert.equal(s.y,0);
});
test('flight allows lane changes but jump and slide cannot cancel it; midair save restores',()=>{
 const s=flight();for(let i=0;i<80;i++)advance(s);const y=s.y;act(s,'slide');act(s,'jump');assert.equal(s.y,y);assert.equal(s.vy,0);act(s,'right');assert.equal(s.lane,2);
 const p=defaultProgress();p.active=s;const restored=parseProgress(JSON.stringify(p));assert.deepEqual(restored,p);advance(s);advance(restored.active);assert.deepEqual(restored.active,s);
});
test('skins charge once, keep character identity and survive save and legacy migration',()=>{
 const p=defaultProgress();assert.equal(chooseSkin(p,'neon').ok,false);p.bank=300;assert.equal(chooseSkin(p,'neon').purchased,true);assert.equal(p.bank,220);chooseSkin(p,'classic');chooseSkin(p,'neon');assert.equal(p.bank,220);assert.deepEqual(parseProgress(JSON.stringify(p)),p);
 const c=skinCharacter(CHARACTERS[2],'neon');assert.equal(c.id,2);assert.equal(c.style,CHARACTERS[2].style);assert.notEqual(c.color,CHARACTERS[2].color);
 delete p.skins;delete p.skin;assert.equal(parseProgress(JSON.stringify(p)).skin,'classic');assert.equal(parseProgress(JSON.stringify(p)).bank,220);
});
