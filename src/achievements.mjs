import {migrateStats} from './daily.mjs?v=20261016-shopfix';
export const ACHIEVEMENTS=[
 {id:'2000m',reward:120,name:'Express service',description:'Reach 2,000 metres in one run.',target:2000,value:p=>Math.max(p.best,p.active?.distance||0)},
 {id:'coins200',reward:100,name:'Treasure train',description:'Collect 200 coins in one run.',target:200,value:p=>Math.max(p.bestRunCoins,p.active?.coins||0)},
 {id:'runs25',reward:80,name:'Regular rider',description:'Finish 25 runs.',target:25,value:p=>p.runs},
 {id:'crew6',reward:100,name:'Everyone aboard',description:'Own all six characters.',target:6,value:p=>p.owned.length},
 {id:'jumps100',reward:60,name:'Air time',description:'Jump 100 times.',target:100,value:p=>p.stats?.jumps||0},
 {id:'total5000',reward:100,name:'Railway regular',description:'Travel 5,000 metres across runs.',target:5000,value:p=>p.stats?.distance||0},
 {id:'boards20',reward:75,name:'Hover hero',description:'Activate a hoverboard 20 times.',target:20,value:p=>p.stats?.boards||0},
 {id:'daily3',reward:60,name:'Daily regular',description:'Complete three daily challenges.',target:3,value:p=>p.stats?.dailyCompleted||0},
 {id:'first',reward:15,name:'First tracks',description:'Finish your first run.',target:1,value:p=>p.runs},
 {id:'100m',reward:20,name:'Finding your feet',description:'Reach 100 metres in one run.',target:100,value:p=>Math.max(p.best,p.active?.distance||0)},
 {id:'500m',reward:40,name:'City explorer',description:'Reach 500 metres in one run.',target:500,value:p=>Math.max(p.best,p.active?.distance||0)},
 {id:'1000m',reward:75,name:'Going the distance',description:'Reach 1,000 metres in one run.',target:1000,value:p=>Math.max(p.best,p.active?.distance||0)},
 {id:'coins25',reward:25,name:'Pocket money',description:'Collect 25 coins in one run.',target:25,value:p=>Math.max(p.bestRunCoins,p.active?.coins||0)},
 {id:'coins100',reward:60,name:'Gold rush',description:'Collect 100 coins in one run.',target:100,value:p=>Math.max(p.bestRunCoins,p.active?.coins||0)},
 {id:'crew',reward:50,name:'The whole crew',description:'Own three different characters.',target:3,value:p=>p.owned.length},
 {id:'board',reward:20,name:'Above the rails',description:'Own your first hoverboard.',target:1,value:p=>p.boards.length},
 {id:'boards',reward:75,name:'Board collector',description:'Own all three hoverboards.',target:3,value:p=>p.boards.length},
 {id:'runs10',reward:50,name:'Back for more',description:'Finish ten runs.',target:10,value:p=>p.runs}
];
export function migrateExtras(p){migrateStats(p);p.musicVolume=Number.isFinite(p.musicVolume)?Math.max(0,Math.min(1,p.musicVolume)):.6;p.bestRunCoins=Number.isInteger(p.bestRunCoins)&&p.bestRunCoins>=0?Math.min(1e9,p.bestRunCoins):0;p.achievements=Array.isArray(p.achievements)?[...new Set(p.achievements.filter(id=>ACHIEVEMENTS.some(a=>a.id===id)))]:[];p.rewardedAchievements=Array.isArray(p.rewardedAchievements)?[...new Set(p.rewardedAchievements.filter(id=>p.achievements.includes(id)))]:[];return p;}
export function unlockAchievements(p){const earned=ACHIEVEMENTS.filter(a=>!p.achievements.includes(a.id)&&a.value(p)>=a.target);p.achievements.push(...earned.map(a=>a.id));return earned;}
export function awardAchievementRewards(p){p.rewardedAchievements??=[];const rewards=ACHIEVEMENTS.filter(a=>p.achievements.includes(a.id)&&!p.rewardedAchievements.includes(a.id));const coins=rewards.reduce((total,a)=>total+a.reward,0);p.bank=Math.min(1e9,p.bank+coins);p.rewardedAchievements.push(...rewards.map(a=>a.id));return coins;}

