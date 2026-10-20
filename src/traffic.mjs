import {trainRear,trainHeight} from './surfaces.mjs?v=20261016-shopfix';
const solid=o=>['train','ramp','barrier','gate'].includes(o.kind);
const front=o=>o.kind==='train'?1.4:o.kind==='ramp'?0:.6;
const rear=o=>o.kind==='train'?trainRear(o):o.kind==='ramp'?9:.6;
// Test the entire future shared lifetime, not just separation at spawn.
// World scrolling cancels in relative motion. Using the slowest scroll speed
// gives a conservative horizon even while the runner accelerates.
export function pathsConflict(a,b){
 if(a.lane!==b.lane||a.used||b.used||!((a.kind==='train'&&a.speed>0)||(b.kind==='train'&&b.speed>0)))return false;
 if(!solid(a)&&((a.height||1)>trainHeight(b)+.3))return false;
 if(!solid(b)&&((b.height||1)>trainHeight(a)+.3))return false;
 const t=Math.max(0,Math.min((a.z+rear(a)+12)/(15+(a.speed||0)),(b.z+rear(b)+12)/(15+(b.speed||0))));
 const d=a.z-b.z,end=d-((a.speed||0)-(b.speed||0))*t;
 return Math.max(d,end)>=-rear(a)-front(b)-2&&Math.min(d,end)<=rear(b)+front(a)+2;
}
export function canPlace(objects,candidate){return !objects.some(o=>pathsConflict(candidate,o));}
export function repairTraffic(s){
 // Keep the nearer moving train when an old save already contains a collision.
 const moving=s.objects.filter(o=>o.kind==='train'&&o.speed>0).sort((a,b)=>a.z-b.z),kept=[];
 for(const o of moving)if(canPlace(kept,o))kept.push(o);
 s.objects=s.objects.filter(o=>moving.includes(o)?kept.includes(o):canPlace(kept,o));
}
