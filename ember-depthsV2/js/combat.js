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
const dmgM=()=>1+(S.berserk||0)/100*(1-p.hp/P.mhp);
const abDmg=(a,lv)=>P.ab*a.d*P.dm*(1+(S.ap||0)/100)*(1+(S[a.s]||0)/100)*(1+.08*(lv-1));
function nearE(r){let b=null,bd=r;for(const e of es)if(!e.dead){const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<bd&&los(p.x,p.y,e.x,e.y)){bd=d;b=e}}return b}
function aim(){if(ms.on)return Math.atan2(ms.wy-p.y,ms.wx-p.x);const t=nearE(420);return t?Math.atan2(t.y-p.y,t.x-p.x):p.fa}
function aimPt(){if(ms.on)return[ms.wx,ms.wy];const t=nearE(420);return t?[t.x,t.y]:[p.x+Math.cos(p.fa)*200,p.y+Math.sin(p.fa)*200]}
function mvec(){let x=(keys.d?1:0)-(keys.a?1:0)+jv.x,y=(keys.s?1:0)-(keys.w?1:0)+jv.y;const m=Math.hypot(x,y);if(m>1){x/=m;y/=m}return[x,y]}
function heal(v,q){v*=1+(S.heal||0)/100;p.hp=Math.min(P.mhp,p.hp+v);if(!q)ft(p.x,p.y-22,'+'+Math.round(v),'#7f7')}
function shove(t,an,f){if(t===p){p.kx+=Math.cos(an)*f;p.ky+=Math.sin(an)*f}else if(!t.heavy){t.kx=Math.cos(an)*f;t.ky=Math.sin(an)*f}}
function landPt(c,q){let x=q[0],y=q[1];const a=Math.atan2(c.y-y,c.x-x);for(let i=0;i<60&&(solid(x,y)||solid(x+6,y)||solid(x-6,y)||solid(x,y+6)||solid(x,y-6));i++){x+=Math.cos(a)*6;y+=Math.sin(a)*6}return[x,y]}
// ---- status effects (shared by the player, monsters and allies)
function addSt(u,id,t,v){if(!u.sx)u.sx={};if(u.boss&&(id=='freeze'||id=='root'||id=='fear'||id=='shock'))t*=.35;
 const o=u.sx[id];if(o){o.t=Math.max(o.t,t);o.mt=Math.max(o.mt,t);if((v||1)>o.v)o.v=v||1}else u.sx[id]={t,mt:t,v:v||1};if(u===p){calc();sxDirty=1}}
const hs=(u,id)=>!!(u.sx&&u.sx[id]&&u.sx[id].t>0);
function dot(u,d,id){if(u===p){if(god)return;p.hp-=d;if(p.hp<=0&&!p.dead)fatal()}else{u.hp-=d;if(u.hp<=0){if(u.k!==undefined)kill(u);else u.dead=1}}if(R()<.06)part(u.x,u.y-4,1,STS[id][2],30,.4,2)}
function tickSt(u,dt){let ch=0;for(const id in u.sx){const s=u.sx[id];s.t-=dt;if(id=='burn'||id=='poison'||id=='bleed')dot(u,s.v*dt,id);if(s.t<=0){delete u.sx[id];ch=1}}
 if(u!==p&&u.cst>0){u.cst-=dt;if(u.cst<=0)u.cs=0}if(ch&&u===p){calc();sxDirty=1}}
function stat(t,k,d){const pl=t===p;d=d||1;
 if(k=='burn')addSt(t,'burn',3.5,d*.22*(1+(pl?0:(S.burn||0)/100)));
 else if(k=='poison')addSt(t,'poison',5,d*.18*(1+(pl?0:(S.psn||0)/100)));
 else if(k=='bleed')addSt(t,'bleed',4,d*.2);
 else if(k=='chill'){addSt(t,'chill',2.5+(pl?0:(S.chill||0)/40),1);if(!pl&&!t.boss){t.cs=(t.cs||0)+1;t.cst=4;if(t.cs>=3){t.cs=0;addSt(t,'freeze',1.6,1);ft(t.x,t.y-t.r-14,'Frozen!','#bfefff');ring(t.x,t.y,26,'#bfefff',.3,3)}}}
 else if(k=='shock')addSt(t,'shock',.6,1);
 else if(k=='root')addSt(t,'root',1.6,1);
 else addSt(t,k,k=='vuln'||k=='weak'?5:3,1)}
// ---- damage
function hit(e,d,kb,a,st,it,nc,fa){if(e.dead||d<=0)return;let c=0;if(!nc&&R()*100<P.crit){c=1;d*=P.cd}
 if(hs(e,'vuln'))d*=1.25;if(hs(e,'freeze'))d*=1.4;d*=1-(e.armr||0);
 if(e.abs>0){const t=Math.min(e.abs,d);e.abs-=t;d-=t;if(d<=0){ft(e.x,e.y-e.r-6,'Absorbed','#8cf');return}}
 e.hp-=d;e.fl=.1;wake(e);if(CFG.num)ft(e.x+rr(-8,8),e.y-e.r-6,Math.round(d),c?'#ffd24a':'#fff',c);
 spark(e.x,e.y,a||0,c?10:5,c?'#ffd24a':'#fff');if(c){shk(3);if(!fa)hstop(.05)}
 if(kb&&!e.heavy){e.kx=Math.cos(a)*kb;e.ky=Math.sin(a)*kb}
 if(!fa&&S.steal)heal(d*Math.min(30,S.steal)/100,1);if(st)stat(e,st,d);if(it)gain(it,1);
 if(e.afx&&e.afx.includes('thorned')&&!fa&&!p.dead)hurt(d*.08,null);
 if(e.hp<=0)kill(e)}
function hurt(d,src,st){if(p.inv>0||p.dh>0||p.dead||god)return;
 if(R()*100<P.blk){ft(p.x,p.y-22,'Block','#8cf');p.inv=.3;return}
 if(p.sh){p.sh=0;ft(p.x,p.y-22,'Aegis','#8cf');p.inv=.6;ring(p.x,p.y,30,'#8cf',.3,3);return}
 d*=1-P.arm/100;if(p.abs>0){const a=Math.min(p.abs,d);p.abs-=a;d-=a;ft(p.x,p.y-30,'Barrier','#ffe9a0')}
 p.fl=.12;p.inv=.45;shk(2);if(d>0){p.hp-=d;ft(p.x,p.y-22,Math.round(d),'#ff6b5e')}
 ['h','c','b','g','k'].forEach(s=>gain(G.eq[s],1));if(st)stat(p,st,d||1);
 if(src&&S.thorn&&!src.dead&&src.k!==undefined)hit(src,d*S.thorn/100,0,0,null,null,1,1);
 if(src&&src.afx&&src.afx.includes('vampiric'))src.hp=Math.min(src.mh,src.hp+d*.4);
 if(p.hp<=0)fatal()}
function hurtAlly(a,d,src){a.hp-=d;a.fl=.1;ft(a.x,a.y-12,Math.round(d),'#ff9a9a');if(src&&src.afx&&src.afx.includes('vampiric'))src.hp=Math.min(src.mh,src.hp+d*.4);if(a.hp<=0){a.dead=1;part(a.x,a.y,10,a.c,80,.5,2);if(a.pet)toast(a.nm+' retreats! It will return next room.')}}
function dmgTo(t,d,src,st){if(src&&hs(src,'weak'))d*=.75;if(t===p)hurt(d,src,st);else{hurtAlly(t,d,src);if(st)stat(t,st,d)}}
function fatal(){if(p.dead)return;if(S.rev&&!p.rv){p.rv=1;p.hp=P.mhp*.5;p.inv=1.5;ft(p.x,p.y-34,'Second Wind','#7f7');ring(p.x,p.y,60,'#7f7',.5,4)}else die()}
function die(){if(p.dead)return;p.dead=1;G.deaths++;const Dd=D();
 if(Dd.pm){G.fell=1;try{localStorage.removeItem('ed.slot'+G.slot)}catch(e){}showDeath(0,1,0);return}
 let c=G.floor,lost=0;
 if(Dd.sb){}else if(G.diff=='easy')G.room=1;else{c=Math.floor((G.floor-1)/5)*5+1;G.floor=c;G.room=1;if(G.diff=='hard'){lost=Math.floor(G.gold*.2);G.gold-=lost}}
 save();showDeath(c,0,lost)}
// ---- projectiles
function proj(c,x,y,a,sp,d,o){bs.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp,d,tm:(c===p||(c&&c.ty))?'p':'e',r:o.r||5,pi:o.pi||0,l:o.l||2.5,k:o.k||'orb',c:o.c||'#fff',ex:o.ex||0,st:o.st||null,it:o.it||null,hm:o.hm||0,zap:o.zap||0,pull:o.pull||0,fa:o.fa||0,nc:o.nc||0,h:[]})}
function boom(b){chkSecret(b.x,b.y,b.ex||8);
 if(b.ex){ring(b.x,b.y,b.ex,b.c,.35,3);glow(b.x,b.y,b.ex,b.c,.3);part(b.x,b.y,16,b.c,160,.45,3);shk(2);
  if(b.pull&&b.tm=='p')for(const t of es)if(!t.dead&&!t.heavy){const d=Math.hypot(t.x-b.x,t.y-b.y);if(d<b.ex*2&&d>4){t.kx=(b.x-t.x)/d*280;t.ky=(b.y-t.y)/d*280}}
  for(const t of(b.tm=='p'?es:frs())){if(t.dead)continue;if(Math.hypot(t.x-b.x,t.y-b.y)<b.ex+t.r){if(b.tm=='p')hit(t,b.d*.7,b.pull?0:160,Math.atan2(t.y-b.y,t.x-b.x),b.st,null,b.nc,b.fa);else dmgTo(t,b.d*.7,null,b.st)}}}
 else part(b.x,b.y,5,b.c,80,.25,2)}
function updB(dt){for(const b of bs){
  if(b.hm){let t=null,bd=260;for(const e of es)if(!e.dead&&!b.h.includes(e)){const d=Math.hypot(e.x-b.x,e.y-b.y);if(d<bd){bd=d;t=e}}if(t){const a=Math.atan2(b.vy,b.vx),ta=Math.atan2(t.y-b.y,t.x-b.x),na=a+cl(adf(ta,a),-5*dt,5*dt),s=Math.hypot(b.vx,b.vy);b.vx=Math.cos(na)*s;b.vy=Math.sin(na)*s}}
  if(b.zap){b.zt=(b.zt||0)-dt;if(b.zt<=0){b.zt=b.zap;let t=null,bd=130;for(const e of es)if(!e.dead){const d=Math.hypot(e.x-b.x,e.y-b.y);if(d<bd&&los(b.x,b.y,e.x,e.y)){bd=d;t=e}}if(t){line(b.x,b.y,t.x,t.y,b.c,2,.2,1);hit(t,b.d*.5,0,0,b.st,null,1,b.fa)}}}
  const sx=b.vx*dt,sy=b.vy*dt,n=Math.ceil(Math.hypot(sx,sy)/8);let dead=0;
  for(let i=0;i<n&&!dead;i++){b.x+=sx/n;b.y+=sy/n;if(blocks(b.x,b.y)){boom(b);dead=1;break}
   if(b.tm=='p'){for(const e of es)if(!e.dead&&!b.h.includes(e)&&Math.hypot(e.x-b.x,e.y-b.y)<e.r+b.r){b.h.push(e);hit(e,b.d,b.ex?0:140,Math.atan2(b.vy,b.vx),b.st,b.it,b.nc,b.fa);if(b.ex){boom(b);dead=1;break}if(b.pi>0)b.pi--;else{dead=1;break}}}
   else for(const u of frs())if(Math.hypot(u.x-b.x,u.y-b.y)<u.r+b.r){dmgTo(u,b.d,null,b.st);boom(b);dead=1;break}}
  b.l-=dt;if(b.l<=0){if(b.ex)boom(b);dead=1}if((b.k=='orb')&&R()<.7)part(b.x,b.y,1,b.c,24,.3,2);if(dead)b.dead=1}
 bs=bs.filter(b=>!b.dead)}
// ---- strikes, zones, orbits, auras
function strike(pl,t,D,a,an){
 if(D<=0){if(a.st)stat(t,a.st,1);if(a.st2)stat(t,a.st2,1);return}
 if(pl){hit(t,D,a.kb?a.kb*(1+(S.kbp||0)/100):0,an,a.st);if(a.st2)stat(t,a.st2,D);if(S.sip)heal(D*S.sip/100,1);if(a.hl)heal(D*a.hl,1)}
 else{dmgTo(t,D,null,a.st);if(a.st2)stat(t,a.st2,D);if(a.kb)shove(t,an,a.kb)}}
function zHit(z){ring(z.x,z.y,z.rad,z.col,.3,3);glow(z.x,z.y,z.rad,z.col,.25);part(z.x,z.y,z.dur?5:(z.sm?10:28),z.col,z.rad*(z.dur?1:1.4),.5,3);if(!z.dur&&!z.sm)shk(z.a.d>5?7:3);if(z.pl)chkSecret(z.x,z.y,z.rad);
 for(const t of(z.pl?es:frs())){if(t.dead)continue;if(Math.hypot(t.x-z.x,t.y-z.y)<z.rad+t.r)strike(z.pl,t,z.D,z.a,Math.atan2(t.y-z.y,t.x-z.x))}
 if(z.a.heal&&z.pl&&Math.hypot(p.x-z.x,p.y-z.y)<z.rad)heal(P.mhp*z.a.heal/100,1)}
function updZ(dt){for(const z of zs){
  if(z.trap){z.life-=dt;if(z.arm>0){z.arm-=dt;continue}if(z.life<=0){z.dead=1;continue}for(const e of es)if(!e.dead&&Math.hypot(e.x-z.x,e.y-z.y)<z.rad*.7){zHit(z);z.dead=1;break}continue}
  if(z.dl>0){z.dl-=dt;if(z.dl<=0)z.dl=0;continue}
  if(!z.dur){zHit(z);z.dead=1;continue}
  z.tn-=dt;if(z.tn<=0){z.tn=z.tk;if(z.rain){const a=rr(0,6.28),d=rr(0,z.rad*.9);zHit(Object.assign({},z,{x:z.x+Math.cos(a)*d,y:z.y+Math.sin(a)*d,rad:z.rad*.4,dur:0,sm:1}))}else zHit(z)}
  if(z.pull)for(const e of es)if(!e.dead&&!e.heavy){const dx=z.x-e.x,dy=z.y-e.y,d=Math.hypot(dx,dy);if(d<z.rad+40&&d>6)move(e,dx/d*z.pull*dt,dy/d*z.pull*dt)}
  z.dur-=dt;if(z.dur<=0)z.dead=1}
 zs=zs.filter(z=>!z.dead)}
function updOrbs(dt){for(const o of orbs){o.t-=dt;o.ang+=dt*3.2;o.ps=[];for(let i=0;i<o.n;i++){const a=o.ang+i*6.283/o.n,x=p.x+Math.cos(a)*o.rad,y=p.y-6+Math.sin(a)*o.rad;o.ps.push([x,y]);if(R()<dt*18)part(x,y,1,o.col,20,.3,2);
  for(const e of es){if(e.dead)continue;if(Math.hypot(e.x-x,e.y-y)<e.r+9&&(o.cd.get(e)||0)<gt){o.cd.set(e,gt+.5);strike(1,e,o.d,o.a,a+1.57)}}}}orbs=orbs.filter(o=>o.t>0)}
function updAur(dt){for(const u of aurs){u.t-=dt;u.tn-=dt;if(u.tn<=0){u.tn=u.a.tk;for(const e of es)if(!e.dead&&Math.hypot(e.x-p.x,e.y-p.y)<u.a.rad+e.r)strike(1,e,u.D,u.a,Math.atan2(e.y-p.y,e.x-p.x));ring(p.x,p.y,u.a.rad,u.col,.4,2)}}aurs=aurs.filter(u=>u.t>0)}
// ---- abilities (shared by the player, monsters and bosses)
function cast(c,a,lv,tx,ty){const pl=c===p,an=Math.atan2(ty-c.y,tx-c.x),D=pl?abDmg(a,lv):c.d*a.d*.8,col=SCH[a.s][2],fo=()=>pl?es.filter(e=>!e.dead):frs();
 switch(a.k){
 case'proj':{const n=a.n2||1,sd=a.sd||0;for(let i=0;i<n;i++){const o=n>1?(i-(n-1)/2)*sd:0;proj(c,c.x+Math.cos(an+o)*12,c.y+Math.sin(an+o)*12,an+o,a.sp,D,{r:a.r||(a.ex?7:5),pi:(a.pr||0)+(pl?Math.floor(S.prc||0):0),ex:a.ex,st:a.st,c:col,k:'orb',l:a.l||2.5,hm:a.hm,zap:a.zap,pull:a.pull})}glow(c.x,c.y,26,col,.2);break}
 case'nova':{ring(c.x,c.y,a.rad,col,.45,4);glow(c.x,c.y,a.rad,col,.3);part(c.x,c.y,26,col,a.rad*1.6,.5,3);if(pl){shk(2);chkSecret(c.x,c.y,a.rad)}
  for(const t of fo())if(Math.hypot(t.x-c.x,t.y-c.y)<a.rad+t.r&&los(c.x,c.y,t.x,t.y))strike(pl,t,D,a,Math.atan2(t.y-c.y,t.x-c.x));if(a.hp&&pl)heal(P.mhp*a.hp/100);break}
 case'cone':{fxs.push({ty:'c',x:c.x,y:c.y,a:an,ar:a.ar,rad:a.rad,c:col,t:.3,mt:.3});part(c.x+Math.cos(an)*30,c.y+Math.sin(an)*30,18,col,260,.4,3);if(pl)chkSecret(c.x+Math.cos(an)*40,c.y+Math.sin(an)*40,40);
  for(const t of fo()){const dx=t.x-c.x,dy=t.y-c.y;if(Math.hypot(dx,dy)<a.rad+t.r&&Math.abs(adf(Math.atan2(dy,dx),an))<a.ar/2&&los(c.x,c.y,t.x,t.y))strike(pl,t,D,a,Math.atan2(dy,dx))}break}
 case'zone':{const q=a.self?[c.x,c.y]:aimEnd(c,tx,ty,a.rg||300);zs.push({x:q[0],y:q[1],rad:a.rad,dl:a.dl||0,dl0:a.dl||.01,dur:a.dur||0,tk:a.tk||0,tn:0,D,a,col,pl,rain:a.rain,pull:a.pull});break}
 case'chain':{let cur={x:c.x,y:c.y};const hl=[],n=(a.n2||3)+(pl?Math.floor(S.chn||0):0);
  for(let i=0;i<n;i++){let b=null,bd=i?a.rg:a.rg*2.2;for(const t of fo())if(!hl.includes(t)&&los(cur.x,cur.y,t.x,t.y)){const d=Math.hypot(t.x-cur.x,t.y-cur.y);if(d<bd){bd=d;b=t}}
   if(!b)break;hl.push(b);line(cur.x,cur.y,b.x,b.y,col,3,.28,1);part(b.x,b.y,6,col,100,.3,2);strike(pl,b,D*(1-i*.08),a,Math.atan2(b.y-cur.y,b.x-cur.x));cur=b}
  if(!hl.length)line(c.x,c.y,c.x+Math.cos(an)*120,c.y+Math.sin(an)*120,col,2,.2,1);break}
 case'ray':{const q=rayEnd(c.x,c.y,c.x+Math.cos(an)*a.rg,c.y+Math.sin(an)*a.rg),ln=Math.hypot(q[0]-c.x,q[1]-c.y);line(c.x,c.y,q[0],q[1],col,a.w,.35);line(c.x,c.y,q[0],q[1],'#fff',a.w/3,.35);shk(2);if(pl)chkSecret(q[0],q[1],10);
  for(const t of fo()){const dx=t.x-c.x,dy=t.y-c.y,fw=dx*Math.cos(an)+dy*Math.sin(an),lt=Math.abs(-dx*Math.sin(an)+dy*Math.cos(an));if(fw>0&&fw<ln+t.r&&lt<a.w/2+t.r)strike(pl,t,D,a,an)}part(q[0],q[1],14,col,160,.4,3);break}
 case'blink':{const q=landPt(c,aimEnd(c,tx,ty,a.dist));for(let i=0;i<10;i++){const t=i/10;part(c.x+(q[0]-c.x)*t,c.y+(q[1]-c.y)*t,2,col,40,.4,3)}
  if(a.d&&!a.land)for(const t of fo())if(segD(t.x,t.y,c.x,c.y,q[0],q[1])<26+t.r)strike(pl,t,D,a,an);
  c.x=q[0];c.y=q[1];if(pl)p.inv=Math.max(p.inv,.3);glow(c.x,c.y,30,col,.25);ring(c.x,c.y,30,col,.3,2);
  if(a.land){ring(c.x,c.y,a.land,col,.4,4);shk(4);for(const t of fo())if(Math.hypot(t.x-c.x,t.y-c.y)<a.land+t.r)strike(pl,t,D,a,Math.atan2(t.y-c.y,t.x-c.x))}break}
 case'heal':{heal(P.mhp*a.pc/100);ring(p.x,p.y,40,col,.5,3);part(p.x,p.y,16,col,70,.8,3);break}
 case'shield':{p.abs=P.mhp*a.pc/100;p.abt=a.dur;ring(p.x,p.y,36,col,.5,3);glow(p.x,p.y,40,col,.4);break}
 case'buff':{(a.sx||[]).forEach(s=>addSt(c,s[0],s[1],s[2]));ring(c.x,c.y,36,col,.5,3);part(c.x,c.y,18,col,90,.7,3);break}
 case'orbit':{orbs.push({n:a.n2,t:a.dur,rad:a.rad,d:D,a,ang:0,cd:new Map(),col,ps:[]});if(a.sx)a.sx.forEach(s=>addSt(p,s[0],s[1],s[2]));break}
 case'trap':{const q=aimEnd(c,tx,ty,260);zs.push({x:q[0],y:q[1],rad:a.rad,trap:1,arm:.6,life:a.dur,D,a,col,pl:1,dl:0,dur:0});break}
 case'wall':{const n=Math.floor(a.len/28);for(let i=1;i<=n;i++){const x=c.x+Math.cos(an)*(30+i*28),y=c.y+Math.sin(an)*(30+i*28);if(blocks(x,y))break;zs.push({x,y,rad:26,dl:i*.03,dl0:.3,dur:a.dur,tk:a.tk,tn:0,D,a,col,pl,sm:1})}break}
 case'aura':{aurs.push({a,D,t:a.dur,tn:0,col});ring(p.x,p.y,a.rad,col,.5,3);break}
 case'ally':{summon(a,lv);ring(c.x,c.y,60,col,.4,3);part(c.x,c.y,20,col,120,.6,3);break}
 case'totem':{const q=landPt(c,aimEnd(c,tx,ty,a.rg||200));spawnAlly(a.ty,q[0],q[1],a.dur,1+.08*(lv-1));ring(q[0],q[1],40,col,.4,3);part(q[0],q[1],16,col,100,.5,3);break}
 case'spawn':{for(let i=0;i<(a.n2||2);i++){const q=lootSpot(c.x,c.y),e=addE(pk(a.mob),q[0],q[1],0);e.aw=1;part(q[0],q[1],8,col,80,.4,3)}ring(c.x,c.y,60,col,.4,3);break}}}
function useAb(i){const it=G.ab[i];if(!it||(p.acd[i]>0&&!nocd)||p.stn>0||p.dead)return;const a=AB[it.t],pt=aimPt();
 if(a.hc){const c=P.mhp*a.hc/100;if(p.hp<=c+1){toast('Not enough health to pay the blood cost');return}p.hp-=c;ft(p.x,p.y-26,'-'+Math.round(c),'#d63b52')}
 cast(p,a,it.lv,pt[0],pt[1]);p.acd[i]=p.acm[i]=nocd?0:Math.max(.8,a.cd*(1-Math.min(60,(S.cdr||0)+(S['c'+a.s]||0))/100)*(1-.02*(it.lv-1)));gain(it,2);p.fa=Math.atan2(pt[1]-p.y,pt[0]-p.x)}
// ---- allies: summons and pets
function spawnAlly(ty,x,y,dur,pw,pet){const d=AL[ty],f=G.floor,lvm=pet?1+.1*(pet.lv-1):1,rm=pet?RR[pet.r][2]:1;
 const mh=d.hp*(1+.12*(f-1))*(1+(S.sumh||0)/100)*lvm*rm*(pet?1+(S.peth||0)/100:1),
  dm=P.ab*d.dm*P.dm*(1+(S.ap||0)/100)*(1+(S.summon||0)/100)*(1+(S.sumd||0)/100)*(pet?(1+(S.petd||0)/100)*lvm*rm:(pw||1));
 const a={ty,x,y,r:d.r,hp:mh,mh,dm,spd:d.spd,rg:d.rg,cdn:d.cd,cd:rr(0,.5),ai:d.ai,sp:d.sp,sc:d.sc,c:d.c,gh:d.gh,pj:d.pj,st:d.st,slam:d.slam,life:dur==null?null:dur,pet:pet||null,sx:{},fl:0,kx:0,ky:0,fi:ri(0,9),nm:d.n,dead:0};al.push(a);return a}
function summon(a,lv){const pw=1+.08*(lv-1),add=a.n2||1,n=al.filter(q=>!q.pet&&!q.dead);while(n.length+add>P.ms&&n.length){const o=n.shift();o.dead=1;part(o.x,o.y,8,o.c,60,.4,2)}
 for(let i=0;i<add;i++){const q=lootSpot(p.x,p.y);spawnAlly(a.ty,q[0],q[1],a.dur*(1+(S.sumh||0)/200),pw)}}
function spawnPet(){if(G.pet){const q=lootSpot(p.x,p.y);spawnAlly(G.pet.t,q[0],q[1],null,1,G.pet)}}
function mvTo(o,x,y,s){const dx=x-o.x,dy=y-o.y,d=Math.hypot(dx,dy)||1;if(d>3)move(o,dx/d*Math.min(s,d),dy/d*Math.min(s,d))}
function followP(a,dt){const d=Math.hypot(p.x-a.x,p.y-a.y);if(d>(a.pet?60:80))mvTo(a,p.x,p.y,a.spd*dt*(d>200?1.6:1))}
function updAl(dt){for(const a of al){if(a.dead)continue;a.fl-=dt;a.cd-=dt;tickSt(a,dt);if(a.dead)continue;
  if(a.life!=null){a.life-=dt;if(a.life<=0){a.dead=1;part(a.x,a.y,10,a.c,70,.5,2);continue}}
  if(hs(a,'freeze')||hs(a,'shock'))continue;
  if(a.kx||a.ky){move(a,a.kx*dt,a.ky*dt);a.kx*=.86;a.ky*=.86}
  if(Math.hypot(p.x-a.x,p.y-a.y)>420){a.x=p.x+rr(-20,20);a.y=p.y+rr(-20,20)}
  if(a.ai=='heal'){if(a.cd<=0&&p.hp<P.mhp*.85&&!p.dead){a.cd=a.cdn;heal(P.mhp*.12);ring(p.x,p.y,24,a.c,.4,2);part(p.x,p.y,10,a.c,60,.5,2)}followP(a,dt);continue}
  const rng=a.ai=='ranged'||a.ai=='turret'||a.ai=='zap';let t=null,bd=rng?a.rg:240;
  for(const e of es){if(e.dead)continue;const d=Math.hypot(e.x-a.x,e.y-a.y);if(d<bd&&(los(a.x,a.y,e.x,e.y)||(a.ai=='melee'&&d<80))){bd=d;t=e}}
  if(a.ai=='melee'){if(t){const rc=a.r+t.r+a.rg*.5;if(bd>rc)mvTo(a,t.x,t.y,a.spd*dt);else if(a.cd<=0){a.cd=a.cdn;const an=Math.atan2(t.y-a.y,t.x-a.x);
    if(a.slam){ring(a.x,a.y,60,a.c,.3,3);shk(1.5);for(const e of es)if(!e.dead&&Math.hypot(e.x-a.x,e.y-a.y)<60+e.r)hit(e,a.dm,200,Math.atan2(e.y-a.y,e.x-a.x),a.st,null,1,1)}
    else{hit(t,a.dm,160,an,a.st,null,1,1);line(t.x-Math.cos(an+1.57)*10,t.y-Math.sin(an+1.57)*10,t.x+Math.cos(an+1.57)*10,t.y+Math.sin(an+1.57)*10,'#fff',2,.1)}}}else followP(a,dt)}
  else if(a.ai=='ranged'){if(t){const an=Math.atan2(t.y-a.y,t.x-a.x);if(bd<a.rg*.5)mvTo(a,a.x-Math.cos(an)*50,a.y-Math.sin(an)*50,a.spd*dt);if(a.cd<=0){a.cd=a.cdn;proj(a,a.x,a.y,an,300,a.dm,{r:a.pj=='arrow'?3:5,k:a.pj||'orb',c:a.c,st:a.st,fa:1,nc:1,l:1.6})}}else followP(a,dt)}
  else if(a.ai=='turret'){if(t&&a.cd<=0){a.cd=a.cdn;proj(a,a.x,a.y,Math.atan2(t.y-a.y,t.x-a.x),320,a.dm,{r:5,k:'orb',c:a.c,st:a.st,fa:1,nc:1,l:1.6})}}
  else if(a.ai=='zap'){if(t&&a.cd<=0){a.cd=a.cdn;line(a.x,a.y-8,t.x,t.y,a.c,3,.2,1);hit(t,a.dm,0,0,'shock',null,1,1)}}}
 al=al.filter(a=>!a.dead)}
// ---- player weapons
function swing(o){const slot=o?'o':'w',it=G.eq[slot],wt=it?WT[it.t]:FIST;if(o&&(!it||wt.sl!='w'))return false;const k=o?'ac2':'ac';if(p[k]>0||p.stn>0||p.dead)return false;
 const cd=Math.max(.1,wt.cd/P.as);p[k]=cd;const a=aim();p.fa=a;
 const sw={a,t:0,d:Math.min(.3,cd*.85),arc:wt.ar,rc:wt.rc*(1+(S.reach||0)/100),wt,it,dir:o?-p.sd:p.sd,done:0,col:it?RR[it.r][1]:'#ffffff',o};
 if(o)p.sw2=sw;else{p.sd=-p.sd;p.sw=sw}return true}
function melee(){if(swing(false)&&S.twin&&G.eq.o&&WT[G.eq.o.t].sl=='w')p.tw=.12}
function offhand(){const it=G.eq.o;if(!it)return;if(it.sl=='r')ranged();else swing(true)}
function meleeHit(w){const a=w.a,dmg=(8+(w.o?(S.fdo||0):(S.fdw||0)))*w.wt.dm*P.dm*dmgM()*(w.o?.65*(1+(S.dual||0)/100):1);let n=0;
 for(let d=16;d<=w.rc;d+=16)chkSecret(p.x+Math.cos(a)*d,p.y+Math.sin(a)*d,10);
 for(const e of es){if(e.dead)continue;const dx=e.x-p.x,dy=e.y-p.y,d=Math.hypot(dx,dy);if(d>w.rc+e.r)continue;let ok;
  if(w.wt.th){const fw=dx*Math.cos(a)+dy*Math.sin(a),lt=Math.abs(-dx*Math.sin(a)+dy*Math.cos(a));ok=fw>-6&&fw<w.rc+e.r&&lt<16+e.r}
  else ok=Math.abs(adf(Math.atan2(dy,dx),a))<w.arc/2+Math.atan2(e.r,Math.max(d,1));
  if(ok&&los(p.x,p.y,e.x,e.y)){hit(e,dmg,w.wt.kb*(1+(S.kbp||0)/100),Math.atan2(dy,dx),null,w.it);line(e.x-Math.cos(a+1.57)*14,e.y-Math.sin(a+1.57)*14,e.x+Math.cos(a+1.57)*14,e.y+Math.sin(a+1.57)*14,'#fff',3,.12);n++}}
 if(n){shk(w.wt.dm>1.4?3:1.5);if(w.wt.dm>1.4)hstop(.03)}}
function ranged(){const it=G.eq.o;if(!it||it.sl!='r'||p.stn>0||p.dead)return;if(p.rc2>0)return;const wt=WT[it.t];p.rc2=Math.max(.12,wt.cd/(1+(S.rspd||0)/100));
 const a=aim(),n=wt.n2||1,sd=wt.sd||0,d=(8+(S.fdr||0))*wt.dm*P.dm*(1+(S.rdmg||0)/100)*dmgM()*(1+(S.dual||0)/200),gun=wt.sp>=700;p.fa=a;p.rt=.35;p.rw=it;
 for(let i=0;i<n;i++){const o=n>1?(i/(n-1)-.5)*sd:rr(-.015,.015);proj(p,p.x+Math.cos(a)*14,p.y-4+Math.sin(a)*14,a+o,wt.sp,d,{r:wt.mg?4:3,pi:wt.pr+Math.floor(S.prc||0),k:wt.mg?'orb':gun?'bullet':'arrow',it,l:1,c:wt.mg?'#9bd4ff':gun?'#ffe6a0':'#d8c8a0'})}
 if(gun){const mx=p.x+Math.cos(a)*20,my=p.y-4+Math.sin(a)*20;glow(mx,my,16,'#ffd070',.08);part(mx,my,5,'#ffd070',120,.15,2);p.kx-=Math.cos(a)*70;p.ky-=Math.sin(a)*70;shk(1.2)}}
function dash(){if(p.dc>0||p.dead||p.stn>0||hs(p,'root'))return;p.dc=Math.max(.35,1.4*(1-Math.min(70,S.dcd||0)/100));p.dh=.15;p.did++;const[x,y]=mvec(),m=Math.hypot(x,y);
 if(m>.1){p.dx=x/m;p.dy=y/m}else{p.dx=Math.cos(p.fa);p.dy=Math.sin(p.fa)}p.inv=Math.max(p.inv,.22);ring(p.x,p.y,22,'#bff',.25,2)}
// ---- consumables (Z X C V)
function useCons(i){const it=G.cs[i];if(!it||p.dead||p.stn>0)return;const f=CONS[it.t].fx;let used=1;
 if(f[0]=='heal'){if(p.hp>=P.mhp-1){toast('Already at full health');return}heal(P.mhp*f[1]/100);part(p.x,p.y,10,'#f77',60,.5,2)}
 else if(f[0]=='st'){addSt(p,f[1],f[2],f[3]);ring(p.x,p.y,30,STS[f[1]][2],.4,3)}
 else if(f[0]=='cleanse'){for(const id in p.sx)if(STS[id][4])delete p.sx[id];calc();sxDirty=1;heal(P.mhp*.15)}
 else if(f[0]=='bomb'){const pt=aimPt(),q=aimEnd(p,pt[0],pt[1],230);cast(p,AB.bombx,1,q[0],q[1])}
 else if(f[0]=='mirror'){used=0;openMirror(i)}
 else if(f[0]=='tame'){let b=null,bd=150;for(const e of es)if(!e.dead&&e.tm&&e.hp<e.mh*.5){const d=Math.hypot(e.x-p.x,e.y-p.y);if(d<bd){bd=d;b=e}}
  if(!b){toast('No weakened beast nearby (they must be below half health).');return}
  const pet=mkPet(b.tm,b.el?1:0,G.floor);
  if(!G.pet){G.pet=pet;b.dead=1;spawnPet();toast('You tamed a '+pet.nm+'!')}else if(addInv(pet)){b.dead=1;toast('You tamed a '+pet.nm+'! It is in your pack.')}else{toast('Your pack is full.');return}
  part(b.x,b.y,16,'#ffb6e6',100,.6,3);ring(b.x,b.y,30,'#ffb6e6',.5,3);disc(pet);calc()}
 if(used){it.n--;if(it.n<=0)G.cs[i]=null;rCb()}}
