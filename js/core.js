const $=s=>document.querySelector(s),$$=s=>document.querySelectorAll(s);
const cv=$('#cv'),cx=cv.getContext('2d'),VW=640,VH=384,T=32,MW=48,MH=32;
cv.width=VW;cv.height=VH;
const R=Math.random,rr=(a,b)=>a+R()*(b-a),ri=(a,b)=>Math.floor(rr(a,b+1)),pk=a=>a[Math.floor(R()*a.length)],cl=(v,a,b)=>Math.max(a,Math.min(b,v));
const adf=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b)),esc=s=>String(s).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';'),okHex=s=>/^#[0-9a-f]{6}$/i.test(String(s));
function rgba(h,a){const n=parseInt(h.slice(1),16);return`rgba(${n>>16&255},${n>>8&255},${n&255},${a})`}
function dkc(h,f){const n=parseInt(h.slice(1),16);return`rgb(${Math.min(255,(n>>16&255)*f)|0},${Math.min(255,(n>>8&255)*f)|0},${Math.min(255,(n&255)*f)|0})`}
let bad=0;function fail(m){if(bad)return;bad=1;document.body.insertAdjacentHTML('beforeend','<div style="position:fixed;inset:0;background:#2a0a10;color:#ffd8d8;padding:24px;z-index:99;font:15px system-ui">'+esc(m)+'</div>')}
addEventListener('error',e=>fail('Script error: '+e.message+' ('+String(e.filename||'').split('/').pop()+':'+e.lineno+')'));
// seeded PRNG (mulberry32 over a string hash): every room is a pure function of seed + floor + room
function hsh(s){let h=1779033703^s.length;for(let i=0;i<s.length;i++){h=Math.imul(h^s.charCodeAt(i),3432918353);h=h<<13|h>>>19}h=Math.imul(h^h>>>16,2246822507);h=Math.imul(h^h>>>13,3266489909);return(h^h>>>16)>>>0}
function mb(a){return()=>{a=a+1831565813|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const wp=(rg,items,w)=>{let t=w.reduce((a,b)=>a+b,0)*rg(),i=0;for(;i<items.length-1&&t>=w[i];i++)t-=w[i];return items[i]};
// ---- state
let G=null,S={},P={mhp:100,dm:1,crit:5,cd:1.5,spd:125,as:1,arm:0,blk:0,ab:12,ms:3};
const p={x:0,y:0,r:10,hp:100,fa:0,ac:0,ac2:0,rc2:0,dc:0,inv:0,dh:0,rv:0,sh:0,dead:0,did:0,dx:0,dy:0,sw:null,sw2:null,acd:[0,0,0,0],acm:[1,1,1,1],sx:{},kx:0,ky:0,abs:0,abt:0,fl:0,mvx:0,mvy:0,nr:0,rt:0,aur:0,sd:1,tw:0,mn:null,ip:null,cdt:0,stn:0,pcd:0};
let es=[],bs=[],ds=[],zs=[],fxs=[],props=[],traps=[],al=[],orbs=[],aurs=[],map=new Uint8Array(MW*MH).fill(1),ores=new Map(),doors=[],dopen=new Uint8Array(MW*MH),secW=-1,fd=new Int16Array(MW*MH),fdist=new Int16Array(MW*MH),big=[];
let scene='menu',gt=0,hst=0,shkv=0,rt='fight',exitI=0,exitOpen=0,flowT=0,startI=0,curBi=0,sxDirty=1,god=0,nocd=0,shopS=null,tokT=0;
const cam={x:0,y:0},keys={},jv={x:0,y:0},ms={x:0,y:0,wx:0,wy:0,on:0};
const D=()=>DIFF[G?G.diff:'normal']||DIFF.normal;
// ---- assets
const IM={},FL={},HCV={},SHT=['hero','mobs','bosses','items','tiles','icons'];let nl=0;
function loadAssets(done){SHT.forEach(n=>{const i=new Image();i.onload=()=>{if(++nl==SHT.length)done()};i.onerror=()=>fail('Could not load sprites/'+n+'.png. Keep the sprites folder next to index.html.');i.src='sprites/'+n+'.png';IM[n]=i})}
const mkc=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c};
function flashOf(img){const c=mkc(img.width,img.height),x=c.getContext('2d');x.drawImage(img,0,0);x.globalCompositeOperation='source-atop';x.fillStyle='rgba(255,255,255,.85)';x.fillRect(0,0,c.width,c.height);return c}
function spr(sh,nm,f,x,y,sc,flip,fl,al){const a=ATLAS[sh][nm],w=a[2],h=a[3],im=fl?(FL[sh]||(FL[sh]=flashOf(IM[sh]))):IM[sh];
 cx.save();cx.translate(Math.round(x),Math.round(y));if(flip)cx.scale(-1,1);if(al!=null)cx.globalAlpha=al;cx.drawImage(im,a[0]+(f%a[4])*w,a[1],w,h,-w*sc/2,-h*sc*.62,w*sc,h*sc);cx.restore()}
function ico(sh,nm,sc){sc=sc||3;const a=sh=='icons'?ATLAS.icons[nm]:ATLAS[sh][nm];if(!a)return'';const s=ATLAS.sheets[sh];return`background-image:url(sprites/${sh}.png);background-size:${s[0]*sc}px ${s[1]*sc}px;background-position:-${a[0]*sc}px -${a[1]*sc}px`}
function tintL(row,col,color){const c=mkc(16,20),x=c.getContext('2d'),sx=col*16,sy=row*20;x.drawImage(IM.hero,sx,sy,16,20,0,0,16,20);
 if(color){x.globalCompositeOperation='multiply';x.fillStyle=color;x.fillRect(0,0,16,20);x.globalCompositeOperation='destination-in';x.drawImage(IM.hero,sx,sy,16,20,0,0,16,20)}return c}
const LY={elf:['ears'],dwarf:['beard'],orc:['tusks'],tiefling:['horns','tail'],drakeborn:['frill','tail']};
function heroC(ch,dir,f){const k=[ch.rc,ch.cl,ch.sk,ch.hs,ch.hc,ch.oc,dir,f].join();if(HCV[k])return HCV[k];
 const rw=ATLAS.hero.rows,col=dir*2+f,c=mkc(16,20),x=c.getContext('2d'),L=(n,t)=>x.drawImage(tintL(rw[n],col,t),0,0),ly=LY[ch.rc]||[],sk=ch.sk,hc=ch.hc,oc=ch.oc;
 if(ly.includes('tail'))L('tail',dkc(sk,.85));
 L('legs',dkc(oc,.6));L('body',sk);L('cloth',oc);
 if(ly.includes('ears'))L('ears',sk);if(ly.includes('beard'))L('beard',hc);if(ly.includes('tusks'))L('tusks',null);if(ly.includes('horns'))L('horns','#4a3030');if(ly.includes('frill'))L('frill',dkc(sk,.8));
 if(ch.hs!=5)L('hair'+ch.hs,hc);L('cls'+CIDX[ch.cl],dkc(oc,1.2));L('eyes',null);
 const o=mkc(16,20),ox=o.getContext('2d');[[1,0],[-1,0],[0,1],[0,-1]].forEach(d=>ox.drawImage(c,d[0],d[1]));ox.globalCompositeOperation='source-in';ox.fillStyle='#120c1a';ox.fillRect(0,0,16,20);ox.globalCompositeOperation='source-over';ox.drawImage(c,0,0);return HCV[k]=o}
// ---- settings and saves
const CFG={side:'left',shake:1,num:1,vig:1,hbox:0};
try{Object.assign(CFG,JSON.parse(localStorage.getItem('ed.cfg')||'{}'))}catch(e){}
const svCfg=()=>{try{localStorage.setItem('ed.cfg',JSON.stringify(CFG))}catch(e){}};
const getSlot=i=>{try{const s=localStorage.getItem('ed.slot'+i);return s?JSON.parse(s):null}catch(e){return null}};
function save(){if(G&&G.slot!=null&&!G.fell)try{localStorage.setItem('ed.slot'+G.slot,JSON.stringify(G))}catch(e){}}
const encG=()=>btoa(unescape(encodeURIComponent(JSON.stringify(G))));
// ---- items
const LM=it=>(1+.09*(it.lv-1))*(1+.06*(it.up||0)),need=l=>14+l*l*5,xpNeed=l=>Math.round(26*Math.pow(l,1.55)),spFor=l=>l%5==0?3:1,cap=()=>20+Math.floor(S.slots||0);
const iconOf=it=>it.sl=='ab'?['items','scroll_'+AB[it.t].s]:it.sl=='cn'?['items',CONS[it.t].ic]:it.sl=='pet'?['mobs',AL[it.t].sp]:['items',it.sl=='egg'?'egg':it.t];
const icoIt=(it,sc)=>{const i=iconOf(it);return ico(i[0],i[1],sc)};
function goldOf(it){if(it.sl=='ab')return 25*AB[it.t].t;if(it.sl=='cn')return Math.ceil(CONS[it.t].pr*.4)*it.n;if(it.sl=='egg')return 40*(it.r+1);if(it.sl=='pet')return 60*(it.r+1);
 return Math.ceil((4+it.l*2.2+it.lv*1.5)*RR[it.r][2]*(1+.2*(it.up||0)))}
function price(it){if(it.sl=='cn')return CONS[it.t].pr*it.n;if(it.sl=='egg')return 150*(it.r+1);if(it.sl=='pet')return 220*(it.r+1);if(it.sl=='ab')return 120*AB[it.t].t*AB[it.t].t;return Math.ceil(goldOf(it)*3.4)}
const afv=(k,f,m)=>{const a=AF[k],v=(a[0]+f*a[1])*m;return k=='hp'?Math.round(v):+v.toFixed(1)};
const base=(sl,t,r,l,nm,st)=>({sl,t,r,l,lv:1,xp:0,up:0,fv:0,n:1,pg:0,nm,st:st||{}});
function mkItem(rg,f,bonus,slot){const ri2=(a,b)=>a+Math.floor(rg()*(b-a+1)),pk2=a=>a[Math.floor(rg()*a.length)];
 const x=rg()/(1+(S.rar||0)/100),q=Math.min(4,(x<.01?4:x<.05?3:x<.16?2:x<.4?1:0)+(bonus||0)),m=RR[q][2];slot=slot||pk2(['w','w','r','r','h','c','b','n','m','g','k']);
 let t,nm,st={},na;
 if(slot=='w'||slot=='r'){t=pk2(Object.keys(WT).filter(k=>WT[k].sl==slot));nm=pk2(WT[t].nm);st.fd=Math.round((3+f*2)*m);na=[0,1,1,2,3][q]}
 else{const a=ARM[slot];t=a.t;nm=pk2(a.nm);na=slot=='n'||slot=='m'?[1,2,2,3,4][q]:[0,1,2,2,3][q];
  if(slot=='h'){st.hp=Math.round((6+3*f)*m);st.arm=afv('arm',f,m)}if(slot=='c'){st.hp=Math.round((10+4*f)*m);st.arm=+((1+.2*f)*m).toFixed(1)}if(slot=='b'){st.spd=+((2+.1*f)*m).toFixed(1);st.arm=+((.5+.1*f)*m).toFixed(1)}
  if(slot=='g')st.arm=+((.5+.1*f)*m).toFixed(1);if(slot=='k')st.hp=Math.round((4+2*f)*m)}
 const pool=POOL[slot].filter(k=>!(k in st)).sort(()=>rg()-.5);for(let i=0;i<na&&i<pool.length;i++)st[pool[i]]=afv(pool[i],f,m);
 return base(slot,t,q,f,pk2(PF[q])+' '+nm,st)}
const mkCons=(t,n)=>Object.assign(base('cn',t,CONS[t].r,1,CONS[t].n),{n:n||1});
const mkAb=(id,lv)=>Object.assign(base('ab',id,AB[id].t,G?G.floor:1,AB[id].n),{lv:lv||1});
const mkEgg=(r,f)=>Object.assign(base('egg','egg',r,f,RR[r][0]+' Egg'),{pg:0});
const mkPet=(id,r,f)=>base('pet',id,r,f,AL[id].n);
function rollAb(rg,maxT){const w=[];for(const id in AB){const a=AB[id];if(a.nodrop||a.t>maxT)continue;for(let i=0;i<[0,10,5,2,1][a.t];i++)w.push(id)}return w[Math.floor(rg()*w.length)]}
const starter=t=>Object.assign(base(WT[t].sl,t,0,1,WT[t].nm[0],{fd:4}));
function cln(it){if(!it||typeof it!='object'||!RR[it.r|0]||typeof it.nm!='string')return null;const sl=it.sl,t=it.t;
 const ok=sl=='ab'?AB[t]:sl=='cn'?CONS[t]:sl=='egg'?t=='egg':sl=='pet'?AL[t]&&AL[t].pet:(sl=='w'||sl=='r')?WT[t]&&WT[t].sl==sl:ARM[sl]&&ARM[sl].t==t;if(!ok)return null;
 return{sl,t,r:it.r|0,l:Math.max(1,it.l|0),lv:cl(it.lv|0,1,12),xp:+it.xp||0,up:cl(it.up|0,0,10),fv:it.fv?1:0,n:cl((it.n|0)||1,1,20),pg:it.pg|0,nm:it.nm.replace(/[^\w ]/g,'').slice(0,28),st:Object.fromEntries(Object.entries(it.st||{}).filter(([k,v])=>k in AF&&isFinite(v)).map(([k,v])=>[k,+v]))}}
const disc=it=>{if(!it||!G)return;if(it.sl=='ab')G.disc[AB[it.t].s]=1;else if(it.sl=='egg'||it.sl=='pet')G.disc.beast=1};
function loadG(o,slot){if(!RACES[o.rc]||!CLS[o.cl])throw 0;
 const hx=(v,a,d)=>okHex(v)?v:(typeof v=='number'&&a[v])||d,e={};
 for(const k in SLN)e[k]=cln(o.eq&&(o.eq[k]||(k=='o'?o.eq.r:null)));
 const old=o.lvl==null,own={};
 for(const id in(o.own||{})){let n=id;if(/^\d+\./.test(id)){const i=+id.split('.')[0];n=(LEG[i]||'x')+id.slice(id.indexOf('.'))}if(ND[n])own[n]=1}
 let lvl=cl((o.lvl|0)||1,1,99),sp=Math.max(0,o.sp|0);
 if(old){let spent=0;for(const id in own)spent+=ND[id].c;lvl=1;let cum=0;while(cum<spent&&lvl<99){lvl++;cum+=spFor(lvl)}sp=cum-spent}
 const sl=(a,f)=>[0,1,2,3].map(i=>{const x=cln(a&&a[i]);return x&&x.sl==f?x:null});
 G={v:3,slot,nm:String(o.nm||'Hero').replace(/[^\w ]/g,'').slice(0,14)||'Hero',rc:o.rc,cl:o.cl,sk:hx(o.sk,SKIN,RACES[o.rc].sk),hs:cl(o.hs|0,0,HAIRN.length-1),hc:hx(o.hc,HAIRC,HAIRC[1]),oc:hx(o.oc,OUTC,OUTC[0]),seed:String(o.seed||'x').replace(/[^\w ]/g,'').slice(0,16)||'x',
  diff:DIFF[o.diff]?o.diff:'normal',gold:Math.max(0,Math.floor(+(o.gold??o.souls)||0)),lvl,xp:Math.max(0,+o.xp||0),sp,mats:{},pick:cl((o.pick|0)||1,1,5),inv:(o.inv||[]).map(cln),eq:e,ab:sl(o.ab,'ab'),cs:sl(o.cs,'cn'),pet:null,
  floor:Math.max(1,o.floor|0),room:cl((o.room|0)||1,1,5),max:Math.max(o.max|0,o.floor|0,1),kills:o.kills|0,deaths:o.deaths|0,disc:Object.assign({},o.disc),own,sold:Array.isArray(o.sold)?o.sold.slice(0,12):[],shopKey:typeof o.shopKey=='string'?o.shopKey.slice(0,12):''};
 for(const k in(o.mats||{}))if(ORES.some(q=>q[0]==k))G.mats[k]=Math.max(0,o.mats[k]|0);
 const pt=cln(o.pet);if(pt&&pt.sl=='pet')G.pet=pt;
 for(const k in G.eq)if(G.eq[k]&&!fits('eq',k,G.eq[k]))G.eq[k]=null;
 if(old&&o.pot>0)G.cs[0]=mkCons('hp2',Math.min(20,o.pot|0));
 G.ab.forEach(disc);G.inv.forEach(disc);disc(G.pet)}
function newG(nc,slot){const C=CLS[nc.cl];G={v:3,slot,nm:(nc.nm||'Hero').replace(/[^\w ]/g,'').trim().slice(0,14)||'Hero',rc:nc.rc,cl:nc.cl,sk:nc.sk,hs:nc.hs,hc:nc.hc,oc:nc.oc,seed:(nc.seed||'').replace(/[^\w ]/g,'').trim().slice(0,16)||Math.random().toString(36).slice(2,8),diff:nc.diff||'normal',gold:0,lvl:1,xp:0,sp:0,mats:{},pick:1,inv:[],
 eq:{w:starter(C.w),o:C.o?starter(C.o):null,h:null,c:null,b:null,n:null,m:null,g:null,k:null},ab:[null,null,null,null],cs:[null,null,null,null],pet:null,floor:1,room:1,max:1,kills:0,deaths:0,disc:{},own:{},sold:[]};
 G.ab[0]=mkAb(C.a,1);disc(G.ab[0]);G.cs[0]=mkCons('hp1',3);if(C.o&&WT[C.o].sl=='w')G.disc.dual=1;if(D().sb){G.gold=5000;G.sp=20}}
// ---- progression
function gain(it,n){if(!it||it.lv>=12||it.sl=='cn')return;it.xp+=n*(1+(S.ixp||0)/100);let up=0;while(it.lv<12&&it.xp>=need(it.lv)){it.xp-=need(it.lv);it.lv++;up=1}if(up){ft(p.x,p.y-36,it.nm+' reached Lv '+it.lv,'#ffe27a');ring(p.x,p.y,34,'#ffe27a',.4,2);calc()}}
function addXP(n){n*=(1+(S.xpg||0)/100)*D().xp;G.xp+=n;let up=0;while(G.xp>=xpNeed(G.lvl)&&G.lvl<99){G.xp-=xpNeed(G.lvl);G.lvl++;G.sp+=spFor(G.lvl);up=1}
 if(up){calc();p.hp=Math.min(P.mhp,p.hp+P.mhp*.3);ft(p.x,p.y-44,'LEVEL '+G.lvl+'!','#ffe27a',1);ring(p.x,p.y,56,'#ffe27a',.6,3);part(p.x,p.y,24,'#ffe27a',140,.8,3);toast('Level '+G.lvl+'! You gained '+spFor(G.lvl)+' skill point'+(spFor(G.lvl)>1?'s':'')+'.')}}
function addGold(n){n=Math.max(1,Math.round(n*(1+(S.soul||0)/100)*D().gd));G.gold+=n;return n}
function petXp(n){const q=G.pet;if(!q||q.lv>=15)return;q.xp+=n*(1+(S.pete||0)/100);while(q.lv<15&&q.xp>=10+q.lv*8){q.xp-=10+q.lv*8;q.lv++;toast(q.nm+' reached level '+q.lv+'!')}}
function tickEggs(){for(let i=0;i<G.inv.length;i++){const e=G.inv[i];if(e&&e.sl=='egg'){e.pg++;if(e.pg>=3+e.r){const id=pk(Object.keys(AL).filter(k=>AL[k].pet&&(k!='drake'||e.r>=2))),pet=mkPet(id,e.r,e.l);G.inv[i]=pet;disc(pet);toast('Your egg hatched into a '+pet.nm+'!')}}}}
// ---- stats
function calc(){S={};const add=(k,v)=>S[k]=(S[k]||0)+v,C=CLS[G.cl],Rc=RACES[G.rc];
 C.st.forEach(x=>add(x[0],x[1]));Rc.st.forEach(x=>add(x[0],x[1]));for(const id in G.own)ND[id].e.forEach(x=>add(x[0],x[1]));
 add('hp',3*(G.lvl-1));add('dmg',G.lvl-1);
 const ib=1+(S.ibst||0)/100;
 for(const sl in G.eq){const it=G.eq[sl];if(!it)continue;const m=LM(it)*ib,wt=WT[it.t];let f=1;
  if(wt){f=1+(C.fv.includes(it.t)?.25:0)+(Rc.fv.includes(it.t)?.15:0);(wt.wp||[]).forEach(x=>add(x[0],x[1]))}
  for(const k in it.st){const v=it.st[k]*m;if(k=='fd')add(sl=='w'?'fdw':it.sl=='r'?'fdr':'fdo',v*f);else add(k,v)}}
 if(G.eq.o&&G.eq.o.sl=='w')G.disc.dual=1;
 if(G.pet)AL[G.pet.t].au.forEach(x=>add(x[0],x[1]*(1+.1*(G.pet.lv-1))));
 for(const id in p.sx){const m=MOD[id];if(m&&p.sx[id].t>0)m(p.sx[id].v||1).forEach(x=>add(x[0],x[1]))}
 const a=1+(S.all||0)/100;
 P.mhp=Math.round((100+(S.hp||0))*a);P.dm=(1+(S.dmg||0)/100)*a;P.crit=Math.min(100,5+(S.crit||0));P.cd=1.5+(S.critd||0)/100;
 P.spd=125*Math.max(.3,1+(S.spd||0)/100);P.as=Math.max(.4,1+(S.aspd||0)/100);P.arm=cl(S.arm||0,-50,75);P.blk=Math.min(50,S.blk||0);
 P.ab=12+.5*Math.max(S.fdw||0,S.fdr||0,S.fdo||0);P.ms=3+Math.floor(S.summ||0);
 const n=cap();while(G.inv.length<n)G.inv.push(null);p.hp=Math.min(p.hp,P.mhp)}
// ---- containers: inv / eq / ab / cs / pet
const getC=(c,k)=>c=='pet'?G.pet:G[c][k];
function setC(c,k,v){if(c=='pet')G.pet=v;else G[c][k]=v}
function fits(c,k,it){if(!it||c=='inv')return true;if(c=='eq')return k=='w'?it.sl=='w':k=='o'?(it.sl=='w'||it.sl=='r'):it.sl==k;if(c=='ab')return it.sl=='ab';if(c=='cs')return it.sl=='cn';if(c=='pet')return it.sl=='pet';return false}
function after(){calc();if(typeof rAb=='function'){rAb();rCb()}save()}
function moveItem(sc,sk,tc,tk){const a=getC(sc,sk),b=getC(tc,tk);if(!a||(sc==tc&&sk==tk))return false;
 if(!fits(tc,tk,a)){toast('That does not fit there');return false}
 if(a.sl=='cn'&&b&&b.sl=='cn'&&a.t==b.t){const m=Math.min(20-b.n,a.n);b.n+=m;a.n-=m;if(a.n<=0)setC(sc,sk,null);after();return true}
 let back=b;if(b&&!fits(sc,sk,b)){const f=G.inv.indexOf(null);if(f<0){toast('Pack is full');return false}G.inv[f]=b;back=null}
 setC(tc,tk,a);setC(sc,sk,back);if(tc=='cs'||sc=='cs'){}after();return true}
function addInv(it){if(it.sl=='cn'){for(const x of G.inv.concat(G.cs))if(x&&x.sl=='cn'&&x.t==it.t&&x.n<20){const m=Math.min(20-x.n,it.n);x.n+=m;it.n-=m;if(it.n<=0)return true}}
 const i=G.inv.indexOf(null);if(i<0)return false;G.inv[i]=it;disc(it);return true}
function sortInv(){const o={w:0,r:1,h:2,c:3,g:4,b:5,k:6,n:7,m:8,ab:9,cn:10,egg:11,pet:12},it=G.inv.filter(Boolean).sort((a,b)=>o[a.sl]-o[b.sl]||b.r-a.r||b.l-a.l);G.inv=it.concat(Array(Math.max(0,G.inv.length-it.length)).fill(null));save()}
function salvage(i){const it=G.inv[i];if(!it||it.fv)return 0;const g=goldOf(it);G.gold+=g;G.inv[i]=null;save();return g}
const respecCost=()=>Math.round(40+25*G.lvl);
function respec(){if(G.gold<respecCost())return false;G.gold-=respecCost();for(const id in G.own)G.sp+=ND[id].c;G.own={};calc();save();return true}
