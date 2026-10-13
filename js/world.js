let startI=0;
const MC={slime:'#6bd36f',bat:'#a07bdc',skeleton:'#e6e4d2',brute:'#c0705a',cultist:'#7a40a0',wraith:'#96bee9'};
const solid=(x,y)=>{const a=Math.floor(x/T),b=Math.floor(y/T);return a<0||b<0||a>=MW||b>=MH||map[b*MW+a]==1};
function bfs(sx,sy){const d=new Int16Array(MW*MH).fill(-1),q=[sy*MW+sx];if(map[q[0]])return d;d[q[0]]=0;
 for(let h=0;h<q.length;h++){const c=q[h],x=c%MW,y=c/MW|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx>0&&ny>0&&nx<MW-1&&ny<MH-1){const j=ny*MW+nx;if(!map[j]&&d[j]<0){d[j]=d[c]+1;q.push(j)}}}}return d}
function los(x1,y1,x2,y2){const d=Math.hypot(x2-x1,y2-y1),n=Math.ceil(d/8);for(let i=1;i<n;i++){const t=i/n;if(solid(x1+(x2-x1)*t,y1+(y2-y1)*t))return false}return true}
function rayEnd(x1,y1,x2,y2){const d=Math.hypot(x2-x1,y2-y1),n=Math.max(1,Math.ceil(d/6));let lx=x1,ly=y1;for(let i=1;i<=n;i++){const t=i/n,x=x1+(x2-x1)*t,y=y1+(y2-y1)*t;if(solid(x,y))break;lx=x;ly=y}return[lx,ly]}
function aimEnd(c,tx,ty,mx){const a=Math.atan2(ty-c.y,tx-c.x),d=Math.min(mx,Math.hypot(tx-c.x,ty-c.y));return rayEnd(c.x,c.y,c.x+Math.cos(a)*d,c.y+Math.sin(a)*d)}
function segD(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,l=dx*dx+dy*dy||1,t=cl(((px-x1)*dx+(py-y1)*dy)/l,0,1);return Math.hypot(px-x1-dx*t,py-y1-dy*t)}
function mv1(o,dx,dy){const r=o.r*.75,nx=o.x+dx,ny=o.y+dy,sx=Math.sign(dx)*r,sy=Math.sign(dy)*r;
 if(dx&&!(solid(nx+sx,o.y-r*.8)||solid(nx+sx,o.y+r*.8)))o.x=nx;if(dy&&!(solid(o.x-r*.8,ny+sy)||solid(o.x+r*.8,ny+sy)))o.y=ny}
function move(o,dx,dy){const n=Math.ceil(Math.hypot(dx,dy)/8)||1;dx/=n;dy/=n;for(let i=0;i<n;i++){mv1(o,dx,0);mv1(o,0,dy)}}
// ---- procedural map: cave (cellular automata), halls (rooms + corridors) or arena (mirrored pillars). Connectivity is guaranteed.
function genMap(rg,boss,force){const ri2=(a,b)=>a+Math.floor(rg()*(b-a+1)),st=force||(boss?'arena':['cave','cave','halls','halls','arena'][ri2(0,4)]);
 map=new Uint8Array(MW*MH).fill(1);
 const carve=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>0&&y>0&&x<MW-1&&y<MH-1)map[y*MW+x]=0};
 if(st=='cave'){for(let i=0;i<MW*MH;i++){const x=i%MW,y=i/MW|0;map[i]=x<2||y<2||x>MW-3||y>MH-3||rg()<.47?1:0}
  for(let it=0;it<5;it++){const n=map.slice();for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){let c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)c+=map[(y+dy)*MW+x+dx];n[y*MW+x]=c>=5?1:0}map=n}}
 else if(st=='halls'){const rs=[];for(let t=0;t<80&&rs.length<10;t++){const w=ri2(6,13),h=ri2(5,9),x=ri2(2,MW-w-3),y=ri2(2,MH-h-3);
   if(rs.every(r=>x>r.x+r.w+2||x+w+2<r.x||y>r.y+r.h+2||y+h+2<r.y)){rs.push({x,y,w,h});carve(x,y,x+w-1,y+h-1)}}
  for(let i=1;i<rs.length;i++){const a=rs[i-1],b=rs[i],ax=a.x+a.w/2|0,ay=a.y+a.h/2|0,bx=b.x+b.w/2|0,by=b.y+b.h/2|0;carve(Math.min(ax,bx),ay,Math.max(ax,bx),ay+1);carve(bx,Math.min(ay,by),bx+1,Math.max(ay,by))}}
 else{carve(4,4,MW-5,MH-5);
  for(let n=ri2(5,9),t=0;n>0&&t<80;t++){const w=ri2(1,2),h=ri2(1,2),x=ri2(7,MW/2-3),y=ri2(6,MH/2-3),cs=[[x,y],[MW-x-w,y],[x,MH-y-h],[MW-x-w,MH-y-h]];
   if(cs.every(([a,b])=>{for(let yy=b-1;yy<=b+h;yy++)for(let xx=a-1;xx<=a+w;xx++)if(map[yy*MW+xx])return 0;return 1})){cs.forEach(([a,b])=>{for(let yy=b;yy<b+h;yy++)for(let xx=a;xx<a+w;xx++)map[yy*MW+xx]=1});n--}}}
 let reg=[];const seen=new Uint8Array(MW*MH);
 for(let i=0;i<MW*MH;i++)if(!map[i]&&!seen[i]){const d=bfs(i%MW,i/MW|0),r=[];for(let j=0;j<d.length;j++)if(d[j]>=0){seen[j]=1;r.push(j)}if(r.length>reg.length)reg=r}
 if(reg.length<260&&st!='arena')return genMap(rg,boss,'arena');
 map.fill(1);reg.forEach(i=>map[i]=0);
 const A=reg[Math.floor(rg()*reg.length)],d1=bfs(A%MW,A/MW|0);let B=A;for(const j of reg)if(d1[j]>d1[B])B=j;
 const d2=bfs(B%MW,B/MW|0);let C=B;for(const j of reg)if(d2[j]>d2[C])C=j;
 for(const j of[B,C]){const x=j%MW,y=j/MW|0;carve(x-1,y-1,x+1,y+1)}
 startI=B;exitI=C;fdist=bfs(B%MW,B/MW|0);big=[];for(let i=0;i<MW*MH;i++)if(fdist[i]>=0)big.push(i)}
function newRoom(){const f=G.floor,r=G.room,boss=r==5,rg=mb(hsh(G.seed+'|'+f+'|'+r)),ri2=(a,b)=>a+Math.floor(rg()*(b-a+1));
 rt=boss?'boss':r>1&&rg()<.3?(rg()<.5?'treasure':'rest'):'fight';es=[];bs=[];ds=[];zs=[];fxs=[];props=[];exitOpen=0;genMap(rg,boss);
 p.x=(startI%MW+.5)*T;p.y=((startI/MW|0)+.5)*T;p.dh=0;p.inv=1;p.sw=null;p.kx=p.ky=0;p.bt=0;p.sl=0;p.stn=0;p.sh=S.aegis?1:0;p.dead=0;
 cam.x=cl(p.x-VW/2,0,MW*T-VW);cam.y=cl(p.y-VH/2,0,MH*T-VH);
 const used=new Set([startI,exitI]);
 const wspot=min=>{const c=[];for(const j of big){if(used.has(j)||fdist[j]<min)continue;const x=j%MW,y=j/MW|0;let w4=0,f8=0;
   for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])w4+=map[(y+dy)*MW+x+dx];for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)f8+=map[(y+dy)*MW+x+dx]?0:1;if(w4>=1&&f8>=6)c.push(j)}
  const j=c.length?c[Math.floor(rg()*c.length)]:big[Math.floor(rg()*big.length)];used.add(j);return[(j%MW+.5)*T,((j/MW|0)+.5)*T]};
 const chest=n=>{const q=wspot(8),loot=[];for(let i=0;i<n;i++)loot.push(mkItem(rg,f,rg()<.2?1:0));if(rg()<.12)loot.push(mkAb(rollAb(rg,1+Math.floor(f/3)),1));props.push({k:'chest',x:q[0],y:q[1],loot,open:0})};
 if(rt=='fight'){const ks=Object.keys(EN).filter(k=>EN[k].f<=f),groups=Math.min(9,3+Math.floor(f/3)),cs=[];
  for(let g=0;g<groups;g++){let c=null;for(let t=0;t<30&&!c;t++){const j=big[Math.floor(rg()*big.length)];if(fdist[j]>=(t<20?14:6)&&cs.every(o=>Math.hypot(o[0]-j%MW,o[1]-(j/MW|0))>6))c=[j%MW,j/MW|0]}
   if(!c)continue;cs.push(c);
   for(let n=ri2(2,3),k=0;k<n;k++){let x=c[0],y=c[1];for(let t=0;t<12;t++){const nx=c[0]+ri2(-2,2),ny=c[1]+ri2(-2,2);if(nx>0&&ny>0&&nx<MW-1&&ny<MH-1&&!map[ny*MW+nx]){x=nx;y=ny;break}}
    addE(ks[Math.floor(rg()*ks.length)],(x+.5)*T,(y+.5)*T,rg()<Math.min(.18,.04+.008*f))}}
  if(rg()<.4)chest(1)}
 else if(boss)addBoss((MW/2+.5)*T,(MH/2+.5)*T,rg);
 else if(rt=='treasure'){for(let i=0,n=ri2(2,3);i<n;i++)chest(ri2(1,2))}
 else{const q=wspot(6);props.push({k:'shrine',x:q[0],y:q[1],used:0});if(rg()<.6)chest(1)}
 flowT=0;scene='play';save()}
function next(){G.room++;if(G.room>5){G.room=1;G.floor++;G.max=Math.max(G.max,G.floor);p.rv=0;toast('Floor '+G.floor)}newRoom()}
// ---- enemies
function addE(k,x,y,el){const d=EN[k],f=G.floor,m=1.2**(f-1)*(el?2.6:1);
 const e={k,x,y,hp:d.hp*m,mh:d.hp*m,r:d.r*(el?1.15:1),sp:d.sp*(el?1.1:1),d:d.d*1.13**(f-1)*(el?1.3:1),s:d.s*(el?3:1),ai:d.ai,sc:d.sc*(el?1.2:1),el,t:rr(0,1.5),aw:0,ch:0,bu:0,bt:0,sl:0,stn:0,fl:0,kx:0,ky:0,fi:ri(0,9),ab:null,acd:rr(1,3),wu:0,wa:null,los:0,lt:0,nm:d.n,heavy:d.hv,c:MC[k]};
 if(d.ab){e.ab=d.ab.filter(id=>AB[id].t<=1+Math.floor(f/4));if(!e.ab.length)e.ab=[d.ab[0]]}
 if(el&&!e.ab)e.ab=[pk(Object.keys(AB).filter(id=>EOK.includes(AB[id].k)&&AB[id].t<=1+Math.floor(f/4)))];
 es.push(e);return e}
function addBoss(x,y,rg){const b=BOSS[Math.floor(rg()*BOSS.length)],f=G.floor,m=1.35**(f-1),t=['the Hollow','of Ash','the Unmourned','of Teeth','the Pale'];
 es.push({k:'boss',spr:b.sp,boss:1,heavy:1,nm:b.n+' '+t[Math.floor(rg()*t.length)],x,y,hp:420*m,mh:420*m,r:30,sp:48,d:11*1.13**(f-1),s:30,ai:5,sc:2.4,t:2,aw:1,ch:0,bu:0,bt:0,sl:0,stn:0,fl:0,kx:0,ky:0,fi:0,ab:b.ab.slice(),acd:2,wu:0,wa:null,los:0,lt:0,c:b.c})}
function wake(e){if(e.aw)return;e.aw=1;for(const o of es)if(!o.aw&&Math.hypot(o.x-e.x,o.y-e.y)<150)o.aw=1}
function flowDir(e){const tx=e.x/T|0,ty=e.y/T|0;let b=fd[ty*MW+tx],bx=0,by=0;if(b<0)return[0,0];
 for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=tx+dx,ny=ty+dy;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;const v=fd[ny*MW+nx];if(v<0||v>=b)continue;if(dx&&dy&&(map[ty*MW+nx]||map[ny*MW+tx]))continue;b=v;bx=dx;by=dy}
 if(!bx&&!by)return[0,0];const m=Math.hypot(bx,by);return[bx/m,by/m]}
function updE(e,dt){const dx=p.x-e.x,dy=p.y-e.y,dd=Math.hypot(dx,dy)||1,ux=dx/dd,uy=dy/dd;e.t-=dt;e.fl-=dt;e.lt-=dt;
 if(e.lt<=0){e.lt=.2;e.los=los(e.x,e.y,p.x,p.y)}
 if(e.bt>0){e.bt-=dt;e.hp-=e.bu*dt;if(R()<dt*6)part(e.x,e.y-e.r,1,e.bk=='poison'?'#6ddb7a':'#ff8a3c',30,.4,2);if(e.hp<=0){kill(e);return}}
 if(e.sl>0)e.sl-=dt;
 if(e.kx||e.ky){move(e,e.kx*dt,e.ky*dt);e.kx*=.86;e.ky*=.86;if(Math.abs(e.kx)+Math.abs(e.ky)<8)e.kx=e.ky=0}
 if(e.stn>0){e.stn-=dt;return}
 if(!e.aw){if((dd<170&&e.los)||dd<90)wake(e);else return}
 if(p.dead)return;
 if(e.wu>0){e.wu-=dt;if(e.wu<=0&&e.wa)cast(e,e.wa,1,p.x,p.y);return}
 if(e.ab){e.acd-=dt;if(e.acd<=0&&dd<320&&e.los){const a=AB[pk(e.ab)];e.wa=a;e.wu=e.boss?.4:.5;e.acd=a.cd*(e.boss?(e.hp<e.mh/2?.35:.5):1)*rr(.9,1.3)+(e.boss?.5:1.5);return}}
 let sp=e.sp*(e.sl>0?.55:1),mx=ux,my=uy,away=0;
 if(e.ai==1){const w=Math.sin(gt*5+e.fi);mx=ux-uy*w*.9;my=uy+ux*w*.9}
 else if(e.ai==2){if(dd<140)away=1;else if(dd<220)mx=my=0;if(e.t<=0&&e.los&&dd<320){e.t=rr(1.5,2.3);proj(e,e.x,e.y,Math.atan2(dy,dx),210,e.d,{r:4,k:'arrow',l:3})}}
 else if(e.ai==3){if(e.ch>0){e.ch-=dt;sp=260}else if(e.t<=0&&dd<260){e.t=rr(2,3.5);e.ch=.5}}
 else if(e.ai==4){if(dd<150)away=1;else if(dd<240)mx=my=0}
 else if(e.ai==5){if(dd<130)mx=my=0}
 let vx=0,vy=0;if(away){vx=-ux;vy=-uy}else if(mx||my){if(e.los||dd<60){vx=mx;vy=my}else{const f=flowDir(e);vx=f[0];vy=f[1]}}
 move(e,vx*sp*dt,vy*sp*dt);if(dd<e.r+p.r+2)hurt(e.d*(e.boss?1.2:1),e)}
function lootSpot(x,y){for(let i=0;i<16;i++){const a=rr(0,6.283),d=rr(14,58),nx=x+Math.cos(a)*d,ny=y+Math.sin(a)*d;
 if(!solid(nx,ny)&&!solid(nx+9,ny)&&!solid(nx-9,ny)&&!solid(nx,ny+9)&&!solid(nx,ny-9)&&los(x,y,nx,ny)&&!ds.some(o=>Math.hypot(o.x-nx,o.y-ny)<18))return[nx,ny]}return[x,y]}
function kill(e){if(e.dead)return;e.dead=1;G.kills++;const n=Math.ceil((1+G.floor*.9)*e.s*.5*(1+(S.soul||0)/100));G.souls+=n;ft(e.x,e.y-e.r-10,'+'+n,'#6fd8ff');
 part(e.x,e.y,e.boss?40:12,e.c,130,.6,3);ring(e.x,e.y,e.boss?100:34,'#fff',.3,2);if(e.boss)shk(8);hstop(.05);gain(G.eq.n,1);gain(G.eq.m,1);
 const put=o=>{const q=lootSpot(e.x,e.y);o.x=q[0];o.y=q[1];ds.push(o);if(o.it)disc(o.it)};
 if(R()<.06)put({po:1});if(R()<.055*(1+(S.drop||0)/100)+(e.el?.4:0))put({it:mkItem(R,G.floor,e.el?1:0)});
 if(e.ab&&!e.boss&&R()<(e.el?.3:.045)){const id=pk(e.ab);if(!AB[id].nodrop)put({it:mkAb(id,1)})}
 if(e.boss){put({it:mkItem(R,G.floor,1)});put({it:mkItem(R,G.floor,1)});put({po:1});const ids=e.ab.filter(id=>!AB[id].nodrop);put({it:mkAb(R()<.6&&ids.length?pk(ids):rollAb(R,2+Math.floor(G.floor/4)),1)})}}
function interact(){
 for(const d of ds){if(d.x<0||Math.hypot(d.x-p.x,d.y-p.y)>22)continue;
  if(d.po){G.pot++;ft(p.x,p.y-20,'+Potion','#f77')}
  else if(d.it){if(G.inv.length<cap()){G.inv.push(d.it);disc(d.it);ft(p.x,p.y-20,d.it.nm,RR[d.it.r][1]);if(d.it.sl=='ab')toast('New ability: '+d.it.nm+'. Open your pack to equip it.')}else{const v=val(d.it);G.souls+=v;ft(p.x,p.y-20,'Pack full: +'+v,'#6fd8ff')}}
  d.x=-999}
 ds=ds.filter(d=>d.x>-900);
 for(const q of props){if(Math.hypot(q.x-p.x,q.y-p.y)>28)continue;
  if(q.k=='chest'&&!q.open){q.open=1;ft(q.x,q.y-24,'Chest!','#fd6');part(q.x,q.y-6,18,'#ffd24a',110,.6,3);glow(q.x,q.y,40,'#ffd24a',.4);G.souls+=Math.ceil(G.floor*6*(1+(S.soul||0)/100));q.loot.forEach(it=>{const s=lootSpot(q.x,q.y);ds.push({x:s[0],y:s[1],it});disc(it)})}
  if(q.k=='shrine'&&!q.used){q.used=1;heal(P.mhp);p.bt=0;p.sl=0;ft(q.x,q.y-24,'Restored','#7fd');ring(q.x,q.y,50,'#7fd8ff',.6,3);part(q.x,q.y,20,'#7fd8ff',90,.8,3)}}}
