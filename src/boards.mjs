import {surfaceAt,ROOF} from './surfaces.mjs?v=20261016-shopfix';
export const BOARDS=[
 {id:0,name:'Glider',cost:75,color:0xb8ef68,accent:0x224959,duration:15,description:'15 seconds · faster lane changes · one crash protected'},
 {id:1,name:'Sunburst',cost:175,color:0xffa45f,accent:0xe7537f,duration:20,description:'20 seconds · +1 coin every 4 collected · one crash protected'},
 {id:2,name:'Starlight',cost:300,color:0xb09aff,accent:0x6ce9e4,duration:25,description:'25 seconds · higher jumps · one crash protected'},
 {id:3,name:'Polarity',cost:425,color:0x52cfe3,accent:0xeb5b86,duration:18,description:'18 seconds · built-in coin magnet · one crash protected'},
 {id:4,name:'Bulwark',cost:600,color:0xefb84e,accent:0x344c6a,duration:20,description:'20 seconds · protects against two crashes'},
 {id:5,name:'Afterburn',cost:750,color:0xf16a47,accent:0xffed8c,duration:18,description:'18 seconds · only 8 seconds to recharge · one crash protected'}
];
export function chooseBoard(p,id){const b=BOARDS.find(b=>b.id===id);if(!b)return {ok:false,reason:'Unknown board'};const purchased=!p.boards.includes(id);if(purchased&&p.bank<b.cost)return {ok:false,reason:`You need ${b.cost-p.bank} more coins`};if(purchased){p.bank-=b.cost;p.boards.push(id);}p.board=id;return {ok:true,purchased};}
export function activateBoard(s,id){const b=BOARDS.find(b=>b.id===id);if(!b||!s.alive||s.jetpack>0||s.boardTime>0||s.boardCooldown>0)return false;s.boardType=id;s.boardTime=b.duration;s.boardHits=id===4?2:1;s.boardCoins=0;return true;}
export function migrateEquipment(p){if(p.boards===undefined)p.boards=[];if(p.board===undefined)p.board=null;return p;}
export function migrateRun(s,character=0){if(!s)return s;if(Number.isFinite(s.jetSpawn)&&s.jetSpawn<0)s.jetSpawn=0;if(s.jetpack===undefined&&s.ground===ROOF&&Array.isArray(s.objects)){const height=surfaceAt(s);if(height>ROOF){s.y+=height-ROOF;s.ground=height;}}for(const [k,v]of Object.entries({jetpack:0,jetSpawn:0,jetLanding:false,character,boardTime:0,boardCooldown:0,boardType:null,grace:0,collected:0}))if(s[k]===undefined)s[k]=v;return s;}


export const boardActive=(s,id)=>s.boardTime>0&&s.boardType===id;
export const boardRecharge=s=>s.boardType===5?8:s.character===7?14:20;
