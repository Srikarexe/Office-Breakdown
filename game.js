const $=s=>document.querySelector(s),cv=$("#c"),c=cv.getContext("2d"),PI=Math.PI;
const W=1280,H=720,FL=610,GR=.75,SPD=4.4,cl=(v,a,b)=>Math.max(a,Math.min(b,v)),rnd=(a,b)=>a+Math.random()*(b-a);
const S={mute:false};let ctlFrom="title";
/* ---------- input ---------- */
const KM={KeyA:[0,"l"],KeyD:[0,"r"],KeyW:[0,"u"],KeyS:[0,"d"],KeyF:[0,"a"],KeyG:[0,"s"],KeyH:[0,"x"],ArrowLeft:[1,"l"],ArrowRight:[1,"r"],ArrowUp:[1,"u"],ArrowDown:[1,"d"],KeyK:[1,"a"],KeyL:[1,"s"],Semicolon:[1,"x"]};
const DN=[{},{}],BF=[{},{}],NOD={},NOB={};
addEventListener("keydown",e=>{au();if(e.code==="Escape"){if(!e.repeat)togglePause();return}if(e.code==="KeyM"&&!e.repeat){mute();return}const m=KM[e.code];if(!m)return;e.preventDefault();if(!DN[m[0]][m[1]])BF[m[0]][m[1]]=7;DN[m[0]][m[1]]=1});
addEventListener("keyup",e=>{const m=KM[e.code];if(m)DN[m[0]][m[1]]=0});
addEventListener("blur",()=>{DN[0]={};DN[1]={};if(G.st==="fight")togglePause()});
const pr=(f,k)=>f.b[k]>0&&(f.b[k]=0,true);


/* ---------- audio ---------- */
let AX,MG;
function au(){if(!AX){try{AX=new(window.AudioContext||window.webkitAudioContext)();MG=AX.createGain();MG.connect(AX.destination);vol(.8)}catch(e){}}if(AX&&AX.state==="suspended")AX.resume()}
function vol(v){G.vol=v;if(MG)MG.gain.setTargetAtTime(S.mute?0:v,AX.currentTime,.05)}
function noise(d,f,v){if(!AX)return;const n=AX.sampleRate*d,b=AX.createBuffer(1,n,AX.sampleRate),a=b.getChannelData(0);for(let i=0;i<n;i++)a[i]=(Math.random()*2-1)*(1-i/n);const s=AX.createBufferSource(),q=AX.createBiquadFilter(),g=AX.createGain();s.buffer=b;q.type="bandpass";q.frequency.value=f;g.gain.value=v;s.connect(q);q.connect(g);g.connect(MG);s.start()}
function osc(f,d,t,v,sl){if(!AX)return;const o=AX.createOscillator(),g=AX.createGain(),n=AX.currentTime;o.type=t;o.frequency.setValueAtTime(f,n);o.frequency.exponentialRampToValueAtTime(Math.max(25,f+sl),n+d);g.gain.setValueAtTime(v,n);g.gain.exponentialRampToValueAtTime(.001,n+d);o.connect(g);g.connect(MG);o.start();o.stop(n+d)}
function snd(k){if(!AX||S.mute)return;({l(){noise(.07,1800,.3);osc(200,.06,"square",.05,-120)},h(){noise(.14,700,.5);osc(110,.22,"sine",.5,-70)},w(){noise(.2,2600,.14)},j(){osc(260,.1,"triangle",.1,200)},d(){noise(.1,400,.15)},b(){osc(300,.08,"square",.1,-100)},ko(){osc(60,1.2,"sine",.8,-35);noise(.6,300,.6)},boom(){osc(70,.9,"sawtooth",.35,-40);noise(.7,1200,.4)},obj(){noise(.2,900,.35);osc(80,.3,"sine",.4,-40)}})[k]()}
function mute(){S.mute=!S.mute;vol(G.vol||.8);$("#mu1").textContent=$("#mu2").textContent="Sound: "+(S.mute?"off":"on")}
/* ---------- move data (frames at 60 Hz). y0/y1 = height above floor. ---------- */
const MV={
jab:{su:3,a:3,r:6,d:4,kb:3,rc:70,off:10,y0:100,y1:135,hs:3,sh:2,t:"JAB",tip:"hF",sv:2,p:{aF:[1.55,1.57],lean:.12}},
cross:{su:5,a:3,r:10,d:7,kb:6,rc:90,off:10,y0:95,y1:135,hs:5,sh:4,t:"CROSS",tip:"hB",sv:4,p:{aB:[1.5,1.57],lean:.32}},
hook:{su:8,a:4,r:14,d:9,kb:8,rc:88,off:8,y0:95,y1:140,hs:6,sh:5,t:"HOOK",tip:"hF",sv:3,p:{aF:[1.2,2.9],lean:.42}},
low:{su:5,a:3,r:8,d:5,kb:4,rc:88,off:10,y0:5,y1:35,hs:3,sh:2,t:"LOW",tip:"fF",low:1,p:{lF:[1.35,1.45],lean:-.2,drop:10}},
upper:{su:6,a:4,r:16,d:9,kb:3,lift:-14,rc:70,off:5,y0:60,y1:175,hs:7,sh:5,t:"UPPERCUT",tip:"hB",p:{aB:[2.6,2.9],lean:.1,drop:14}},
jkick:{su:2,a:50,r:6,d:7,kb:7,rc:80,off:10,y0:15,y1:70,hs:5,sh:4,t:"KICK",tip:"fF",av:5,air:1,p:{lF:[1.4,1.5],lB:[-.3,-.2],lean:-.35}},
torn:{su:10,a:24,r:22,d:12,kb:14,hs:8,sh:6,t:"WHAM",tip:"fF",leg:1,lx:3.6,lv:-10,sp:150,p:{}},
knee:{su:12,a:18,r:18,d:14,kb:14,rc:60,off:15,y0:40,y1:150,hs:9,sh:7,t:"KNEE!",tip:"fF",sv:8,av:12,lv:-7,sp:150,p:{lF:[1.9,.4],lB:[-1,-1.2],aF:[1.2,1.8],aB:[-.8,-.4],lean:.55}},
sup:{su:18,a:12,r:26,d:16,kb:18,rc:115,off:20,y0:80,y1:140,hs:11,sh:10,t:"SUPERMAN!",tip:"hF",av:11,hov:1,sp:180,p:{lean:1.15,aF:[1.55,1.57],aB:[-1.4,-1.5],lF:[-1.3,-1.5],lB:[-1.1,-1.4]}}};
const B0={aF:[.5,2.2],aB:[.2,2.4],lF:[.35,.1],lB:[-.4,-.15],lean:.05,drop:0};
const mixp=(a,b,k)=>{const r={};for(const q in B0){const x=a[q],y=b[q]!==undefined?b[q]:B0[q];r[q]=Array.isArray(x)?[x[0]+(y[0]-x[0])*k,x[1]+(y[1]-x[1])*k]:x+(y-x)*k}return r};
/* ---------- state ---------- */
const G={st:"title",ts:1,hs:0,shake:0,t:0,paused:false,vol:.8,cam:{x:W/2,y:FL-210,z:1}};
let P=[],FX=[],PT=[],MODE=null;
const MODES=[{id:"layoff",name:"LAYOFF LEGENDS",tag:"Same office. Different victim.",start(){startFight()}}];
function mk(i){return{i,x:i?900:380,y:FL,vx:0,vy:0,face:i?-1:1,hp:100,hpv:100,st:"free",fr:0,mv:null,stun:0,kd:0,inv:0,sp:0,dd:0,cb:0,cbT:0,lie:0,spin:0,wk:0,flash:0,pose:mixp(B0,{},1),tie:[],trail:[],hit:new Set,conn:0,col:i?"#3b8bff":"#ff3b3b",d:DN[i],b:BF[i],aura:0,eye:0,blk:0,adj:0,walking:0,neck:{x:0,y:0},j:null}}
function startFight(){au();for(let i=0;i<2;i++){DN[i]={};BF[i]={}}P=[mk(0),mk(1)];P.forEach((f,i)=>{f.d=DN[i]=DN[i];f.b=BF[i]});FX=[];PT=[];Object.assign(G,{st:"intro",ts:1,hs:0,shake:0,t:0,intro:130,time:99,tc:0,pud:null,cab:null,prn:0,hz:420,fin:null,paused:false,ann:null});G.cam={x:W/2,y:FL-210,z:1};vol(.8);go(null);mute();mute()}
function toModes(){G.st="title";G.paused=false;P=[];FX=[];PT=[];G.fin=null;G.cab=null;G.pud=null;G.prn=0;G.ann=null;go("modes")}
function go(id){document.querySelectorAll(".s").forEach(e=>e.classList.remove("on"));if(id)$("#"+id).classList.add("on")}
function togglePause(){if(!["fight","intro"].includes(G.st))return;G.paused=!G.paused;go(G.paused?"pause":null)}
$("#mcards").innerHTML=MODES.map((m,i)=>`<div class="card"><h3>${m.name}</h3><p class="tag">${m.tag}</p><button class="b" onclick="MODES[${i}].start()">Fight</button></div>`).join("");mute();mute();
/* ---------- fighter logic ---------- */
function start(f,n){f.st="atk";f.mv=n;f.fr=0;f.hit.clear();f.conn=0;f.trail=[];f.kext=0;if(n==="jkick"&&f.y>=FL)f.vy=-11;snd(MV[n].sp?"w":"d")}
const NEXT={jab:"cross",cross:"hook",upper:"jkick"};
function step(f,o){
 const act=G.st==="fight",d=act?f.d:NOD,gr=f.y>=FL,dir=(d.r?1:0)-(d.l?1:0);
 if(!act){for(const k in f.b)f.b[k]=0}
 for(const k in f.b)if(f.b[k]>0)f.b[k]--;
 if(f.inv>0)f.inv--;if(f.sp>0)f.sp--;if(f.dd>0)f.dd--;if(f.flash>0)f.flash--;if(f.cbT>0&&--f.cbT===0)f.cb=0;
 const sl=G.pud&&gr&&Math.abs(f.x-G.pud.x)<G.pud.w/2;f.blk=0;let hov=false;
 if(f.st==="free"){
  if(gr)f.face=o.x>=f.x?1:-1;
  if(gr&&d.d){f.blk=1;f.vx*=.7}
  else if(gr){if(sl){f.vx=cl(f.vx+dir*.3,-5.5,5.5)*.995}else f.vx=dir*SPD}
  else f.vx+=(dir*SPD-f.vx)*.06;
  f.walking=dir!==0&&gr;if(f.walking)f.wk+=.28;
  if(gr&&pr(f,"u")){f.vy=-16.5;snd("j");puff(f.x,f.y,4)}
  if(pr(f,"x")&&f.dd<=0){f.st="dodge";f.fr=0;f.inv=14;f.dd=42;f.vx=(dir||-f.face)*10;snd("d")}
  else if(pr(f,"s")&&f.sp<=0&&gr){start(f,d.d?"sup":dir===f.face?"knee":"torn");f.sp=MV[f.mv].sp}
  else if(pr(f,"a")){start(f,!gr?"jkick":d.d?"upper":dir===-f.face?"low":"jab")}
 }else if(f.st==="atk"){
  const m=MV[f.mv],t=++f.fr,on=t>m.su&&t<=m.su+m.a;f.walking=0;
  if(t<=m.su&&m.sv)f.vx=m.sv*f.face;else if(on&&m.av)f.vx=m.av*f.face;else if(gr)f.vx*=.8;
  if(t===m.su+1&&m.lv)f.vy=m.lv;if(t===m.su+1&&m.lx)f.vx=m.lx*f.face;
  if(m.hov&&on){hov=true;f.vy=-.4}
  if(on){if(m.ev&&(t-m.su-1)%m.ev===0)f.hit.clear();if(m.leg&&f.kext<.25)f.trail=[];else{f.trail.push(tip(f,m.tip));if(f.trail.length>7)f.trail.shift()}hitscan(f,o,m,t)}
  if(m.air&&gr&&t>4){f.st="free";f.vx=0}
  else if(f.conn&&t>m.su&&act){
   if(f.sp<=0&&pr(f,"s")){start(f,d.d?"sup":dir===f.face?"knee":"torn");f.sp=MV[f.mv].sp}
   else if(NEXT[f.mv]&&pr(f,"a")){start(f,f.mv==="cross"&&d.d?"upper":NEXT[f.mv])}}
  if(f.st==="atk"&&t>=m.su+m.a+m.r)f.st="free"
 }else if(f.st==="dodge"){if(++f.fr>16)f.st="free";f.vx*=.9}
 else if(f.st==="hit"){f.vx*=gr?.9:.99;if(gr&&f.kd){f.st="down";f.fr=0;f.vx*=.5;puff(f.x,f.y,8);snd("d")}else if(--f.stun<=0&&gr)f.st="free"}
 else if(f.st==="down"){f.vx*=.85;if(++f.fr>55){f.st="free";f.kd=0;f.inv=24}}
 else if(f.st==="ko"){f.vx*=gr?.93:.995;if(!gr)f.spin+=.22*-f.face;else f.spin*=.8;if(f.x<80||f.x>W-80){if(Math.abs(f.vx)>3){papers(f.x,f.y-80,18);G.shake=Math.max(G.shake,12);snd("obj")}f.x=cl(f.x,80,W-80);f.vx*=-.2}}
 else if(f.st==="win"){if(!f.walking)f.vx*=.8}
 f.vy+=hov?0:GR;f.x+=f.vx;f.y+=f.vy;
 if(f.y>=FL){if(f.vy>7&&f.st!=="ko"){puff(f.x,FL,6);snd("d")}if(f.st==="ko"&&f.vy>3){f.vy*=-.35;f.vx*=.7;puff(f.x,FL,10);G.shake=Math.max(G.shake,9);snd("h");f.y=FL}else{f.y=FL;f.vy=0}}
 f.x=cl(f.x,70,W-70);
 const lt=f.st==="down"||f.st==="ko"?1:0;f.lie+=(lt-f.lie)*.18;
 if(f.st==="atk"&&f.mv==="torn"){const q=tornPose(f);f.pose=q.p;f.yaw=q.yaw}else{f.yaw=0;f.pose=mixp(f.pose,posef(f),f.st==="atk"?.8:.35)}
}
function separate(){const a=P[0],b=P[1];if(a.st==="ko"||b.st==="ko"||a.inv>0||b.inv>0)return;const dx=b.x-a.x,ov=46-Math.abs(dx);if(ov>0&&Math.abs(a.y-b.y)<110){const s=dx>=0?1:-1;a.x-=s*ov/2;b.x+=s*ov/2;a.x=cl(a.x,70,W-70);b.x=cl(b.x,70,W-70)}}
function posef(f){let p={},e=1;const s=f.st;
 if(s==="atk"){const m=MV[f.mv],t=f.fr,sa=m.su+m.a;e=t<=m.su?t/m.su:t<=sa?1:Math.max(0,1-(t-sa)/m.r);p=m.p}
 else if(s==="hit")p={lean:-.45,aF:[-.5,-.2],aB:[-.9,-.5],lF:[.5,.3],lB:[-.6,-.3]};
 else if(s==="dodge")p={lean:-.5,drop:20,lF:[.9,-.4],lB:[-.8,-.2]};
 else if(s==="down"||s==="ko")p={aF:[-1.2,-1.4],aB:[1.2,1.4],lF:[.5,.9],lB:[-.5,-.9]};
 else if(f.adj)p={aF:[.35,2.9],aB:[.1,2.5],lean:.02,lF:[.2,.1],lB:[-.2,-.1],drop:2};
 else if(f.blk)p={aF:[.7,2.7],aB:[.5,2.9],lean:.15,drop:8};
 else if(f.y<FL)p=f.vy<0?{lF:[.9,-.2],lB:[-.4,.4],aF:[.9,2.2],aB:[-.3,2]}:{lF:[.5,.1],lB:[-.3,0]};
 else if(f.walking){const w=Math.sin(f.wk);p={lF:[w*.8,w*.8-.45],lB:[-w*.8,-w*.8-.45],lean:.12,aF:[-w*.6+.2,2],aB:[w*.6,2]}}
 return mixp(B0,p,e)}
function joints(f){const P_=f.pose,fc=f.face,L=36,A=26,bob=f.st==="free"&&!f.walking?Math.sin(G.t*.08+f.i)*1.5:0;
 const hip={x:f.x,y:f.y-72+P_.drop+bob+58*f.lie},rot=-fc*PI/2*f.lie+f.spin,cr=Math.cos(rot),sr=Math.sin(rot);
 const ps=f.yaw||0,cp=Math.cos(ps),sp=Math.sin(ps),Wd=p=>({x:hip.x+p.x*cr-p.y*sr,y:hip.y+p.x*sr+p.y*cr}),pj=(xf,y,z)=>Wd({x:fc*(xf*cp+z*sp),y});
 const chain=(ox,oy,z,q,l)=>{const a=Math.sin(q[0])*l,b=Math.cos(q[0])*l,c2=Math.sin(q[1])*l,d=Math.cos(q[1])*l,r=[pj(ox,oy,z),pj(ox+a,oy+b,z),pj(ox+a+c2,oy+b+d,z)];r.d=z*cp-(ox+a)*sp;return r};
 const nx=Math.sin(P_.lean)*50,ny=-Math.cos(P_.lean)*50,hx=nx+Math.sin(P_.lean)*20,hy=ny-Math.cos(P_.lean)*20;
 return{hip:pj(0,0,0),neck:pj(nx,ny,0),head:pj(hx,hy,0),lF:chain(0,0,8,P_.lF,L),lB:chain(0,0,-8,P_.lB,L),aF:chain(nx,ny,11,P_.aF,A),aB:chain(nx,ny,-11,P_.aB,A),rot,yaw:ps}}
function ORD(j){const t=[j.hip,j.neck];t.d=0;return[j.aB,j.lB,t,j.lF,j.aF].sort((a,b)=>a.d-b.d)}
/* Tornado kick: windup crouch -> takeoff -> hips/torso yaw one full turn (smoothstep) while the kicking leg chambers, extends through the opponent, retracts -> landing crouch -> idle */
function tornPose(f){const t=f.fr,E=u=>u<=0?0:u>=1?1:u*u*(3-2*u);
 const WU={drop:22,lean:-.18,lF:[1.2,-.25],lB:[1.1,-.45],aF:[-.8,-.3],aB:[-.4,-.1]},
 CH={drop:6,lean:.3,lF:[1,-.5],lB:[.2,-.1],aF:[1.9,1.8],aB:[.5,1.2]},
 KK={drop:0,lean:.28,lF:[-1.2,-1.35],lB:[.9,-.9],aF:[1.45,1.6],aB:[-.7,-1]},
 LD={drop:22,lean:.15,lF:[1.15,-.35],lB:[1.05,-.45],aF:[.6,1.5],aB:[.3,1.6]};
 const u=Math.max(0,Math.min(1,(t-10)/26)),e1=E((u-.2)/.22)*(1-E((u-.6)/.22));
 let p=mixp(B0,WU,E(t/10));p=mixp(p,CH,E((t-10)/5));p=mixp(p,KK,e1);p=mixp(p,LD,E((t-34)/6));p=mixp(p,B0,E((t-40)/16));
 f.kext=e1;return{p,yaw:t<=10?-.6*E(t/10):u>=1?0:-.6+(2*PI+.6)*E(u)}}
function tip(f,k){const j=joints(f);return k==="hF"?j.aF[2]:k==="hB"?j.aB[2]:j.lF[2]}
/* ---------- combat ---------- */
function hurt(o){const lo=o.st==="down"||o.st==="ko"||o.lie>.5;return lo?{x0:o.x-60,x1:o.x+60,y0:o.y-40,y1:o.y}:{x0:o.x-24,x1:o.x+24,y0:o.y-(o.blk?135:150),y1:o.y}}
function hitscan(f,o,m,t){if(f.hit.has(o)||o.inv>0||o.st==="down"||o.st==="ko"||o.st==="win")return;
 let x0,x1,ay0=f.y-m.y1,ay1=f.y-m.y0,tp=null;
 if(m.leg){if(f.kext<.7)return;const j=joints(f),hp=j.hip;tp=j.lF[2];if((tp.x-f.x)*f.face<35)return;x0=Math.min(hp.x,tp.x)-12;x1=Math.max(hp.x,tp.x)+12;ay0=Math.min(hp.y,tp.y)-14;ay1=Math.max(hp.y,tp.y)+14}
 else if(m.off<0){x0=f.x-m.rc;x1=f.x+m.rc}else if(f.face>0){x0=f.x+m.off;x1=x0+m.rc}else{x1=f.x-m.off;x0=x1-m.rc}
 const h=hurt(o);if(x1<h.x0||x0>h.x1||ay0>h.y1||ay1<h.y0)return;
 f.hit.add(o);f.conn=1;const last=m.ev&&t>=m.su+m.a-m.ev+1;
 const blk=o.blk&&o.face===-f.face&&!m.low;let dmg=m.d;if(o.st==="hit"){f.cb++;dmg=Math.max(1,Math.round(dmg*Math.max(.5,1-.1*f.cb)))}else f.cb=1;f.cbT=50;
 const px=tp?tp.x:o.x-f.face*10,py=tp?tp.y:o.y-(m.y0+m.y1)/2-10,kb=last&&m.kbL?m.kbL:m.kb;
 if(blk){dmg=Math.ceil(dmg*.12);o.vx=f.face*kb*.5;snd("b");sparks(px,py,5,"#9fd0ff");G.hs=3}
 else{o.st="hit";o.stun=Math.max(14,Math.round(dmg*1.5+8));o.vx=f.face*kb;o.vy=m.lift||(o.y<FL?-3:last?-6:0);o.kd=!!(m.lift||kb>=12);o.flash=6;o.fr=0;
  const big=m.d>=9||last;snd(big?"h":"l");sparks(px,py,big?14:7,"#ffd54a");FX.push({k:"b",x:px,y:py,t:0,l:16,s:big?70:44,c:big?"#ff5a36":"#ffd54a",tx:m.t});G.hs=m.hs;G.shake=Math.max(G.shake,m.sh);if(big)papers(px,py,4)}
 dmgTo(o,dmg,f)}
function dmgTo(o,n,src){o.hp=Math.max(0,o.hp-n);if(o.hp<=0&&G.st==="fight")startFin(src||P[1-o.i],o,false)}
function startFin(w,l,soft){G.st="fin";G.fin={t:0,ph:0,w,l};l.st="ko";l.kd=0;l.fr=0;l.vx=w.face*(soft?4:17);l.vy=soft?-6:-13;w.st="win";w.vx=0;w.fr=0;G.hs=soft?6:30;G.shake=soft?4:22;
 FX.push({k:"b",x:l.x,y:l.y-90,t:0,l:30,s:140,c:"#fff",tx:"K.O.!"});sparks(l.x,l.y-90,30,"#fff");papers(l.x,l.y-90,16);snd("ko");G.ann=null}
function stepFin(){const F=G.fin,w=F.w,l=F.l;F.t++;
 if(F.ph===0){if(F.t===1){G.ts=.3;vol(.12)}if(l.y>=FL&&Math.abs(l.vx)<.4&&F.t>70){F.ph=1;G.ts=1;F.t=0}}
 else if(F.ph===1){const dx=l.x-w.x;w.face=dx>=0?1:-1;if(Math.abs(dx)>170&&w.x>100&&w.x<W-100){w.vx=w.face*1.25;w.wk+=.1;w.walking=1}else{w.vx=0;w.walking=0;F.ph=2;F.t=0}}
 else if(F.ph===2){w.aura=Math.min(1,F.t/210);w.eye=w.aura;vol(.12+w.aura*.2);auraP(w);if(F.t>230||w.aura>=1&&F.t>215){F.ph=3;F.t=0;w.adj=1;G.shake=14;FX.push({k:"ring",x:w.x,y:w.y-90,t:0,l:40,c:w.col});sparks(w.x,w.y-90,40,w.col);snd("boom");vol(.9)}}
 else if(F.ph===3){auraP(w);if(F.t>230){G.st="end";$("#wp").textContent="PLAYER "+(w.i+1);$("#wp").className=w.i?"p2":"p1";$(".ko").style.setProperty("--w",w.col);go("win")}}}
function timeUp(){const[a,b]=P;if(a.hp===b.hp){G.st="end";$("#wp").textContent="DRAW";$("#wp").className="";go("win");return}startFin(a.hp>b.hp?a:b,a.hp>b.hp?b:a,true)}
/* ---------- fx ---------- */
function puff(x,y,n){for(let i=0;i<n;i++)PT.push({k:"d",x:x+rnd(-14,14),y:y-2,vx:rnd(-2,2),vy:rnd(-2,-.3),l:30,m:30,s:rnd(4,9)})}
function sparks(x,y,n,col){for(let i=0;i<n;i++){const a=rnd(0,PI*2),s=rnd(3,11);PT.push({k:"s",x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:18,m:18,s:rnd(2,4),c:col})}}
function papers(x,y,n){for(let i=0;i<n;i++)PT.push({k:"p",x:x+rnd(-20,20),y:y+rnd(-20,20),vx:rnd(-6,6),vy:rnd(-10,-2),l:140,m:140,r:rnd(0,6),vr:rnd(-.2,.2),s:rnd(8,13)})}
function auraP(w){if(G.t%2)return;const k=w.aura;for(let i=0;i<2+k*3;i++)PT.push({k:"a",x:w.x+rnd(-45,45),y:w.y-rnd(0,40),vx:rnd(-.5,.5),vy:-rnd(2,6)*(.5+k),l:50,m:50,s:rnd(2,6),c:w.col});if(Math.random()<.4)PT.push({k:"p",x:w.x+rnd(-90,90),y:w.y-5,vx:rnd(-1,1),vy:-rnd(3,8)*k,l:130,m:130,r:0,vr:rnd(-.15,.15),s:11})}
function fxStep(){for(const f of FX)f.t++;FX=FX.filter(f=>f.t<f.l);
 for(const p of PT){p.l--;p.x+=p.vx;p.y+=p.vy;if(p.k==="p"){p.vy+=.12;p.vx*=.98;p.r+=p.vr;if(p.y>FL+30){p.y=FL+30;p.vy=0;p.vx*=.8;p.vr=0}}else if(p.k==="s")p.vy+=.4;else if(p.k==="d")p.vx*=.95}
 PT=PT.filter(p=>p.l>0);if(PT.length>350)PT.splice(0,PT.length-350);if(G.shake>0)G.shake*=.88}
function hazards(){
 if(--G.hz<=0){G.hz=rnd(520,860);const k=Math.floor(rnd(0,3));if(k===0&&!G.pud)G.pud={x:rnd(330,950),w:180,t:560};else if(k===1&&!G.prn)G.prn=170;else if(!G.cab){const f=P[Math.floor(rnd(0,2))];G.cab={x:cl(f.x+rnd(-80,80),160,W-160),t:110,y:-150,vy:0,done:0,hit:new Set}}}
 if(G.pud&&--G.pud.t<=0)G.pud=null;
 if(G.prn>0){G.prn--;if(G.prn%5===0){PT.push({k:"p",x:1130,y:FL-190,vx:-rnd(5,12),vy:-rnd(3,8),l:140,m:140,r:0,vr:rnd(-.2,.2),s:12})}if(G.prn===150)snd("obj")}
 const k=G.cab;if(k){if(k.t>0)k.t--;else if(!k.done){k.vy+=1.1;k.y+=k.vy;for(const f of P){if(!k.hit.has(f)&&f.inv<=0&&f.st!=="ko"&&Math.abs(f.x-k.x)<52&&f.y-150<k.y+130&&f.y>k.y){k.hit.add(f);f.st="hit";f.stun=26;f.kd=true;f.vx=(f.x>=k.x?1:-1)*6;f.vy=-8;f.flash=8;dmgTo(f,12,P[1-f.i]);sparks(f.x,f.y-90,12,"#ffd54a")}}
   if(k.y+130>=FL){k.y=FL-130;k.done=1;k.t=130;G.shake=Math.max(G.shake,14);snd("boom");papers(k.x,FL-60,14);puff(k.x,FL,14)}}else if(--k.t<=0)G.cab=null}}
function sim(){
 if(G.hs>0){G.hs--;return}
 G.t++;
 if(G.st==="intro"){G.intro--;G.ann=G.intro>55?"ROUND 1":"FIGHT!";if(G.intro<=0){G.st="fight";G.ann=null}}
 if(["intro","fight","fin","end"].includes(G.st)){
  step(P[0],P[1]);step(P[1],P[0]);separate();
  if(G.st==="fight"){hazards();if(++G.tc>=60){G.tc=0;if(--G.time<=0)timeUp()}}
  if(G.st==="fin")stepFin();
  if(G.st==="end"&&G.fin){const w=G.fin.w;w.aura*=.985;w.eye=w.aura;if(w.aura>.25)auraP(w)}
  for(const f of P){f.hpv+=(f.hp-f.hpv)*.06;const w=f.st==="win"?(f.adj?Math.sin(G.t*.35)*1.6+1.2:0):f.st==="atk"&&f.mv==="torn"?f.face*1.8*Math.sin(f.yaw||0):0;
   const j=joints(f);f.neck=j.neck;tieStep(f,j.neck,w)}
  fxStep()}}
function tieStep(f,n,wind){const T=f.tie;if(!T.length)for(let i=0;i<6;i++)T.push({x:n.x,y:n.y+i*10,px:n.x,py:n.y+i*10});
 T[0].x=n.x;T[0].y=n.y;for(let i=1;i<6;i++){const p=T[i],vx=(p.x-p.px)*.93,vy=(p.y-p.py)*.93;p.px=p.x;p.py=p.y;p.x+=vx+wind;p.y+=vy+.55;const q=T[i-1],dx=p.x-q.x,dy=p.y-q.y,l=Math.hypot(dx,dy)||1;p.x=q.x+dx/l*10;p.y=q.y+dy/l*10}}
/* ---------- rendering ---------- */
function txt(s,x,y,sz,fill,al="center",st="#0d1630",lw=8){c.font=`${sz}px Bangers,Impact,sans-serif`;c.textAlign=al;c.textBaseline="middle";c.lineJoin="round";c.lineWidth=lw;c.strokeStyle=st;c.strokeText(s,x,y);c.fillStyle=fill;c.fillText(s,x,y)}
function bg(t){const px=(G.cam.x-W/2)*.04;
 c.fillStyle="#0f1a3a";c.fillRect(-100,-60,W+200,FL+120);
 for(let i=0;i<4;i++){const x=110+i*300-px*2,g=c.createLinearGradient(0,60,0,330);g.addColorStop(0,"#ffe08a");g.addColorStop(1,"#ff9f43");c.fillStyle=g;c.fillRect(x,70,200,270);c.fillStyle="#d9792f";for(let k=0;k<6;k++)c.fillRect(x+k*34,230-((k*37)%90),24,110);c.strokeStyle="#2a3560";c.lineWidth=9;c.strokeRect(x,70,200,270);c.beginPath();c.moveTo(x+100,70);c.lineTo(x+100,340);c.moveTo(x,205);c.lineTo(x+200,205);c.stroke();
  c.fillStyle="rgba(255,200,90,.07)";c.beginPath();c.moveTo(x+10,340);c.lineTo(x+190,340);c.lineTo(x+330,FL);c.lineTo(x+90,FL);c.fill()}
 c.fillStyle="#16224a";c.fillRect(-100,360,W+200,FL-360);
 for(let i=0;i<7;i++){const x=40+i*190-px*4;c.fillStyle="#3a4570";c.fillRect(x,390,150,160);c.fillStyle="#4b5890";c.fillRect(x,386,150,8);c.fillStyle="#d8cdb0";c.fillRect(x-6,500,162,12);c.fillStyle="#6b7285";c.fillRect(x+20,452,52,40);c.fillStyle=i%2?"#8fc7e8":"#ffd978";c.fillRect(x+25,457,42,28);c.fillRect(x+40,492,12,8);if(i%3===0){c.fillStyle="#f3e6c4";c.fillRect(x+100,484,14,16);c.fillStyle="#2f7d5a";c.beginPath();c.arc(x+112,476,13,0,PI*2);c.fill()}}
 c.fillStyle="#9aa0b4";c.fillRect(20,430,70,180);c.fillStyle="#7b8196";for(let i=0;i<4;i++)c.fillRect(26,438+i*42,58,34);
 const sk=G.prn>0?rnd(-3,3):0;c.fillStyle="#cfc8b4";c.fillRect(1090+sk,FL-130,130,110);c.fillStyle="#8f8a7c";c.fillRect(1100+sk,FL-150,110,24);c.fillStyle="#fff";c.fillRect(1110+sk,FL-168,80,22);c.fillStyle="#2a3560";c.fillRect(1100+sk,FL-95,60,8);
 const g2=c.createLinearGradient(0,FL,0,H);g2.addColorStop(0,"#26356b");g2.addColorStop(1,"#101a3c");c.fillStyle=g2;c.fillRect(-100,FL,W+200,H-FL+80);c.fillStyle="#ffc83d22";c.fillRect(-100,FL,W+200,4);
 c.fillStyle="rgba(255,200,90,.1)";for(let i=0;i<4;i++){c.beginPath();c.ellipse(260+i*300-px*2,FL+50,130,22,0,0,PI*2);c.fill()}}
function fg(){c.fillStyle="rgba(8,12,28,.85)";c.fillRect(-100,FL+70,230,80);c.fillRect(W-130,FL+70,230,80);c.beginPath();c.arc(30,FL+75,34,PI,0);c.fill();c.fillRect(W-60,FL+40,10,40)}
function drawHaz(){const p=G.pud;if(p){c.fillStyle="#3b2418";c.beginPath();c.ellipse(p.x,FL+8,p.w/2,13,0,0,PI*2);c.fill();c.fillStyle="rgba(255,255,255,.25)";c.beginPath();c.ellipse(p.x-30,FL+4,34,4,0,0,PI*2);c.fill();c.fillStyle="#f3e6c4";c.fillRect(p.x+p.w/2+8,FL-14,16,16)}
 const k=G.cab;if(k){if(k.t>0&&!k.done){const a=.35+.35*Math.sin(G.t*.5),s=1+(110-k.t)/110;c.fillStyle=`rgba(255,59,59,${a})`;c.beginPath();c.ellipse(k.x,FL+6,60*s*.6,12,0,0,PI*2);c.fill();c.fillStyle=`rgba(255,59,59,${.5+a})`;c.beginPath();c.moveTo(k.x,FL-70);c.lineTo(k.x-26,FL-24);c.lineTo(k.x+26,FL-24);c.fill();txt("!",k.x,FL-42,32,"#fff","center","#a00",4)}
  c.save();c.globalAlpha=k.done&&k.t<30?k.t/30:1;c.fillStyle="#9aa0b4";c.fillRect(k.x-36,k.y,72,130);c.strokeStyle="#000";c.lineWidth=3;c.strokeRect(k.x-36,k.y,72,130);c.fillStyle="#7b8196";for(let i=0;i<3;i++){c.fillRect(k.x-30,k.y+8+i*40,60,32);c.strokeRect(k.x-30,k.y+8+i*40,60,32)}c.restore()}}
function limb(a,w,col){c.strokeStyle=col;c.lineWidth=w;c.beginPath();c.moveTo(a[0].x,a[0].y);for(let i=1;i<a.length;i++)c.lineTo(a[i].x,a[i].y);c.stroke()}
function drawF(f){const j=joints(f),ghost=f.inv>0&&f.st==="dodge";c.save();c.globalAlpha=ghost?.45:1;c.lineCap="round";c.lineJoin="round";
 for(const[w,col]of[[16,"rgba(255,235,190,.4)"],[10,f.flash>0?"#fff":"#05070d"]]){for(const a of ORD(j))limb(a,a.length===2?w+2:w,col);c.fillStyle=col;c.beginPath();c.arc(j.head.x,j.head.y,w===16?19:14,0,PI*2);c.fill()}
 c.fillStyle="#fff";const n=j.neck;c.beginPath();c.moveTo(n.x-11,n.y-6);c.lineTo(n.x+1,n.y+10);c.lineTo(n.x+2,n.y-3);c.fill();c.beginPath();c.moveTo(n.x+11,n.y-6);c.lineTo(n.x-1,n.y+10);c.lineTo(n.x-2,n.y-3);c.fill();
 if(f.st==="ko"||f.st==="down"){c.strokeStyle="#fff";c.lineWidth=2.5;for(const s of[-1,1]){c.beginPath();c.moveTo(j.head.x+f.face*6-3,j.head.y-3+s*3);c.lineTo(j.head.x+f.face*6+3,j.head.y+3+s*3);c.stroke()}}
 else{c.fillStyle=f.eye>0?f.col:"#fff";c.shadowColor=f.col;c.shadowBlur=f.eye*20;c.beginPath();if(Math.cos(j.yaw)>-.15){c.arc(j.head.x+f.face*6*Math.cos(j.rot)*Math.cos(j.yaw),j.head.y-2,f.eye>0?3.6:2.4,0,PI*2);c.fill()}c.shadowBlur=0}
 const T=f.tie;if(T.length){const ww=[3,4,6,9,12,5],L=[],R=[];for(let i=0;i<6;i++){const a=T[Math.max(0,i-1)],b=T[Math.min(5,i+1)],dx=b.x-a.x,dy=b.y-a.y,l=Math.hypot(dx,dy)||1,nx=-dy/l,ny=dx/l;L.push([T[i].x+nx*ww[i],T[i].y+ny*ww[i]]);R.push([T[i].x-nx*ww[i],T[i].y-ny*ww[i]])}
  c.fillStyle=f.col;c.strokeStyle="#0a0f1e";c.lineWidth=2;c.beginPath();c.moveTo(L[0][0],L[0][1]);for(let i=1;i<6;i++)c.lineTo(L[i][0],L[i][1]);for(let i=5;i>=0;i--)c.lineTo(R[i][0],R[i][1]);c.closePath();c.fill();c.stroke();c.beginPath();c.arc(T[0].x,T[0].y+1,5,0,PI*2);c.fill();c.stroke()}
 c.restore()}
/* One luminous sphere: translucent shaded interior + bright rim behind the fighter, spiral surface currents rotating in 3D (far side behind, near side faint in front). */
function drawAura(f,front){const k=f.aura;if(k<=.01)return;const ph=G.fin&&G.fin.ph>=3,I=Math.min(1.2,k*(ph?1.15:1)),R=(78+34*k)*(1+(ph?.03*Math.sin(G.t*.1):0)),cx=f.x,cy=f.y-80,red=f.col==="#ff3b3b",rgb=red?"255,59,59":"59,139,255",hi=red?"255,196,176":"176,218,255";
 c.save();
 if(!front){c.globalCompositeOperation="lighter";let g=c.createRadialGradient(cx-R*.3,cy-R*.35,R*.05,cx,cy,R);g.addColorStop(0,`rgba(${hi},${.22*I})`);g.addColorStop(.6,`rgba(${rgb},${.09*I})`);g.addColorStop(.88,`rgba(${rgb},${.3*I})`);g.addColorStop(1,`rgba(${rgb},${.7*I})`);c.fillStyle=g;c.beginPath();c.arc(cx,cy,R,0,PI*2);c.fill();
  c.globalCompositeOperation="source-over";c.save();c.beginPath();c.arc(cx,cy,R,0,PI*2);c.clip();g=c.createRadialGradient(cx-R*.3,cy-R*.35,R*.5,cx-R*.3,cy-R*.35,R*1.55);g.addColorStop(0,"rgba(4,8,24,0)");g.addColorStop(1,`rgba(4,8,24,${.38*Math.min(1,I)})`);c.fillStyle=g;c.fillRect(cx-R,cy-R,R*2,R*2);c.restore();
  c.globalCompositeOperation="lighter";c.fillStyle=`rgba(255,255,255,${.16*I})`;c.beginPath();c.ellipse(cx-R*.38,cy-R*.5,R*.22,R*.11,-.6,0,PI*2);c.fill();
  c.lineWidth=3+3*I;c.strokeStyle=`rgba(${hi},${.9*Math.min(1,I)})`;c.shadowColor=f.col;c.shadowBlur=16+14*I;c.beginPath();c.arc(cx,cy,R,0,PI*2);c.stroke();c.shadowBlur=0}
 c.globalCompositeOperation="lighter";c.lineCap="round";
 const sp=G.t*.05,ct=Math.cos(.4),sn=Math.sin(.4);
 for(let n=0;n<6;n++){let pv=null;for(let i=0;i<=30;i++){const s=i/30*2-1,la=s*1.25,lo=n*PI/3+s*2.6+sp,x=Math.cos(la)*Math.sin(lo),y0=-Math.sin(la),z0=Math.cos(la)*Math.cos(lo),y=y0*ct-z0*sn,z=y0*sn+z0*ct,pt={x:cx+R*.985*x,y:cy+R*.985*y,z};
  if(pv&&((pv.z+z)/2>=0)===!!front){const d=Math.abs((pv.z+z)/2);c.strokeStyle=`rgba(${hi},${(front?.42:.36)*I*(.3+.7*d)})`;c.lineWidth=(front?2.2:3.4)*(.5+.5*d);c.beginPath();c.moveTo(pv.x,pv.y);c.lineTo(pt.x,pt.y);c.stroke()}pv=pt}}
 c.restore()}
function drawFX(){for(const f of FX){const u=f.t/f.l;if(f.k==="b"){c.save();c.translate(f.x,f.y);c.rotate(.2);const s=f.s*(.6+Math.min(1,u*3)*.5);c.globalAlpha=1-u*u;c.fillStyle=f.c;c.strokeStyle="#000";c.lineWidth=4;c.beginPath();for(let i=0;i<16;i++){const r=i%2?s*.55:s,a=i/16*PI*2;c.lineTo(Math.cos(a)*r,Math.sin(a)*r)}c.closePath();c.fill();c.stroke();c.rotate(-.2);txt(f.tx,0,Math.max(18,s*.42),"#fff","center","#000",5);c.restore()}
  else if(f.k==="ring"){c.save();c.globalAlpha=1-u;c.strokeStyle=f.c;c.lineWidth=16*(1-u)+2;c.beginPath();c.arc(f.x,f.y,40+u*500,0,PI*2);c.stroke();c.globalCompositeOperation="lighter";c.fillStyle=f.c;c.globalAlpha=(1-u)*.5;for(let i=0;i<14;i++){const a=i/14*PI*2;c.save();c.translate(f.x,f.y);c.rotate(a);c.fillRect(60+u*300,-5,160,10);c.restore()}c.restore()}}
 for(const f of P){if(f.st==="atk"&&f.trail.length>1){const lg=MV[f.mv].leg;c.strokeStyle=lg?"rgba(255,244,200,.5)":"rgba(255,244,200,.8)";c.lineWidth=lg?4:6;c.lineCap="round";c.beginPath();c.moveTo(f.trail[0].x,f.trail[0].y);for(const p of f.trail)c.lineTo(p.x,p.y);c.stroke();if(MV[f.mv].ring){c.strokeStyle="rgba(255,244,200,.5)";c.lineWidth=8;c.beginPath();c.ellipse(f.x,f.y-75,95,40,0,0,PI*2);c.stroke()}}}
 for(const p of PT){const u=p.l/p.m;c.globalAlpha=Math.min(1,u*1.5);if(p.k==="p"){c.save();c.translate(p.x,p.y);c.rotate(p.r);c.fillStyle="#f6f0dc";c.fillRect(-p.s/2,-p.s*.7,p.s,p.s*1.4);c.restore()}else if(p.k==="d"){c.fillStyle="#cfc4a8";c.beginPath();c.arc(p.x,p.y,p.s*(2-u),0,PI*2);c.fill()}else{c.fillStyle=p.c;if(p.k==="a"){c.globalCompositeOperation="lighter"}c.fillRect(p.x,p.y,p.s,p.s);c.globalCompositeOperation="source-over"}}c.globalAlpha=1}
function bar(x,w,f,right){c.fillStyle="#000";c.fillRect(x-5,20,w+10,40);c.fillStyle="#2a1418";c.fillRect(x,25,w,30);const hv=f.hpv/100*w,h=f.hp/100*w;c.fillStyle="#ffc83d";if(right)c.fillRect(x+w-hv,25,hv,30);else c.fillRect(x,25,hv,30);c.fillStyle=f.col;if(right)c.fillRect(x+w-h,25,h,30);else c.fillRect(x,25,h,30);
 txt("PLAYER "+(f.i+1),right?x+w:x,76,26,f.col,right?"right":"left","#000",5);const r=1-f.sp/150;c.fillStyle="#000";c.fillRect(right?x:x+w-170,64,170,12);c.fillStyle=f.sp<=0?"#ffc83d":"#5a6aa0";c.fillRect(right?x:x+w-170,66,166*(f.sp<=0?1:Math.max(0,r)),8)}
function hud(){bar(40,520,P[0],0);bar(720,520,P[1],1);c.fillStyle="#000";c.fillRect(W/2-44,16,88,56);txt(String(Math.max(0,G.time)),W/2,45,46,"#ffc83d","center","#000",4);
 for(const f of P)if(f.cb>=2&&f.cbT>0)txt(f.cb+" HIT COMBO!",f.i?W-200:200,120,40,f.col,"center","#000",6);
 if(G.ann){const u=G.intro%55;txt(G.ann,W/2,H/2-60,110+Math.max(0,u-45)*8,"#ffc83d","center","#000",12)}
 c.font="500 15px Rubik,sans-serif";c.fillStyle="rgba(243,230,196,.65)";c.textAlign="center";c.fillText("P1: A D W S  F G H     |     P2: Arrows  K L ;     |     Esc pause   M mute",W/2,H-14)}
function render(){c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,W,H);
 const cam=G.cam;let tx,ty,tz;
 if(P.length&&["intro","fight","fin","end"].includes(G.st)){const F=G.fin;if(F&&F.ph>=2){tx=F.w.x+F.w.face*40;ty=F.w.y-110;tz=F.ph===3?2:1.4}else{tx=(P[0].x+P[1].x)/2;ty=FL-210;tz=cl(1150/(Math.abs(P[0].x-P[1].x)+420),1,1.28)}}else{tx=W/2+Math.sin(performance.now()/2500)*120;ty=FL-210;tz=1.05}
 const k=G.fin&&G.fin.ph>=2?.05:.12;cam.x+=(tx-cam.x)*k;cam.y+=(ty-cam.y)*k;cam.z+=(tz-cam.z)*k;
 const hw=W/2/cam.z,hh=H/2/cam.z,ccx=cl(cam.x,hw,W-hw),ccy=cl(cam.y,hh,H-hh),sh=G.shake*(S.reduce?0:1);
 c.translate(W/2+rnd(-sh,sh),H/2+rnd(-sh,sh));c.scale(cam.z,cam.z);c.translate(-ccx,-ccy);
 bg();drawHaz();
 if(P.length){const ord=P.slice().sort((a,b)=>(a.st==="ko"?-1:0)-(b.st==="ko"?-1:0));
  c.fillStyle="rgba(0,0,0,.35)";for(const f of P){c.beginPath();c.ellipse(f.x,FL+6,40*(1-(FL-f.y)/500),9,0,0,PI*2);c.fill()}
  for(const f of ord){drawAura(f,0);drawF(f);drawAura(f,1)}}
 drawFX();fg();
 if(G.fin&&G.fin.ph===0&&G.hs>0){c.fillStyle="rgba(255,255,255,.55)";c.fillRect(ccx-hw,ccy-hh,hw*2,hh*2)}
 c.setTransform(1,0,0,1,0,0);
 if(G.fin&&G.fin.ph>=2){const a=G.fin.w.aura*.5,g=c.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.85);g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,`rgba(5,8,20,${a})`);c.fillStyle=g;c.fillRect(0,0,W,H)}
 if(P.length&&G.st!=="title"&&G.st!=="end"&&!(G.fin&&G.fin.ph>=1))hud()}
let last=0,acc=0;
function loop(ts){requestAnimationFrame(loop);const dt=Math.min(50,ts-last);last=ts;if(!G.paused&&P.length){acc+=dt*G.ts;let n=0;while(acc>=16.667&&n++<5){acc-=16.667;sim()}}render()}
requestAnimationFrame(loop);
