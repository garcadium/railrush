import {chromium} from '../../overdrive/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const browser=await chromium.launch({channel:'msedge',headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:4196');
await page.getByRole('button',{name:'18 or over',exact:true}).click();await page.locator('#start:not([disabled])').waitFor();
async function seed(){
 await page.evaluate(async()=>{const {freshRun,defaultProgress,addMovingRoute}=await import('/src/simulation.mjs?v=20261016-shopfix');const p=defaultProgress(),s=freshRun(1);s.objects=[];s.spawn=1000;s.x=-3;s.lane=0;s.y=5.2;s.ground=5.2;addMovingRoute(s,0);for(const o of s.objects)o.z-=106;p.active=s;localStorage.setItem('railrush-progress-v1',JSON.stringify(p));});
 await page.reload();await page.locator('#start:not([disabled])').waitFor();await page.click('#start');
}
await seed();await page.keyboard.press('ArrowUp');await page.keyboard.press('ArrowRight');await page.waitForTimeout(350);await page.screenshot({path:'moving-jump-desktop.png'});await page.waitForTimeout(750);await page.keyboard.press('KeyP');
let s=await page.evaluate(()=>JSON.parse(localStorage.getItem('railrush-progress-v1')).active);assert.ok(s.alive);assert.equal(s.y,5.2);assert.equal(s.lane,1);
await page.reload();await page.locator('#start:not([disabled])').waitFor();await page.click('#start');await page.keyboard.press('KeyP');s=await page.evaluate(()=>JSON.parse(localStorage.getItem('railrush-progress-v1')).active);assert.equal(s.y,5.2);assert.ok(s.objects.some(o=>o.speed===6&&o.z<0));
await page.click('#home');await page.setViewportSize({width:390,height:844});await seed();await page.locator('[data-action="jump"]').click();await page.locator('[data-action="right"]').click();await page.waitForTimeout(1100);await page.keyboard.press('KeyP');s=await page.evaluate(()=>JSON.parse(localStorage.getItem('railrush-progress-v1')).active);assert.equal(s.y,5.2);assert.equal(s.lane,1);assert.ok(s.alive);await page.screenshot({path:'moving-roof-mobile.png'});
assert.deepEqual(errors,[]);console.log('Passed desktop and mobile rooftop transfers, saved moving roof restoration, and no browser errors.');await browser.close();
