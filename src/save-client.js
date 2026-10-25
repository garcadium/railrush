/* Garcadium Save Client v1.2.0. Copy into each independent game release. */
export class SaveStore {
  constructor(storage, game, accepts) { this.storage=storage;this.game=game;this.accepts=accepts;this.uid=null;this.onchange=()=>{}; }
  prefix(){return `gca:${this.game}:${this.uid}:`;}
  metaKey(){return `gca-meta:${this.game}:${this.uid}`;}
  meta(){try{return JSON.parse(this.storage.getItem(this.metaKey()))||{};}catch{return {};}}
  keys(){const keys=[];for(let i=0;i<this.storage.length;i++){const key=this.storage.key(i);if(this.uid?key.startsWith(this.prefix()):this.accepts(key))keys.push(this.uid?key.slice(this.prefix().length):key);}return keys.filter(this.accepts);}
  get length(){return this.keys().length;}
  key(i){return this.keys()[i]??null;}
  getItem(key){if(!this.accepts(key))return this.storage.getItem(key);return this.storage.getItem(this.uid?this.prefix()+key:key);}
  setItem(key,value){if(!this.accepts(key))return this.storage.setItem(key,value);this.write(key,String(value));}
  removeItem(key){if(!this.accepts(key))return this.storage.removeItem(key);this.write(key,null);}
  write(key,value){
    if(value===this.getItem(key))return;
    if(!this.uid){value===null?this.storage.removeItem(key):this.storage.setItem(key,value);this.onchange();return;}
    const meta=this.meta();const old=meta[key]||{revision:0};
    // Write-ahead record recovers an interrupted browser storage write on next load.
    meta[key]={...old,dirty:true,value,event:globalThis.crypto.randomUUID()};
    this.storage.setItem(this.metaKey(),JSON.stringify(meta));
    value===null?this.storage.removeItem(this.prefix()+key):this.storage.setItem(this.prefix()+key,value);
    this.onchange();
  }
  restoreDirty(){for(const [key,m]of Object.entries(this.meta()))if(m.dirty){m.value===null?this.storage.removeItem(this.prefix()+key):this.storage.setItem(this.prefix()+key,m.value);}}
  install(key,value,revision){const meta=this.meta();value===null?this.storage.removeItem(this.prefix()+key):this.storage.setItem(this.prefix()+key,value);meta[key]={revision};this.storage.setItem(this.metaKey(),JSON.stringify(meta));}
  acknowledge(key,event,revision){const meta=this.meta();if(meta[key]?.event===event)meta[key]={revision};else if(meta[key])meta[key].revision=revision;this.storage.setItem(this.metaKey(),JSON.stringify(meta));}
}

let nativeStorage=null;
try{if(typeof window!=='undefined')nativeStorage=window.localStorage;}catch{}
const GAME=typeof document!=='undefined'?document.documentElement.dataset.garcadiumGame:'';
const slots={luminera:['luminera-run-v1'],morsel:['morsel-save','morsel-audio'],oddly:['garcadium-oddly-v1','garcadium-oddly-audio-v1'],gloopy:['ember-save-v1','ember-save-v1-backup'],slipstream:['slipstream-save-v1','slipstream-muted'],railrush:['railrush-progress-v1']};
const allowed=key=>GAME==='pocketvalley'?/^(meadowcraft-v1|meadowcraft-build-v1|meadowcraft-build-slot-[a-f0-9-]{36}|meadowcraft-avatar-v1|pocket-valley-avatar-backup|pocket-valley-pins-v1)$/.test(key||''):(slots[GAME]||[]).includes(key);
// In Node, use the test/server's existing storage when provided; browser games use account namespaces.
export const saveStorage=typeof window==='undefined'?{
 getItem:key=>globalThis.localStorage?.getItem(key)??null,setItem:(key,value)=>globalThis.localStorage?.setItem(key,value),removeItem:key=>globalThis.localStorage?.removeItem(key),
 get length(){return globalThis.localStorage?.length||0;},key:i=>globalThis.localStorage?.key(i)??null
}:new SaveStore(nativeStorage,GAME,allowed);
export const account={player:null,token:null,ageBand:null,status:'Guest · saved in this browser'};
const PORTAL='https://garcadium.com';
const GAME_ORIGIN=typeof location==='undefined'?'':location.origin;
const GAME_NAME={luminera:'Luminera',pocketvalley:'Pocket Valley',morsel:'Morsel',oddly:'Oddly',gloopy:'Gloopy',slipstream:'Slipstream',railrush:'Railrush'}[GAME]||GAME;
let bar,statusNode,actionNode,timer,running=false,blocked=false,sessionEnded=false,lastValidated=0,lastCheckAttempt=0,checking=false;
const tokenKey=()=>`gca-session:${GAME}`;
const pendingKey=()=>`gca-handoff:${GAME}`;
const hex=()=>Array.from(crypto.getRandomValues(new Uint8Array(32)),x=>x.toString(16).padStart(2,'0')).join('');
function status(text){account.status=text;if(statusNode)statusNode.textContent=text;}
function action(label,fn){actionNode.replaceChildren();if(label){const b=document.createElement('button');b.type='button';b.textContent=label;b.onclick=fn;actionNode.append(b);}}
function mount(){
 const css=document.createElement('style');css.textContent=`.gca-savebar{position:fixed;bottom:8px;left:8px;z-index:10000;max-width:calc(100vw - 16px);box-sizing:border-box;display:flex;align-items:center;gap:10px;flex-wrap:wrap;background:#101724;color:#f7f8fc;border:1px solid #344258;border-radius:12px;padding:9px 12px;font:12px/1.4 Inter,system-ui,sans-serif}.gca-savebar a{color:#c8ff31}.gca-savebar button,.gca-dialog button{background:#c8ff31;color:#0a0f19;border:0;border-radius:8px;padding:7px 10px;cursor:pointer;font:600 12px Inter,system-ui,sans-serif}dialog .gca-savebar{position:static;max-width:100%;margin-top:16px;text-align:left}.gca-savebar button{display:inline-block!important;padding:7px 10px!important;font:600 12px Inter,system-ui,sans-serif!important}.gca-savebar summary{cursor:pointer}.gca-savebar details[open]{background:#101724}.gca-dialog{color:#f7f8fc;background:#101724;border:1px solid #344258;border-radius:16px;padding:24px;max-width:460px;font:15px/1.6 Inter,system-ui,sans-serif}.gca-dialog::backdrop{background:#080d17e8}.gca-dialog h2{font-family:Sora,system-ui,sans-serif}.gca-dialog button{margin:6px}`;document.head.append(css);
 bar=document.createElement('div');bar.className='gca-savebar';
 const home=document.createElement('a');home.href=PORTAL;home.textContent='← Garcadium';
 statusNode=document.createElement('span');statusNode.setAttribute('role','status');actionNode=document.createElement('span');bar.append(home,statusNode,actionNode);document.body.append(bar);status(account.status);
 // Keep save controls inside the active modal so they remain visible and operable.
 const dialogs=[];new MutationObserver(records=>{for(const record of records){const d=record.target;if(d.tagName==='DIALOG'&&d.open){const i=dialogs.indexOf(d);if(i>=0)dialogs.splice(i,1);dialogs.push(d);}}for(let i=dialogs.length-1;i>=0;i--)if(!dialogs[i].isConnected||!dialogs[i].open)dialogs.splice(i,1);const host=dialogs.at(-1)||document.body;if(bar.parentElement!==host)host.append(bar);}).observe(document.body,{attributes:true,attributeFilter:['open'],subtree:true});
}
async function api(op,data={}){
 const started=Date.now();
 const res=await fetch(`${PORTAL}/wp-json/garcadium/v1/game/saves/${GAME}/${op}`,{method:'POST',credentials:'omit',cache:'no-store',headers:{'Content-Type':'application/json',...(account.token?{Authorization:`Bearer ${account.token}`}:{})},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});
 let body;try{body=await res.json();}catch{throw Error('Garcadium could not be reached. Your browser copy is retained.');}
 if(!res.ok)throw Object.assign(Error(body.error||'Saving is unavailable.'),{status:res.status});lastValidated=started;return body;
}
export async function connect(){
 // Offline files and alternate hosts continue through the canonical online game.
 if(!/\.onrender\.com$/i.test(location.hostname)){location.assign(`${PORTAL}/play/${GAME}/`);return;}
 const state=hex(),verifier=hex();const bytes=new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(verifier)));
 const challenge=btoa(String.fromCharCode(...bytes)).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'');
 const url=new URL(location.href);url.searchParams.delete('gca_connect');url.hash='';
 sessionStorage.setItem(pendingKey(),JSON.stringify({state,verifier,returnTo:url.pathname+url.search,expires:Date.now()+180000}));
 if(window.parent!==window){
  const handoff=await new Promise((resolve,reject)=>{
   const timeout=setTimeout(()=>{removeEventListener('message',receive);reject(Error('Garcadium account connection timed out.'));},15000);
   function receive(event){if(event.source!==window.parent||event.origin!==PORTAL||event.data?.type!=='garcadium:handoff'||event.data?.state!==state)return;clearTimeout(timeout);removeEventListener('message',receive);event.data.error?reject(Error(event.data.error)):resolve(event.data);}
   addEventListener('message',receive);window.parent.postMessage({type:'garcadium:connect',game:GAME,state,challenge},PORTAL);
  });
  saveAccount(await api('exchange',{code:handoff.code,state,verifier}));sessionStorage.removeItem(pendingKey());
  url.searchParams.delete('gca_connect');history.replaceState(null,'',url.pathname+url.search);return true;
 }
 location.replace(`${PORTAL}/play/${GAME}/?state=${state}&challenge=${challenge}`);return false;
}
function saveAccount(session){account.token=session.token;account.player=session.player;sessionStorage.setItem(tokenKey(),JSON.stringify(session));}
async function conflict(key){
 blocked=true;status('Another device has a newer save · choose a copy');
 const remote=await api('read',{slot:key});const local=saveStorage.getItem(key);
 // Keep both records locally before asking the player which should become active.
 const backup={game:GAME,slot:key,local,cloud:remote.value,createdAt:new Date().toISOString()};
 nativeStorage.setItem(`gca-conflict:${GAME}:${saveStorage.uid}:${key}`,JSON.stringify(backup));
 await new Promise(resolve=>{
  const d=document.createElement('dialog');d.className='gca-dialog';
  const h=document.createElement('h2');h.textContent='Two saves, safely kept.';
  const p=document.createElement('p');p.textContent='Another session changed this save. Choose the copy to continue with. Download both copies first if you want a backup.';d.append(h,p);
  const download=document.createElement('button');download.textContent='Download both copies';download.onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(backup,null,2)],{type:'application/json'}));a.download=`${GAME}-save-copies.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};d.append(download);
  for(const [label,value]of [['Use cloud save',remote.value],['Use this browser save',local]]){const b=document.createElement('button');b.textContent=label;b.onclick=async()=>{saveStorage.install(key,remote.value,remote.revision);if(value!==remote.value)saveStorage.write(key,value);d.close();d.remove();blocked=false;resolve();};d.append(b);}
  d.addEventListener('cancel',e=>e.preventDefault());document.body.append(d);d.showModal();
 });
}
async function restore(manifest){account.player=manifest.player;saveStorage.uid=String(account.player.id);saveStorage.restoreDirty();
 const remote=new Map(manifest.slots.map(s=>[s.slot_key,s]));
 for(const [key,row]of remote){if(!allowed(key))continue;const m=saveStorage.meta()[key];
  if(m?.dirty){if(m.revision!==Number(row.revision)){
    // A previous request may have succeeded before its response was lost: replay its event first.
    try{const ack=await api('write',{slot:key,...m});saveStorage.acknowledge(key,m.event,ack.revision);}catch(e){if(e.status===409)await conflict(key);else throw e;}
  }}else if(m?.revision!==Number(row.revision)){const r=await api('read',{slot:key});saveStorage.install(key,r.value,r.revision);}
 }
 const claim=`gca-guest-claimed:${GAME}`;
 if(!remote.size&&!saveStorage.keys().length&&!nativeStorage.getItem(claim)){
   const guest=[];for(let i=0;i<nativeStorage.length;i++){const k=nativeStorage.key(i);if(allowed(k))guest.push([k,nativeStorage.getItem(k)]);}
   for(const [key,value]of guest)saveStorage.write(key,value);
   nativeStorage.setItem(claim,String(account.player.id));
 }
}
async function flush(){
 if(!account.token||!account.player||running||blocked)return;
 running=true;
 try{
  for(const [key,m]of Object.entries(saveStorage.meta())){if(!m.dirty||!allowed(key))continue;
   status('Saving to Garcadium…');
   try{const r=await api('write',{slot:key,revision:m.revision,event:m.event,value:m.value});saveStorage.acknowledge(key,m.event,r.revision);}
   catch(e){if(e.status===409){await conflict(key);location.reload();return;}throw e;}
  }
  const dirty=Object.values(saveStorage.meta()).some(m=>m.dirty);
  status(dirty?'Save pending in this browser':`${account.player.name} · Saved to Garcadium`);action(null);
 }catch(e){
  if(e.status===401||e.status===403){blocked=true;sessionEnded=true;status('Sign in again · browser changes retained');action('Reconnect',connect);window.dispatchEvent(new CustomEvent('garcadium-session-ended'));}
  else{status('Save pending · browser copy retained');action('Retry save',flush);}
 }finally{running=false;}
}
export async function initSaves(){
 mount();const url=new URL(location.href);const fragment=new URLSearchParams(url.hash.slice(1));
 try{
  if(!nativeStorage)throw Error('Browser storage is unavailable. Enable site storage, then reload to keep progress safe.');
  if(fragment.has('gca_code')){
   const pending=JSON.parse(sessionStorage.getItem(pendingKey())||'null'),embeddedVerifier=fragment.get('verifier');
   history.replaceState(null,'',pending?.returnTo||location.pathname+location.search);
   const exchangeState=pending?.state||fragment.get('state'),exchangeVerifier=pending?.verifier||embeddedVerifier;
   if(!exchangeVerifier||!exchangeState||pending&&pending.expires<Date.now()||exchangeState!==fragment.get('state'))throw Error('The connection expired. Launch again from Garcadium.');
   saveAccount(await api('exchange',{code:fragment.get('gca_code'),state:exchangeState,verifier:exchangeVerifier}));sessionStorage.removeItem(pendingKey());
  }else if(url.searchParams.has('gca_connect')){if(!await connect())return false;}
  else {const stored=JSON.parse(sessionStorage.getItem(tokenKey())||'null');if(stored?.token)saveAccount(stored);}
  if(account.token){status('Restoring your Garcadium save…');
   const manifest=await api('manifest');account.player=manifest.player;
   if(!navigator.locks)throw Error('Account saves need an updated browser with Web Locks support.');
   await new Promise((resolve,reject)=>{navigator.locks.request(`garcadium:${GAME}:${account.player.id}`,{ifAvailable:true},lock=>{
    if(!lock){reject(Error('This game is already open for this player in another tab. Close that tab, then reload.'));return;}
    resolve();return new Promise(()=>{});
   }).catch(reject);});
   await restore(manifest);await flush();
   const menu=document.createElement('details'),summary=document.createElement('summary'),out=document.createElement('button');summary.textContent='Player';out.textContent=`Sign out of ${GAME_NAME}`;
   out.onclick=async()=>{await flush();if(Object.values(saveStorage.meta()).some(m=>m.dirty)){status('Save pending · retry before signing out');return;}sessionStorage.removeItem(tokenKey());location.replace('/');};menu.append(summary,out);bar.append(menu);
  }else{
   if(['localhost','127.0.0.1'].includes(location.hostname)){action('',connect);}else{action('Connect account',connect);}
   account.ageBand=nativeStorage.getItem('garcadium-guest-age');
   if(account.ageBand==='under13'){status('A parent-managed Garcadium profile is required.');action('Use my Garcadium account',connect);return false;}
   if(!['13-17','18+'].includes(account.ageBand)){
    const allowed=await new Promise(resolve=>{const d=document.createElement('dialog');d.className='gca-dialog';
     const h=document.createElement('h2');h.textContent='Who is playing?';const p=document.createElement('p');p.textContent='Choose your age group. Children under 13 need a parent-managed Garcadium profile.';d.append(h,p);
     for(const [value,label]of [['under13','Under 13'],['13-17','13–17'],['18+','18 or over']]){const b=document.createElement('button');b.textContent=label;b.onclick=()=>{nativeStorage.setItem('garcadium-guest-age',value);account.ageBand=value;if(value==='under13'){location.assign(PORTAL+'/family/');resolve(false);}else{d.close();d.remove();resolve(true);}};d.append(b);}
     const sign=document.createElement('button');sign.textContent='Use my Garcadium account';sign.onclick=connect;d.append(sign);d.addEventListener('cancel',e=>e.preventDefault());document.body.append(d);d.showModal();});
    if(!allowed)return false;
   }
  }
  saveStorage.onchange=()=>{if(account.token){status('Save pending in this browser');clearTimeout(timer);timer=setTimeout(flush,1200);}else status('Guest · saved in this browser');};
  addEventListener('online',flush);addEventListener('pagehide',flush);setInterval(flush,15000);
  addEventListener('garcadium-online-save',e=>{let node=document.getElementById('gca-online-save');if(!node){node=document.createElement('span');node.id='gca-online-save';node.setAttribute('role','status');bar.append(node);}node.textContent=e.detail;});
  if(account.token)setInterval(async()=>{if(sessionEnded||checking||Date.now()-Math.max(lastValidated,lastCheckAttempt)<45000)return;checking=true;lastCheckAttempt=Date.now();try{await api('session');}catch(e){if(e.status===401||e.status===403){blocked=true;sessionEnded=true;status('Sign in again to continue');action('Reconnect',connect);window.dispatchEvent(new CustomEvent('garcadium-session-ended'));}}finally{checking=false;}},1000);
  return true;
 }catch(e){status(e.message||'Could not restore your save.');action('Reconnect to Garcadium',connect);return false;}
}



