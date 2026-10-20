import * as T from '../vendor/three.module.js?v=20261016-shopfix';
import {CHARACTERS} from './characters.mjs?v=20261016-shopfix';
export function createCharacter(id=0,custom=null){
 const c=custom||CHARACTERS[id]||CHARACTERS[0],root=new T.Group(),hips=new T.Group(),body=new T.Group(),head=new T.Group();root.add(hips);hips.add(body);body.add(head);head.position.y=1.05;
 const materials=new Map(),geometries=[];function material(color){if(!materials.has(color))materials.set(color,new T.MeshStandardMaterial({color,roughness:.7}));return materials.get(color);}
 function mesh(parent,geo,color,x,y,z){geometries.push(geo);const m=new T.Mesh(geo,material(color));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function oval(p,x,y,z,w,h,d,color){const m=mesh(p,new T.SphereGeometry(1,16,12),color,x,y,z);m.scale.set(w,h,d);return m;}
 function block(p,x,y,z,w,h,d,color){return mesh(p,new T.BoxGeometry(w,h,d),color,x,y,z);}
 function capsule(p,x,y,z,r,len,color){return mesh(p,new T.CapsuleGeometry(r,len,4,10),color,x,y,z);}
 const navy=0x26364d,white=0xfff5e5;
 oval(body,0,.44,0,.38,.49,.26,c.color);oval(body,0,.78,.02,.28,.19,.25,c.color);block(body,0,.02,0,.55,.13,.37,navy);
 // Jacket zipper, chest patch, hood, and a compact backpack.
 block(body,0,.45,-.255,.025,.55,.025,white);block(body,-.19,.62,-.23,.13,.1,.04,c.accent);
 oval(body,0,.71,.14,.28,.2,.2,c.accent);block(body,0,.44,.29,.42,.46,.2,navy);block(body,0,.38,.405,.32,.18,.05,c.accent);
 for(const side of [-1,1])block(body,side*.23,.47,.19,.055,.5,.09,c.accent);
 oval(head,0,.03,0,.32,.36,.29,c.skin);for(const side of [-1,1]){oval(head,side*.31,0,0,.065,.1,.065,c.skin);oval(head,side*.116,.05,-.258,.067,.08,.035,white);oval(head,side*.115,.047,-.288,.032,.045,.015,navy);block(head,side*.115,.17,-.255,.12,.025,.035,c.hair);}oval(head,0,-.05,-.29,.055,.055,.06,c.skin);block(head,0,-.145,-.267,.10,.018,.025,0x784c46);
 oval(head,0,.25,.035,.33,.16,.28,c.hair);
 if(c.style==='cap'){oval(head,0,.28,.025,.35,.17,.30,navy);block(head,0,.21,-.3,.51,.055,.3,c.accent);block(head,0,.31,-.26,.11,.09,.03,white);}
 if(c.style==='curls'){for(let i=0;i<11;i++){const a=i/11*Math.PI*2;oval(head,Math.cos(a)*.26,.28+Math.sin(i*2)*.04,Math.sin(a)*.22,.13,.14,.13,c.hair);}oval(head,0,.39,0,.21,.12,.22,c.hair);}
 if(c.style==='ponytail'){oval(head,0,.18,.25,.26,.22,.14,c.hair);oval(head,0,.16,.4,.11,.13,.12,c.accent);oval(head,0,-.04,.46,.15,.31,.14,c.hair);oval(head,-.21,.23,-.22,.16,.15,.1,c.hair);}
 if(c.style==='headphones'){const band=mesh(head,new T.TorusGeometry(.34,.044,8,24,Math.PI),c.accent,0,.12,.02);for(const side of [-1,1]){oval(head,side*.34,.01,.015,.075,.14,.13,navy);oval(head,side*.4,.01,.015,.04,.11,.09,c.accent);}band.rotation.z=0;}
 if(c.style==='beanie'){oval(head,0,.32,.015,.35,.23,.3,c.accent);oval(head,0,.21,.015,.36,.08,.31,c.accent);oval(head,0,.58,.015,.10,.1,.1,c.color);block(head,0,.25,-.29,.12,.10,.025,white);}
 if(c.style==='robot'){oval(head,0,.03,-.245,.27,.17,.09,navy);for(const side of [-1,1])block(head,side*.115,.055,-.332,.08,.035,.015,c.accent);capsule(head,0,.46,.025,.025,.19,navy);oval(head,0,.6,.025,.07,.07,.07,c.accent);}
 if(c.style==='aviator'){oval(head,0,.25,.04,.35,.2,.31,c.accent);for(const side of [-1,1]){oval(head,side*.15,.12,-.27,.13,.1,.06,navy);oval(head,side*.15,.12,-.32,.095,.065,.025,0x9ce7f5);}block(body,0,.85,-.22,.5,.12,.1,c.accent);}
 if(c.style==='mohawk'){for(let i=0;i<5;i++)oval(head,0,.39+Math.sin(i/4*Math.PI)*.13,-.2+i*.11,.09,.2,.09,c.accent);for(const side of [-1,1])oval(head,side*.34,-.09,0,.045,.06,.045,c.accent);}
 if(c.style==='buns'){for(const side of [-1,1]){oval(head,side*.29,.32,.04,.18,.18,.17,c.hair);oval(head,side*.28,.23,.03,.19,.05,.16,c.accent);}block(body,0,.64,-.26,.24,.18,.04,c.accent);}
 if(c.racing){for(const side of [-1,1])block(body,side*.23,.45,-.24,.07,.55,.045,c.accent);}
 const jet=new T.Group();body.add(jet);jet.visible=false;const flames=[];for(const side of [-1,1]){capsule(jet,side*.24,.42,.4,.14,.48,0xa9dce4);block(jet,side*.24,.12,.42,.22,.13,.24,0x344d67);const flame=mesh(jet,new T.ConeGeometry(.12,.55,10),0xffb43d,side*.24,-.17,.42);flame.rotation.z=Math.PI;flames.push(flame);}block(jet,0,.45,.43,.16,.34,.16,0xf7c857);
 const limbs=[];for(const side of [-1,1]){const arm=new T.Group(),elbow=new T.Group(),leg=new T.Group(),knee=new T.Group();arm.position.set(side*.41,.69,0);body.add(arm);arm.add(elbow);elbow.position.y=-.29;capsule(arm,0,-.145,0,.105,.2,c.color);capsule(elbow,0,-.13,0,.085,.18,c.color);oval(elbow,0,-.29,0,.09,.105,.09,c.skin);leg.position.set(side*.18,0,0);hips.add(leg);capsule(leg,0,-.20,0,.125,.26,navy);knee.position.y=-.4;leg.add(knee);capsule(knee,0,-.17,0,.105,.24,navy);block(knee,0,-.36,-.07,.27,.15,.43,white);block(knee,0,-.425,-.07,.29,.05,.45,c.accent);block(knee,0,-.32,-.13,.18,.04,.16,c.accent);limbs.push({side,arm,elbow,leg,knee});}
 let slide=0,air=0,lean=0;function pose(s,mode,time,dt){hips.rotation.x=0;hips.scale.setScalar(1);const idle=mode==='menu'||mode==='shop',blend=1-Math.exp(-18*dt);slide+=(Number(!idle&&s.slide>0&&!(s.roll>0)&&s.y-(s.ground||0)<.05)-slide)*blend;air+=(Number(!idle&&s.y-(s.ground||0)>.04)-air)*blend;lean+=((idle?0:(s.lane*3-3-s.x)*-.09)-lean)*blend;const jump=air*(1-slide),phase=(s.distance||0)*.78,run=(1-slide)*(1-air)*(idle?0:1);hips.position.y=.89-slide*.41+Math.cos(phase*2)*.026*run+(idle?Math.sin(time*2)*.018:0);body.rotation.x=-.1*run-slide*.98;body.rotation.y=Math.sin(phase)*.045*run;head.rotation.x=.05*run+slide*.3;head.rotation.y=idle?Math.sin(time*.65)*.10:0;root.rotation.z=lean;root.rotation.y=idle?Math.PI+.3:0;root.position.set(idle?0:s.x,idle?0:s.y,0);
 for(const l of limbs){const wave=Math.sin(phase)*l.side;l.leg.rotation.x=wave*.65*run+jump*(l.side===1?.75:.3)+slide*1.4;l.knee.rotation.x=-Math.max(0,-wave)*1.15*run-jump*.85-slide*1.65;l.arm.rotation.x=-wave*.5*run+jump*.6+slide*.6;l.arm.rotation.z=l.side*(idle?.1:.07);l.elbow.rotation.x= .5+.2*run+slide*.35;l.leg.rotation.z=l.side*slide*.12;}
 if(mode==='caught'||mode==='over'||mode==='catcher'){const t=Math.min(1,(s.catchTime||0)/1.1);body.rotation.x=mode==='catcher'?-.12:.3;hips.position.y=.89;head.rotation.y=mode==='catcher'?0:-.65*t;for(const l of limbs){l.leg.rotation.x*=1-t;l.knee.rotation.x*=1-t;l.arm.rotation.x=mode==='catcher'?1.25*t:.5*t;l.elbow.rotation.x=mode==='catcher'?.1:.85;l.arm.rotation.z=l.side*.12;}root.rotation.z=mode==='catcher'?0:Math.sin((s.catchTime||0)*18)*.08*(1-t);}
 if(!idle&&s.boardTime>0&&!(s.jetpack>0)){hips.position.y-=.07*(1-slide);body.rotation.y+=.48;root.position.y+=.12;for(const l of limbs){l.leg.rotation.x=.18+slide*1.22;l.knee.rotation.x=-.35-slide*1.3;l.arm.rotation.x=.1+slide*.6;l.arm.rotation.z=l.side*.38;l.elbow.rotation.x=.3;l.leg.rotation.z=l.side*.12;}}
 if(!idle&&mode!=='catcher'&&mode!=='caught'&&mode!=='over'&&s.roll>0&&!(s.jetpack>0)){const t=1-s.roll/.55,e=t*t*(3-2*t),tuck=Math.sin(Math.PI*t);hips.rotation.x=-Math.PI*2*e;hips.position.y=.89+.3*tuck;hips.scale.setScalar(1-.38*tuck);body.rotation.x=-.5*tuck;body.rotation.y=0;head.rotation.x=.55*tuck;for(const l of limbs){l.leg.rotation.x=1.8*tuck;l.knee.rotation.x=-2.1*tuck;l.arm.rotation.x=1.5*tuck;l.arm.rotation.z=l.side*.1;l.elbow.rotation.x=1.5*tuck;}}
 jet.visible=!idle&&s.jetpack>0;if(jet.visible){body.rotation.x=-.15;for(const f of flames)f.scale.y=1+Math.sin(time*35)*.2;for(const l of limbs){l.leg.rotation.x=.12;l.knee.rotation.x=-.35;l.arm.rotation.x=-.2;l.arm.rotation.z=l.side*.35;}}
 }
 pose({distance:0,lane:1,x:0,y:0,slide:0},'menu',0,1);
 function dispose(){for(const g of geometries)g.dispose();for(const m of materials.values())m.dispose();}
 return {root,pose,dispose};
}
export function characterPortraits(variants=CHARACTERS){const renderer=new T.WebGLRenderer({alpha:true,antialias:true});renderer.setSize(240,260);renderer.setPixelRatio(1);const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,240/260,.1,20);camera.position.set(0,1.25,4.9);camera.lookAt(0,1.12,0);scene.add(new T.HemisphereLight(0xffffff,0x879aaa,2.8));const light=new T.DirectionalLight(0xffebd3,2.5);light.position.set(-3,5,5);scene.add(light);const images=variants.map(c=>{const model=createCharacter(c.id,c);scene.add(model.root);renderer.render(scene,camera);const src=renderer.domElement.toDataURL('image/png');scene.remove(model.root);model.dispose();return src;});renderer.dispose();renderer.forceContextLoss();return images;}



