// ពន្លឺយប់: ព្រះអាទិត្យ ព្រះចន្ទ ផ្កាយ អំពូលផ្លូវ ភ្លើងឡាន
const _hud=hud;
function glow(x,y,r,col,a){const q=g.createRadialGradient(x,y,0,x,y,r);q.addColorStop(0,`rgba(${col},${a})`);q.addColorStop(1,`rgba(${col},0)`);g.fillStyle=q;g.fillRect(x-r,y-r,r*2,r*2)}
function nightFX(light){
 if(G.mode=='menu')return;
 const me=G.me,cx=me.x-W/2,cy=me.y-H/2,al=.55*(1-Math.min(1,light*1.8)),k=Math.min(1,al/.3);
 const tm=G.time,d=(tm-.25)*2,n=((tm+.5)%1-.25)*2;
 g.save();
 if(d>0&&d<1){const x=W*.1+d*W*.8,y=95-Math.sin(d*PI)*45;glow(x,y,60,'255,220,80',.5);g.fillStyle='#ffd23a';g.beginPath();g.arc(x,y,16,0,7);g.fill()}
 if(n>0&&n<1){const x=W*.1+n*W*.8,y=95-Math.sin(n*PI)*45;glow(x,y,50,'200,220,255',.4);g.fillStyle='#eef3ff';g.beginPath();g.arc(x,y,14,0,7);g.fill();g.fillStyle='#c9d3ee';g.beginPath();g.arc(x-4,y-3,3,0,7);g.arc(x+4,y+4,2,0,7);g.fill()}
 if(k>.05)for(let i=0;i<40;i++){g.fillStyle=`rgba(255,255,255,${k*(.4+.4*Math.sin(G.t/20+i))})`;g.fillRect(hash(i,1)*W,40+hash(i,2)*70,2,2)}
 if(k>.02){g.globalCompositeOperation='lighter';
  const x0=Math.floor(cx/TS),y0=Math.floor(cy/TS);
  for(let gy=y0-2;gy<=y0+H/TS+3;gy++)for(let gx=x0-2;gx<=x0+W/TS+3;gx++){
   if(terr(gx,gy)!='road'||(gx+gy)%4)continue;
   const hz=gy%10<2&&gx%10>1,vt=gx%10<2&&gy%10>1;if(!hz&&!vt)continue;
   const sx=gx*TS-cx,sy=gy*TS-cy,px=hz?sx+20:(gx%10==0?sx+4:sx+TS-4),py=vt?sy+20:(gy%10==0?sy+4:sy+TS-4);
   const fl=hash(gx,gy)>.9?(.5+.5*Math.sin(G.t/3+gx)):1;
   glow(px,py,95,'255,210,120',.55*k*fl);
   g.fillStyle=`rgba(255,240,200,${k})`;g.beginPath();g.arc(px,py,3,0,7);g.fill()}
  for(const v of G.veh){if(v.can!='land'||!(v.drv||v.ai=='traffic'||v.race))continue;
   const x=v.x-cx+Math.cos(v.a)*55,y=v.y-cy+Math.sin(v.a)*55;if(x<-100||y<-100||x>W+100||y>H+100)continue;glow(x,y,70,'255,240,190',.35*k)}
  if(!me.veh)glow(W/2,H/2,60,'255,230,180',.25*k);
  g.globalCompositeOperation='source-over'}
 g.restore();
 if(K.n)G.time=(G.time+.004)%1;
}
hud=function(light){nightFX(light);_hud(light)};
