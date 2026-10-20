export const UPGRADES=[{id:'jetpack',name:'Jetpack fuel',base:8,step:2},{id:'magnet',name:'Coin magnet',base:12,step:3}];
export const UPGRADE_COSTS=[75,150,250,400];
export function migrateUpgrades(p){const old=p.upgrades;p.upgrades=Object.fromEntries(UPGRADES.map(u=>[u.id,Number.isInteger(old?.[u.id])&&old[u.id]>=0&&old[u.id]<=4?old[u.id]:0]));}
export function duration(id,levels={},character=0){const u=UPGRADES.find(u=>u.id===id);return u.base+u.step*(levels[id]||0)+(id==='jetpack'&&character===6?2:0)+(id==='magnet'&&character===3?6:0);}
export function buyUpgrade(p,id){const u=UPGRADES.find(u=>u.id===id);if(!u)return false;const level=p.upgrades[id],cost=UPGRADE_COSTS[level];if(cost===undefined||p.bank<cost)return false;p.bank-=cost;p.upgrades[id]++;return true;}
