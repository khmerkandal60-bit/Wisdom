// យានជំនិះ មនុស្ស និងការគូរ
const VT={
 car:{w:44,h:22,max:6,acc:.15,turn:.07,can:'land'},
 bike:{w:34,h:12,max:8,acc:.22,turn:.1,can:'land'},
 police:{w:46,h:22,max:7.2,acc:.2,turn:.08,can:'land'},
 boat:{w:48,h:20,max:6,acc:.12,turn:.05,can:'water'},
 ship:{w:150,h:44,max:3,acc:.04,turn:.015,can:'water'},
 plane:{w:90,h:80,max:11,acc:.08,turn:.025,can:'air'},
 train:{w:80,h:26,max:9,acc:.1,turn:0,can:'rail'}};
function ok(kind,x,y){const t=terr(Math.floor(x/TS),Math.floor(y/TS));
 if(kind=='foot')return t!='bld'&&t!='sea'&&t!='river';
 if(kind=='land')return t!='bld'&&t!='sea'&&t!='river';
 if(kind=='water')return t=='sea'||t=='river';
 return true}
class Veh{
 constructor(type,x,y,a=0,o={}){Object.assign(this,{type,x,y,a,v:0,hp:100,drv:null,col:`hsl(${R()*360|0},65%,45%)`},VT[type],o)}
 update(ix,iy,brake){
  if(this.can=='rail'){this.v+=(ix*this.max-this.v)*.04;this.x+=this.v;const L=N*TS+500;if(this.x>L)this.x=-500;if(this.x<-500)this.x=L;return}
  const m=Math.min(1,Math.hypot(ix,iy));
  if(m>.2){let d=Math.atan2(iy,ix)-this.a;d=Math.atan2(Math.sin(d),Math.cos(d));
   this.a+=Math.max(-this.turn,Math.min(this.turn,d))*(this.can=='air'?1:Math.min(1,.25+Math.abs(this.v)/3));
   if(this.v<this.max)this.v+=this.acc*m}
  else this.v*=this.can=='air'?.995:.97;
  if(brake)this.v*=.9;
  const c=Math.cos(this.a),s=Math.sin(this.a),nx=this.x+c*this.v,ny=this.y+s*this.v;
  if(this.can=='air'||(ok(this.can,nx+c*20,ny+s*20)&&ok(this.can,nx,ny))){this.x=nx;this.y=ny}else this.v*=-.3}
}
class Ped{constructor(x,y,team,o={}){Object.assign(this,{x,y,team,hp:40,a:R()*6.28,cd:0,col:`hsl(${R()*360|0},55%,48%)`},o)}}
function drawPed(g,p,cx,cy){
 const x=p.x-cx,y=p.y-cy;
 g.fillStyle='rgba(0,0,0,.25)';g.beginPath();g.ellipse(x+2,y+3,8,6,0,0,7);g.fill();
 if(p.team=='ally'||p.team=='me'){g.strokeStyle=p.team=='me'?'#fff':'#3f6';g.lineWidth=2;g.beginPath();g.arc(x,y,13,0,7);g.stroke()}
 g.save();g.translate(x,y);g.rotate(p.a);
 const hair=p.girl?'#2a1018':p.old?'#ddd':'#222';
 g.fillStyle=p.col;g.beginPath();g.ellipse(0,0,6,9,0,0,7);g.fill();
 if(p.girl){g.fillStyle=hair;g.fillRect(-13,-4,12,8)}
 g.fillStyle='#fcb';g.beginPath();g.arc(1,0,5,0,7);g.fill();
 g.fillStyle=hair;g.beginPath();g.arc(0,0,5.5,PI*.6,PI*1.4);g.fill();
 if(p.team!='civ'){g.fillStyle='#111';g.fillRect(4,2,13,3)}
 if(p.old){g.fillStyle='#753';g.fillRect(5,6,2,12)}
 g.restore()}
function hull(g,w,h){g.beginPath();g.moveTo(w/2,0);g.lineTo(w/2-w*.2,h/2);g.lineTo(-w/2,h/2);g.lineTo(-w/2,-h/2);g.lineTo(w/2-w*.2,-h/2);g.closePath();g.fill()}
function drawVeh(g,v,cx,cy,t){
 const x=v.x-cx,y=v.y-cy,w=v.w,h=v.h;
 if(x<-300||y<-300||x>g.canvas.width+300||y>g.canvas.height+300)return;
 g.save();g.translate(x,y);
 if(v.type=='train'){
  const cc=['#c33','#b44','#48b','#4a6','#cb4','#a5a'];
  for(let i=5;i>=0;i--){const ox=-i*(w+6);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(ox-w/2+3,-h/2+3,w,h);g.fillStyle=cc[i];g.fillRect(ox-w/2,-h/2,w,h);g.fillStyle='rgba(255,255,255,.6)';g.fillRect(ox-w/2+6,-h/2+4,w-12,4)}
  g.fillStyle='#ff0';g.fillRect(w/2-6,-h/2+3,6,h-6);g.restore();return}
 g.rotate(v.a);
 if(v.type=='plane'){const air=v.v>5;
  if(air){g.fillStyle='rgba(0,0,0,.25)';g.fillRect(-w/2+26,18,w,8);g.scale(1.25,1.25)}
  g.fillStyle='#e8e8ee';g.fillRect(-w/2,-5,w,10);g.fillRect(-8,-h/2,22,h);g.fillRect(-w/2,-14,14,28);
  g.fillStyle='#c33';g.fillRect(w/2-12,-5,12,10);g.fillStyle='#69c';g.fillRect(w/2-24,-4,8,8)}
 else if(v.type=='ship'){g.fillStyle='#6a1c1c';hull(g,w,h);g.fillStyle='#eee';g.fillRect(-w/2+8,-h/4,22,h/2);
  ['#d33','#37c','#fa3','#3a5','#d33','#37c'].forEach((c,i)=>{g.fillStyle=c;g.fillRect(-w/2+38+i*14,-h/2+8,11,h-16)})}
 else if(v.type=='boat'){g.fillStyle='#f4f4f4';hull(g,w,h);g.fillStyle='#37a';g.fillRect(-10,-6,16,12);
  if(Math.abs(v.v)>1){g.fillStyle='rgba(255,255,255,.5)';g.fillRect(-w/2-18,-h/3,18,3);g.fillRect(-w/2-18,h/3-3,18,3)}}
 else if(v.type=='bike'){g.fillStyle='#111';g.fillRect(-w/2,-2.5,9,5);g.fillRect(w/2-9,-2.5,9,5);
  g.fillStyle=v.col;g.fillRect(-w/2+6,-3,w-12,6);g.fillStyle='#fff';g.fillRect(-w/2-3,-4,5,8);
  if(v.drv){g.fillStyle=v.girl?'#f48':'#27c';g.fillRect(-6,-6,10,12);g.fillStyle=v.girl?'#c13':'#222';if(v.girl)g.fillRect(-14,-3,10,6);g.fillStyle='#fcb';g.beginPath();g.arc(2,0,5,0,7);g.fill();g.fillStyle=v.girl?'#c13':'#222';g.beginPath();g.arc(1,0,5.5,PI*.6,PI*1.4);g.fill()}}
 else{g.fillStyle='rgba(0,0,0,.3)';g.fillRect(-w/2+3,-h/2+3,w,h);
  g.fillStyle=v.type=='police'?'#f4f4f4':v.col;g.beginPath();g.roundRect(-w/2,-h/2,w,h,6);g.fill();
  g.fillStyle='#8cf';g.fillRect(4,-h/2+3,9,h-6);g.fillRect(-14,-h/2+3,7,h-6);
  g.fillStyle='rgba(0,0,0,.25)';g.fillRect(-7,-h/2+3,11,h-6);
  g.fillStyle='#ffd';g.fillRect(w/2-3,-h/2+2,3,5);g.fillRect(w/2-3,h/2-7,3,5);
  if(v.type=='police'){g.fillStyle=(t>>3)&1?'#f22':'#25f';g.fillRect(-3,-9,6,18)}}
 g.restore();
 if(v.num){g.fillStyle='#fff';g.fillRect(x-9,y-28,18,14);g.fillStyle='#000';g.font='bold 12px sans-serif';g.textAlign='center';g.fillText(v.num,x,y-17)}}
