let menuMap=null,last=0;
function upd(dt){gt+=dt;ms.wx=ms.x+cam.x;ms.wy=ms.y+cam.y;
 p.ac-=dt;p.ac2-=dt;p.rc2-=dt;p.dc-=dt;p.inv-=dt;p.fl-=dt;p.nr-=dt;p.rt-=dt;
 for(let i=0;i<4;i++)p.acd[i]=Math.max(0,p.acd[i]-dt);
 if(p.abt>0){p.abt-=dt;if(p.abt<=0)p.abs=0}
 tickSt(p,dt);if(p.dead)return;
 p.stn=hs(p,'freeze')||hs(p,'shock')?1:0;p.hp=Math.min(P.mhp,p.hp+(S.regen||0)*dt);
 let[mx,my]=mvec();if(p.stn||hs(p,'root')){mx=my=0}
 p.mvx=mx*P.spd;p.mvy=my*P.spd;if(Math.hypot(mx,my)>.1&&!p.sw&&!p.sw2)p.fa=Math.atan2(my,mx);
 if(p.dh>0){p.dh-=dt;move(p,p.dx*640*dt,p.dy*640*dt);part(p.x,p.y,1,'#bff',10,.3,3);
  if(S.ph)for(const e of es)if(!e.dead&&e.dn!=p.did&&Math.hypot(e.x-p.x,e.y-p.y)<e.r+18){e.dn=p.did;hit(e,(8+(S.fdw||0))*P.dm*2,200,p.fa)}}
 else move(p,mx*P.spd*dt,my*P.spd*dt);
 if(p.kx||p.ky){move(p,p.kx*dt,p.ky*dt);p.kx*=.85;p.ky*=.85;if(Math.abs(p.kx)+Math.abs(p.ky)<10)p.kx=p.ky=0}
 if(keys.atk)melee();if(keys.rng)offhand();if(keys.dash)dash();
 if(p.tw>0){p.tw-=dt;if(p.tw<=0)swing(true)}
 for(const k of['sw','sw2']){const w=p[k];if(w){w.t+=dt;if(!w.done&&w.t>=w.d*.3){w.done=1;meleeHit(w)}if(w.t>=w.d)p[k]=null}}
 flowT-=dt;if(flowT<=0){flowT=.25;fd=bfs(p.x/T|0,p.y/T|0)}
 es.forEach(e=>updE(e,dt));es=es.filter(e=>!e.dead);updAl(dt);updB(dt);updZ(dt);updOrbs(dt);updAur(dt);updTraps(dt);updDoors();interact();mine(dt);updFx(dt);
 for(const z of zs)if(z.dur>0&&z.dl<=0&&!z.trap&&R()<dt*14)part(z.x+rr(-z.rad,z.rad)*.8,z.y+rr(-z.rad,z.rad)*.8,1,z.col,30,.6,2);
 if(!es.length&&!exitOpen){exitOpen=1;if(rt=='fight'||rt=='boss'||rt=='mine'||rt=='ambush'){toast('The gate is open');addXP((10+6*G.floor)*(rt=='boss'?4:1));petXp(3)}save()}
 if(exitOpen&&!p.dead&&Math.hypot(p.x-(exitI%MW+.5)*T,p.y-((exitI/MW|0)+.5)*T)<22)next()}
// ---- rendering
function drawTiles(){const bi=curBi,x0=Math.max(0,cam.x/T|0),y0=Math.max(0,cam.y/T|0),x1=Math.min(MW-1,(cam.x+VW)/T|0),y1=Math.min(MH-1,(cam.y+VH)/T|0),wf=(gt*2|0)&1;
 for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++){const i=y*MW+x,v=map[i],fl=(x*7+y*13+x*y)%4;let c=fl;
  if(v==1||v==7)c=(y<MH-1&&walk(map[i+MW]))?4:5;else if(v==4)c=7;else if(v==5)c=8+wf;else if(v==6)c=10;
  cx.drawImage(IM.tiles,c*16,bi*16,16,16,x*T,y*T,T,T);
  if(v==2){cx.globalAlpha=dopen[i]?.3:1;cx.drawImage(IM.tiles,96,bi*16,16,16,x*T,y*T,T,T);cx.globalAlpha=1}
  else if(v==7){const a=ATLAS.items['vein_'+ores.get(i)];if(a)cx.drawImage(IM.items,a[0],a[1],16,16,x*T,y*T,T,T)}
  else if((v==0||v==6)&&y>0){const u=map[i-MW];if(u==1||u==4||u==7){cx.fillStyle='rgba(0,0,0,.28)';cx.fillRect(x*T,y*T,T,7)}}}}
function shadow(x,y,r){cx.fillStyle='rgba(0,0,0,.35)';cx.beginPath();cx.ellipse(x,y,r,r*.4,0,0,7);cx.fill()}
const hDir=a=>{const c=Math.cos(a),s=Math.sin(a);return Math.abs(c)>Math.abs(s)?[1,c<0?1:0]:[s>0?0:2,0]};
function drawWpn(it,x,y,a,sc){const A=ATLAS.items[it.t],mel=WT[it.t].sl=='w'||it.t=='wand';cx.save();cx.translate(x,y);
 if(mel){cx.rotate(a+Math.PI/4);cx.drawImage(IM.items,A[0],A[1],16,16,-4*sc,-12*sc,16*sc,16*sc)}
 else{cx.rotate(a);if(Math.abs(a)>Math.PI/2)cx.scale(1,-1);cx.drawImage(IM.items,A[0],A[1],16,16,-5*sc,-8*sc,16*sc,16*sc)}cx.restore()}
function hbox(w){cx.save();cx.strokeStyle='rgba(255,255,255,.6)';cx.lineWidth=1;cx.setLineDash([4,3]);
 if(w.wt.th){cx.translate(p.x,p.y);cx.rotate(w.a);cx.strokeRect(-6,-16,w.rc+6,32)}else{cx.beginPath();cx.moveTo(p.x,p.y);cx.arc(p.x,p.y,w.rc,w.a-w.arc/2,w.a+w.arc/2);cx.closePath();cx.stroke()}cx.restore()}
function drawP(){const d=hDir(p.fa),f=Math.hypot(p.mvx,p.mvy)>5?(gt*8|0)%2:0,hx=p.x,hy=p.y-6,sc=G.rc=='halfling'?.86:1;shadow(p.x,p.y+8,11);
 if(p.aur>0){cx.strokeStyle=rgba(p.auc,.5+.3*Math.sin(gt*8));cx.lineWidth=2;cx.beginPath();cx.ellipse(p.x,p.y+8,17,7,0,0,7);cx.stroke()}
 const L=d[1]==1,hold=(it,sw,side)=>{if(!it)return;
  if(it.sl=='r'&&p.rt>0&&p.rw===it){drawWpn(it,hx+Math.cos(p.fa)*8,hy+Math.sin(p.fa)*8,p.fa,1.6);return}
  if(sw){const u=1-(1-cl(sw.t/sw.d,0,1))**2;let wa=sw.a+sw.dir*(u*sw.arc-sw.arc/2),ox=0,oy=0;if(sw.wt.th){wa=sw.a;const l=Math.sin(u*Math.PI)*sw.rc*.55;ox=Math.cos(sw.a)*l;oy=Math.sin(sw.a)*l}drawWpn(it,hx+Math.cos(sw.a)*8+ox,hy+Math.sin(sw.a)*8+oy,wa,1.7);return}
  const sx=(side?-1:1)*(L?-1:1);drawWpn(it,hx+sx*8,hy+2,sx>0?-1.15:Math.PI+1.15,1.4)};
 const wpn=()=>{hold(G.eq.o,p.sw2,1);hold(G.eq.w,p.sw,0)};
 if(d[0]==2)wpn();
 let im=heroC(G,d[0],f);if(p.fl>0)im=im.fl||(im.fl=flashOf(im));
 cx.save();cx.translate(Math.round(p.x),Math.round(p.y));if(d[1])cx.scale(-1,1);cx.drawImage(im,-16*sc,-30*sc+(sc<1?4:0),32*sc,40*sc);cx.restore();
 if(hs(p,'freeze')){cx.fillStyle='rgba(190,235,255,.45)';cx.fillRect(p.x-12,p.y-24,24,36)}
 if(d[0]!=2)wpn();
 if(p.abs>0){cx.strokeStyle='rgba(255,233,160,.7)';cx.lineWidth=2;cx.beginPath();cx.arc(p.x,p.y-4,16,0,7);cx.stroke()}
 if(p.sh){cx.strokeStyle='#8cf';cx.lineWidth=2;cx.beginPath();cx.arc(p.x,p.y-4,19,0,7);cx.stroke()}}
function drawSwing(w){if(!w)return;const u=1-(1-cl(w.t/w.d,0,1))**2,hx=p.x,hy=p.y-6;if(!CFG.hbox)hbox(w);
 if(w.wt.th){const l=Math.sin(u*Math.PI)*w.rc;cx.strokeStyle=rgba(w.col,.7*(1-u*.5));cx.lineWidth=4;cx.beginPath();cx.moveTo(hx+Math.cos(w.a)*10,hy+Math.sin(w.a)*10);cx.lineTo(hx+Math.cos(w.a)*(10+l),hy+Math.sin(w.a)*(10+l));cx.stroke();return}
 const ut=Math.max(0,u-.55),N=9,r1=w.rc,r0=w.rc*.38;
 for(let i=0;i<N;i++){const a0=w.a+w.dir*((ut+(u-ut)*i/N)*w.arc-w.arc/2),a1=w.a+w.dir*((ut+(u-ut)*(i+1)/N)*w.arc-w.arc/2),al=(i+1)/N*.55*(1-w.t/w.d*.4);
  cx.fillStyle=rgba(w.col,al);cx.beginPath();cx.arc(hx,hy,r1,a0,a1,w.dir<0);cx.arc(hx,hy,r0+(r1-r0)*.3*(1-i/N),a1,a0,w.dir>0);cx.closePath();cx.fill()}
 const ae=w.a+w.dir*(u*w.arc-w.arc/2);cx.strokeStyle='rgba(255,255,255,.9)';cx.lineWidth=3;cx.beginPath();cx.moveTo(hx+Math.cos(ae)*r0,hy+Math.sin(ae)*r0);cx.lineTo(hx+Math.cos(ae)*r1,hy+Math.sin(ae)*r1);cx.stroke()}
function drawTel(e){const u=cl(1-e.pt/(e.wk=='combo2'?.26:(e.wu||.5)),0,1),a=e.wa2;cx.fillStyle=`rgba(255,70,60,${.16+.32*u})`;cx.strokeStyle='rgba(255,120,100,.85)';cx.lineWidth=1.5;
 if(e.wk=='slam'){cx.beginPath();cx.arc(e.x,e.y,e.sr,0,7);cx.fill();cx.stroke()}
 else if(e.wk=='melee'||e.wk=='combo'||e.wk=='combo2'){const rc=e.rg+e.r+e.lg*.4;cx.beginPath();cx.moveTo(e.x,e.y);cx.arc(e.x,e.y,rc,a-e.ar/2,a+e.ar/2);cx.closePath();cx.fill();cx.stroke()}
 else if(e.wk=='dive'||e.wk=='leap'){const w=e.r+2;cx.save();cx.translate(e.x,e.y);cx.rotate(a);cx.fillRect(0,-w,e.lg,w*2);cx.strokeRect(0,-w,e.lg,w*2);cx.restore()}
 else if(e.wk=='shoot'){cx.beginPath();cx.moveTo(e.x,e.y);cx.lineTo(e.x+Math.cos(a)*50,e.y+Math.sin(a)*50);cx.stroke()}
 else if(e.wk=='cast'&&e.wa){const c=SCH[e.wa.s][2];cx.strokeStyle=rgba(c,.9);cx.lineWidth=2;cx.beginPath();cx.arc(e.x,e.y,e.r+8+Math.sin(gt*30)*3,0,7);cx.stroke();
  if(e.wa.k=='zone'&&!e.wa.self){const q=aimEnd(e,e.wx,e.wy,e.wa.rg||300);cx.fillStyle=rgba(c,.12+.2*u);cx.beginPath();cx.arc(q[0],q[1],e.wa.rad,0,7);cx.fill();cx.stroke()}
  else if(e.wa.k=='nova'){cx.beginPath();cx.arc(e.x,e.y,e.wa.rad,0,7);cx.stroke()}}}
function pips(u,y){let i=0;const ks=Object.keys(u.sx).filter(k=>u.sx[k].t>0);ks.forEach((k,j)=>{cx.fillStyle=STS[k][2];cx.fillRect(u.x-ks.length*3+j*6,y,5,5)})}
function drawE(e){const sh=e.boss?'bosses':'mobs',nm=e.boss?e.spr:e.k,fr=(gt*5+e.fi|0)%2;if(e.ph==1)drawTel(e);shadow(e.x,e.y+e.r*.7,e.r*1.1);
 if(e.el){cx.fillStyle='rgba(255,210,74,.28)';cx.beginPath();cx.ellipse(e.x,e.y+e.r*.7,e.r*1.5,e.r*.6,0,0,7);cx.fill()}
 spr(sh,nm,e.aw?fr:0,e.x,e.y,e.sc,p.x<e.x,e.fl>0,hs(e,'freeze')?.65:null);
 if(hs(e,'freeze')){cx.fillStyle='rgba(190,235,255,.4)';cx.fillRect(e.x-e.r,e.y-e.r,e.r*2,e.r*2)}
 if(e.abs>0){cx.strokeStyle='rgba(140,200,255,.7)';cx.lineWidth=2;cx.beginPath();cx.arc(e.x,e.y,e.r+3,0,7);cx.stroke()}
 if(!e.boss){if(e.hp<e.mh||e.el){const w=e.r*2;cx.fillStyle='rgba(0,0,0,.65)';cx.fillRect(e.x-w/2,e.y-e.r-14,w,4);cx.fillStyle=e.el?'#ffd24a':'#d9503f';cx.fillRect(e.x-w/2,e.y-e.r-14,w*Math.max(0,e.hp/e.mh),4)}
  if(e.el){cx.fillStyle='#ffd24a';cx.font='bold 9px system-ui';cx.textAlign='center';cx.fillText(e.nm,e.x,e.y-e.r-18)}}
 pips(e,e.y-e.r-9)}
function drawAl(a){shadow(a.x,a.y+a.r*.7,a.r*1.1);cx.strokeStyle=a.pet?'rgba(255,200,120,.8)':'rgba(122,224,184,.8)';cx.lineWidth=2;cx.beginPath();cx.ellipse(a.x,a.y+a.r*.7,a.r*1.2,a.r*.5,0,0,7);cx.stroke();
 spr('mobs',a.sp,(gt*5+a.fi|0)%2,a.x,a.y,a.sc,p.x<a.x,a.fl>0,a.gh?.8:null);
 if(a.hp<a.mh){const w=a.r*2;cx.fillStyle='rgba(0,0,0,.65)';cx.fillRect(a.x-w/2,a.y-a.r-12,w,3);cx.fillStyle='#5be08a';cx.fillRect(a.x-w/2,a.y-a.r-12,w*Math.max(0,a.hp/a.mh),3)}pips(a,a.y-a.r-8)}
function drawB(b){const a=Math.atan2(b.vy,b.vx);cx.save();cx.translate(b.x,b.y);cx.rotate(a);
 if(b.k=='arrow'){cx.fillStyle='#d8c8a0';cx.fillRect(-9,-1,12,2);cx.fillStyle='#fff';cx.fillRect(3,-2,4,4);cx.fillStyle='#c33';cx.fillRect(-10,-2,3,4)}
 else if(b.k=='bullet'){cx.fillStyle='rgba(255,230,160,.35)';cx.fillRect(-16,-1,16,2);cx.fillStyle='#fff6d0';cx.fillRect(-4,-1,8,2)}
 else{const g=cx.createRadialGradient(0,0,1,0,0,b.r*2.4);g.addColorStop(0,'#fff');g.addColorStop(.35,b.c);g.addColorStop(1,rgba(b.c,0));cx.fillStyle=g;cx.beginPath();cx.ellipse(-b.r*.6,0,b.r*3.2,b.r*1.7,0,0,7);cx.fill()}
 cx.restore()}
function drawZ(z){const pu=.5+.5*Math.sin(gt*10);
 if(z.trap){cx.strokeStyle=rgba(z.col,z.arm>0?.3:.6+.3*pu);cx.lineWidth=2;cx.setLineDash([5,4]);cx.beginPath();cx.arc(z.x,z.y,z.rad*.7,0,7);cx.stroke();cx.setLineDash([]);return}
 if(z.dl>0){cx.strokeStyle=rgba(z.col,.4+.4*pu);cx.lineWidth=2;cx.beginPath();cx.arc(z.x,z.y,z.rad,0,7);cx.stroke();cx.fillStyle=rgba(z.col,.04+.14*(1-z.dl/z.dl0));cx.fill()}
 else if(z.dur>0){const g=cx.createRadialGradient(z.x,z.y,2,z.x,z.y,z.rad);g.addColorStop(0,rgba(z.col,.05));g.addColorStop(1,rgba(z.col,.32));cx.fillStyle=g;cx.beginPath();cx.arc(z.x,z.y,z.rad,0,7);cx.fill();cx.strokeStyle=rgba(z.col,.6);cx.lineWidth=2;cx.stroke()}}
function drawFx(){for(const f of fxs){const k=f.t/f.mt;
 if(f.ty=='tx'){cx.font=f.big?'bold 17px system-ui':'bold 12px system-ui';cx.textAlign='center';cx.globalAlpha=Math.min(1,k*2);cx.lineWidth=3;cx.strokeStyle='#000';cx.strokeText(f.s,f.x,f.y);cx.fillStyle=f.c;cx.fillText(f.s,f.x,f.y);cx.globalAlpha=1}
 else if(f.ty=='p'){cx.globalAlpha=Math.min(1,k*1.5);cx.fillStyle=f.c;cx.fillRect(f.x-f.s/2,f.y-f.s/2,f.s,f.s);cx.globalAlpha=1}
 else if(f.ty=='r'){cx.globalAlpha=k;cx.strokeStyle=f.c;cx.lineWidth=f.w*k+1;cx.beginPath();cx.arc(f.x,f.y,f.rad*(1-k*k),0,7);cx.stroke();cx.globalAlpha=1}
 else if(f.ty=='g'){const g=cx.createRadialGradient(f.x,f.y,0,f.x,f.y,f.rad);g.addColorStop(0,rgba(f.c,.7*k));g.addColorStop(1,rgba(f.c,0));cx.fillStyle=g;cx.fillRect(f.x-f.rad,f.y-f.rad,f.rad*2,f.rad*2)}
 else if(f.ty=='l'){cx.globalAlpha=k;cx.strokeStyle=f.c;cx.lineWidth=f.w*(.4+k*.6);cx.lineCap='round';cx.beginPath();cx.moveTo(f.x1,f.y1);
  if(f.jag){const n=6,dx=f.x2-f.x1,dy=f.y2-f.y1,l=Math.hypot(dx,dy)||1;for(let i=1;i<n;i++)cx.lineTo(f.x1+dx*i/n-dy/l*rr(-9,9),f.y1+dy*i/n+dx/l*rr(-9,9))}cx.lineTo(f.x2,f.y2);cx.stroke();cx.globalAlpha=1}
 else if(f.ty=='c'){const g=cx.createRadialGradient(f.x,f.y,10,f.x,f.y,f.rad);g.addColorStop(0,rgba(f.c,0));g.addColorStop(1,rgba(f.c,.55*k));cx.fillStyle=g;cx.beginPath();cx.moveTo(f.x,f.y);cx.arc(f.x,f.y,f.rad*(1.05-k*.2),f.a-f.ar/2,f.a+f.ar/2);cx.closePath();cx.fill()}}}
function arrow(tx,ty,c){const sx=tx-cam.x,sy=ty-cam.y;if(sx>12&&sx<VW-12&&sy>12&&sy<VH-12)return;const a=Math.atan2(sy-VH/2,sx-VW/2);cx.save();cx.translate(cl(VW/2+Math.cos(a)*400,22,VW-22),cl(VH/2+Math.sin(a)*400,22,VH-22));cx.rotate(a);cx.fillStyle=c;cx.beginPath();cx.moveTo(10,0);cx.lineTo(-6,-7);cx.lineTo(-6,7);cx.closePath();cx.fill();cx.restore()}
function vig(x,y){if(!CFG.vig)return;const g=cx.createRadialGradient(x,y,90,x,y,400);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(4,2,10,.8)');cx.fillStyle=g;cx.fillRect(0,0,VW,VH)}
function wrapT(s,x,y,w,lh){const ws=s.split(' ');let l='';for(const t of ws){if(cx.measureText(l+t).width>w&&l){cx.fillText(l,x,y);y+=lh;l=''}l+=t+' '}cx.fillText(l,x,y)}
function drawProps(){for(const q of props){
 if(q.k=='deco')spr('items',q.s,0,q.x,q.y,1.4);
 else if(q.k=='chest'||q.k=='mchest')spr('items',q.open?'chesto':'chestc',0,q.x,q.y,2);
 else if(q.k=='shrine')spr('items','shrine',0,q.x,q.y,2,0,0,q.used?.45:1);
 else if(q.k=='anvil')spr('items','anvil',0,q.x,q.y,2.2);
 else if(q.k=='npc'){shadow(q.x,q.y+10,12);spr('mobs',q.sp,(gt*2|0)%2,q.x,q.y,2.4);cx.font='bold 10px system-ui';cx.textAlign='center';cx.fillStyle='#ffd24a';cx.fillText(q.name,q.x,q.y-30);
  if(Math.hypot(q.x-p.x,q.y-p.y)<130){cx.fillStyle='rgba(20,16,32,.85)';cx.fillRect(q.x-70,q.y-70,140,34);cx.fillStyle='#fff';cx.font='10px system-ui';wrapT(q.line,q.x,q.y-58,132,11)}}}
 for(const q of traps){if(q.k=='spike')spr('items','spike'+(q.ph||0),0,q.x,q.y,2);else if(q.k=='vent')spr('items',q.ph?'vent1':'vent0',0,q.x,q.y,2);
  else{spr('items','turret',0,q.x,q.y,2);if(q.w>0){cx.fillStyle='rgba(255,90,60,.6)';cx.beginPath();cx.arc(q.x+q.dx*14,q.y+q.dy*14,5,0,7);cx.fill()}}}}
function drawOrbs(){for(const o of orbs)for(const q of(o.ps||[])){const g=cx.createRadialGradient(q[0],q[1],1,q[0],q[1],12);g.addColorStop(0,'#fff');g.addColorStop(.4,o.col);g.addColorStop(1,rgba(o.col,0));cx.fillStyle=g;cx.beginPath();cx.arc(q[0],q[1],12,0,7);cx.fill()}
 for(const u of aurs){cx.strokeStyle=rgba(u.col,.5);cx.lineWidth=2;cx.setLineDash([6,6]);cx.beginPath();cx.arc(p.x,p.y,u.a.rad,gt*1.5,gt*1.5+6.28);cx.stroke();cx.setLineDash([]);cx.fillStyle=rgba(u.col,.06);cx.fill()}}
function draw(){cx.imageSmoothingEnabled=false;cx.fillStyle='#0b0812';cx.fillRect(0,0,VW,VH);
 const k=CFG.shake&&shkv>0?shkv:0;cx.save();cx.translate(Math.round(-cam.x+rr(-k,k)),Math.round(-cam.y+rr(-k,k)));drawTiles();
 const gx=(exitI%MW+.5)*T,gy=((exitI/MW|0)+.5)*T;
 if(exitOpen){const g=cx.createRadialGradient(gx,gy,4,gx,gy,56);g.addColorStop(0,'rgba(110,255,176,.5)');g.addColorStop(1,'rgba(110,255,176,0)');cx.fillStyle=g;cx.fillRect(gx-56,gy-56,112,112)}
 spr('items',exitOpen?'gate1':'gate0',0,gx,gy,2.2);drawProps();zs.forEach(drawZ);
 for(const d of ds){const y=d.y+Math.sin(gt*4+d.x)*2,c=RR[d.it.r][1];cx.fillStyle=rgba(c,.3);cx.beginPath();cx.ellipse(d.x,d.y+8,10,4,0,0,7);cx.fill();const i=iconOf(d.it);spr(i[0],i[1],0,d.x,y-4,1.4)}
 es.concat(al,[p]).sort((a,b)=>a.y-b.y).forEach(e=>e===p?drawP():e.ty!==undefined?drawAl(e):drawE(e));
 drawOrbs();bs.forEach(drawB);drawSwing(p.sw);drawSwing(p.sw2);drawFx();
 if(p.ip){cx.font='bold 12px system-ui';cx.textAlign='center';cx.lineWidth=3;cx.strokeStyle='#000';const t=(p.ip.act?'[F] ':'')+p.ip.t;cx.strokeText(t,p.x,p.y-34);cx.fillStyle='#fff';cx.fillText(t,p.x,p.y-34)}
 if(p.mn){const o=ORES.find(q=>q[0]==ores.get(p.mn.i));if(o){const x=(p.mn.i%MW+.5)*T,y=((p.mn.i/MW|0)+.5)*T;cx.fillStyle='rgba(0,0,0,.7)';cx.fillRect(x-16,y-26,32,5);cx.fillStyle=o[2];cx.fillRect(x-16,y-26,32*cl(p.mn.t/1.2,0,1),5)}}
 cx.restore();vig(p.x-cam.x,p.y-cam.y);
 const B=es.find(e=>e.boss);if(B){cx.fillStyle='rgba(0,0,0,.65)';cx.fillRect(60,10,VW-120,14);cx.fillStyle=B.c;cx.fillRect(60,10,(VW-120)*Math.max(0,B.hp/B.mh),14);cx.fillStyle='#fff';cx.font='bold 11px system-ui';cx.textAlign='center';cx.fillText(B.nm,VW/2,21)}
 if(exitOpen)arrow(gx,gy,'#6dffb0');else if(es.length&&es.length<=3){let n=es[0];for(const e of es)if(Math.hypot(e.x-p.x,e.y-p.y)<Math.hypot(n.x-p.x,n.y-p.y))n=e;arrow(n.x,n.y,'#ff6b5e')}}
function menuBg(){cx.imageSmoothingEnabled=false;map=menuMap;curBi=0;cam.x=(MW*T-VW)/2+Math.sin(gt*.1)*300;cam.y=(MH*T-VH)/2+Math.cos(gt*.13)*180;cx.save();cx.translate(-Math.round(cam.x),-Math.round(cam.y));drawTiles();cx.restore();cx.fillStyle='rgba(8,6,16,.55)';cx.fillRect(0,0,VW,VH);vig(VW/2,VH/2)}
function loop(t){requestAnimationFrame(loop);const dt=Math.min(.033,(t-last)/1000||0);last=t;
 if(scene=='play'&&G){if(!uiOpen()&&!p.dead){if(hst>0)hst-=dt;else upd(dt)}const tx=cl(p.x-VW/2,0,MW*T-VW),ty=cl(p.y-VH/2,0,MH*T-VH);cam.x+=(tx-cam.x)*.2;cam.y+=(ty-cam.y)*.2;draw();hud()}
 else{gt+=dt;menuBg()}
 shkv=Math.max(0,shkv-dt*14)}
// ---- game flow
function enterGame(){p.dead=0;p.rv=0;p.acd=[0,0,0,0];p.sx={};p.abs=0;p.sw=p.sw2=null;p.mn=null;keys.atk=keys.rng=keys.dash=keys.use=0;god=0;nocd=0;calc();p.hp=P.mhp;newRoom();closeOv();rAb();rCb();sxSig='';sxDirty=1;
 setT(H.nm,G.nm+' · '+RACES[G.rc].n+' '+CLS[G.cl].n);$('#hud').style.display='flex';fit()}
function playSlot(i){const s=getSlot(i);if(!s)return;try{loadG(s,i)}catch(e){return toast('That save could not be read.')}if(s.lvl==null)toast('Converted from an older save: Normal difficulty.');enterGame()}
function beginNew(nc,slot){newG(nc,slot);enterGame();save()}
function toMenu(){save();G=null;scene='menu';map=menuMap;closeOv();$('#hud').style.display='none';rAb();rCb();$('#sx').innerHTML='';rMain();showOv('mm')}
function escKey(){if(scene!='play'||!G||p.dead)return;if(uiOpen())closeOv();else modPause()}
// ---- input
const KM={KeyW:'w',ArrowUp:'w',KeyA:'a',ArrowLeft:'a',KeyS:'s',ArrowDown:'s',KeyD:'d',ArrowRight:'d',Space:'atk',KeyJ:'atk',KeyK:'rng',KeyE:'rng',ShiftLeft:'dash',ShiftRight:'dash',KeyL:'dash',KeyF:'use'};
addEventListener('keydown',e=>{if(/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||scene!='play'||!G)return;const k=KM[e.code];if(k){keys[k]=1;e.preventDefault()}if(e.repeat)return;
 if(e.code=='Escape')escKey();else if(!p.dead){if(e.code=='KeyT')togOv('sv');else if(e.code=='KeyI')togOv('iv');else if(!uiOpen()){if(e.code=='KeyF'&&p.ip&&p.ip.act)p.ip.act();else if(/^Key[ZXCV]$/.test(e.code))useCons('ZXCV'.indexOf(e.code[3]));else if(/^Digit[1-4]$/.test(e.code))useAb(+e.code[5]-1)}}});
addEventListener('keyup',e=>{const k=KM[e.code];if(k){keys[k]=0;if(!/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))e.preventDefault()}});
cv.addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();ms.x=(e.clientX-r.left)*VW/r.width;ms.y=(e.clientY-r.top)*VH/r.height;ms.on=1});
cv.addEventListener('mousedown',e=>{ms.on=1;if(e.button==0)keys.atk=1;if(e.button==2)keys.rng=1});
addEventListener('mouseup',e=>{if(e.button==0)keys.atk=0;if(e.button==2)keys.rng=0});
cv.addEventListener('contextmenu',e=>e.preventDefault());
$$('#bt button').forEach(b=>{const k=b.dataset.k;b.addEventListener('pointerdown',e=>{e.preventDefault();ms.on=0;keys[k]=1;if(k=='use'&&p.ip&&p.ip.act)p.ip.act()});['pointerup','pointercancel','pointerleave'].forEach(v=>b.addEventListener(v,()=>{keys[k]=0}))});
const jsE=$('#js'),jk=$('#jk');let jid=null;
function jm(e){const r=jsE.getBoundingClientRect();let x=(e.clientX-r.left-r.width/2)/(r.width/2),y=(e.clientY-r.top-r.height/2)/(r.height/2);const m=Math.hypot(x,y);if(m>1){x/=m;y/=m}if(m<.2)x=y=0;jv.x=x;jv.y=y;jk.style.transform=`translate(${x*30}px,${y*30}px)`}
jsE.addEventListener('pointerdown',e=>{jid=e.pointerId;jsE.setPointerCapture(jid);ms.on=0;jm(e)});jsE.addEventListener('pointermove',e=>{if(e.pointerId==jid)jm(e)});
['pointerup','pointercancel'].forEach(v=>jsE.addEventListener(v,()=>{jid=null;jv.x=jv.y=0;jk.style.transform=''}));
function fit(){const w=$('#wrap'),s=Math.min(w.clientWidth/VW,w.clientHeight/VH);cv.style.width=VW*s+'px';cv.style.height=VH*s+'px'}
addEventListener('resize',fit);addEventListener('pagehide',save);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});setInterval(save,8000);
function boot(){genMap(mb(hsh('menu')),'cave',0);menuMap=map;$('#hud').style.display='none';fit();rMain();showOv('mm');requestAnimationFrame(loop)}
loadAssets(boot);
