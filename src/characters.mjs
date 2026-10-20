export const CHARACTERS = [
 {id:0,name:'Kai',tag:'The original freestyler',cost:0,color:0xb8ef68,accent:0xef795b,skin:0xc98b64,hair:0x332d34,style:'cap'},
 {id:1,name:'Sunny',tag:'A little sunshine. A lot of speed.',cost:50,color:0xf68e70,accent:0xffd36b,skin:0x915a40,hair:0x38251e,style:'curls'},
 {id:2,name:'Luna',tag:'Late nights, bright sneakers.',cost:100,color:0xb39aec,accent:0x70e2dc,skin:0xe9b991,hair:0x423261,style:'ponytail'},
 {id:3,name:'Beats',tag:'Every street has a rhythm.',cost:150,color:0x5cc9df,accent:0xffb85a,skin:0x865238,hair:0x242638,style:'headphones'},
 {id:4,name:'Scout',tag:'Always taking the scenic route.',cost:225,color:0xf0bb56,accent:0x4c9e86,skin:0xd99d73,hair:0x834d32,style:'beanie'},
 {id:5,name:'Nova',tag:'Out of this world. Into the city.',cost:350,color:0xe5edf7,accent:0xf18bc0,skin:0xa4e9df,hair:0x31465d,style:'robot'},
 {id:6,name:'Aero',tag:'Eyes on the skyline.',cost:450,color:0x57bfc7,accent:0xffd16c,skin:0xb87950,hair:0x3d2924,style:'aviator'},
 {id:7,name:'Dash',tag:'Always ready for another ride.',cost:550,color:0xe76895,accent:0x7af0d0,skin:0x754b38,hair:0x452356,style:'mohawk'},
 {id:8,name:'Ember',tag:'A fearless spark.',cost:650,color:0xe87535,accent:0xffe5a1,skin:0xd89c75,hair:0x672d28,style:'buns'}
];
export const ABILITIES=['Quick feet · faster lane changes','Lucky find · +1 coin for every 5 collected','Moon jump · higher jumps','Deep groove · magnets last 18 seconds','Low profile · longer slides','Safety first · starts a new run with an 8-second shield','Sky rider · jetpacks last 2 seconds longer','Quick charge · hoverboards recharge in 14 seconds','Lasting guard · shield pickups last 28 seconds'];
export function chooseCharacter(progress,id){const c=CHARACTERS.find(c=>c.id===id);if(!c)return {ok:false,reason:'Unknown runner'};const owned=progress.owned.includes(id);if(!owned&&progress.bank<c.cost)return {ok:false,reason:`You need ${c.cost-progress.bank} more coins`};if(!owned){progress.bank-=c.cost;progress.owned.push(id);}progress.outfit=id;return {ok:true,purchased:!owned};}

