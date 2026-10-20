import * as T from '../vendor/three.module.js?v=20261016-shopfix';
import {BOARDS} from './boards.mjs?v=20261016-shopfix';
export function createHoverboard(){
 const root=new T.Group(),materials=[],geometries=[];const deck=new T.MeshStandardMaterial({color:0xb8ef68,roughness:.38,metalness:.3}),trim=new T.MeshStandardMaterial({color:0x224959,roughness:.4}),glow=new T.MeshStandardMaterial({color:0x7dfff5,emissive:0x3ce4d6,emissiveIntensity:1.7});materials.push(deck,trim,glow);
 function part(geo,mat,x,y,z){geometries.push(geo);const mesh=new T.Mesh(geo,mat);mesh.position.set(x,y,z);root.add(mesh);mesh.castShadow=true;return mesh;}
 part(new T.BoxGeometry(.8,.12,1.4),deck,0,0,0);for(const z of [-.7,.7]){const end=part(new T.CylinderGeometry(.4,.4,.12,24),deck,0,0,z);end.scale.z=.7;}
 part(new T.BoxGeometry(.13,.015,1.7),trim,0,.07,0);for(const x of [-.30,.30])part(new T.BoxGeometry(.045,.07,1.3),glow,x,-.08,0);for(const z of [-.4,.4]){part(new T.BoxGeometry(.64,.02,.32),trim,0,.075,z);part(new T.CylinderGeometry(.16,.23,.08,16),glow,0,-.11,z);}
 const wings=[];for(const side of [-1,1]){const wing=part(new T.BoxGeometry(.3,.07,.65),deck,side*.48,-.01,.25);wing.rotation.y=side*.3;wings.push(wing);}
 function update(s,time){root.visible=s.boardTime>0;if(!root.visible)return;const b=BOARDS[s.boardType]||BOARDS[0];deck.color.setHex(b.color);trim.color.setHex(b.accent);root.position.set(s.x,s.y+.08,0);root.rotation.z=(s.lane*3-3-s.x)*-.08;root.rotation.x=Math.sin(time*4)*.025;wings.forEach(w=>w.visible=[2,4,5].includes(b.id));root.scale.z=b.id===1||b.id===5?1.12:1;root.scale.x=b.id===4?1.25:1;glow.color.setHex(b.accent);glow.emissive.setHex(b.accent);}
 return {root,update};
}

