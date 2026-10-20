export const SKINS=[
 {id:'classic',name:'Classic',cost:0,description:'Your runner’s original outfit.'},
 {id:'neon',name:'Neon Sprint',cost:80,color:0x792de0,accent:0x88ff54,description:'Violet jacket with electric lime trim.'},
 {id:'sunset',name:'Sunset Racer',cost:160,color:0xf05b45,accent:0xffdf73,description:'Coral racing jacket with golden trim.'},
 {id:'arctic',name:'Arctic Flash',cost:260,color:0xdaf5ff,accent:0x00b7db,description:'Ice blue jacket with bright cyan trim.'}
];
export function migrateSkins(p){if(!Array.isArray(p.skins))p.skins=['classic'];p.skins=[...new Set(['classic',...p.skins.filter(id=>SKINS.some(s=>s.id===id))])];if(!p.skins.includes(p.skin))p.skin='classic';}
export function chooseSkin(p,id){const skin=SKINS.find(s=>s.id===id);if(!skin)return {ok:false};const purchased=!p.skins.includes(id);if(purchased&&p.bank<skin.cost)return {ok:false};if(purchased){p.bank-=skin.cost;p.skins.push(id);}p.skin=id;return {ok:true,purchased};}
export function skinCharacter(c,id){const skin=SKINS.find(s=>s.id===id);return skin?.color?{...c,color:skin.color,accent:skin.accent,racing:true}:c;}
