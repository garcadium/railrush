import {initSaves} from './save-client.js?v=1.2.2';
import {boot} from './game.js?v=20261016-shopfix';
boot(initSaves).catch(error=>{console.error(error);document.querySelector('#start').textContent='Unable to start — reload to retry';document.querySelector('#toast').textContent=error.message;});

