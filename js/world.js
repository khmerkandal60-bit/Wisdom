// ផែនទី: ទីក្រុង ទន្លេ សមុទ្រ កំពង់ផែ ផ្លូវរថភ្លើង ព្រលានយន្តហោះ
const TS=40,N=70,R=Math.random,PI=Math.PI;
const hash=(x,y)=>(((x*73856093)^(y*19349663))>>>0)%1000/1000;
const riverX=y=>30+5*Math.sin(y/7);
function terr(gx,gy){
 if(gx<0||gy<0||gx>=N||gy>=N)return 'sea';
 if(gy==5)return 'rail';
 if(gx>=46&&gx<=67&&(gy==14||gy==15))return 'runway';
 if(gx>=40&&gx<=64&&((gy>=56&&gy<=59)||(gy>=60&&gy<=63&&gx%6==0)))return 'dock';
 if(gy>=60)return 'sea';
 if(Math.abs(gx-riverX(gy))<2.5)return gy%10<2?'bridge':'river';
 if(gx%10<2||gy%10<2)return 'road';
 return ((gx/10|0)+(gy/10|0))%3==0?'grass':'bld';
}
const COL={road:'#3a3a40',bridge:'#7a6548',dock:'#a8a29a',rail:'#8a7a66',runway:'#2c2c30',grass:'#5fae4e',river:'#2f8fd8',sea:'#1f6fb8'};
let LIGHT=0;
function drawWorld(g,cx,cy,W,H,t){
 LIGHT=(t/360|0)%2;
 const x0=Math.floor(cx/TS),y0=Math.floor(cy/TS),x1=x0+Math.ceil(W/TS)+1,y1=y0+Math.ceil(H/TS)+1;
 for(let gy=y0;gy<=y1;gy++)for(let gx=x0;gx<=x1;gx++){
  const T=terr(gx,gy),sx=Math.round(gx*TS-cx),sy=Math.round(gy*TS-cy),h=hash(gx,gy);
  if(T=='bld'){const bi=gx/10|0,bj=gy/10|0;g.fillStyle=`hsl(${(bi*53+bj*97)%360},25%,${40+(bi+bj)%3*8}%)`;g.fillRect(sx,sy,TS,TS);
   g.fillStyle='rgba(255,255,255,.12)';g.fillRect(sx+3,sy+3,TS-6,TS-6);g.fillStyle='#ffe9a0';
   if(h>.3)g.fillRect(sx+9,sy+9,7,7);if(h>.55)g.fillRect(sx+24,sy+23,7,7);continue}
  g.fillStyle=T=='grass'?(h>.5?'#5fae4e':'#58a548'):COL[T];g.fillRect(sx,sy,TS+1,TS+1);
  if(T=='sea'||T=='river'){if(h>.6){g.fillStyle='rgba(255,255,255,.18)';g.fillRect(sx+8+Math.sin(t/25+gx+gy)*6,sy+16,18,2)}}
  else if(T=='road'){g.fillStyle='#e8c93a';
   if(gx%10==0&&gy%10>1)g.fillRect(sx+TS-1,sy+8,2,TS-16);
   if(gy%10==0&&gx%10>1)g.fillRect(sx+8,sy+TS-1,TS-16,2);
   if(gx%10==0&&gy%10==0){ // ភ្លើងស្តុប
    g.fillStyle='#111';g.fillRect(sx,sy,10,10);g.fillRect(sx+TS-10,sy,10,10);
    g.fillStyle=LIGHT?'#3f3':'#f33';g.fillRect(sx+2,sy+2,6,6);
    g.fillStyle=LIGHT?'#f33':'#3f3';g.fillRect(sx+TS-8,sy+2,6,6)}}
  else if(T=='grass'){if(h>.8){g.fillStyle='#5a3a1a';g.fillRect(sx+17,sy+17,6,10);g.fillStyle='#1f7a2a';g.beginPath();g.arc(sx+20,sy+15,13,0,7);g.fill()}
   else if(h<.22){for(let f=0;f<4;f++){g.fillStyle=`hsl(${(f*90+h*900)%360},90%,62%)`;g.beginPath();g.arc(sx+8+f*8,sy+10+(f%2)*14,3,0,7);g.fill()}}}
  else if(T=='dock'){g.fillStyle='#8a847c';g.fillRect(sx,sy+19,TS,2)}
  else if(T=='bridge'){g.fillStyle='#5a4630';g.fillRect(sx,gy%10==0?sy:sy+TS-3,TS,3)}
  else if(T=='rail'){g.fillStyle='#4a3a2a';for(let s=0;s<4;s++)g.fillRect(sx+s*10+2,sy+10,4,20);g.fillStyle='#bbb';g.fillRect(sx,sy+14,TS,3);g.fillRect(sx,sy+23,TS,3)}
  else if(T=='runway'&&gy==14){g.fillStyle='#fff';g.fillRect(sx+6,sy+TS-1,TS-12,2)}
 }
}
