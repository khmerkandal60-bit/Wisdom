const c=document.getElementById('c'),g=c.getContext('2d');let W,H;
function rs(){W=c.width=innerWidth;H=c.height=innerHeight}onresize=rs;rs();
const G={mode:'menu',st:'play',t:0,t2:0,time:.3,veh:[],peds:[],bl:[],me:null,wanted:0,heat:0,money:0,kills:0,msg:'',msgT:0,cnt:0,rank:0};
const IN={x:0,y:0,fire:0,brake:0,act:0},K={},P=new Map();let stick=null;
const NAME={car:'រថយន្ត',bike:'ម៉ូតូ',police:'ឡានប៉ូលីស',boat:'ទូក',ship:'កប៉ាល់',plane:'យន្តហោះ',train:'រថភ្លើង'};
const DX=[1,0,-1,0],DY=[0,1,0,-1],WP=[[40,440],[840,440],[840,2040],[40,2040]];
const HOST={me:['civ','enemy'],ally:['enemy'],enemy:['me','ally']};
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),msg=s=>{G.msg=s;G.msgT=200};
const MM=document.createElement('canvas');MM.width=MM.height=N*2;
(()=>{const m=MM.getContext('2d');for(let y=0;y<N;y++)for(let x=0;x<N;x++){const t=terr(x,y);m.fillStyle=t=='bld'?'#888':COL[t];m.fillRect(x*2,y*2,2,2)}})();
// ---------- សំឡេង ----------
let ac,osc,og;
function audio(){if(ac)return;ac=new(window.AudioContext||window.webkitAudioContext)();osc=ac.createOscillator();og=ac.createGain();osc.type='sawtooth';og.gain.value=0;osc.connect(og);og.connect(ac.destination);osc.start()}
function bang(){if(!ac)return;const s=ac.createBufferSource(),b=ac.createBuffer(1,3000,22050),d=b.getChannelData(0);for(let i=0;i<3000;i++)d[i]=(R()*2-1)*(1-i/3000);s.buffer=b;const q=ac.createGain();q.gain.value=.12;s.connect(q);q.connect(ac.destination);s.start()}
function chirp(){if(!ac)return;const o=ac.createOscillator(),q=ac.createGain();o.frequency.setValueAtTime(2200,ac.currentTime);o.frequency.linearRampToValueAtTime(3200,ac.currentTime+.08);q.gain.value=.02;o.connect(q);q.connect(ac.destination);o.start();o.stop(ac.currentTime+.1)}
// ---------- ជំនួយ ----------
function spawnRoad(a,b){for(let i=0;i<200;i++){const gx=R()*N|0,gy=R()*N|0;if(terr(gx,gy)!='road')continue;const x=gx*TS+20,y=gy*TS+20;if(G.me){const d=Math.hypot(x-G.me.x,y-G.me.y);if(d<a||d>b)continue}return{x,y}}return null}
function addTraffic(){const p=spawnRoad(350,1500);if(!p)return;const gx=p.x/TS|0,gy=p.y/TS|0,vert=gx%10<2,hor=gy%10<2;
 const d=vert&&!hor?(R()<.5?1:3):hor&&!vert?(R()<.5?0:2):R()*4|0;
 const v=new Veh(R()<.25?'bike':'car',p.x,p.y,d*PI/2);v.ai='traffic';v.d=d;v.sp=1.5+R()*1.6;G.veh.push(v)}
function addCiv(){const p=spawnRoad(200,1100);if(!p)return;const girl=R()<.45,old=!girl&&R()<.4;
 G.peds.push(new Ped(p.x+R()*30-15,p.y+R()*30-15,'civ',{girl,old,col:girl?`hsl(${300+R()*60|0},70%,60%)`:undefined}))}
function wanted(n){if(G.mode!='free')return;G.wanted=Math.min(3,G.wanted+n);G.heat=0}
function nearest(p,l){let b=null,bd=1e9;for(const q of l){const d=dist(p,q);if(d<bd){bd=d;b=q}}return b}
function mk(x,y,a,team){a+=(R()-.5)*.1;G.bl.push({x:x+Math.cos(a)*14,y:y+Math.sin(a)*14,vx:Math.cos(a)*10,vy:Math.sin(a)*10,team,life:50,dmg:team=='me'?20:8});bang()}
function shoot(p,t){mk(p.x,p.y,Math.atan2(t.y-p.y,t.x-p.x),p.team)}
function fireMe(){const me=G.me;let t=nearest(me,G.peds.filter(p=>p.team=='enemy'));if(t&&dist(me,t)>420)t=null;
 const a=t?Math.atan2(t.y-me.y,t.x-me.x):(me.veh?me.veh.a:me.a);me.a=a;mk(me.x,me.y,a,'me')}
// ---------- ចាប់ផ្តើមហ្គេម ----------
function reset(mode){Object.assign(G,{mode,st:'play',veh:[],peds:[],bl:[],wanted:0,heat:0,kills:0,cnt:0,t:0,t2:0,msg:''});
 G.me=new Ped(60,500,'me',{col:'#e33',hp:100});G.me.veh=null}
function startFree(){reset('free');const V=G.veh,Q=Math.PI/2;
 V.push(new Veh('car',30,600,Q),new Veh('police',30,680,Q),new Veh('bike',55,760,Q,{girl:1}),new Veh('bike',55,800,Q));
 [45,51,57].forEach(gx=>V.push(new Veh('boat',gx*TS+20,61*TS,PI)));
 V.push(new Veh('ship',52*TS,67*TS,0),new Veh('boat',riverX(30)*TS,30*TS,Q),new Veh('plane',1900,600,0));
 const tr=new Veh('train',300,220,0);tr.auto=1;V.push(tr);
 for(let i=0;i<16;i++)addTraffic();for(let i=0;i<35;i++)addCiv();
 for(let i=0;i<5;i++)G.peds.push(new Ped(150+i*30,300,'enemy',{col:'#c22',hp:40}));
 msg('ពិភពសេរី: ដើរទៅជិតយានជំនិះ ហើយចុច ឡើង')}
function startRace(){reset('race');
 for(let i=0;i<9;i++){const b=new Veh('bike',200-(i/3|0)*45,415+(i%3)*30,0,{num:i+1,girl:[1,3,5,7,4].includes(i),col:`hsl(${i*40},80%,50%)`});
  b.wp=1;b.race=1;b.fin=0;b.drv=1;b.score=0;b.max=VT.bike.max*(.78+R()*.2);b.ai=i==4?null:'race';G.veh.push(b)}
 const mb=G.veh[4];mb.max=VT.bike.max;mb.drv=G.me;G.me.veh=mb;G.me.x=mb.x;G.me.y=mb.y;
 for(let i=0;i<20;i++)addCiv();G.st='count';G.cnt=240}
function startBrawl(){const me=G.me;G.mode='brawl';G.st='play';G.kills=0;
 if(me.veh){me.veh.drv=null;me.veh=null}me.hp=100;G.peds=[];G.veh.forEach(v=>{if(v.race){v.ai=null}});
 for(let i=0;i<8;i++)G.peds.push(new Ped(me.x-30*(i%4+1),me.y+(i<4?-14:14),'ally',{col:'#2c6',hp:60,girl:i%3==0}));
 msg('វ៉ៃគ្នា! សម្លាប់ ២៥ នាក់ ជាឈ្នះ')}
function startBrawlMode(){reset('brawl');startBrawl()}
// ---------- ឡើង/ចុះយាន ----------
function toggle(){const me=G.me,v=me.veh;
 if(v){if(v.can=='air'&&v.v>2){msg('ហោះខ្ពស់ពេក!');return}
  for(let k=0;k<8;k++){const a=v.a+PI/2+k*.8,r=v.w/2+16,nx=v.x+Math.cos(a)*r,ny=v.y+Math.sin(a)*r;
   if(ok('foot',nx,ny)){me.x=nx;me.y=ny;v.drv=null;me.veh=null;v.v*=.3;return}}
  msg('មិនអាចចុះនៅទីនេះ');return}
 let b=null,bd=1e9;for(const o of G.veh){if(o.drv)continue;const d=dist(o,me)-o.w*.3;if(d<bd){bd=d;b=o}}
 if(b&&bd<60){if(b.ai=='traffic'||b.ai=='chase'||b.type=='police'){wanted(1);msg('លួចយានបាន! ប៉ូលីសកំពុងស្វែងរក')}
  b.ai=null;b.drv=me;me.veh=b;msg(NAME[b.type])}else msg('គ្មានយានជិតទេ')}
// ---------- AI ----------
function pedStep(p){const me=G.me;let sp=0;if(p.cd>0)p.cd--;
 if(p.team=='civ'){if(p.flee>0){p.flee--;sp=2;p.a=Math.atan2(p.y-me.y,p.x-me.x)}else{sp=.5;if(R()<.01)p.a+=R()*2-1}}
 else if(p.team=='enemy'){const t=nearest(p,[me,...G.peds.filter(q=>q.team=='ally')]);
  if(t){const d=dist(p,t);if(G.mode=='brawl'||d<380){p.a=Math.atan2(t.y-p.y,t.x-p.x);sp=d>150?1.3:0;if(d<320&&p.cd<=0&&R()<.5){shoot(p,t);p.cd=45+R()*40}}}}
 else if(p.team=='ally'){const e=nearest(p,G.peds.filter(q=>q.team=='enemy')),d=dist(p,me);
  if(e&&dist(p,e)<330){p.a=Math.atan2(e.y-p.y,e.x-p.x);if(p.cd<=0){shoot(p,e);p.cd=30+R()*30}sp=dist(p,e)>160?1.5:0}
  else if(d>110){p.a=Math.atan2(me.y-p.y,me.x-p.x);sp=2.2}}
 if(sp){const nx=p.x+Math.cos(p.a)*sp,ny=p.y+Math.sin(p.a)*sp;if(ok('foot',nx,ny)){p.x=nx;p.y=ny}else p.a+=1.5+R()}}
function traffic(o){const me=G.me,rd=t=>t=='road'||t=='bridge',T=(x,y)=>terr(Math.floor(x/TS),Math.floor(y/TS));
 const gx=Math.floor((o.x+DX[o.d]*28)/TS),gy=Math.floor((o.y+DY[o.d]*28)/TS),here=Math.floor(o.x/TS)%10<2&&Math.floor(o.y/TS)%10<2;
 let stop=false;
 if(!rd(T(o.x+DX[o.d]*28,o.y+DY[o.d]*28))){const op=[0,1,2,3].filter(d=>d!=(o.d+2)%4&&rd(T(o.x+DX[d]*28,o.y+DY[d]*28)));o.d=op.length?op[R()*op.length|0]:(o.d+2)%4}
 else if(gx%10<2&&gy%10<2&&!here){if(o.d%2!=LIGHT)stop=true;else if(!o.dec){o.dec=1;if(R()<.4)o.d=(o.d+(R()<.5?1:3))%4}}
 if(here)o.dec=0;
 const dx=me.x-o.x,dy=me.y-o.y;if(Math.hypot(dx,dy)<55&&dx*DX[o.d]+dy*DY[o.d]>0)stop=true;
 o.v=stop?0:o.sp;o.x+=DX[o.d]*o.v;o.y+=DY[o.d]*o.v;
 const gx0=Math.floor(o.x/TS),gy0=Math.floor(o.y/TS);
 if(o.d%2==0){const by=(gy0/10|0)*10;o.y+=((by+(o.d==0?1.5:.5))*TS-o.y)*.1}else{const bx=(gx0/10|0)*10;o.x+=((bx+(o.d==1?.5:1.5))*TS-o.x)*.1}
 o.a=o.d*PI/2}
function raceStep(){const rs=G.veh.filter(v=>v.race),mine=G.me.veh;
 for(const r of rs){const me=r===mine,t=WP[r.wp%4],hor=r.wp%2==1,off=me?0:((r.num%3)-1)*14;
  const dx=t[0]+(hor?0:off)-r.x,dy=t[1]+(hor?off:0)-r.y,d=Math.hypot(dx,dy)||1;
  if(d<(me?130:90)&&!r.fin)r.wp++;
  if(G.st=='play'&&r.ai=='race'&&!r.fin)r.update(dx/d,dy/d,0);else if(r.fin&&!me)r.update(0,0,1);
  r.score=r.fin?1e9-r.fin:r.wp*1e5-d;
  if(r.wp>=13&&!r.fin){r.fin=G.t;if(me){G.st='end';G.t2=0;G.rank=1+rs.filter(o=>o.fin&&o!==r).length}}}}
// ---------- វដ្តហ្គេម ----------
function step(){G.t++;G.time=(G.time+.00022)%1;if(G.msgT>0)G.msgT--;
 if(G.mode=='menu')return;
 const me=G.me;
 if(!stick){const x=(K.d||K.arrowright?1:0)-(K.a||K.arrowleft?1:0),y=(K.s||K.arrowdown?1:0)-(K.w||K.arrowup?1:0),m=Math.hypot(x,y)||1;IN.x=x/m;IN.y=y/m}
 const fire=IN.fire||K[' '],brake=IN.brake||K.shift||K.b;
 if(IN.act){IN.act=0;if(G.mode!='race'&&G.st=='play')toggle()}
 if(G.st=='count'&&--G.cnt<=0){G.st='play';msg('GO!')}
 const mv=me.veh,lock=G.st!='play'&&G.st!='count';
 if(G.st=='play'||(G.st=='count'&&0)){
  if(mv)mv.update(IN.x,IN.y,brake);
  else{const m=Math.hypot(IN.x,IN.y);if(m>.2){me.a=Math.atan2(IN.y,IN.x);const nx=me.x+IN.x*2.6,ny=me.y+IN.y*2.6;if(ok('foot',nx,ny)){me.x=nx;me.y=ny}}}
  if(fire&&me.cd<=0){fireMe();me.cd=10}}
 else if(mv&&lock)mv.update(0,0,1);
 if(me.cd>0)me.cd--;if(mv){me.x=mv.x;me.y=mv.y}
 for(const o of G.veh){
  if(o.ai=='traffic')traffic(o);
  else if(o.ai=='chase'){const d=dist(o,me)||1;o.update((me.x-o.x)/d,(me.y-o.y)/d,0);if(Math.abs(o.v)<.4)o.a+=.4;if(d<48)me.hp-=.25}
  else if(o.auto&&!o.drv)o.update(.35,0)}
 if(G.mode=='race')raceStep();
 // ប៉ូលីស
 if(G.mode=='free'&&G.wanted>0){const ch=G.veh.filter(o=>o.ai=='chase');
  if(ch.length<G.wanted&&G.t%120==0){const p=spawnRoad(500,900);if(p){const v=new Veh('police',p.x,p.y,0);v.ai='chase';G.veh.push(v)}}
  if(ch.some(o=>dist(o,me)<450))G.heat=0;else if(++G.heat>480){G.wanted=0;msg('ប៉ូលីសបាត់ដានហើយ')}}
 else G.veh.forEach(o=>{if(o.ai=='chase')o.ai=null});
 G.peds.forEach(pedStep);
 // កាំភ្លើង
 for(const b of G.bl){b.x+=b.vx;b.y+=b.vy;b.life--;
  if(terr(b.x/TS|0,b.y/TS|0)=='bld'){b.life=0;continue}
  const hs=HOST[b.team]||[];
  for(const p of [me,...G.peds]){if(p.hp<=0||!hs.includes(p.team))continue;const r=p===me&&me.veh?22:10;
   if(Math.abs(p.x-b.x)<r&&Math.abs(p.y-b.y)<r){p.hp-=b.dmg;b.life=0;if(p.team=='civ'){p.flee=200;if(!p.hit&&b.team=='me'){p.hit=1;wanted(1)}}break}}
  if(b.life>0&&b.team=='me')for(const o of G.veh)if(o.type=='police'&&!o.drv&&dist(o,b)<26){o.hp-=8;b.life=0;if(o.hp<=0&&o.ai=='chase')G.money+=100}}
 G.bl=G.bl.filter(b=>b.life>0);G.veh=G.veh.filter(o=>o.hp>0);
 // បុកមនុស្ស
 if(mv&&mv.can=='land'&&Math.abs(mv.v)>2.5)for(const p of G.peds)if(p.team!='ally'&&Math.abs(p.x-mv.x)<22&&Math.abs(p.y-mv.y)<22){p.hp=0;if(p.team=='civ')wanted(1)}
 for(const p of G.peds)if(p.hp<=0&&!p.dead){p.dead=1;if(p.team=='enemy'){G.kills++;G.money+=50}}
 G.peds=G.peds.filter(p=>p.hp>0);
 if(G.mode=='free'&&G.t%60==0&&G.peds.filter(p=>p.team=='civ').length<30)addCiv();
 if(G.mode=='brawl'&&G.st=='play'){if(G.t%50==0&&G.peds.filter(p=>p.team=='enemy').length<10){const p=spawnRoad(380,650);if(p)G.peds.push(new Ped(p.x,p.y,'enemy',{col:'#c22'}))}
  if(G.kills>=25)G.st='win'}
 if(G.st=='end'&&++G.t2>200)startBrawl();
 if(me.hp<=0&&G.st=='play'){if(G.mode=='free'){msg('ចាប់ខ្លួនហើយ! -$500');if(me.veh){me.veh.drv=null;me.veh=null}me.x=60;me.y=500;me.hp=100;G.wanted=0;G.money=Math.max(0,G.money-500)}else G.st='lose'}
 if(osc){const l=mv&&G.st!='end';og.gain.value=l?.025:0;osc.frequency.value=(mv&&mv.can=='air'?90:mv&&mv.can=='water'?35:45)+(mv?Math.abs(mv.v)*16:0)}
 if(Math.sin(G.time*2*PI-PI/2)>0&&R()<.004)chirp()}
// ---------- គូរ ----------
function draw(){
 if(G.mode=='menu'){drawMenu();return}
 const me=G.me,cx=me.x-W/2,cy=me.y-H/2;
 drawWorld(g,cx,cy,W,H,G.t);
 G.peds.forEach(p=>drawPed(g,p,cx,cy));if(!me.veh)drawPed(g,me,cx,cy);
 G.veh.filter(v=>v.can!='air').forEach(v=>drawVeh(g,v,cx,cy,G.t));
 g.fillStyle='#ff0';for(const b of G.bl)g.fillRect(b.x-cx-2,b.y-cy-2,5,5);
 G.veh.filter(v=>v.can=='air').forEach(v=>drawVeh(g,v,cx,cy,G.t));
 const light=(Math.sin(G.time*2*PI-PI/2)+1)/2,al=.55*(1-Math.min(1,light*1.8));
 if(al>.02){g.fillStyle=`rgba(5,10,45,${al})`;g.fillRect(0,0,W,H)}
 g.fillStyle='rgba(0,0,0,.07)';for(let k=0;k<5;k++){const x=((k*520-G.t*.4-cx*.3)%(W+600)+W+600)%(W+600)-300,y=((k*300-cy*.3)%(H+300)+H+300)%(H+300)-150;g.beginPath();g.ellipse(x,y,160,70,0,0,7);g.fill()}
 hud(light)}
function hud(light){const me=G.me,v=me.veh;g.textAlign='left';
 g.fillStyle='rgba(0,0,0,.45)';g.fillRect(0,0,W,30);g.fillStyle='#fff';g.font='bold 16px sans-serif';
 g.fillText('ទឹកដីបន្ទាយដែក  $'+G.money+'  '+(v?NAME[v.type]:'ដើរ'),8,21);
 if(G.mode=='free'){g.fillStyle='#fd0';g.fillText('★'.repeat(G.wanted)+'☆'.repeat(3-G.wanted),W/2+40,21)}
 g.fillStyle='#400';g.fillRect(8,36,120,8);g.fillStyle='#e33';g.fillRect(8,36,Math.max(0,me.hp)*1.2,8);
 g.fillStyle='#fff';g.font='bold 16px sans-serif';
 if(G.mode=='race'){const rs=[...G.veh.filter(o=>o.race)].sort((a,b)=>b.score-a.score);const mb=me.veh;
  g.fillText('លេខ '+(rs.indexOf(mb)+1)+'/9   ជុំ '+Math.min(3,((mb.wp-1)/4|0)+1)+'/3',8,64)}
 if(G.mode=='brawl')g.fillText('សម្លាប់ '+G.kills+'/25',8,64);
 g.drawImage(MM,W-148,36,140,140);g.fillStyle='#f00';g.fillRect(W-148+me.x/TS*2-2,36+me.y/TS*2-2,4,4);
 G.veh.forEach(o=>{if(o.type=='plane'||o.type=='ship'||o.type=='train'){g.fillStyle='#ff0';g.fillRect(W-148+o.x/TS*2-1,36+o.y/TS*2-1,3,3)}});
 g.fillStyle=light>.5?'#fd2':'#cde';g.beginPath();g.arc(W-170,18,9,0,7);g.fill();
 [['act',W-170,H-70,34,v?'ចុះ':'ឡើង'],['fire',W-80,H-100,44,'បាញ់'],['brake',W-70,H-200,32,'ហ្វ្រាំង']].forEach(([k,x,y,r,l])=>{g.fillStyle='rgba(0,0,0,.4)';g.beginPath();g.arc(x,y,r,0,7);g.fill();g.strokeStyle='#fff';g.lineWidth=2;g.stroke();g.fillStyle='#fff';g.font='bold 15px sans-serif';g.textAlign='center';g.fillText(l,x,y+5)});
 if(stick){g.strokeStyle='rgba(255,255,255,.5)';g.beginPath();g.arc(stick.ox,stick.oy,55,0,7);g.stroke();g.fillStyle='rgba(255,255,255,.4)';g.beginPath();g.arc(stick.ox+IN.x*55,stick.oy+IN.y*55,24,0,7);g.fill()}
 g.textAlign='center';g.fillStyle='#fff';g.font='bold 20px sans-serif';if(G.msgT>0)g.fillText(G.msg,W/2,H*.2);
 g.fillStyle='#ff0';g.font='bold 90px sans-serif';
 if(G.st=='count')g.fillText(Math.ceil(G.cnt/80),W/2,H*.5);
 g.font='bold 40px sans-serif';
 if(G.st=='end')g.fillText('ចូលដល់លេខ '+G.rank+'!',W/2,H*.45);
 if(G.st=='win')g.fillText('ឈ្នះហើយ! (ចុចដើម្បីត្រឡប់)',W/2,H*.45);
 if(G.st=='lose')g.fillText('ចាញ់ហើយ (ចុចដើម្បីត្រឡប់)',W/2,H*.45)}
const MB=i=>({x:W/2-150,y:H*.42+i*74});
function drawMenu(){drawWorld(g,1500+Math.sin(G.t/200)*300,1900+Math.cos(G.t/260)*120,W,H,G.t);
 g.fillStyle='rgba(0,0,0,.55)';g.fillRect(0,0,W,H);g.textAlign='center';
 g.fillStyle='#ffd400';g.font='bold '+Math.min(54,W/9)+'px sans-serif';g.fillText('ទឹកដីបន្ទាយដែក',W/2,H*.24);
 g.fillStyle='#fff';g.font='16px sans-serif';g.fillText('ប្រណាំងម៉ូតូ • ពិភពសេរី • វ៉ៃគ្នា',W/2,H*.24+34);
 ['ពិភពសេរី (លួចឡាន ទូក យន្តហោះ)','ប្រណាំងម៉ូតូ ៩ គ្រឿង → វ៉ៃគ្នា','វ៉ៃគ្នាភ្លាមៗ'].forEach((s,i)=>{const b=MB(i);g.fillStyle='#e63';g.beginPath();g.roundRect(b.x,b.y,300,58,12);g.fill();g.fillStyle='#fff';g.font='bold 18px sans-serif';g.fillText(s,W/2,b.y+36)});
 g.font='13px sans-serif';g.fillStyle='#ccc';g.fillText('WASD ដើរ • E ឡើង/ចុះ • Space បាញ់ • Shift ហ្វ្រាំង',W/2,H-20)}
// ---------- បញ្ចូល ----------
const BT=[['act',()=>W-170,()=>H-70,34],['fire',()=>W-80,()=>H-100,44],['brake',()=>W-70,()=>H-200,32]];
c.onpointerdown=e=>{audio();const x=e.clientX,y=e.clientY;
 if(G.mode=='menu'){for(let i=0;i<3;i++){const b=MB(i);if(x>b.x&&x<b.x+300&&y>b.y&&y<b.y+58){[startFree,startRace,startBrawlMode][i]();return}}return}
 if(G.st=='win'||G.st=='lose'){G.mode='menu';return}
 for(const[k,bx,by,r]of BT)if(Math.hypot(x-bx(),y-by())<r+12){P.set(e.pointerId,k);if(k=='act')IN.act=1;else IN[k]=1;return}
 if(x<W*.6){P.set(e.pointerId,'stick');stick={id:e.pointerId,ox:x,oy:y}}};
c.onpointermove=e=>{if(stick&&stick.id==e.pointerId){let dx=(e.clientX-stick.ox)/55,dy=(e.clientY-stick.oy)/55;const m=Math.hypot(dx,dy);if(m>1){dx/=m;dy/=m}IN.x=dx;IN.y=dy}};
c.onpointerup=c.onpointercancel=e=>{const k=P.get(e.pointerId);P.delete(e.pointerId);if(k=='stick'){stick=null;IN.x=IN.y=0}else if(k&&k!='act')IN[k]=0};
onkeydown=e=>{audio();K[e.key.toLowerCase()]=1;if(e.key.toLowerCase()=='e'&&!e.repeat)IN.act=1};
onkeyup=e=>K[e.key.toLowerCase()]=0;
let last=0,acc=0;
function loop(ts){acc+=Math.min(100,ts-last);last=ts;while(acc>=16.67){step();acc-=16.67}draw();requestAnimationFrame(loop)}
requestAnimationFrame(loop);
