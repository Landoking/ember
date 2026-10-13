// ---- visual effects
function ft(x,y,s,c,big){fxs.push({ty:'tx',x,y,s,c,big,t:.9,mt:.9})}
function part(x,y,n,c,sp,t,s){for(let i=0;i<n;i++){const a=rr(0,6.283),v=rr(.2,1)*sp;fxs.push({ty:'p',x,y,vx:Math.cos(a)*v,vy:Math.sin(a)*v,c,s:s||2,t:rr(.5,1)*t,mt:t})}}
function spark(x,y,a,n,c){for(let i=0;i<n;i++){const aa=a+rr(-.8,.8),v=rr(90,280);fxs.push({ty:'p',x,y,vx:Math.cos(aa)*v,vy:Math.sin(aa)*v,c,s:2,t:rr(.15,.32),mt:.32})}}
const ring=(x,y,rad,c,t,w)=>fxs.push({ty:'r',x,y,rad,c,w:w||2,t,mt:t});
const glow=(x,y,rad,c,t)=>fxs.push({ty:'g',x,y,rad,c,t,mt:t});
const line=(x1,y1,x2,y2,c,w,t,jag)=>fxs.push({ty:'l',x1,y1,x2,y2,c,w,t,mt:t,jag});
const shk=v=>{shkv=Math.max(shkv,v)},hstop=t=>{hst=Math.max(hst,t)};
function updFx(dt){for(const f of fxs){f.t-=dt;if(f.ty=='tx')f.y-=26*dt;else if(f.ty=='p'){f.x+=f.vx*dt;f.y+=f.vy*dt;f.vx*=.92;f.vy*=.92}}fxs=fxs.filter(f=>f.t>0);if(fxs.length>700)fxs.splice(0,fxs.length-700)}
// ---- helpers
const dmgM=()=>1+(S.rage||0)/100*(1-p.hp/P.mhp);
const abDmg=(a,lv)=>P.ab*a.d*P.dm*(1+(S.ap||0)/100)*(1+(S[a.s]||0)/100)*(1+.08*(lv-1));
function nearE(r){let b=null,bd=r;for(const e of es)if(!e.dead){const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<bd&&los(p.x,p.y,e.x,e.y)){bd=d;b=e}}return b}
function aim(){if(ms.on)return Math.atan2(ms.wy-p.y,ms.wx-p.x);const t=nearE(420);return t?Math.atan2(t.y-p.y,t.x-p.x):p.fa}
function aimPt(){if(ms.on)return[ms.wx,ms.wy];const t=nearE(420);return t?[t.x,t.y]:[p.x+Math.cos(p.fa)*200,p.y+Math.sin(p.fa)*200]}
function mvec(){let x=(keys.d?1:0)-(keys.a?1:0)+jv.x,y=(keys.s?1:0)-(keys.w?1:0)+jv.y;const m=Math.hypot(x,y);if(m>1){x/=m;y/=m}return[x,y]}
function heal(v,q){v*=1+(S.heal||0)/100;p.hp=Math.min(P.mhp,p.hp+v);if(!q)ft(p.x,p.y-22,'+'+Math.round(v),'#7f7')}
function shove(t,an,f){if(t===p){p.kx+=Math.cos(an)*f;p.ky+=Math.sin(an)*f}else if(!t.heavy){t.kx=Math.cos(an)*f;t.ky=Math.sin(an)*f}}
function stat(t,k,d){const pl=t===p;
 if(k=='burn'){t.bu=Math.max(t.bu||0,d*.22*(1+(pl?0:(S.burn||0)/100)));t.bt=3.5;t.bk='burn'}
 else if(k=='poison'){t.bu=Math.max(t.bu||0,d*.18*(1+(pl?0:(S.psn||0)/100)));t.bt=5;t.bk='poison'}
 else if(k=='chill')t.sl=2.5+(pl?0:(S.chill||0)/40);
 else if(k=='shock')t.stn=Math.max(t.stn||0,t.boss?.15:.6)}
// ---- damage
function hit(e,d,kb,a,st,it,nc){if(e.dead)return;let c=0;if(!nc&&R()*100<P.crit){c=1;d*=P.cd}
 e.hp-=d;e.fl=.1;wake(e);if(CFG.num)ft(e.x+rr(-8,8),e.y-e.r-6,Math.round(d),c?'#ffd24a':'#fff',c);
 spark(e.x,e.y,a||0,c?10:5,c?'#ffd24a':'#fff');if(c){shk(3);hstop(.05)}
 if(kb&&!e.heavy){e.kx=Math.cos(a)*kb;e.ky=Math.sin(a)*kb}
 if(S.steal)heal(d*Math.min(30,S.steal)/100,1);if(st)stat(e,st,d);if(it)gain(it,1);if(e.hp<=0)kill(e)}
function hurt(d,src,st){if(p.inv>0||p.dh>0||p.dead)return;
 if(R()*100<P.blk){ft(p.x,p.y-22,'Block','#8cf');p.inv=.3;return}
 if(p.sh){p.sh=0;ft(p.x,p.y-22,'Aegis','#8cf');p.inv=.6;ring(p.x,p.y,30,'#8cf',.3,3);return}
 d*=1-P.arm/100;if(p.abs>0){const a=Math.min(p.abs,d);p.abs-=a;d-=a;ft(p.x,p.y-30,'Barrier','#ffe9a0')}
 p.fl=.12;p.inv=.45;shk(2);if(d>0){p.hp-=d;ft(p.x,p.y-22,Math.round(d),'#ff6b5e')}
 ['h','c','b'].forEach(s=>gain(G.eq[s],1));if(st)stat(p,st,d||1);
 if(src&&S.thorn&&!src.dead)hit(src,d*S.thorn/100,0,0,null,null,1);if(p.hp<=0)fatal()}
function fatal(){if(S.rev&&!p.rv){p.rv=1;p.hp=P.mhp*.5;p.inv=1.5;ft(p.x,p.y-34,'Second Wind','#7f7');ring(p.x,p.y,60,'#7f7',.5,4)}else die()}
function die(){if(p.dead)return;p.dead=1;G.deaths++;const c=Math.floor((G.floor-1)/5)*5+1;G.floor=c;G.room=1;save();showDeath(c)}
// ---- projectiles and zones
function proj(c,x,y,a,sp,d,o){bs.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,d,tm:c===p?'p':'e',r:o.r||5,pi:o.pi||0,l:o.l||2.5,k:o.k||'orb',c:o.c||'#fff',ex:o.ex||0,st:o.st||null,it:o.it||null,h:[]})}
function boom(b){if(b.ex){ring(b.x,b.y,b.ex,b.c,.35,3);glow(b.x,b.y,b.ex,b.c,.3);part(b.x,b.y,16,b.c,160,.45,3);shk(2);
  for(const t of(b.tm=='p'?es:[p])){if(t.dead)continue;if(Math.hypot(t.x-b.x,t.y-b.y)<b.ex+t.r){if(b.tm=='p')hit(t,b.d*.7,160,Math.atan2(t.y-b.y,t.x-b.x),b.st);else hurt(b.d*.7,null,b.st)}}}
 else part(b.x,b.y,5,b.c,80,.25,2)}
function updB(dt){for(const b of bs){const sx=b.vx*dt,sy=b.vy*dt,n=Math.ceil(Math.hypot(sx,sy)/8);let dead=0;
  for(let i=0;i<n&&!dead;i++){b.x+=sx/n;b.y+=sy/n;if(solid(b.x,b.y)){boom(b);dead=1;break}
   if(b.tm=='p'){for(const e of es)if(!e.dead&&!b.h.includes(e)&&Math.hypot(e.x-b.x,e.y-b.y)<e.r+b.r){b.h.push(e);hit(e,b.d,b.ex?0:140,Math.atan2(b.vy,b.vx),b.st,b.it);if(b.ex){boom(b);dead=1;break}if(b.pi>0)b.pi--;else{dead=1;break}}}
   else if(!p.dead&&Math.hypot(p.x-b.x,p.y-b.y)<p.r+b.r){hurt(b.d,null,b.st);boom(b);dead=1}}
  b.l-=dt;if(b.l<=0)dead=1;if(b.k=='orb'&&R()<.7)part(b.x,b.y,1,b.c,24,.3,2);if(dead)b.dead=1}
 bs=bs.filter(b=>!b.dead)}
function strike(pl,t,D,a,an){if(pl){hit(t,D,a.kb?a.kb*(1+(S.kbp||0)/100):0,an,a.st);if(S.sip)heal(D*S.sip/100,1)}else{hurt(D,null,a.st);if(a.kb)shove(p,an,a.kb)}}
function zHit(z){ring(z.x,z.y,z.rad,z.col,.3,3);glow(z.x,z.y,z.rad,z.col,.25);part(z.x,z.y,z.dur?5:28,z.col,z.rad*(z.dur?1:1.4),.5,3);if(!z.dur)shk(z.a.d>5?7:3);
 for(const t of(z.pl?es:[p])){if(t.dead)continue;if(Math.hypot(t.x-z.x,t.y-z.y)<z.rad+t.r)strike(z.pl,t,z.D,z.a,Math.atan2(t.y-z.y,t.x-z.x))}}
function updZ(dt){for(const z of zs){if(z.dl>0){z.dl-=dt;if(z.dl<=0)z.dl=0;continue}
  if(!z.dur){zHit(z);z.dead=1;continue}z.tn-=dt;if(z.tn<=0){z.tn=z.tk;zHit(z)}z.dur-=dt;if(z.dur<=0)z.dead=1}zs=zs.filter(z=>!z.dead)}
// ---- abilities (shared by the player, monsters and bosses)
function cast(c,a,lv,tx,ty){const pl=c===p,an=Math.atan2(ty-c.y,tx-c.x),D=pl?abDmg(a,lv):c.d*a.d*.8,col=SCH[a.s][2],fo=pl?es.filter(e=>!e.dead):(p.dead?[]:[p]);
 if(a.k=='proj'){const n=a.n2||1,sd=a.sd||0;for(let i=0;i<n;i++){const o=n>1?(i-(n-1)/2)*sd:0;proj(c,c.x+Math.cos(an+o)*12,c.y+Math.sin(an+o)*12,an+o,a.sp,D,{r:a.ex?7:5,pi:(a.pr||0)+(pl?Math.floor(S.prc||0):0),ex:a.ex,st:a.st,c:col,k:'orb',l:2.5})}glow(c.x,c.y,26,col,.2)}
 else if(a.k=='nova'){ring(c.x,c.y,a.rad,col,.45,4);glow(c.x,c.y,a.rad,col,.3);part(c.x,c.y,26,col,a.rad*1.6,.5,3);if(pl)shk(2);
  for(const t of fo)if(Math.hypot(t.x-c.x,t.y-c.y)<a.rad+t.r&&los(c.x,c.y,t.x,t.y)){strike(pl,t,D,a,Math.atan2(t.y-c.y,t.x-c.x));if(a.hl&&pl)heal(D*a.hl,1)}
  if(a.hp&&pl)heal(P.mhp*a.hp/100)}
 else if(a.k=='cone'){fxs.push({ty:'c',x:c.x,y:c.y,a:an,ar:a.ar,rad:a.rad,c:col,t:.3,mt:.3});part(c.x+Math.cos(an)*30,c.y+Math.sin(an)*30,18,col,260,.4,3);
  for(const t of fo){const dx=t.x-c.x,dy=t.y-c.y;if(Math.hypot(dx,dy)<a.rad+t.r&&Math.abs(adf(Math.atan2(dy,dx),an))<a.ar/2&&los(c.x,c.y,t.x,t.y))strike(pl,t,D,a,Math.atan2(dy,dx))}}
 else if(a.k=='zone'){const q=aimEnd(c,tx,ty,a.rg||300);zs.push({x:q[0],y:q[1],rad:a.rad,dl:a.dl||0,dl0:a.dl||.01,dur:a.dur||0,tk:a.tk||0,tn:0,D,a,col,pl})}
 else if(a.k=='chain'){let cur={x:c.x,y:c.y};const hitL=[],n=(a.n2||3)+(pl?Math.floor(S.chn||0):0);
  for(let i=0;i<n;i++){let b=null,bd=i?a.rg:a.rg*2.2;for(const t of fo)if(!hitL.includes(t)&&los(cur.x,cur.y,t.x,t.y)){const d=Math.hypot(t.x-cur.x,t.y-cur.y);if(d<bd){bd=d;b=t}}
   if(!b)break;hitL.push(b);line(cur.x,cur.y,b.x,b.y,col,3,.28,1);part(b.x,b.y,6,col,100,.3,2);strike(pl,b,D*(1-i*.08),a,Math.atan2(b.y-cur.y,b.x-cur.x));cur=b}
  if(!hitL.length)line(c.x,c.y,c.x+Math.cos(an)*120,c.y+Math.sin(an)*120,col,2,.2,1)}
 else if(a.k=='ray'){const q=rayEnd(c.x,c.y,c.x+Math.cos(an)*a.rg,c.y+Math.sin(an)*a.rg),ln=Math.hypot(q[0]-c.x,q[1]-c.y);line(c.x,c.y,q[0],q[1],col,a.w,.35);line(c.x,c.y,q[0],q[1],'#fff',a.w/3,.35);shk(2);
  for(const t of fo){const dx=t.x-c.x,dy=t.y-c.y,fw=dx*Math.cos(an)+dy*Math.sin(an),lt=Math.abs(-dx*Math.sin(an)+dy*Math.cos(an));if(fw>0&&fw<ln+t.r&&lt<a.w/2+t.r)strike(pl,t,D,a,an)}part(q[0],q[1],14,col,160,.4,3)}
 else if(a.k=='blink'){const q=aimEnd(c,tx,ty,a.dist);for(let i=0;i<10;i++){const t=i/10;part(c.x+(q[0]-c.x)*t,c.y+(q[1]-c.y)*t,2,col,40,.4,3)}
  if(a.d)for(const t of fo)if(segD(t.x,t.y,c.x,c.y,q[0],q[1])<26+t.r)strike(pl,t,D,a,an);
  c.x=q[0];c.y=q[1];if(pl)p.inv=Math.max(p.inv,.3);glow(c.x,c.y,30,col,.25);ring(c.x,c.y,30,col,.3,2)}
 else if(a.k=='heal'){heal(P.mhp*a.pc/100);ring(p.x,p.y,40,col,.5,3);part(p.x,p.y,16,col,70,.8,3)}
 else if(a.k=='shield'){p.abs=P.mhp*a.pc/100;p.abt=a.dur;ring(p.x,p.y,36,col,.5,3);glow(p.x,p.y,40,col,.4)}
 else if(a.k=='buff'){a.b.forEach(b=>p.bf[b[0]]={v:b[1],t:a.dur});p.aur=a.dur;p.auc=col;calc();ring(p.x,p.y,36,col,.5,3);part(p.x,p.y,18,col,90,.7,3)}
 else if(a.k=='spawn'){for(let i=0;i<3;i++){const q=lootSpot(c.x,c.y),e=addE(pk(['slime','bat']),q[0],q[1]);e.aw=1}ring(c.x,c.y,60,col,.4,3);part(c.x,c.y,20,col,120,.6,3)}}
function useAb(i){const it=G.ab[i];if(!it||p.acd[i]>0||p.stn>0||p.dead)return;const a=AB[it.t],pt=aimPt();
 cast(p,a,it.lv,pt[0],pt[1]);p.acd[i]=p.acm[i]=Math.max(.8,a.cd*(1-Math.min(60,(S.cdr||0)+(S['c'+a.s]||0))/100)*(1-.02*(it.lv-1)));gain(it,2);p.fa=Math.atan2(pt[1]-p.y,pt[0]-p.x)}
// ---- player weapons
function melee(){const it=G.eq.w,wt=it?WT[it.t]:FIST;if(p.ac>0||p.stn>0||p.dead)return;const cd=Math.max(.1,wt.cd/P.as),a=aim();p.ac=cd;p.fa=a;p.sd=-p.sd;
 p.sw={a,t:0,d:Math.min(.3,cd*.85),arc:wt.ar,rc:wt.rc*(1+(S.reach||0)/100),wt,it,dir:p.sd,done:0,col:it?RR[it.r][1]:'#ffffff'}}
function meleeHit(){const w=p.sw,a=w.a,dmg=(8+(S.fdw||0))*w.wt.dm*P.dm*dmgM();let n=0;
 for(const e of es){if(e.dead)continue;const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);if(d>w.rc+e.r)continue;let ok;
  if(w.wt.th){const fw=dx*Math.cos(a)+dy*Math.sin(a),lt=Math.abs(-dx*Math.sin(a)+dy*Math.cos(a));ok=fw>-6&&fw<w.rc+e.r&&lt<16+e.r}
  else ok=Math.abs(adf(Math.atan2(dy,dx),a))<w.arc/2+Math.atan2(e.r,Math.max(d,1));
  if(ok&&los(p.x,p.y,e.x,e.y)){hit(e,dmg,w.wt.kb*(1+(S.kbp||0)/100),Math.atan2(dy,dx),null,w.it);line(e.x-Math.cos(a+1.57)*14,e.y-Math.sin(a+1.57)*14,e.x+Math.cos(a+1.57)*14,e.y+Math.sin(a+1.57)*14,'#fff',3,.12);n++}}
 if(n){shk(w.wt.dm>1.4?3:1.5);if(w.wt.dm>1.4)hstop(.03)}}
function ranged(){const it=G.eq.r;if(p.stn>0||p.dead)return;if(!it){if(p.nr<=0){toast('No ranged weapon equipped. Find a bow or a gun!');p.nr=2}return}
 if(p.rc2>0)return;const wt=WT[it.t];p.rc2=Math.max(.12,wt.cd/(1+(S.rspd||0)/100));
 const a=aim(),n=wt.n2||1,sd=wt.sd||0,d=(8+(S.fdr||0))*wt.dm*P.dm*(1+(S.rdmg||0)/100)*dmgM(),gun=wt.sp>=700;p.fa=a;p.rt=.35;p.rw=it;
 for(let i=0;i<n;i++){const o=n>1?(i/(n-1)-.5)*sd:rr(-.015,.015);proj(p,p.x+Math.cos(a)*14,p.y-4+Math.sin(a)*14,a+o,wt.sp,d,{r:3,pi:wt.pr+Math.floor(S.prc||0),k:gun?'bullet':'arrow',it,l:1,c:gun?'#ffe6a0':'#d8c8a0'})}
 if(gun){const mx=p.x+Math.cos(a)*20,my=p.y-4+Math.sin(a)*20;glow(mx,my,16,'#ffd070',.08);part(mx,my,5,'#ffd070',120,.15,2);p.kx-=Math.cos(a)*70;p.ky-=Math.sin(a)*70;shk(1.2)}}
function dash(){if(p.dc>0||p.dead||p.stn>0)return;p.dc=Math.max(.35,1.4*(1-Math.min(70,S.dcd||0)/100));p.dh=.15;p.did++;const[x,y]=mvec(),m=Math.hypot(x,y);
 if(m>.1){p.dx=x/m;p.dy=y/m}else{p.dx=Math.cos(p.fa);p.dy=Math.sin(p.fa)}p.inv=Math.max(p.inv,.22);ring(p.x,p.y,22,'#bff',.25,2)}
function potion(){if(p.dead||G.pot<1||p.hp>=P.mhp)return;G.pot--;heal(P.mhp*.4)}
