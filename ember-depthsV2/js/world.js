const MC={slime:'#6bd36f',bat:'#a07bdc',skeleton:'#e6e4d2',brute:'#c0705a',cultist:'#7a40a0',wraith:'#96bee9',spider:'#5a4070',goblin:'#78b046',wolf:'#8a8e9c',mushroom:'#c83c46',imp:'#c83c3c',necro:'#6040a0',orc:'#6ea050',fspirit:'#f08232',iwisp:'#96d2f5',mimic:'#96622f'};
const SHN=['Grimble','Odalys','Brannoch','Tessa','Old Murk','Pip'];
const SHL={greet:['Welcome, welcome! Mind the mimics.','Fresh from the depths? Let me see that coin.','Everything is genuine. Mostly.','Gold talks. Silence also sells.','Ah, a customer! Or a very polite looter.'],buy:['Pleasure doing business!','You have an eye for quality.','No refunds, but plenty of luck.','Excellent choice, truly.'],poor:['Your purse is lighter than a ghost.','Come back when you are richer.','I do not accept compliments as payment.'],full:['Your pack is full, friend. Salvage something!'],bye:['Mind the dark down there.','Come back alive, preferably.']};
const tile=(x,y)=>x<0||y<0||x>=MW||y>=MH?1:map[y*MW+x];
const solid=(x,y)=>{const v=tile(Math.floor(x/T),Math.floor(y/T));return v==1||v==4||v==5||v==7};
const wallOnly=(x,y)=>{const v=tile(Math.floor(x/T),Math.floor(y/T));return v==1||v==4||v==7};
const blocks=(x,y)=>{const a=Math.floor(x/T),b=Math.floor(y/T),v=tile(a,b);return v==1||v==4||v==7||(v==2&&!dopen[b*MW+a])};
const walk=v=>v==0||v==2||v==6;
function bfs(sx,sy){const d=new Int16Array(MW*MH).fill(-1),q=[sy*MW+sx];if(!walk(map[q[0]]))return d;d[q[0]]=0;
 for(let h=0;h<q.length;h++){const c=q[h],x=c%MW,y=c/MW|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=x+dx,ny=y+dy;if(nx>0&&ny>0&&nx<MW-1&&ny<MH-1){const j=ny*MW+nx;if(d[j]<0&&walk(map[j])){d[j]=d[c]+1;q.push(j)}}}}return d}
function los(x1,y1,x2,y2){const d=Math.hypot(x2-x1,y2-y1),n=Math.ceil(d/8);for(let i=1;i<n;i++){const t=i/n;if(blocks(x1+(x2-x1)*t,y1+(y2-y1)*t))return false}return true}
function rayEnd(x1,y1,x2,y2){const d=Math.hypot(x2-x1,y2-y1),n=Math.max(1,Math.ceil(d/6));let lx=x1,ly=y1;for(let i=1;i<=n;i++){const t=i/n,x=x1+(x2-x1)*t,y=y1+(y2-y1)*t;if(blocks(x,y))break;lx=x;ly=y}return[lx,ly]}
function aimEnd(c,tx,ty,mx){const a=Math.atan2(ty-c.y,tx-c.x),d=Math.min(mx,Math.hypot(tx-c.x,ty-c.y));return rayEnd(c.x,c.y,c.x+Math.cos(a)*d,c.y+Math.sin(a)*d)}
function segD(px,py,x1,y1,x2,y2){const dx=x2-x1,dy=y2-y1,l=dx*dx+dy*dy||1,t=cl(((px-x1)*dx+(py-y1)*dy)/l,0,1);return Math.hypot(px-x1-dx*t,py-y1-dy*t)}
function mv1(o,dx,dy){const sf=o.fly?wallOnly:solid,r=o.r*.75,nx=o.x+dx,ny=o.y+dy,sx=Math.sign(dx)*r,sy=Math.sign(dy)*r;
 if(dx&&!(sf(nx+sx,o.y-r*.8)||sf(nx+sx,o.y+r*.8)))o.x=nx;if(dy&&!(sf(o.x-r*.8,ny+sy)||sf(o.x+r*.8,ny+sy)))o.y=ny}
function move(o,dx,dy){if(o.gh){o.x=cl(o.x+dx,T*1.2,(MW-1.2)*T);o.y=cl(o.y+dy,T*1.2,(MH-1.2)*T);return}const n=Math.ceil(Math.hypot(dx,dy)/8)||1;dx/=n;dy/=n;for(let i=0;i<n;i++){mv1(o,dx,0);mv1(o,0,dy)}}
function chkSecret(x,y,r){if(secW<0)return;const sx=(secW%MW+.5)*T,sy=((secW/MW|0)+.5)*T;if(Math.hypot(sx-x,sy-y)<r+18){map[secW]=0;secW=-1;toast('A hidden passage opens!');part(sx,sy,24,'#c8c0b0',150,.7,3);ring(sx,sy,40,'#fff',.4,3);shk(3);addXP(10+G.floor*2)}}
// ---- procedural map: cave (cellular automata), halls (rooms + corridors), arena (mirrored pillars), outdoor (meadow with river). Connectivity is guaranteed.
function genMap(rg,style,boss){const ri2=(a,b)=>a+Math.floor(rg()*(b-a+1));
 map=new Uint8Array(MW*MH).fill(1);ores=new Map();doors=[];secW=-1;dopen.fill(0);
 const carve=(x0,y0,x1,y1)=>{for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(x>0&&y>0&&x<MW-1&&y<MH-1&&map[y*MW+x]!=5&&map[y*MW+x]!=6)map[y*MW+x]=0};
 if(style=='cave'){for(let i=0;i<MW*MH;i++){const x=i%MW,y=i/MW|0;map[i]=x<2||y<2||x>MW-3||y>MH-3||rg()<.47?1:0}
  for(let it=0;it<5;it++){const n=map.slice();for(let y=1;y<MH-1;y++)for(let x=1;x<MW-1;x++){let c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)c+=map[(y+dy)*MW+x+dx];n[y*MW+x]=c>=5?1:0}map=n}}
 else if(style=='halls'){const rs=[];for(let t=0;t<80&&rs.length<10;t++){const w=ri2(6,13),h=ri2(5,9),x=ri2(2,MW-w-3),y=ri2(2,MH-h-3);
   if(rs.every(r=>x>r.x+r.w+2||x+w+2<r.x||y>r.y+r.h+2||y+h+2<r.y)){rs.push({x,y,w,h});carve(x,y,x+w-1,y+h-1)}}
  for(let i=1;i<rs.length;i++){const a=rs[i-1],b=rs[i],ax=a.x+a.w/2|0,ay=a.y+a.h/2|0,bx=b.x+b.w/2|0,by=b.y+b.h/2|0;carve(Math.min(ax,bx),ay,Math.max(ax,bx),ay);carve(bx,Math.min(ay,by),bx,Math.max(ay,by))}}
 else if(style=='outdoor'){carve(2,2,MW-3,MH-3);
  for(let i=0;i<MW*MH;i++)if(map[i]==0&&rg()<.13)map[i]=1;
  {const n=map.slice();for(let y=2;y<MH-2;y++)for(let x=2;x<MW-2;x++){let c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)c+=map[(y+dy)*MW+x+dx]==1?1:0;if(c>=4)n[y*MW+x]=1}map=n}
  const vert=rg()<.5,len=vert?MH:MW,river=[];let pos=ri2(14,(vert?MW:MH)-15);
  for(let a=0;a<len;a++){pos=cl(pos+ri2(-1,1),vert?10:8,(vert?MW:MH)-(vert?12:10));const w=ri2(2,3);for(let b=0;b<w;b++){const x=vert?pos+b:a,y=vert?a:pos+b;map[y*MW+x]=5;river.push([x,y])}}
  for(const b0 of[ri2(6,12),ri2(18,len-8)])for(let a=b0;a<b0+3;a++){const rs=river.filter(q=>(vert?q[1]:q[0])==a).map(q=>vert?q[0]:q[1]);if(!rs.length)continue;const lo=Math.min(...rs),hi=Math.max(...rs);
   for(let c=lo;c<=hi;c++){const x=vert?c:a,y=vert?a:c;if(map[y*MW+x]==5)map[y*MW+x]=6}
   for(let k=1;k<=6;k++)for(const c of[lo-k,hi+k]){const x=vert?c:a,y=vert?a:c;if(x>1&&y>1&&x<MW-2&&y<MH-2&&map[y*MW+x]==1)map[y*MW+x]=0}}}
 else{carve(4,4,MW-5,MH-5);
  if(!boss)for(let n=ri2(5,9),t=0;n>0&&t<80;t++){const w=ri2(1,2),h=ri2(1,2),x=ri2(7,MW/2-3),y=ri2(6,MH/2-3),cs=[[x,y],[MW-x-w,y],[x,MH-y-h],[MW-x-w,MH-y-h]];
   if(cs.every(([a,b])=>{for(let yy=b-1;yy<=b+h;yy++)for(let xx=a-1;xx<=a+w;xx++)if(map[yy*MW+xx]==1)return 0;return 1})){cs.forEach(([a,b])=>{for(let yy=b;yy<b+h;yy++)for(let xx=a;xx<a+w;xx++)map[yy*MW+xx]=1});n--}}}
 let reg=[];const seen=new Uint8Array(MW*MH);
 for(let i=0;i<MW*MH;i++)if(walk(map[i])&&!seen[i]){const d=bfs(i%MW,i/MW|0),r=[];for(let j=0;j<d.length;j++)if(d[j]>=0){seen[j]=1;r.push(j)}if(r.length>reg.length)reg=r}
 if(reg.length<260&&style!='arena')return genMap(rg,'arena',boss);
 const inR=new Uint8Array(MW*MH);reg.forEach(i=>inR[i]=1);for(let i=0;i<MW*MH;i++)if(walk(map[i])&&!inR[i])map[i]=1;
 const A=reg[Math.floor(rg()*reg.length)],d1=bfs(A%MW,A/MW|0);let B=A;for(const j of reg)if(d1[j]>d1[B])B=j;
 const d2=bfs(B%MW,B/MW|0);let C=B;for(const j of reg)if(d2[j]>d2[C])C=j;
 for(const j of[B,C]){const x=j%MW,y=j/MW|0;carve(x-1,y-1,x+1,y+1)}
 startI=B;exitI=C;fdist=bfs(B%MW,B/MW|0);big=[];for(let i=0;i<MW*MH;i++)if(fdist[i]>=0)big.push(i);return style}
function placeDoors(rg){const c=[];
 for(const j of big){const x=j%MW,y=j/MW|0;if(j==startI||j==exitI||x<2||y<2||x>MW-3||y>MH-3)continue;const w=[map[j-1],map[j+1],map[j-MW],map[j+MW]].map(walk),h=w[0]&&w[1]&&!w[2]&&!w[3],v=!w[0]&&!w[1]&&w[2]&&w[3];if(!h&&!v)continue;
  if((h?[j-1,j+1]:[j-MW,j+MW]).some(k=>{const kx=k%MW,ky=k/MW|0;let f=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)f+=walk(map[(ky+dy)*MW+kx+dx])?1:0;return f>=8}))c.push(j)}
 c.sort(()=>rg()-.5);const out=[];for(const j of c){if(out.length>=4)break;if(fdist[j]<6)continue;if(out.every(k=>Math.hypot(k%MW-j%MW,(k/MW|0)-(j/MW|0))>5)){out.push(j);map[j]=2;doors.push(j)}}}
function placeSecret(rg){const c=big.slice().sort(()=>rg()-.5).slice(0,300);
 for(const j of c){const x=j%MW,y=j/MW|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]].sort(()=>rg()-.5)){
  let ok=map[(y+dy)*MW+x+dx]==1;
  for(let k=2;k<=6&&ok;k++)for(let l=-2;l<=2&&ok;l++){const xx=x+dx*k+(dy?l:0),yy=y+dy*k+(dx?l:0);if(xx<2||yy<2||xx>MW-3||yy>MH-3||map[yy*MW+xx]!=1)ok=false}
  if(!ok)continue;
  map[(y+dy)*MW+x+dx]=4;secW=(y+dy)*MW+x+dx;map[(y+dy*2)*MW+x+dx*2]=0;
  for(let k=3;k<=5;k++)for(let l=-1;l<=1;l++)map[(y+dy*k+(dx?l:0))*MW+x+dx*k+(dy?l:0)]=0;
  return[(x+dx*4+.5)*T,(y+dy*4+.5)*T]}}return null}
function placeOres(rg,n,out){const ot=ORES.filter(o=>o[4]<=G.floor),c=[];
 if(out){for(const j of big){const x=j%MW,y=j/MW|0;if(fdist[j]<7||x<3||y<3||x>MW-4||y>MH-4)continue;let ok=true;for(let dy=-1;dy<=1&&ok;dy++)for(let dx=-1;dx<=1;dx++)if(!walk(map[(y+dy)*MW+x+dx])){ok=false;break}if(ok)c.push(j)}}
 else for(let i=0;i<MW*MH;i++)if(map[i]==1){const x=i%MW,y=i/MW|0;if(x<2||y<2||x>MW-3||y>MH-3)continue;if([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>{const k=(y+dy)*MW+x+dx;return walk(map[k])&&fdist[k]>4}))c.push(i)}
 c.sort(()=>rg()-.5);for(let i=0;i<n&&i<c.length;i++){map[c[i]]=7;ores.set(c[i],wp(rg,ot,ot.map(o=>[6,3,2,1][o[3]-1]))[0])}}
function placeTraps(rg,ns,nt,nv){const fl=big.filter(j=>fdist[j]>=7&&Math.hypot(j%MW-exitI%MW,(j/MW|0)-(exitI/MW|0))>4).sort(()=>rg()-.5),tk=new Set();
 const put=(k,n)=>{for(let i=0,c=0;c<n&&i<fl.length;i++){const j=fl[i];if(tk.has(j))continue;let near=false;for(const o of tk)if(Math.hypot(o%MW-j%MW,(o/MW|0)-(j/MW|0))<2){near=true;break}if(near)continue;tk.add(j);traps.push({k,x:(j%MW+.5)*T,y:((j/MW|0)+.5)*T,t:rg()*3});c++}};
 put('spike',ns);put('vent',nv);
 const ws=[];for(const j of big){if(fdist[j]<6)continue;const x=j%MW,y=j/MW|0;for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])if(map[(y+dy)*MW+x+dx]==1&&x+dx>1&&y+dy>1&&x+dx<MW-2&&y+dy<MH-2)ws.push([(x+dx),(y+dy),-dx,-dy])}
 ws.sort(()=>rg()-.5);for(let i=0;i<nt&&i<ws.length;i++)traps.push({k:'turret',x:(ws[i][0]+.5)*T,y:(ws[i][1]+.5)*T,dx:ws[i][2],dy:ws[i][3],t:0,cd:rg()*2+1,w:0})}
const isShopFloor=f=>{let x=0;for(let i=0;i<300&&x<f;i++)x+=3+hsh(G.seed+'s'+x)%3;return x==f};
function genStock(rg,f){const pk2=a=>a[Math.floor(rg()*a.length)],o=[];for(let i=0,n=3+Math.floor(rg()*2);i<n;i++)o.push(mkItem(rg,f,rg()<.25?1:0));
 o.push(mkCons(f<6?'hp1':f<12?'hp2':'hp3',3));o.push(mkCons(pk2(['haste','rage','iron','regen','focus','luck','cleanse','bomb']),2));
 if(rg()<.45)o.push(mkAb(rollAb(rg,1+Math.floor(f/3)),1));if(rg()<.35)o.push(mkEgg(Math.min(4,Math.floor(rg()*(1+f/8))),f));if(rg()<.3)o.push(mkCons('mirror',1));if(rg()<.35)o.push(mkCons('treat',2));return o}
// ---- rooms
function newRoom(){const f=G.floor,r=G.room,rg=mb(hsh(G.seed+'|'+f+'|'+r)),ri2=(a,b)=>a+Math.floor(rg()*(b-a+1)),pk2=a=>a[Math.floor(rg()*a.length)],Dd=D(),boss=r==5;
 let k=boss?'boss':'fight';if(!boss){if(r==4&&isShopFloor(f))k='shop';else if(r>1)k=wp(rg,['fight','treasure','rest','mine','trapvault','forge','ambush'],[48,9,7,10,7,4,13])}
 rt=k;const out=(k=='fight'||k=='ambush')&&rg()<.4,want=boss||k=='shop'||k=='forge'||k=='rest'?'arena':k=='mine'?'cave':k=='trapvault'||k=='treasure'?'halls':out?'outdoor':wp(rg,['cave','halls','arena'],[4,4,2]);
 es=[];bs=[];ds=[];zs=[];fxs=[];props=[];traps=[];al=[];orbs=[];aurs=[];exitOpen=0;shopS=null;p.mn=null;
 const style=genMap(rg,want,boss);curBi=style=='outdoor'?5+(((f-1)/5|0)%3):((f-1)/5|0)%5;
 p.x=(startI%MW+.5)*T;p.y=((startI/MW|0)+.5)*T;p.dh=0;p.inv=1;p.sw=p.sw2=null;p.kx=p.ky=0;p.stn=0;p.sh=S.aegis?1:0;p.dead=0;
 if(p.hp<=0)p.hp=P.mhp;
 cam.x=cl(p.x-VW/2,0,MW*T-VW);cam.y=cl(p.y-VH/2,0,MH*T-VH);
 const used=new Set([startI,exitI]);
 const wspot=(min,max)=>{const c=[];for(const j of big){if(used.has(j)||fdist[j]<min||(max&&fdist[j]>max))continue;const x=j%MW,y=j/MW|0;let w4=0,f8=0;
   for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]])w4+=map[(y+dy)*MW+x+dx]==1?1:0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++)f8+=walk(map[(y+dy)*MW+x+dx])?1:0;if(w4>=1&&f8>=6)c.push(j)}
  const j=c.length?c[Math.floor(rg()*c.length)]:big[Math.floor(rg()*big.length)];used.add(j);return[(j%MW+.5)*T,((j/MW|0)+.5)*T]};
 const chest=(n,mim)=>{const q=wspot(8),loot=[];for(let i=0;i<n;i++)loot.push(mkItem(rg,f,rg()<.2?1:0));if(rg()<.12)loot.push(mkAb(rollAb(rg,1+Math.floor(f/3)),1));props.push({k:mim?'mchest':'chest',x:q[0],y:q[1],loot,open:0})};
 if(style=='halls')placeDoors(rg);
 let sec=null;if(!boss&&(style=='cave'||style=='halls')&&rg()<.4)sec=placeSecret(rg);
 placeOres(rg,k=='mine'?ri2(8,12):k=='forge'?ri2(3,5):rg()<.35?ri2(1,3):0,style=='outdoor');
 if(sec){props.push({k:'chest',x:sec[0],y:sec[1]-4,loot:[mkItem(rg,f,1),mkItem(rg,f,rg()<.5?1:0),mkItem(rg,f,0)],open:0,sec:1});if(rg()<.5)props.push({k:'shrine',x:sec[0]+18,y:sec[1]+6,used:0})}
 const pool=Object.keys(EN).filter(q=>EN[q].f<=f&&EN[q].w>0),ng=Math.round(Math.min(11,3+f/3)*Dd.en);
 const groups=(n,pl)=>{const cs=[];for(let g=0;g<n;g++){let c=null;for(let t=0;t<40&&!c;t++){const j=big[Math.floor(rg()*big.length)];if(fdist[j]>=(t<25?14:6)&&cs.every(o=>Math.hypot(o[0]-j%MW,o[1]-(j/MW|0))>6))c=[j%MW,j/MW|0]}
   if(!c)continue;cs.push(c);const kk=wp(rg,pl,pl.map(q=>EN[q].w)),d=EN[kk],m=Math.max(1,Math.round(ri2(d.gr[0],d.gr[1])*Dd.en));
   for(let i=0;i<m;i++){let x=c[0],y=c[1];for(let t=0;t<12;t++){const nx=c[0]+ri2(-2,2),ny=c[1]+ri2(-2,2);if(nx>0&&ny>0&&nx<MW-1&&ny<MH-1&&walk(map[ny*MW+nx])){x=nx;y=ny;break}}
    addE(kk,(x+.5)*T,(y+.5)*T,i==0&&f>=2&&rg()<Math.min(.35,.05+.012*f)*Dd.el)}}};
 if(k=='fight'||k=='ambush'){groups(ng,pool);if(f>=2)placeTraps(rg,ri2(0,3),f>=4?ri2(0,2):0,f>=6?ri2(0,2):0);if(k=='ambush'){chest(1,1);if(rg()<.5)chest(1,1);if(rg()<.4)chest(1,0)}else if(rg()<.35)chest(1)}
 else if(k=='mine'){groups(2,pool.filter(q=>EN[q].f<=3&&!EN[q].ab));if(rg()<.3)chest(1)}
 else if(k=='boss')addBoss((MW/2+.5)*T,(MH/2+.5)*T,rg);
 else if(k=='treasure'){const n=ri2(2,3),m=rg()<.25?ri2(0,n-1):-1;for(let i=0;i<n;i++)chest(ri2(1,2),i==m)}
 else if(k=='rest'){const q=wspot(6);props.push({k:'shrine',x:q[0],y:q[1],used:0});if(rg()<.6)chest(1)}
 else if(k=='trapvault'){placeTraps(rg,ri2(9,14),ri2(3,5),f>=3?ri2(2,4):0);const q=wspot(14);props.push({k:'chest',x:q[0],y:q[1],loot:[mkItem(rg,f,1),mkItem(rg,f,1),mkItem(rg,f,0),mkCons(pk2(['haste','rage','iron','regen','focus']),2)].concat(rg()<.4?[mkAb(rollAb(rg,1+Math.floor(f/3)),1)]:[]),open:0})}
 else if(k=='forge'){const a=wspot(3,12);props.push({k:'anvil',x:a[0],y:a[1]});const q=wspot(4);props.push({k:'shrine',x:q[0],y:q[1],used:0})}
 else if(k=='shop'){const q=wspot(3,16),key=f+'.'+r;if(G.shopKey!==key){G.shopKey=key;G.sold=[]}
  props.push({k:'npc',x:q[0],y:q[1],name:pk2(SHN),sp:pk2(['shopA','shopB']),line:pk2(SHL.greet),stock:genStock(rg,f)});const a=wspot(3,16);props.push({k:'anvil',x:a[0],y:a[1]})}
 for(let i=0,n=ri2(6,12);i<n;i++){const q=wspot(3);props.push({k:'deco',x:q[0]+rr(-6,6),y:q[1]+rr(-4,4),s:pk2(curBi>=5?['fungus','bones','barrel']:['crate','barrel','bones','candle','fungus'])})}
 if(!es.length)exitOpen=1;
 spawnPet();flowT=0;scene='play';save()}
function next(){tickEggs();G.room++;if(G.room>5){G.room=1;G.floor++;G.max=Math.max(G.max,G.floor);p.rv=0;toast('Floor '+G.floor+(isShopFloor(G.floor)?' (a shop awaits in room 4)':''))}newRoom()}
// ---- enemies
function eBase(){return{ph:0,pt:0,cdt:rr(.5,2),aw:0,sx:{},kx:0,ky:0,fl:0,fi:ri(0,9),fa:rr(-.9,.9),cw:R()<.5?1:-1,lt:0,los:0,tg:null,tt:0,hr:0,cmb:0,abs:0,afx:[],acd:rr(1,3),wa:null,wx:0,wy:0,wa2:0,wk:'',lx:0,ly:0,lt2:0,dv:0,hd:0,bph:0,armr:0}}
function addE(k,x,y,el){const d=EN[k],f=G.floor,Dd=D(),m=1.2**(f-1),hp=d.hp*m*Dd.eh,e=Object.assign(eBase(),{k,x,y,hp,mh:hp,r:d.r,sp:d.sp,d:d.d*1.13**(f-1)*Dd.ed,s:d.s,xm:d.s,sc:d.sc,el:0,ai:d.ai,at:d.at,rg:d.rg,wu:d.wu,cdn:d.cdn,lg:d.lg||0,sr:d.sr||0,ar:d.ar||1.2,ab:d.ab?d.ab.filter(id=>AB[id].t<=Math.floor(1+f/4)):null,fly:d.fly,gh:k=='wraith',heavy:d.hv,tm:d.tm,nm:d.n,c:MC[k]||'#fff',hrn:d.hr});
 if(e.ab&&!e.ab.length)e.ab=[d.ab[0]];if(el)makeElite(e);es.push(e);return e}
function makeElite(e){e.el=1;e.sc*=1.15;e.r*=1.12;e.hp=e.mh=e.hp*1.8;e.d*=1.25;e.s*=3;e.xm*=3;const a=AFX.slice().sort(()=>R()-.5).slice(0,G.floor>=6?2:1);e.afx=a.map(x=>x[0]);e.nm=a.map(x=>x[1]).join(' ')+' '+e.nm;
 if(e.afx.includes('swift'))e.sp*=1.3;if(e.afx.includes('armored')){e.armr=.35;e.hp=e.mh*=1.4}if(e.afx.includes('shielded'))e.abs=e.mh*.5;
 if(!e.ab&&e.at!='cast'&&R()<.6){const id=pk(EAB.filter(q=>AB[q].t<=Math.floor(1+G.floor/4)));if(id)e.ab=[id]}}
function addBoss(x,y,rg){const b=BOSS[Math.floor(rg()*BOSS.length)],f=G.floor,Dd=D(),hp=420*1.35**(f-1)*Dd.eh;
 es.push(Object.assign(eBase(),{k:'boss',spr:b.sp,boss:1,heavy:1,nm:b.n+' '+BTITLE[Math.floor(rg()*BTITLE.length)],x,y,hp,mh:hp,r:30,sp:b.spd,d:11*1.13**(f-1)*Dd.ed,s:30,xm:30,sc:2.4,ai:b.ai,at:b.at,rg:b.rg,wu:b.wu||.6,cdn:b.cdn||2,lg:b.lg||0,sr:b.sr||0,ar:1.5,ab:b.ab.slice(),cdt:2,aw:1,acd:2,c:b.c}))}
function bossPhase(e){e.bph++;ring(e.x,e.y,180,e.c,.7,5);shk(7);hstop(.1);toast(e.nm+' grows enraged!');e.acd=0;e.ph=0;const kk=Object.keys(EN).filter(k=>EN[k].f<=G.floor&&EN[k].w>0&&!EN[k].ab&&k!='mimic');for(let i=0;i<2+e.bph;i++){const q=lootSpot(e.x,e.y),m=addE(pk(kk),q[0],q[1],0);m.aw=1;part(q[0],q[1],8,e.c,80,.4,3)}}
function wake(e){if(e.aw)return;e.aw=1;for(const o of es)if(!o.aw&&Math.hypot(o.x-e.x,o.y-e.y)<150)o.aw=1}
function flowDir(e){const tx=e.x/T|0,ty=e.y/T|0;let b=fd[ty*MW+tx],bx=0,by=0;if(b<0)return[0,0];
 for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=tx+dx,ny=ty+dy;if(nx<0||ny<0||nx>=MW||ny>=MH)continue;const v=fd[ny*MW+nx];if(v<0||v>=b)continue;if(dx&&dy&&(!walk(map[ty*MW+nx])||!walk(map[ny*MW+tx])))continue;b=v;bx=dx;by=dy}
 if(!bx&&!by)return[0,0];const m=Math.hypot(bx,by);return[bx/m,by/m]}
const frs=()=>[p].concat(al).filter(u=>!u.dead&&(u!==p||!p.dead));
function pickTg(e){let b=p.dead?null:p,bd=p.dead?1e9:Math.hypot(p.x-e.x,p.y-e.y)*.8;for(const a of al){if(a.dead)continue;const d=Math.hypot(a.x-e.x,a.y-e.y);if(d<bd&&d<300){bd=d;b=a}}return b||p}
function startWind(e,t,k){e.ph=1;e.pt=(k=='combo2'?.26:e.wu)*(e.afx.includes('frenzied')&&e.hp<e.mh/2?.7:1)*(hs(e,'chill')?1.25:1);e.wk=k;e.wa2=Math.atan2(t.y-e.y,t.x-e.x);e.wx=t.x+(t===p?p.mvx*.35:0);e.wy=t.y+(t===p?p.mvy*.35:0)}
function eHit(e,fn,d,st,kb){for(const u of frs())if(fn(u)){dmgTo(u,d,e,st);if(kb)shove(u,Math.atan2(u.y-e.y,u.x-e.x),kb)}}
function fireE(e,t){const k=e.wk,a=e.wa2,d=e.d*(hs(e,'rage')?1.35:1)*(hs(e,'weak')?.75:1),sw=e.afx.includes('swift')?.8:1;e.ph=3;e.pt=.3;e.cdt=e.cdn*rr(.85,1.2)*sw;
 const cone=(u,reach,ar)=>{const dx=u.x-e.x,dy=u.y-e.y,dd=Math.hypot(dx,dy);return dd<reach+u.r&&Math.abs(adf(Math.atan2(dy,dx),a))<ar/2&&los(e.x,e.y,u.x,u.y)};
 if(k=='melee'||k=='combo'||k=='combo2'){const reach=e.rg+e.r+e.lg*.4;eHit(e,u=>cone(u,reach,e.ar),d*(k=='combo2'?1.15:1),null,200);fxs.push({ty:'c',x:e.x,y:e.y,a,ar:e.ar,rad:reach,c:'#ff6b5e',t:.18,mt:.18});
  e.lx=Math.cos(a)*e.lg*2.2;e.ly=Math.sin(a)*e.lg*2.2;e.lt2=.14;
  if(k!='melee'){e.cmb++;if(e.cmb<3){e.ph=1;e.pt=.26;e.wk='combo2';e.wa2=Math.atan2(t.y-e.y,t.x-e.x);e.cdt=0;return}e.cmb=0}
  if(e.hrn)e.hr=1;e.ph=2;e.pt=.14}
 else if(k=='slam'){eHit(e,u=>Math.hypot(u.x-e.x,u.y-e.y)<e.sr+u.r,d*1.2,null,420);ring(e.x,e.y,e.sr,'#ffb36a',.4,4);glow(e.x,e.y,e.sr,'#ff9a4a',.3);part(e.x,e.y,e.boss?26:14,'#c8c0b0',e.sr*1.6,.5,3);shk(e.boss?6:3);e.pt=.4}
 else if(k=='dive'||k=='leap'){e.dv=1;e.hd=0;e.lx=Math.cos(a)*e.lg/.22;e.ly=Math.sin(a)*e.lg/.22;e.lt2=.22;e.ph=2;e.pt=.3}
 else if(k=='shoot'){const n=1+(G.floor>=6)+(G.floor>=12),sp=210,lead=Math.hypot(t.x-e.x,t.y-e.y)/sp,aa=Math.atan2(t.y+(t===p?p.mvy:0)*lead*.7-e.y,t.x+(t===p?p.mvx:0)*lead*.7-e.x);
  for(let i=0;i<n;i++)proj(e,e.x,e.y,aa+(i-(n-1)/2)*.16,sp,d,{r:4,k:'arrow',l:3});part(e.x,e.y,4,'#fff',60,.2,2)}
 else if(k=='cast'){const ab=e.wa;cast(e,ab,1,e.wx,e.wy);e.acd=e.boss?ab.cd*(.5/(1+.35*e.bph))+.6:Math.max(e.cdn,ab.cd*.45)*rr(.9,1.3);e.cdt=Math.max(e.cdt,.5)}}
function diveHit(e){if(e.hd)return;for(const u of frs())if(Math.hypot(u.x-e.x,u.y-e.y)<e.r+u.r+3){e.hd=1;dmgTo(u,e.d*(hs(e,'rage')?1.35:1),e,e.k=='spider'?'poison':null);if(e.k=='spider')stat(u,'root',e.d);part(u.x,u.y,6,'#ff6b5e',90,.3,2);break}}
function updE(e,dt){e.fl-=dt;e.lt-=dt;e.cdt-=dt;e.acd-=dt;e.hr-=dt;e.tt-=dt;
 if(e.lt<=0){e.lt=.2;e.los=!p.dead&&los(e.x,e.y,p.x,p.y)}
 tickSt(e,dt);if(e.dead)return;
 if(e.afx.includes('regen'))e.hp=Math.min(e.mh,e.hp+e.mh*.03*dt);
 if(e.kx||e.ky){move(e,e.kx*dt,e.ky*dt);e.kx*=.86;e.ky*=.86;if(Math.abs(e.kx)+Math.abs(e.ky)<8)e.kx=e.ky=0}
 if(hs(e,'freeze')||hs(e,'shock')){if(e.ph==1)e.ph=0;return}
 const dp=Math.hypot(p.x-e.x,p.y-e.y);
 if(!e.aw){if(!p.dead&&((dp<190&&e.los)||dp<80))wake(e);else return}
 if(e.boss){const fr=e.hp/e.mh;if((e.bph<1&&fr<.66)||(e.bph<2&&fr<.33))bossPhase(e)}
 if(e.afx.includes('teleporter')){e.tpt=(e.tpt||3)-dt;if(e.tpt<=0&&e.ph==0){e.tpt=rr(3,5);const q=lootSpot(p.x,p.y);ring(e.x,e.y,24,'#a06bff',.3,2);e.x=q[0];e.y=q[1];ring(e.x,e.y,24,'#a06bff',.3,2)}}
 if(e.tt<=0||!e.tg||e.tg.dead){e.tt=.4;e.tg=pickTg(e)}
 const t=e.tg,dx=t.x-e.x,dy=t.y-e.y,dd=Math.hypot(dx,dy)||1,ux=dx/dd,uy=dy/dd;
 if(e.lt2>0&&e.ph!=0){e.lt2-=dt;move(e,e.lx*dt,e.ly*dt);if(e.dv)diveHit(e)}
 if(e.ph==1){e.pt-=dt;if(e.pt<=0)fireE(e,t);return}
 if(e.ph==2){e.pt-=dt;if(e.pt<=0){e.ph=3;e.pt=.25;e.dv=0}return}
 if(e.ph==3){e.pt-=dt;if(e.pt<=0)e.ph=0;return}
 let mx=0,my=0;const sp=e.sp*(hs(e,'slow')?.4:hs(e,'chill')?.65:1)*(hs(e,'haste')?1.35:1)*(e.afx.includes('frenzied')&&e.hp<e.mh/2?1.3:1);
 if(hs(e,'fear')||e.hr>0){mx=-ux;my=-uy}
 else switch(e.ai){
  case'chase':{if(!e.los&&dd>50&&!t.dead){const f=flowDir(e);mx=f[0];my=f[1]}else{const a=Math.atan2(dy,dx)+e.fa*cl((dd-e.rg*2)/150,0,1);mx=Math.cos(a);my=Math.sin(a)}break}
  case'circle':{const R0=e.rg*1.6;if(!e.los&&dd>60){const f=flowDir(e);mx=f[0];my=f[1]}else if(dd>R0+30){mx=ux;my=uy}else if(dd<R0-30){mx=-ux*.6;my=-uy*.6}else{mx=-uy*e.cw;my=ux*e.cw}break}
  case'kite':{const pr=e.rg*.75;if(dd<pr*.7){mx=-ux;my=-uy}else if(dd>pr*1.1){if(e.los){mx=ux;my=uy}else{const f=flowDir(e);mx=f[0];my=f[1]}}else{mx=-uy*e.cw*.7;my=ux*e.cw*.7}break}
  case'erratic':{const w=Math.sin(gt*5+e.fi);mx=ux-uy*w*.9;my=uy+ux*w*.9;break}
  case'static':if(dd<60){mx=-ux*.5;my=-uy*.5}break}
 if(R()<dt*.3)e.cw*=-1;
 if(e.ab&&e.acd<=0&&e.los&&dd<320&&!t.dead&&(e.at=='cast'||dd>e.rg*1.6)){e.wa=AB[pk(e.ab)];startWind(e,t,'cast');return}
 if(e.cdt<=0&&e.los&&!t.dead){const at=e.at,rch=e.rg+e.r+t.r;
  if((at=='melee'||at=='combo')&&dd<rch+e.lg*.2){e.cmb=0;startWind(e,t,at);return}
  if(at=='slam'&&dd<e.rg+t.r+e.r){startWind(e,t,'slam');return}
  if((at=='dive'||at=='leap')&&dd<e.rg+30&&dd>e.r+t.r+10){startWind(e,t,at);return}
  if(at=='shoot'&&dd<e.rg*1.25){startWind(e,t,'shoot');return}}
 if(dd<e.r+t.r+4&&!hs(e,'fear')){mx=0;my=0}
 for(const o of es)if(o!==e&&!o.dead){const ox=e.x-o.x,oy=e.y-o.y,od=Math.hypot(ox,oy),mn=e.r+o.r-2;if(od<mn&&od>.1){mx+=ox/od*.8;my+=oy/od*.8}}
 if(!hs(e,'root'))move(e,mx*sp*dt,my*sp*dt)}
// ---- loot, kills, chests
function lootSpot(x,y){for(let i=0;i<16;i++){const a=rr(0,6.283),d=rr(14,58),nx=x+Math.cos(a)*d,ny=y+Math.sin(a)*d;
 if(!solid(nx,ny)&&!solid(nx+9,ny)&&!solid(nx-9,ny)&&!solid(nx,ny+9)&&!solid(nx,ny-9)&&los(x,y,nx,ny)&&!ds.some(o=>Math.hypot(o.x-nx,o.y-ny)<18))return[nx,ny]}return[x,y]}
function kill(e){if(e.dead)return;e.dead=1;G.kills++;const f=G.floor,dl=1+(S.drop||0)/100;
 addXP((4+2.5*f)*e.xm*.5);const g=addGold((1+f*.6)*e.s*.3);if(CFG.num)ft(e.x,e.y-e.r-10,'+'+g+'g','#ffd24a');petXp(e.boss?10:1);
 part(e.x,e.y,e.boss?40:12,e.c,130,.6,3);ring(e.x,e.y,e.boss?100:34,'#fff',.3,2);if(e.boss)shk(8);hstop(.05);gain(G.eq.n,1);gain(G.eq.m,1);
 const put=o=>{const q=lootSpot(e.x,e.y);o.x=q[0];o.y=q[1];ds.push(o);if(o.it)disc(o.it)};
 if(R()<.07*dl)put({it:mkCons(f<5?'hp1':f<10?'hp2':'hp3',1)});else if(R()<.02*dl)put({it:mkCons(pk(['haste','rage','iron','regen','focus','luck','cleanse','bomb','treat']),1)});
 if(R()<.055*dl+(e.el?.4:0))put({it:mkItem(R,f,e.el?1:0)});
 if(e.ab&&!e.boss&&R()<(e.el?.3:.045)){const id=pk(e.ab);if(!AB[id].nodrop)put({it:mkAb(id,1)})}
 if(R()<(e.tm?.012:.004)*dl)put({it:mkEgg(0,f)});
 if(e.afx.includes('explosive')){ring(e.x,e.y,70,'#ff9a4a',.4,4);part(e.x,e.y,20,'#ff9a4a',150,.5,3);shk(3);eHit(e,u=>Math.hypot(u.x-e.x,u.y-e.y)<70+u.r,e.d*1.2,'burn',200)}
 if(e.boss){put({it:mkItem(R,f,1)});put({it:mkItem(R,f,1)});put({it:mkCons('hp'+(f<8?2:3),2)});const ids=e.ab.filter(id=>!AB[id].nodrop);put({it:mkAb(R()<.6&&ids.length?pk(ids):rollAb(R,2+Math.floor(f/4)),1)});if(R()<.3)put({it:mkEgg(Math.min(4,1+Math.floor(f/8)),f)})}
 if(R()*100<Math.min(100,S.nova||0)){fxs.push({ty:'r',x:e.x,y:e.y,rad:75,c:'#ff9a3c',w:3,t:.3,mt:.3});for(const o of es)if(!o.dead&&Math.hypot(o.x-e.x,o.y-e.y)<75+o.r)hit(o,P.dm*P.ab*1.5,0,0)}}
function openChest(q){q.open=1;ft(q.x,q.y-24,'Chest!','#fd6');part(q.x,q.y-6,18,'#ffd24a',110,.6,3);glow(q.x,q.y,40,'#ffd24a',.4);const g=addGold(G.floor*7);ft(q.x,q.y-38,'+'+g+' gold','#ffd24a');addXP(8+G.floor*3);
 q.loot.forEach(it=>{const s=lootSpot(q.x,q.y);ds.push({x:s[0],y:s[1],it});disc(it)})}
function interact(){
 for(const d of ds){if(d.x<0||Math.hypot(d.x-p.x,d.y-p.y)>22)continue;
  if(d.it){if(addInv(d.it)){ft(p.x,p.y-20,d.it.nm,RR[d.it.r][1]);if(d.it.sl=='ab')toast('New ability: '+d.it.nm+'. Open your pack to equip it.');d.x=-999;if(typeof rCb=='function')rCb()}else if(gt-(p.pcd||0)>1.5){p.pcd=gt;ft(p.x,p.y-24,'Pack full','#ff8a7a')}}else d.x=-999}
 ds=ds.filter(d=>d.x>-900);
 for(const q of props){const dd=Math.hypot(q.x-p.x,q.y-p.y);
  if(q.k=='chest'&&!q.open&&dd<28)openChest(q);
  else if(q.k=='mchest'&&dd<46){q.dead=1;const e=addE('mimic',q.x,q.y,0);e.aw=1;ft(q.x,q.y-24,'Mimic!','#ff6b5e',1);shk(4);part(q.x,q.y,16,'#96622f',120,.5,3)}
  else if(q.k=='shrine'&&!q.used&&dd<28){q.used=1;heal(P.mhp);for(const id in p.sx)if(STS[id][4])delete p.sx[id];calc();ft(q.x,q.y-24,'Restored','#7fd');ring(q.x,q.y,50,'#7fd8ff',.6,3);part(q.x,q.y,20,'#7fd8ff',90,.8,3);addXP(5+G.floor)}}
 props=props.filter(q=>!q.dead);
 p.ip=null;let bd=52;
 for(const q of props)if(q.k=='npc'||q.k=='anvil'){const d=Math.hypot(q.x-p.x,q.y-p.y);if(d<bd){bd=d;p.ip=q.k=='npc'?{t:'Talk to '+q.name,act:()=>openShop(q)}:{t:'Use the forge',act:()=>openForge()}}}
 if(!p.ip){let b2=50,bi=-1;for(const i of ores.keys()){const d=Math.hypot((i%MW+.5)*T-p.x,((i/MW|0)+.5)*T-p.y);if(d<b2){b2=d;bi=i}}
  if(bi>=0){const o=ORES.find(q=>q[0]==ores.get(bi));p.ip={t:(o[3]>G.pick?'Needs a better pickaxe: ':'Mine ')+o[1]+(o[3]>G.pick?'':' (hold F)'),ore:bi}}}}
function mine(dt){const ip=p.ip;if(!keys.use||!ip||ip.ore==null||p.dead){p.mn=null;return}
 const i=ip.ore,o=ORES.find(q=>q[0]==ores.get(i));if(!o)return;
 if(o[3]>G.pick){if(!p.mn||p.mn.i!=i){p.mn={i,t:0};toast('Your pickaxe is too weak for '+o[1]+'. Upgrade it at a forge.')}return}
 if(!p.mn||p.mn.i!=i)p.mn={i,t:0};p.mn.t+=dt*(1+(S.pickspd||0)/100)*(1+.3*(G.pick-1));
 const x=(i%MW+.5)*T,y=((i/MW|0)+.5)*T;if(R()<dt*24)part(x,y,1,o[2],80,.3,2);
 if(p.mn.t>=1.2){map[i]=0;ores.delete(i);const n=1+Math.floor(S.ore||0)+(R()<.35?1:0);G.mats[o[0]]=(G.mats[o[0]]||0)+n;G.disc.artisan=1;ft(x,y-12,'+'+n+' '+o[1],o[2],1);part(x,y,14,o[2],120,.5,3);addXP(4+G.floor);p.mn=null;shk(1);save()}}
function updTraps(dt){for(const q of traps){q.t+=dt;const dd=Math.hypot(p.x-q.x,p.y-q.y),dm=7*1.13**(G.floor-1)*D().ed;
 if(q.k=='spike'){const c=q.t%3.2;q.ph=c<2?0:c<2.5?1:c<2.9?2:0;if(q.ph==2&&!p.dead&&dd<15)hurt(dm*1.4,null)}
 else if(q.k=='vent'){const c=q.t%4.4;q.ph=c<3?0:c<3.6?1:c<4.1?2:0;if(q.ph==2&&!p.dead&&dd<30)hurt(dm,null,'burn');if(q.ph==2&&R()<dt*30)part(q.x,q.y,1,'#ff9a4a',60,.4,3)}
 else if(q.k=='turret'){q.cd-=dt;if(q.w>0){q.w-=dt;if(q.w<=0){const a=Math.atan2(p.y-q.y,p.x-q.x);proj(q,q.x+q.dx*14,q.y+q.dy*14,a,240,dm*1.2,{r:4,k:'arrow',l:3});q.cd=2.2}}
  else if(q.cd<=0&&!p.dead&&dd<300&&los(q.x+q.dx*18,q.y+q.dy*18,p.x,p.y)){q.w=.35}}}}
function updDoors(){for(const j of doors){const x=(j%MW+.5)*T,y=((j/MW|0)+.5)*T;let o=0;if(Math.hypot(p.x-x,p.y-y)<34)o=1;else for(const e of es)if(!e.dead&&Math.hypot(e.x-x,e.y-y)<30){o=1;break}dopen[j]=o}}
