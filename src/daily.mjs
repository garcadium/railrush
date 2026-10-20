// Daily reset uses the game's fixed UTC−6 clock, the same on every device.
export const dayKey=(now=Date.now())=>new Date(now-6*3600000).toISOString().slice(0,10);
export function challenges(day){const n=[...day].reduce((a,c)=>a+c.charCodeAt(0),0);return [
 {id:'distance',name:'Explore the line',description:'Travel metres across any number of runs.',target:500+n%3*250,reward:40+n%3*10},
 {id:'coins',name:'Daily coin hunt',description:'Pick up coins on the track.',target:25+n%3*10,reward:35+n%3*10},
 {id:n%2?'jumps':'slides',name:n%2?'Spring in your step':'Keep it low',description:n%2?'Jump while running.':'Slide while running.',target:12+n%3*4,reward:30}
 ];}
export function ensureDaily(p,now=Date.now()){const today=dayKey(now);if(!p.daily||!/^\d{4}-\d{2}-\d{2}$/.test(p.daily.day)||today>p.daily.day)p.daily={day:today,distance:0,coins:0,jumps:0,slides:0,claimed:[]};for(const k of ['distance','coins','jumps','slides'])if(!Number.isFinite(p.daily[k])||p.daily[k]<0)p.daily[k]=0;p.daily.claimed=Array.isArray(p.daily.claimed)?[...new Set(p.daily.claimed.filter(id=>challenges(p.daily.day).some(c=>c.id===id)))]:[];return p.daily;}
export function migrateStats(p){p.stats??={};for(const k of ['distance','coins','jumps','slides','boards','dailyCompleted'])if(!Number.isFinite(p.stats[k])||p.stats[k]<0)p.stats[k]=0;return p;}
export function recordActivity(p,kind,amount=1,now=Date.now()){ensureDaily(p,now);migrateStats(p);if(!Number.isFinite(amount)||amount<=0)return;if(kind in p.stats)p.stats[kind]=Math.min(1e9,p.stats[kind]+amount);if(['distance','coins','jumps','slides'].includes(kind))p.daily[kind]=Math.min(1e9,p.daily[kind]+amount);}
export function rewardDaily(p,now=Date.now()){const d=ensureDaily(p,now);migrateStats(p);const completed=challenges(d.day).filter(c=>d[c.id]>=c.target&&!d.claimed.includes(c.id));const coins=completed.reduce((n,c)=>n+c.reward,0);p.bank=Math.min(1e9,p.bank+coins);d.claimed.push(...completed.map(c=>c.id));p.stats.dailyCompleted+=completed.length;return {coins,completed};}

