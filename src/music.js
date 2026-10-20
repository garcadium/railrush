// Original eight-bar synth-funk loop, generated locally: no downloads or streaming.
export const BPM=136;
const STEP=60/BPM/4;
const CHORDS=[[60,64,67,71],[55,59,62,67],[57,60,64,67],[53,57,60,64]];
const MELODY=[0,-1,2,4,-1,2,1,-1,0,2,-1,4,3,-1,2,1];
const hz=midi=>440*2**((midi-69)/12);
export class Soundtrack {
 constructor(){this.context=null;this.timer=null;this.voices=new Set();this.step=0;this.next=0;this.playing=false;this.volume=.6;this.theme='run';}
 initialize(){
  if(this.context)return;this.context=new AudioContext();this.context.onstatechange=()=>this.onStateChange?.();const c=this.context;
  this.master=c.createGain();this.master.gain.value=.24;this.master.connect(c.destination);
  this.noise=c.createBuffer(1,c.sampleRate*.3,c.sampleRate);const data=this.noise.getChannelData(0);let seed=4217;for(let i=0;i<data.length;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;data[i]=(seed/4294967296)*2-1;}
 }
 voice(source,gain,extra,time,length){
  const nodes=[source,gain,...extra];this.voices.add(source);source.onended=()=>{this.voices.delete(source);nodes.forEach(n=>n.disconnect());};source.start(time);source.stop(time+length);
 }
 note(midi,time,length,volume,type='triangle'){
  const c=this.context,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.value=hz(midi);g.gain.setValueAtTime(0,time);g.gain.linearRampToValueAtTime(volume,time+.008);g.gain.exponentialRampToValueAtTime(.0001,time+length);o.connect(g).connect(this.master);this.voice(o,g,[],time,length+.02);
 }
 percussion(kind,time){
  const c=this.context,g=c.createGain();if(kind==='kick'){const o=c.createOscillator();o.frequency.setValueAtTime(125,time);o.frequency.exponentialRampToValueAtTime(44,time+.14);g.gain.setValueAtTime(.8,time);g.gain.exponentialRampToValueAtTime(.0001,time+.22);o.connect(g).connect(this.master);this.voice(o,g,[],time,.24);return;}
  const source=c.createBufferSource(),filter=c.createBiquadFilter();source.buffer=this.noise;filter.type='highpass';filter.frequency.value=kind==='hat'?7500:1300;const length=kind==='hat'?.045:.16;g.gain.setValueAtTime(kind==='hat'?.1:.24,time);g.gain.exponentialRampToValueAtTime(.0001,time+length);source.connect(filter).connect(g).connect(this.master);this.voice(source,g,[filter],time,length+.01);
 }
 schedule(step,time){
  if(this.theme==='menu'){const tick=step%16,chord=CHORDS[Math.floor(step/32)%4];if(tick===0){chord.forEach(n=>this.note(n,time,1.5,.065,'sine'));this.note(chord[0]-12,time,1.6,.15,'sine');}if(tick%4===0)this.percussion('kick',time);if(tick===4||tick===12)this.percussion('snare',time);if(tick%2===0)this.percussion('hat',time);if(tick%4===2)this.note(chord[(tick>>2)%4]+12,time,.55,.085,'triangle');return;}
  const tick=step%16,bar=Math.floor(step/16)%8,chord=CHORDS[Math.floor(bar/2)],swing=tick%2?STEP*.10:0;time+=swing;
  if([0,4,8,12].includes(tick))this.percussion('kick',time);
  if(tick===4||tick===12)this.percussion('snare',time);
  if(tick%2===0||bar%2===1&&tick===15)this.percussion('hat',time);
  if([0,3,6,8,11,14].includes(tick))this.note(chord[tick===11?2:0]-24,time,STEP*1.6,.36,'sine');
  if([2,7,10].includes(tick))chord.slice(0,3).forEach(n=>this.note(n,time,STEP*2.1,.075));
  const degree=MELODY[(tick+(bar%2)*4)%16];if(degree>=0){const scale=[0,4,7,11,12];this.note(chord[0]+12+scale[degree],time,STEP*(bar%2?1.3:1.7),.095,'triangle');}
 }
 pump(){if(!this.playing)return;const c=this.context;if(this.next<c.currentTime-.2)this.next=c.currentTime+.02;while(this.next<c.currentTime+.12){this.schedule(this.step,this.next);this.step=(this.step+1)%128;this.next+=STEP;}}
 start(){if(this.playing){if(this.context.state!=='running')this.context.resume().catch(()=>this.stop());return;}this.initialize();this.playing=true;this.next=this.context.currentTime+.03;this.master.gain.cancelScheduledValues(this.context.currentTime);this.master.gain.setValueAtTime(.24*this.volume,this.context.currentTime);this.context.resume().catch(()=>this.stop());this.pump();this.timer=setInterval(()=>this.pump(),25);}
 stop(){this.playing=false;clearInterval(this.timer);this.timer=null;if(!this.context)return;this.master.gain.cancelScheduledValues(this.context.currentTime);this.master.gain.setTargetAtTime(0,this.context.currentTime,.012);for(const voice of this.voices){try{voice.stop(this.context.currentTime+.04);}catch{}}}
 setVolume(value){this.volume=Math.max(0,Math.min(1,value));if(this.context&&this.playing)this.master.gain.setTargetAtTime(.24*this.volume,this.context.currentTime,.04);}
 setTheme(theme){if(this.theme===theme)return;const wasPlaying=this.playing;this.stop();this.theme=theme;this.step=0;if(wasPlaying)this.start();}
 setRunning(enabled){if(enabled)this.start();else this.stop();}
}


