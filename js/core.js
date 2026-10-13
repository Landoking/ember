const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const cv=$('#cv'),cx=cv.getContext('2d'),VW=640,VH=384,T=32,MW=48,MH=32;
cv.width=VW;cv.height=VH;
const R=Math.random,rr=(a,b)=>a+R()*(b-a),ri=(a,b)=>Math.floor(rr(a,b+1)),pk=a=>a[Math.floor(R()*a.length)],cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const adf=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b)),esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';');
function rgba(h,a){const n=parseInt(h.slice(1),16);return`rgba(${n>>16&255},${n>>8&255},${n&255},${a})`}
function dkc(h,f){const n=parseInt(h.slice(1),16);return`rgb(${Math.min(255,(n>>16&255)*f)|0},${Math.min(255,(n>>8&255)*f)|0},${Math.min(255,(n&255)*f)|0})`}
let bad=0;function fail(m){if(bad)return;bad=1;document.body.insertAdjacentHTML('beforeend','<div style="position:fixed;inset:0;background:#2a0a10;color:#ffd8d8;padding:24px;z-index:99;font:15px system-ui">'+esc(m)+'</div>')}
addEventListener('error',e=>fail('Script error: '+e.message+' ('+String(e.filename||'').split('/').pop()+':'+e.lineno+')'));
// seeded PRNG (mulberry32 over a string hash): every room is a pure function of seed + floor + room
function hsh(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^h>>>16)>>>0}
function mb(a){return()=>{a=a+1831565813|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
// state
let G=null,S={},P={mhp:100,dm:1,crit:5,cd:1.5,spd:125,as:1,arm:0,blk:0,ab:12};
const p={x:0,y:0,r:10,hp:100,fa:0,ac:0,rc2:0,dc:0,inv:0,dh:0,rv:0,sh:0,dead:0,did:0,dx:0,dy:0,sw:null,acd:[0,0,0,0],acm:[1,1,1,1],bf:{},kx:0,ky:0,abs:0,abt:0,sl:0,stn:0,bt:0,bu:0,sd:1,fl:0,mvx:0,mvy:0,nr:0,rt:0,aur:0};
let es=[],bs=[],ds=[],zs=[],fxs=[],props=[],map=new Uint8Array(MW*MH).fill(1),fd=new Int16Array(MW*MH),fdist=new Int16Array(MW*MH),big=[],scene='menu',gt=0,hst=0,shkv=0,rt='fight',exitI=0,exitOpen=0,flowT=0;
const cam={x:0,y:0},keys={},jv={x:0,y:0},ms={x:0,y:0,wx:0,wy:0,on:0};
// assets
const IM={},FL={},HCV={},SHT=['hero','mobs','bosses','items','tiles'];let nl=0;
function loadAssets(done){SHT.forEach(n=>{const i=new Image();i.onload=()=>{if(++nl==SHT.length)done()};i.onerror=()=>fail('Could not load sprites/'+n+'.png. Keep the sprites folder next to index.html.');i.src='sprites/'+n+'.png';IM[n]=i})}
const mkc=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
function flashOf(img){const c=mkc(img.width,img.height),x=c.getContext('2d');x.drawImage(img,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(255,255,255,.85)';x.fillRect(0,0,c.width,c.height);return c}
function spr(sh,nm,f,x,y,sc,flip,fl){const a=ATLAS[sh][nm],w=a[2],h=a[3],im=fl?(FL[sh]||(FL[sh]=flashOf(IM[sh]))):IM[sh];
 cx.save();cx.translate(Math.round(x),Math.round(y));if(flip)cx.scale(-1,1);cx.drawImage(im,a[0]+(f%a[4])*w,a[1],w,h,-w*sc/2,-h*sc*.62,w*sc,h*sc);cx.restore()}
function tintL(row,col,color){const c=mkc(16,20),x=c.getContext('2d'),sx=col*16,sy=row*20;x.drawImage(IM.hero,sx,sy,16,20,0,0,16,20);
 if(color){x.globalCompositeOperation='multiply';x.fillStyle=color;x.fillRect(0,0,16,20);x.globalCompositeOperation='destination-in';x.drawImage(IM.hero,sx,sy,16,20,0,0,16,20)}return c}
function heroC(ch,dir,f){const k=[ch.rc,ch.cl,ch.sk,ch.hs,ch.hc,ch.oc,dir,f].join();if(HCV[k])return HCV[k];
 const rw=ATLAS.hero.rows,col=dir*2+f,c=mkc(16,20),x=c.getContext('2d'),sk=SKIN[ch.sk],hc=HAIRC[ch.hc],oc=OUTC[ch.oc],L=(n,t)=>x.drawImage(tintL(rw[n],col,t),0,0);
 L('legs',dkc(oc,.6));L('body',sk);L('cloth',oc);if(ch.rc=='elf')L('ears',sk);if(ch.rc=='dwarf')L('beard',hc);if(ch.rc=='orc')L('tusks',null);L('hair'+ch.hs,hc);L('cls'+CLS_IDX[ch.cl],dkc(oc,1.2));L('eyes',null);
 const o=mkc(16,20),ox=o.getContext('2d');[[1,0],[-1,0],[0,1],[0,-1]].forEach(d=>ox.drawImage(c,d[0],d[1]));ox.globalCompositeOperation='source-in';ox.fillStyle='#120c1a';ox.fillRect(0,0,16,20);ox.globalCompositeOperation='source-over';ox.drawImage(c,0,0);return HCV[k]=o}
// settings and saves
const CFG={side:'left',shake:1,num:1,vig:1};
try{Object.assign(CFG,JSON.parse(localStorage.getItem('ed.cfg')||'{}'))}catch(e){}
const svCfg=()=>{try{localStorage.setItem('ed.cfg',JSON.stringify(CFG))}catch(e){}};
const getSlot=i=>{try{const s=localStorage.getItem('ed.slot'+i);return s?JSON.parse(s):null}catch(e){return null}};
function save(){if(G&&G.slot!=null)try{localStorage.setItem('ed.slot'+G.slot,JSON.stringify(G))}catch(e){}}
const encG=()=>btoa(unescape(encodeURIComponent(JSON.stringify(G))));
function cln(it){return it&&it.sl&&it.st&&RR[it.r]&&typeof it.nm=='string'&&(it.sl=='ab'?AB[it.t]:(WT[it.t]||Object.values(ARM).some(a=>a.t==it.t)))?{sl:it.sl,t:it.t,r:it.r|0,l:(it.l|0)||1,lv:cl(it.lv|0,1,12),xp:+it.xp||0,nm:it.nm.replace(/[^\w ]/g,''),st:Object.fromEntries(Object.entries(it.st).filter(([k,v])=>k in AF&&isFinite(v)).map(([k,v])=>[k,+v]))}:null}
function loadG(o,slot){if(!RACES[o.rc]||!CLS[o.cl])throw 0;const e={};for(const k in SLN)e[k]=cln(o.eq&&o.eq[k]);
 G={slot,nm:String(o.nm||'Hero').slice(0,14),rc:o.rc,cl:o.cl,sk:o.sk|0,hs:o.hs|0,hc:o.hc|0,oc:o.oc|0,seed:String(o.seed||'x').slice(0,16),souls:+o.souls||0,own:{},inv:(o.inv||[]).map(cln).filter(Boolean),eq:e,ab:[0,1,2,3].map(i=>cln(o.ab&&o.ab[i])),floor:Math.max(1,o.floor|0),room:cl(o.room|0,1,5),max:Math.max(o.max|0,o.floor|0,1),kills:o.kills|0,deaths:o.deaths|0,pot:o.pot??3,disc:o.disc||{}};
 for(const id in(o.own||{}))if(ND[id])G.own[id]=1;G.ab.forEach(disc);G.inv.forEach(disc)}
const disc=it=>{if(it&&it.sl=='ab')G.disc[AB[it.t].s]=1};
// items
const LM=it=>1+.09*(it.lv-1),need=l=>14+l*l*5,ic=it=>it.sl=='ab'?'scroll':it.t,val=it=>Math.ceil((2+it.l*1.5)*RR[it.r][2]),cap=()=>20+Math.floor(S.slots||0);
const afv=(k,f,m)=>{const a=AF[k],v=(a[0]+f*a[1])*m;return k=='hp'?Math.round(v):+v.toFixed(1)};
function mkItem(rg,f,bonus,slot){const ri2=(a,b)=>a+Math.floor(rg()*(b-a+1)),pk2=a=>a[Math.floor(rg()*a.length)];
 const x=rg()/(1+(S.rar||0)/100),q=Math.min(4,(x<.01?4:x<.05?3:x<.16?2:x<.4?1:0)+(bonus||0)),m=RR[q][2];slot=slot||pk2(['w','w','r','r','h','c','b','n','m']);
 let t,nm,st={},na;
 if(slot=='w'||slot=='r'){t=pk2(Object.keys(WT).filter(k=>WT[k].sl==slot));nm=pk2(WT[t].nm);st.fd=Math.round((3+f*2)*m);na=[0,1,1,2,3][q]}
 else{const a=ARM[slot];t=a.t;nm=pk2(a.nm);na=slot=='n'||slot=='m'?[1,2,2,3,4][q]:[0,1,2,2,3][q];
  if(slot=='h'){st.hp=Math.round((6+3*f)*m);st.arm=afv('arm',f,m)}if(slot=='c'){st.hp=Math.round((10+4*f)*m);st.arm=+((1+.2*f)*m).toFixed(1)}if(slot=='b'){st.spd=+((2+.1*f)*m).toFixed(1);st.arm=+((.5+.1*f)*m).toFixed(1)}}
 const pool=POOL[slot].filter(k=>!(k in st)).sort(()=>rg()-.5);for(let i=0;i<na&&i<pool.length;i++)st[pool[i]]=afv(pool[i],f,m);
 return{sl:slot,t,r:q,l:f,lv:1,xp:0,nm:pk2(PF[q])+' '+nm,st}}
const mkAb=(id,lv)=>({sl:'ab',t:id,r:AB[id].t,l:G?G.floor:1,lv:lv||1,xp:0,nm:AB[id].n,st:{}});
function rollAb(rg,maxT){const w=[];for(const id in AB){const a=AB[id];if(a.nodrop||a.t>maxT)continue;for(let i=0;i<[0,10,5,2,1][a.t];i++)w.push(id)}return w[Math.floor(rg()*w.length)]}
const starter=t=>({sl:WT[t].sl,t,r:0,l:1,lv:1,xp:0,nm:WT[t].nm[0],st:{fd:4}});
function newG(nc,slot){const C=CLS[nc.cl];G={slot,nm:(nc.nm||'Hero').trim().slice(0,14)||'Hero',rc:nc.rc,cl:nc.cl,sk:nc.sk,hs:nc.hs,hc:nc.hc,oc:nc.oc,seed:(nc.seed||'').trim().slice(0,16)||Math.random().toString(36).slice(2,8),souls:0,own:{},inv:[],eq:{w:starter(C.w),r:C.r?starter(C.r):null,h:null,c:null,b:null,n:null,m:null},ab:[null,null,null,null],floor:1,room:1,max:1,kills:0,deaths:0,pot:3,disc:{}};G.ab[0]=mkAb(C.a,1);disc(G.ab[0])}
function gain(it,n){if(!it||it.lv>=12)return;it.xp+=n*(1+(S.ixp||0)/100);let up=0;while(it.lv<12&&it.xp>=need(it.lv)){it.xp-=need(it.lv);it.lv++;up=1}if(up){ft(p.x,p.y-36,it.nm+' reached Lv '+it.lv,'#ffe27a');ring(p.x,p.y,34,'#ffe27a',.4,2);calc()}}
function calc(){S={};const add=(k,v)=>S[k]=(S[k]||0)+v,C=CLS[G.cl],Rc=RACES[G.rc];
 C.st.forEach(x=>add(x[0],x[1]));Rc.st.forEach(x=>add(x[0],x[1]));for(const id in G.own)ND[id].e.forEach(x=>add(x[0],x[1]));
 const ib=1+(S.ibst||0)/100;
 for(const sl in G.eq){const it=G.eq[sl];if(!it)continue;const f=(sl=='w'||sl=='r')?1+(C.fv.includes(it.t)?.25:0)+(Rc.fv.includes(it.t)?.15:0):1;
  for(const k in it.st){const v=it.st[k]*LM(it)*ib;if(k=='fd')add(sl=='r'?'fdr':'fdw',v*f);else add(k,v)}}
 for(const k in p.bf)add(k,p.bf[k].v);
 const a=1+(S.all||0)/100;P.mhp=Math.round((100+(S.hp||0))*a);P.dm=(1+(S.dmg||0)/100)*a;P.crit=Math.min(100,5+(S.crit||0));P.cd=1.5+(S.critd||0)/100;
 P.spd=125*(1+(S.spd||0)/100);P.as=1+(S.aspd||0)/100;P.arm=Math.min(75,S.arm||0);P.blk=Math.min(50,S.blk||0);P.ab=12+.5*Math.max(S.fdw||0,S.fdr||0);p.hp=Math.min(p.hp,P.mhp)}
function equipInv(i){const it=G.inv[i];if(!it||it.sl=='ab')return;const old=G.eq[it.sl];G.eq[it.sl]=it;G.inv.splice(i,1);if(old)G.inv.push(old);calc();save()}
function unequip(sl){const it=G.eq[sl];if(!it)return;if(G.inv.length>=cap())return toast('Pack is full');G.inv.push(it);G.eq[sl]=null;calc();save()}
function slotAb(i,k){const it=G.inv[i];if(!it||it.sl!='ab')return;const old=G.ab[k];G.ab[k]=it;G.inv.splice(i,1);if(old)G.inv.push(old);p.acd[k]=0;save()}
function unslotAb(k){const it=G.ab[k];if(!it)return;if(G.inv.length>=cap())return toast('Pack is full');G.inv.push(it);G.ab[k]=null;save()}
function salvage(i){const it=G.inv[i];if(!it)return;G.souls+=val(it);G.inv.splice(i,1);save()}
