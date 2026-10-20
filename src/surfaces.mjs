export const ROOF=3.06,RAMP_LENGTH=9;
export const trainHeight=o=>o.speed?5.2:ROOF;
export const trainRear=o=>(o.length||6.8)-1;
export function surfaceAt(s){let height=0;for(const o of s.objects){if(o.used||Math.abs(s.x-(o.lane*3-3))>1.1)continue;if(o.kind==='train'&&o.z<=1.05&&o.z>=-trainRear(o))height=Math.max(height,trainHeight(o));if(o.kind==='ramp'&&o.z<=0&&o.z>=-RAMP_LENGTH)height=Math.max(height,-o.z/RAMP_LENGTH*ROOF);}return height;}
