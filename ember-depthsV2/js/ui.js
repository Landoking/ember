let tt,abEl=[],csEl=[],NC,NS,pvd=0,selI=null,selMode=0,selSet=new Set(),tab='might',selN=null,showLock=0,ccEdit=-1,sxSig='',sxEl={},shSel=null,fgSel=null,dg=null,cfT=0;
const H={};['hp','ht','lv','xp','fl','gd','spt','nm'].forEach(k=>H[k]=$('#'+k));
const setT=(e,s)=>{if(e._t!==s){e._t=s;e.textContent=s}};
const uiOpen=()=>!!$('.ov.on'),kk=(c,k)=>c=='eq'?k:+k;
function showOv(id){$$('.ov').forEach(o=>o.classList.remove('on'));$('#'+id).classList.add('on')}
function closeOv(){$$('.ov').forEach(o=>o.classList.remove('on'));selMode=0;selSet.clear()}
function togOv(id){if(scene!='play'||!G||p.dead)return;const was=$('#'+id).classList.contains('on');closeOv();if(!was){showOv(id);if(id=='sv')rTree();if(id=='iv')rInv()}}
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2600)}
function modal(h){$('#md').innerHTML='<div class="pn">'+h+'</div>';showOv('md')}
// ---- HUD
function rAb(){const b=$('#ab');b.className=CFG.side;$('#sx').className=CFG.side=='left'?'right':'left';if(!G){b.innerHTML='';abEl=[];return}
 b.innerHTML=G.ab.map((it,i)=>{if(!it)return`<div class="as e" data-i="${i}"><span class="k">${i+1}</span></div>`;const a=AB[it.t],s=SCH[a.s];
  return`<div class="as" data-i="${i}" style="--c:${s[2]}" title="${esc(a.n)}"><span class="k">${i+1}</span><b>${s[1]}</b><span class="n">${esc(a.n)}</span><u>Lv ${it.lv}</u><i class="cd"></i><em></em></div>`}).join('');
 abEl=[...b.children].map(e=>({cd:e.querySelector('.cd'),em:e.querySelector('em')}))}
function rCb(){const b=$('#cb');if(!G){b.innerHTML='';csEl=[];return}
 b.innerHTML=G.cs.map((it,i)=>`<div class="cs${it?'':' e'}" data-i="${i}" ${it?`title="${esc(it.nm)}"`:''}><span class="k">${'ZXCV'[i]}</span>${it?`<i class="ic" style="${icoIt(it,2)}"></i><b>${it.n}</b>`:''}</div>`).join('')}
function updSx(){const ks=Object.keys(p.sx).filter(k=>p.sx[k].t>0),sig=ks.join();
 if(sig!=sxSig||sxDirty){sxSig=sig;sxDirty=0;$('#sx').innerHTML=ks.map(k=>{const s=STS[k];return`<div class="st${s[4]?' bad':''}" data-k="${k}" style="--c:${s[2]}" title="${esc(s[0]+': '+s[3])}"><i style="${ico('icons',s[1],2)}"></i><em></em></div>`}).join('');sxEl={};[...$('#sx').children].forEach(e=>sxEl[e.dataset.k]=e.querySelector('em'))}
 for(const k of ks){const e=sxEl[k];if(e){const t=Math.ceil(p.sx[k].t);setT(e,t>99?'':t+'')}}}
function hud(){H.hp.style.width=Math.max(0,p.hp/P.mhp*100)+'%';setT(H.ht,Math.ceil(Math.max(0,p.hp))+' / '+P.mhp);setT(H.lv,'Lv '+G.lvl);H.xp.style.width=Math.min(100,G.xp/xpNeed(G.lvl)*100)+'%';
 const tag={boss:' (boss)',shop:' (shop)',forge:' (forge)',treasure:' (treasure)',rest:' (shrine)',trapvault:' (trap vault)'}[rt];
 setT(H.fl,'Floor '+G.floor+', room '+G.room+'/5'+(tag||(es.length?', '+es.length+' left':'')));setT(H.gd,G.gold.toLocaleString()+' gold');setT(H.spt,G.sp>0?G.sp+' SP':'');
 abEl.forEach((x,i)=>{if(!x.cd)return;x.cd.style.height=(p.acm[i]?p.acd[i]/p.acm[i]*100:0)+'%';setT(x.em,p.acd[i]>0?p.acd[i].toFixed(1):'')});updSx()}
$('#ab').addEventListener('pointerdown',e=>{const s=e.target.closest('.as');if(s&&scene=='play'&&!uiOpen())useAb(+s.dataset.i)});
$('#cb').addEventListener('pointerdown',e=>{const s=e.target.closest('.cs');if(s&&scene=='play'&&!uiOpen())useCons(+s.dataset.i)});
$('#bs').onclick=()=>togOv('sv');$('#bi').onclick=()=>togOv('iv');$('#bm').onclick=()=>{if(uiOpen())closeOv();else modPause()};
$$('.ov').forEach(o=>o.addEventListener('click',e=>{if(e.target.closest('[data-x]')||(e.target==o&&['sv','iv','md'].includes(o.id)&&scene=='play'))closeOv()}));
// ---- main menu
const normCh=s=>({rc:s.rc,cl:s.cl,sk:okHex(s.sk)?s.sk:SKIN[s.sk|0]||SKIN[0],hs:cl(s.hs|0,0,11),hc:okHex(s.hc)?s.hc:HAIRC[s.hc|0]||HAIRC[1],oc:okHex(s.oc)?s.oc:OUTC[s.oc|0]||OUTC[0]});
function rMain(){const sl=[0,1,2].map(i=>getSlot(i));
 $('#mm').innerHTML=`<div class="pn big"><div class="ttl">Ember Depths</div><p class="mu c">An endless, seeded dungeon. Choose a slot.</p>`+sl.map((s,i)=>{const ok=s&&RACES[s.rc]&&CLS[s.cl],dk=ok&&DIFF[s.diff]?s.diff:'normal';
  return`<div class="slot">${ok?`<canvas class="pt" width="64" height="80" data-i="${i}"></canvas>`:'<div class="pt e"></div>'}<div class="si">${ok?`<b>${esc(String(s.nm||'Hero'))}</b> <span class="bdg ${dk}">${DIFF[dk].n}</span><br><small>${RACES[s.rc].n} ${CLS[s.cl].n} · Lv ${s.lvl||'?'} · floor ${s.floor|0} (best ${s.max|0})<br>seed ${esc(String(s.seed||''))}</small>`:'<i class="mu">Empty slot</i>'}</div><span class="sb">${ok?`<button data-a="play" data-i="${i}" class="go">Continue</button><button data-a="del" data-i="${i}">Delete</button>`:`<button data-a="new" data-i="${i}" class="go">New character</button>`}</span></div>`}).join('')
  +`<div class="srow"><button data-a="imp">Import code</button><button data-a="set">Settings</button></div></div>`;
 $$('#mm canvas.pt').forEach(c=>{const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#1b1626';x.fillRect(0,0,64,80);x.drawImage(heroC(normCh(sl[+c.dataset.i]),0,0),0,0,64,80)})}
$('#mm').addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,i=+b.dataset.i;
 if(a=='play')playSlot(i);else if(a=='new')openCC(i);else if(a=='imp')modCode();else if(a=='set')modSettings('mm');
 else if(a=='del'){if(b.dataset.c){try{localStorage.removeItem('ed.slot'+i)}catch(x){}rMain()}else{b.dataset.c=1;b.textContent='Click again to delete'}}});
// ---- character creator (also used by the Mirror Crystal)
function openCC(slot){ccEdit=-1;NS=slot;NC={nm:'Hero',rc:'human',cl:'warrior',sk:RACES.human.sk,hs:0,hc:HAIRC[1],oc:OUTC[0],seed:'',diff:'normal'};pvd=0;rCC();showOv('cc')}
function openMirror(i){ccEdit=i;NC={nm:G.nm,rc:G.rc,cl:G.cl,sk:G.sk,hs:G.hs,hc:G.hc,oc:G.oc,seed:G.seed,diff:G.diff};pvd=0;rCC();showOv('cc')}
const colRow=(k,arr)=>`<div class="sw">${arr.map(c=>`<i class="${NC[k]==c?'a':''}" data-col="${k}:${c}" style="background:${c}"></i>`).join('')}<input type="color" value="${NC[k]}" data-cc="${k}" title="Pick any colour"><input class="hx" maxlength="7" value="${NC[k]}" data-hx="${k}" title="Hex colour"></div>`;
const chs=(k,o,f)=>`<div class="chs">${Object.keys(o).map(x=>`<button class="${NC[k]==x?'a':''}" data-${k}="${x}">${esc(f(x))}</button>`).join('')}</div>`;
function rCC(){const ed=ccEdit>=0;
 $('#cc').innerHTML=`<div class="pn big"><div class="hd"><span>${ed?'Change your appearance':'Create your character'}</span><span class="sp"></span><button data-a="back">${ed?'Cancel':'Back'}</button></div><div class="ccb"><div class="pv"><canvas id="pvc" width="128" height="160" data-a="turn" title="Click to turn"></canvas>
 ${ed?'':`<input id="nm" maxlength="14" value="${esc(NC.nm)}" placeholder="Name"><label class="mu">World seed <input id="sd" maxlength="16" value="${esc(NC.seed)}" placeholder="random"></label>`}</div><div class="opts">
 ${ed?'':`<div class="lb">Race</div>${chs('rc',RACES,x=>RACES[x].n)}<p class="mu">${esc(RACES[NC.rc].d)}</p><div class="lb">Class</div>${chs('cl',CLS,x=>CLS[x].n)}<p class="mu">${esc(CLS[NC.cl].d)}</p>
 <div class="lb">Difficulty</div>${chs('diff',DIFF,x=>DIFF[x].n)}<p class="mu">${esc(DIFF[NC.diff].d)}</p>`}
 <div class="lb">Skin colour</div>${colRow('sk',SKIN)}<div class="lb">Hair style</div><div class="chs">${HAIRN.map((n,i)=>`<button class="${NC.hs==i?'a':''}" data-hs="${i}">${n}</button>`).join('')}</div>
 <div class="lb">Hair colour</div>${colRow('hc',HAIRC)}<div class="lb">Outfit colour</div>${colRow('oc',OUTC)}</div></div><div class="foot"><button data-a="${ed?'apply':'start'}" class="go">${ed?'Apply appearance':'Begin the descent'}</button></div></div>`;drawPv()}
function drawPv(){const c=$('#pvc');if(!c)return;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#1b1626';x.fillRect(0,0,128,160);x.save();if(pvd==3){x.translate(128,0);x.scale(-1,1)}const s=NC.rc=='halfling'?.86:1;x.drawImage(heroC(NC,pvd==3?1:pvd,0),64-64*s,160-160*s,128*s,160*s);x.restore()}
$('#cc').addEventListener('click',e=>{const t=e.target.closest('[data-rc],[data-cl],[data-hs],[data-diff],[data-col],[data-a]');if(!t)return;const d=t.dataset;
 if(d.a=='back'){if(ccEdit>=0)closeOv();else{showOv('mm');rMain()}return}
 if(d.a=='start'){beginNew(NC,NS);return}
 if(d.a=='apply'){const it=G.cs[ccEdit];G.sk=NC.sk;G.hs=NC.hs;G.hc=NC.hc;G.oc=NC.oc;if(it){it.n--;if(it.n<=0)G.cs[ccEdit]=null}rCb();save();closeOv();toast('Your new look suits you.');return}
 if(d.a=='turn'){pvd=(pvd+1)%4;drawPv();return}
 if(d.col){const[k,c]=d.col.split(':');NC[k]=c;rCC();return}
 if(d.rc){NC.rc=d.rc;NC.sk=RACES[d.rc].sk}if(d.cl)NC.cl=d.cl;if(d.diff)NC.diff=d.diff;if(d.hs!=null)NC.hs=+d.hs;rCC()});
$('#cc').addEventListener('input',e=>{const t=e.target;if(t.id=='nm')NC.nm=t.value;else if(t.id=='sd')NC.seed=t.value;
 else if(t.dataset.cc){NC[t.dataset.cc]=t.value;const h=$('#cc [data-hx="'+t.dataset.cc+'"]');if(h)h.value=t.value;drawPv()}
 else if(t.dataset.hx&&okHex(t.value)){NC[t.dataset.hx]=t.value.toLowerCase();const c=$('#cc [data-cc="'+t.dataset.hx+'"]');if(c)c.value=t.value.toLowerCase();drawPv()}});
// ---- pause, settings, codes, death
function modPause(){modal(`<div class="hd"><span>Paused</span></div><div class="mb mcol"><button data-a="res">Resume</button><button data-a="sv">Save game</button><button data-a="inv">Pack and gear</button><button data-a="tr">Skill trees</button><button data-a="set">Settings</button><button data-a="ctl">Controls</button><button data-a="code">Export / import code</button>${D().sb?'<button data-a="sbx">Sandbox menu</button>':''}<button data-a="quit">Save and quit to main menu</button></div>`)}
const srow=(l,k,o)=>`<div class="srow"><span>${l}</span><span>${o.map(x=>`<button class="${CFG[k]==x[0]?'a':''}" data-set="${k}:${x[0]}">${x[1]}</button>`).join('')}</span></div>`;
function modSettings(from){modal(`<div class="hd"><span>Settings</span></div><div class="mb" data-f="${from}">${srow('Ability bar side','side',[['left','Left'],['right','Right']])}${srow('Screen shake','shake',[[1,'On'],[0,'Off']])}${srow('Damage numbers','num',[[1,'On'],[0,'Off']])}${srow('Dark vignette','vig',[[1,'On'],[0,'Off']])}${srow('Hide melee hitboxes','hbox',[[0,'Off'],[1,'On']])}<p class="mu">Melee hitboxes show the area your weapon can hit while you swing.</p><div class="srow"><span></span><button data-a="back">Back</button></div></div>`)}
function modCode(){modal(`<div class="hd"><span>Save code</span></div><div class="mb" data-f="${G?'pause':'mm'}"><p class="mu">${G?'Copy this code to carry your character to another browser. ':''}Paste a code below and import it into an empty slot. Codes from earlier versions of the game still work.</p><textarea id="cd" rows="5">${G?encG():''}</textarea><div class="srow"><button data-a="imp2">Import into empty slot</button><button data-a="back">Back</button></div></div>`)}
function modControls(){modal(`<div class="hd"><span>Controls</span></div><div class="mb" data-f="pause"><p>Move: WASD or arrows<br>Main hand: left click or Space<br>Off-hand (melee or ranged): right click or K<br>Abilities: 1 2 3 4<br>Consumables: Z X C V<br>Dash: Shift · Interact / mine (hold): F<br>Skill trees: T · Pack: I · Menu: Esc</p><p class="mu">Clear every monster to open the green gate. Every fifth room is a boss, and a shop appears every 3 to 5 floors. Attack suspicious cracked walls. Weapons, armor and abilities level up the more you use them.</p><div class="srow"><span></span><button data-a="back">Back</button></div></div>`)}
function showDeath(c,hc,lost){$('#dv').innerHTML=hc?`<div class="pn"><div class="hd">You have fallen</div><div class="mb"><p>${esc(G.nm)} died on floor ${G.floor} at level ${G.lvl}. Hardcore characters do not come back.</p><button data-a="menu" class="go">Return to the main menu</button></div></div>`
 :`<div class="pn"><div class="hd">You fell</div><div class="mb"><p>${D().sb?'Sandbox: no penalty.':G.diff=='easy'?'Easy: you restart this floor.':'Checkpoint: floor '+c+'.'} ${lost?'You lost '+lost+' gold. ':''}Your levels, skills and gear are safe.</p><button data-a="rise" class="go">Rise again</button></div></div>`;showOv('dv')}
$('#dv').addEventListener('click',e=>{const a=e.target.closest('[data-a]');if(!a)return;if(a.dataset.a=='rise'){p.dead=0;p.rv=0;p.sx={};calc();p.hp=P.mhp;closeOv();newRoom();rAb();rCb()}else if(a.dataset.a=='menu'){closeOv();toMenu()}});
const mkItemR=(slot,r,f)=>{for(let i=0;i<500;i++){const it=mkItem(R,f,0,slot);if(it.r==r)return it}return mkItem(R,f,r,slot)};
function modSandbox(){const o=(a,f)=>a.map(k=>`<option value="${k}">${esc(f(k))}</option>`).join(''),sl=['w','r','h','m','k','c','n','g','b'],nm={w:'Main-hand weapon',r:'Ranged weapon',h:'Helm',m:'Amulet',k:'Cape',c:'Chest',n:'Ring',g:'Gloves',b:'Boots'},rar=o(RR.map((r,i)=>i),i=>RR[i][0]);
 modal(`<div class="hd"><span>Sandbox</span></div><div class="mb" data-f="pause"><div class="srow"><span>Gear</span><span><select id="g1">${o(sl,k=>nm[k])}</select> <select id="g2">${rar}</select> Lv <input id="g3" type="number" min="1" max="200" value="${G.floor}" style="width:54px"> <button data-sb="gear">Give</button></span></div>
 <div class="srow"><span>Ability</span><span><select id="g4">${o(Object.keys(AB).filter(k=>!AB[k].nodrop),k=>SCH[AB[k].s][0]+': '+AB[k].n)}</select> Lv <input id="g5" type="number" min="1" max="12" value="1" style="width:46px"> <button data-sb="ab">Give</button></span></div>
 <div class="srow"><span>Consumable</span><span><select id="g6">${o(Object.keys(CONS),k=>CONS[k].n)}</select> x<input id="g7" type="number" min="1" max="20" value="5" style="width:46px"> <button data-sb="cons">Give</button></span></div>
 <div class="srow"><span>Egg / pet</span><span><select id="g8">${rar}</select> <button data-sb="egg">Egg</button> <select id="g9">${o(Object.keys(AL).filter(k=>AL[k].pet),k=>AL[k].n)}</select> <button data-sb="pet">Pet</button></span></div>
 <div class="srow"><span>Resources</span><span><button data-sb="gold">+1000 gold</button> <button data-sb="sp">+10 SP</button> <button data-sb="lvl">+1 level</button> <button data-sb="mats">+20 ore</button> <button data-sb="unlock">Unlock trees</button></span></div>
 <div class="srow"><span>Teleport</span><span>floor <input id="t1" type="number" min="1" value="${G.floor}" style="width:56px"> room <input id="t2" type="number" min="1" max="5" value="1" style="width:40px"> <button data-sb="tp">Go</button></span></div>
 <div class="srow"><span>Spawn</span><span><select id="s1">${o(Object.keys(EN),k=>EN[k].n)}</select> <label><input id="s2" type="checkbox"> elite</label> <button data-sb="spawn">Spawn</button></span></div>
 <div class="srow"><span>Cheats</span><span><button data-sb="god" class="${god?'a':''}">God mode</button> <button data-sb="cd" class="${nocd?'a':''}">No cooldowns</button> <button data-sb="heal">Heal</button> <button data-sb="kill">Kill all</button></span></div>
 <div class="srow"><span></span><button data-a="back">Back</button></div></div>`)}
$('#md').addEventListener('click',e=>{const s=e.target.closest('[data-set]');
 if(s){const[k,v]=s.dataset.set.split(':');CFG[k]=isNaN(v)?v:+v;svCfg();if(G)rAb();modSettings(s.closest('[data-f]').dataset.f);return}
 const sb=e.target.closest('[data-sb]');if(sb&&G){const v=id=>$('#'+id).value;let m='';
  switch(sb.dataset.sb){
   case'gear':{const it=mkItemR(v('g1'),+v('g2'),Math.max(1,+v('g3')||1));m=addInv(it)?'Added '+it.nm:'Pack is full';break}
   case'ab':{const id=v('g4');m=addInv(mkAb(id,cl(+v('g5')||1,1,12)))?'Added '+AB[id].n:'Pack is full';break}
   case'cons':{const id=v('g6');m=addInv(mkCons(id,cl(+v('g7')||1,1,20)))?'Added '+CONS[id].n:'Pack is full';break}
   case'egg':m=addInv(mkEgg(+v('g8'),G.floor))?'Added an egg':'Pack is full';break;
   case'pet':{const id=v('g9');m=addInv(mkPet(id,+v('g8'),G.floor))?'Added '+AL[id].n:'Pack is full';break}
   case'gold':G.gold+=1000;break;case'sp':G.sp+=10;break;
   case'lvl':G.lvl++;G.sp+=spFor(G.lvl);break;
   case'mats':ORES.forEach(q=>G.mats[q[0]]=(G.mats[q[0]]||0)+20);break;
   case'unlock':Object.keys(SCH).forEach(k=>G.disc[k]=1);['dual','beast','artisan'].forEach(k=>G.disc[k]=1);G.max=Math.max(G.max,30);m='All trees unlocked';break;
   case'tp':G.floor=Math.max(1,+v('t1')||1);G.max=Math.max(G.max,G.floor);G.room=cl(+v('t2')||1,1,5);closeOv();newRoom();break;
   case'spawn':{const q=lootSpot(p.x,p.y);addE(v('s1'),q[0],q[1],$('#s2').checked).aw=1;break}
   case'god':god=!god;m='God mode '+(god?'on':'off');break;case'cd':nocd=!nocd;m='No cooldowns '+(nocd?'on':'off');break;
   case'heal':p.hp=P.mhp;break;case'kill':for(const q of es.slice())if(!q.dead)kill(q);break}
  calc();rAb();rCb();save();if(m)toast(m);if(['god','cd'].includes(sb.dataset.sb))modSandbox();return}
 const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,f=(b.closest('[data-f]')||{dataset:{}}).dataset.f;
 if(a=='res')closeOv();else if(a=='sv'){save();toast('Game saved')}else if(a=='inv')togOv('iv');else if(a=='tr')togOv('sv');else if(a=='set')modSettings('pause');else if(a=='ctl')modControls();else if(a=='code')modCode();else if(a=='quit')toMenu();else if(a=='sbx')modSandbox();
 else if(a=='back'){if(f=='mm'){showOv('mm');rMain()}else modPause()}
 else if(a=='imp2'){try{const o=JSON.parse(decodeURIComponent(escape(atob($('#cd').value.trim())))),sl=[0,1,2].find(i=>!getSlot(i));if(sl==null)return toast('All slots are full. Delete one first.');const keep=G;loadG(o,sl);save();G=keep;toast('Imported into slot '+(sl+1)+(o.lvl==null?' (converted to Normal difficulty)':''));if(scene!='play'){showOv('mm');rMain()}}catch(x){toast('That code is not valid')}}});
// ---- inventory with drag and drop
function cell(it,c,k,lab){const on=selI&&selI.c==c&&selI.k==k,ck=c=='inv'&&selSet.has(k);
 return`<div class="cell${on?' sel':''}${it?'':' emp'}${ck?' ck':''}" data-c="${c}" data-k="${k}" ${it?`style="--c:${RR[it.r][1]}"`:''}>${it?`<i class="ic" style="${icoIt(it)}"></i>${it.sl=='ab'?`<b class="bg">${SCH[AB[it.t].s][1]}</b>`:''}<u>${it.sl=='cn'?it.n:it.sl=='egg'?it.pg+'/'+(3+it.r):it.up?'+'+it.up:it.lv}</u>${it.fv?'<span class="fv">★</span>':''}`:`<small>${lab||''}</small>`}</div>`}
const selTotal=()=>{let g=0;selSet.forEach(i=>{if(G.inv[i])g+=goldOf(G.inv[i])});return g};
function stl(it){const C=CLS[G.cl],Rc=RACES[G.rc],ib=1+(S.ibst||0)/100,f=(it.sl=='w'||it.sl=='r')?1+(C.fv.includes(it.t)?.25:0)+(Rc.fv.includes(it.t)?.15:0):1;
 return Object.keys(it.st).map(k=>'+'+(it.st[k]*LM(it)*ib*(k=='fd'?f:1)).toFixed(k=='hp'?0:1)+AF[k][2]).join('<br>')}
function descAb(a,lv){const sc=SCH[a.s],b=[];if(a.d)b.push('power '+Math.round(a.d*100*(1+.08*(lv-1)))+'%');if(a.st)b.push('applies '+STS[a.st][0].toLowerCase());if(a.st2)b.push('and '+STS[a.st2][0].toLowerCase());if(a.hl)b.push('heals you');if(a.hc)b.push('costs '+a.hc+'% health');if(a.sx)b.push('grants '+a.sx.map(s=>STS[s[0]][0].toLowerCase()).join(', '));if(a.ty)b.push('summons '+AL[a.ty].n.toLowerCase()+(a.n2>1?'s':''));
 return`<div>${sc[1]} ${sc[0]} · ${KIND[a.k]}</div><div class="mu">Cooldown ${a.cd}s${b.length?' · '+b.join(', '):''}</div>`}
function det(it,s){if(!it)return'<p class="mu">Select an item to inspect it. Drag items between cells to move or equip them. Everything you use levels up: weapons when they hit, armor when you take hits, jewelry on kills, abilities when cast.</p>';
 const q=RR[it.r];let h=`<div class="dh" style="color:${q[1]}"><b>${esc(it.nm)}</b> <small>${q[0]} ${it.sl=='ab'?'ability':it.sl=='cn'?'consumable':it.sl=='egg'?'egg':it.sl=='pet'?'pet':SLN[it.sl]||''}</small></div>`;
 if(it.sl=='cn')h+=`<div>${esc(CONS[it.t].d)}</div><div class="mu">Stack ${it.n}/20 · worth ${goldOf(it)} gold</div>`;
 else if(it.sl=='egg')h+=`<div>Hatches after ${3+it.r} rooms in your pack (${it.pg} so far).</div>`;
 else if(it.sl=='pet'){const d=AL[it.t];h+=`<div>${esc(d.d)}</div><div class="mu">Level ${it.lv}${it.lv<15?` (${Math.floor(it.xp)}/${10+it.lv*8} xp)`:' (max)'} · gains experience from kills</div>`}
 else{h+=`<div class="mu">Item level ${it.lv}${it.lv<12?` (${Math.floor(it.xp)}/${need(it.lv)} xp)`:' (max)'}${it.up?' · forged +'+it.up:''}</div>`;
  if(it.sl=='ab')h+=descAb(AB[it.t],it.lv);
  else{const w=WT[it.t];if(w){const C=CLS[G.cl],Rc=RACES[G.rc];h+=`<div class="mu">Reach ${w.rc?Math.round(w.rc*(1+(S.reach||0)/100)):'ranged'} · ${(1/w.cd).toFixed(1)} attacks/s${w.n2?' · '+w.n2+' pellets':''}${w.pr?' · pierces':''}${w.th?' · thrust':''}</div>`;if(C.fv.includes(it.t))h+='<div class="fv2">Class favored: +25% damage</div>';if(Rc.fv.includes(it.t))h+='<div class="fv2">Race favored: +15% damage</div>'}h+=`<div>${stl(it)}</div>`}}
 const b=[];
 if(s.c=='inv'&&!selMode){const k=s.k;
  if(it.sl=='w'){b.push('<button data-do="eq:w">Main hand</button><button data-do="eq:o">Off-hand</button>')}else if(it.sl=='r')b.push('<button data-do="eq:o">Off-hand</button>');
  else if(it.sl=='ab')for(let i=0;i<4;i++)b.push(`<button data-do="ab:${i}">Slot ${i+1}</button>`);
  else if(it.sl=='cn')for(let i=0;i<4;i++)b.push(`<button data-do="cs:${i}">${'ZXCV'[i]}</button>`);
  else if(it.sl=='pet')b.push('<button data-do="pet">Make active pet</button>');
  else if(it.sl!='egg')b.push('<button data-do="eq:'+it.sl+'">Equip</button>');
  b.push(`<button data-do="fav">${it.fv?'Unfavorite ★':'Favorite ★'}</button>`);b.push(it.fv?'':`<button data-do="sal">Salvage +${goldOf(it)}</button>`)}
 else if(!selMode&&['eq','ab','cs','pet'].includes(s.c)){b.push('<button data-do="un">Unequip</button>');b.push(`<button data-do="fav">${it.fv?'Unfavorite ★':'Favorite ★'}</button>`)}
 return h+`<div class="srow">${b.join('')}</div>`}
function rInv(){if(selI&&!getC(selI.c,selI.k))selI=null;const it=selI?getC(selI.c,selI.k):null,ml=G.eq.w?WT[G.eq.w.t].dm:FIST.dm,gear=x=>x&&!x.fv&&'whrbcgknm'.includes(x.sl[0])&&x.sl.length==1;
 const q=[0,1,2].map(r=>{let n=0,g=0;G.inv.forEach(x=>{if(gear(x)&&x.r<=r){n++;g+=goldOf(x)}});return`<button data-q="${r}">Up to ${RR[r][0]} (${n}, +${g})</button>`}).join('');
 $('#ib').innerHTML=`<div class="eq">Damage ${((8+(S.fdw||0))*ml*P.dm).toFixed(1)} · Health ${P.mhp} · Crit ${P.crit.toFixed(0)}% · Armor ${P.arm.toFixed(0)}% · Gold ${G.gold.toLocaleString()}</div><div class="ibody"><div class="lcol"><div class="doll">`
 +['h','m','k','w','c','o','n','g','b'].map(k=>cell(G.eq[k],'eq',k,SLN[k])).join('')+`</div><div class="lb">Pet</div><div class="row4">${cell(G.pet,'pet',0,'Pet')}</div><div class="lb">Abilities</div><div class="row4">${[0,1,2,3].map(i=>cell(G.ab[i],'ab',i,'Ability '+(i+1))).join('')}</div><div class="lb">Consumables</div><div class="row4">${[0,1,2,3].map(i=>cell(G.cs[i],'cs',i,'ZXCV'[i])).join('')}</div></div>`
 +`<div class="rcol"><div class="tools"><b>Pack ${G.inv.filter(Boolean).length}/${cap()}</b><button data-q="sort">Sort</button><button data-q="mode" class="${selMode?'a':''}">Select to salvage</button></div>${selMode?`<div class="tools">${q}<button data-q="clr">Clear</button></div><div class="tools"><span>${selSet.size} selected · <b>+${selTotal()} gold</b></span><button data-q="go" class="go">${cfT&&Date.now()-cfT<3000?'Click again to confirm':'Salvage selected'}</button></div>`:''}<div class="pack">`
 +Array.from({length:cap()},(_,i)=>cell(G.inv[i],'inv',i,'')).join('')+`</div></div></div><div id="det">${det(it,selI)}</div>`}
$('#ib').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;
 if(d.q!=null){const q=d.q;if(q=='sort')sortInv();else if(q=='mode'){selMode=!selMode;selSet.clear();selI=null}else if(q=='clr')selSet.clear();
  else if(q=='go'){if(!selSet.size)return;if(!cfT||Date.now()-cfT>3000){cfT=Date.now();rInv();return}let g=0;selSet.forEach(i=>{const x=G.inv[i];if(x&&!x.fv){g+=goldOf(x);G.inv[i]=null}});G.gold+=g;toast('Salvaged for '+g+' gold');selSet.clear();cfT=0;save()}
  else{G.inv.forEach((x,i)=>{if(x&&!x.fv&&'whrbcgknm'.includes(x.sl[0])&&x.sl.length==1&&x.r<=+q)selSet.add(i)})}rInv();return}
 if(!d.do||!selI)return;const s=selI,it=getC(s.c,s.k);if(!it)return;let ok=1;const[a,v]=d.do.split(':');
 if(a=='eq')ok=moveItem('inv',s.k,'eq',v);else if(a=='ab')ok=moveItem('inv',s.k,'ab',+v);else if(a=='cs')ok=moveItem('inv',s.k,'cs',+v);else if(a=='pet'){ok=moveItem('inv',s.k,'pet',0);if(ok){const o=al.find(q=>q.pet);if(o)o.dead=1;spawnPet()}}
 else if(a=='fav'){it.fv=it.fv?0:1;save();ok=0}else if(a=='sal'){const g=salvage(s.k);toast('Salvaged for '+g+' gold')}
 else if(a=='un'){const f=G.inv.indexOf(null);if(f<0)toast('Pack is full');else ok=moveItem(s.c,s.k,'inv',f);if(s.c=='pet'){const o=al.find(q=>q.pet);if(o)o.dead=1}}
 if(ok!==0)selI=null;rAb();rCb();rInv()});
$('#ib').addEventListener('pointerdown',e=>{const c=e.target.closest('.cell');if(!c)return;dg={c:c.dataset.c,k:kk(c.dataset.c,c.dataset.k),x:e.clientX,y:e.clientY,on:0,g:null}});
addEventListener('pointermove',e=>{if(!dg)return;if(!dg.on&&Math.hypot(e.clientX-dg.x,e.clientY-dg.y)>7&&!selMode&&getC(dg.c,dg.k)){dg.on=1;const g=document.createElement('div');g.className='ghost';g.innerHTML=`<i class="ic" style="${icoIt(getC(dg.c,dg.k))}"></i>`;document.body.appendChild(g);dg.g=g}
 if(dg.on){dg.g.style.left=e.clientX-24+'px';dg.g.style.top=e.clientY-24+'px'}});
addEventListener('pointerup',e=>{if(!dg)return;const d=dg;dg=null;if(d.g)d.g.remove();const t=document.elementFromPoint(e.clientX,e.clientY),c=t&&t.closest('.cell');if(!c||!c.closest('#ib'))return;const tc=c.dataset.c,tk=kk(tc,c.dataset.k);
 if(d.on){if(moveItem(d.c,d.k,tc,tk)){selI=null;if(d.c=='pet'||tc=='pet'){const o=al.find(q=>q.pet);if(o)o.dead=1;spawnPet()}rAb();rCb();rInv()}return}
 if(selMode&&tc=='inv'){if(G.inv[tk]){selSet.has(tk)?selSet.delete(tk):selSet.add(tk)}rInv();return}
 selI={c:tc,k:tk};rInv()});
// ---- skill trees
const treeOpen=t=>{if(t.u.startsWith('race:'))return G.rc==t.u.slice(5);if(G.max<t.f)return false;if(t.u.startsWith('school:')||t.u.startsWith('flag:'))return!!G.disc[t.u.split(':')[1]];return true};
const lockWhy=t=>{const u=t.u.split(':')[1];if(t.u.startsWith('school:')&&!G.disc[u])return'Find a '+SCH[u][0]+' ability scroll to unlock this tree';if(t.u.startsWith('flag:')&&!G.disc[u])return{dual:'Equip or find an off-hand melee weapon to unlock this tree',beast:'Find an egg or a pet to unlock this tree',artisan:'Mine an ore or use a forge to unlock this tree'}[u];return'Reach floor '+t.f+' to unlock this tree'};
const visTrees=()=>TREES.filter(t=>!t.u.startsWith('race:')||t.u=='race:'+G.rc);
function nst(id){const n=ND[id],t=TBY[n.tk];if(G.own[id])return'own';if(!treeOpen(t))return'tree';if(G.max<n.mf)return'floor';if(n.rq.some(q=>!G.own[q]))return'req';return G.sp<n.c?'sp':'ok'}
const npos=n=>n.ks?[180,880]:[60+n.j*120+(n.t%2?-8:8),160+(n.t-1)*88];
function rTree(){const vis=visTrees(),list=vis.filter(t=>showLock||treeOpen(t));if(!list.some(t=>t.k==tab))tab=(list[0]||vis[0]).k;const t=TBY[tab];let l='',b='';
 for(const id in ND){const n=ND[id];if(n.tk!=tab)continue;const[x,y]=npos(n),s=nst(id);
  for(const q of n.rq.length?n.rq:[null]){const a=q?npos(ND[q]):[180,56],sy=q?a[1]+30:a[1];l+=`<path class="${G.own[id]&&(!q||G.own[q])?'on':''}" d="M${a[0]} ${sy} C${a[0]} ${sy+40},${x} ${y-70},${x} ${y-28}"/>`}
  b+=`<button class="nd ${n.ks?'ks ':''}${s}${selN==id?' sel':''}" data-n="${id}" style="left:${x}px;top:${y}px" title="${esc(n.nm+': '+n.d)}"><i style="${ico('icons',n.ic,3)}"></i><b>${n.ks?'★':RO[n.t-1]}</b><span>${esc(n.nm.replace(/ [IVX]+$/,''))}</span></button>`}
 const lh=t.l.map((x,j)=>`<div class="lh" style="left:${60+j*120}px"><b>${esc(x[0])}</b><small>+${x[2]}${esc(x[3])}</small></div>`).join('');
 $('#tr').style.setProperty('--c',t.c);$('#tr').innerHTML=`<svg width="360" height="960">${l}</svg><div class="tt" style="left:180px;top:24px"><b>${esc(t.n)}</b></div>${lh}${b}${treeOpen(t)?'':`<div class="lw">${esc(lockWhy(t))}</div>`}`;rOpt(list)}
function nodeInfo(n){const s=nst(n.id),m={own:'Owned',tree:lockWhy(TBY[n.tk]),floor:'Locked: reach floor '+n.mf,req:'Locked: buy the earlier nodes first',sp:'Need '+(n.c-G.sp)+' more skill point'+(n.c-G.sp>1?'s':''),ok:'Ready to buy'}[s];
 return`<div class="nh"><i style="${ico('icons',n.ic,3)}"></i><div><b>${esc(n.nm)}</b><br><span class="mu">${n.ks?'Keystone':'Tier '+n.t}</span></div></div><p>${esc(n.d)}</p><p class="mu">${s=='own'?'':n.c+' skill point'+(n.c>1?'s':'')+' · '}${m}</p>${s=='ok'?'<button data-a="buy" class="go">Buy</button>':''}`}
function rOpt(list){const n=selN&&ND[selN]&&ND[selN].tk==tab?ND[selN]:null,hid=visTrees().filter(x=>!treeOpen(x)).length;
 $('#opt').innerHTML=`<div class="lvb"><b>Level ${G.lvl}</b><div class="xb"><div style="width:${Math.min(100,G.xp/xpNeed(G.lvl)*100)}%"></div></div><small>${Math.floor(G.xp)} / ${xpNeed(G.lvl)} xp</small><div class="spb">${G.sp} skill point${G.sp==1?'':'s'}</div></div>
 <div class="tl">${list.map(x=>`<button class="tb${x.k==tab?' a':''}${treeOpen(x)?'':' lk'}" data-t="${x.k}" style="--c:${x.c}"><i style="${ico('icons',treeOpen(x)?(ICO[x.l[0][1]]||'gem'):'lock',2)}"></i>${esc(x.n)}</button>`).join('')}</div>
 <button data-a="lock" class="${showLock?'a':''}">${showLock?'Hide':'Show'} locked trees (${hid})</button><div class="ni">${n?nodeInfo(n):'<p class="mu">Select a node to read about it. Higher tiers need deeper floors. School trees unlock when you find an ability scroll of that school.</p>'}</div><button data-a="respec">${cfT&&Date.now()-cfT<3000?'Click again to respec':'Respec (costs '+respecCost()+' gold)'}</button>`}
function buyNode(id){if(nst(id)!='ok')return;G.sp-=ND[id].c;G.own[id]=1;calc();save();rTree()}
$('#tr').addEventListener('click',e=>{const b=e.target.closest('[data-n]');if(!b)return;const id=b.dataset.n;if(selN===id&&nst(id)=='ok')buyNode(id);else{selN=id;rTree()}});
$('#opt').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const a=b.dataset.a;
 if(b.dataset.t){tab=b.dataset.t;selN=null;rTree()}else if(a=='lock'){showLock=!showLock;rTree()}else if(a=='buy'&&selN)buyNode(selN);
 else if(a=='respec'){if(!cfT||Date.now()-cfT>3000){cfT=Date.now();rTree();return}cfT=0;if(respec()){selN=null;toast('Skill points refunded')}else toast('You need '+respecCost()+' gold to respec');rTree()}});
// ---- shop
function openShop(npc){shopS={npc,sel:null,line:npc.line};showOv('shp');rShop()}
function rShop(){const n=shopS.npc;
 $('#shp').innerHTML=`<div class="pn wide"><div class="hd"><span>${esc(n.name)}'s wares</span><b>${G.gold.toLocaleString()} gold</b><span class="sp"></span><button data-x>Leave</button></div><div class="dlg"><canvas id="npcv" width="64" height="64"></canvas><p>"${esc(shopS.line)}"</p></div><div class="pack shg">`
 +n.stock.map((it,i)=>G.sold.includes(i)?`<div class="cell emp"><small>Sold</small></div>`:`<div class="cell${shopS.sel==i?' sel':''}" data-i="${i}" style="--c:${RR[it.r][1]}"><i class="ic" style="${icoIt(it)}"></i><u>${it.sl=='cn'?it.n:it.lv}</u><s class="pr">${price(it)}</s></div>`).join('')+`</div><div id="sdet">${shopS.sel!=null&&n.stock[shopS.sel]&&!G.sold.includes(shopS.sel)?det(n.stock[shopS.sel],{c:'shop',k:0})+`<div class="srow"><b>${price(n.stock[shopS.sel])} gold</b><button data-a="buy" class="go">Buy</button></div>`:'<p class="mu">Select something to inspect it. Salvage unwanted gear in your pack for gold (press I).</p>'}</div></div>`;
 const c=$('#npcv'),x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#1b1626';x.fillRect(0,0,64,64);const a=ATLAS.mobs[n.sp];x.drawImage(IM.mobs,a[0],a[1],16,16,0,0,64,64)}
$('#shp').addEventListener('click',e=>{if(e.target==$('#shp')){closeOv();return}if(e.target.closest('[data-x]')){toast(pk(SHL.bye));closeOv();return}
 const c=e.target.closest('.cell[data-i]');if(c){shopS.sel=+c.dataset.i;rShop();return}
 const b=e.target.closest('[data-a=buy]');if(!b)return;const i=shopS.sel,it=shopS.npc.stock[i];if(!it||G.sold.includes(i))return;
 if(G.gold<price(it)){shopS.line=pk(SHL.poor)}else{const cp=JSON.parse(JSON.stringify(it));if(!addInv(cp))shopS.line=pk(SHL.full);else{G.gold-=price(it);G.sold.push(i);shopS.line=pk(SHL.buy);shopS.sel=null;calc();save();rCb()}}rShop()});
// ---- forge
const PKC=[null,{copper:8,iron:6},{iron:10,silver:6},{silver:10,mythril:6},{mythril:10,voidstone:6}];
function upCost(n){const d=Math.max(.3,1-(S.forge||0)/100),m={};if(n<=3)m.copper=n+2;if(n>=2&&n<=6)m.iron=n;if(n>=5)m.silver=n-3;if(n>=8)m.mythril=n-6;for(const k in m)m[k]=Math.max(1,Math.round(m[k]*d));return{g:Math.round(50*Math.pow(n,1.5)*d),m}}
const rrCost=it=>{const d=Math.max(.3,1-(S.forge||0)/100);return{g:Math.round((80+30*it.l)*d),m:{iron:Math.max(1,Math.round(3*d))}}};
const canPay=c=>G.gold>=c.g&&Object.keys(c.m).every(k=>(G.mats[k]||0)>=c.m[k]),payS=c=>{G.gold-=c.g;for(const k in c.m)G.mats[k]-=c.m[k]},costT=c=>c.g+' gold'+Object.keys(c.m).map(k=>', '+c.m[k]+' '+k).join('');
const forgeList=()=>{const o=[];for(const k in G.eq)if(G.eq[k])o.push({c:'eq',k,it:G.eq[k]});G.inv.forEach((it,i)=>{if(it&&'whrbcgknm'.includes(it.sl[0])&&it.sl.length==1)o.push({c:'inv',k:i,it})});return o};
function openForge(){G.disc.artisan=1;fgSel=null;showOv('fg');rForge()}
function rForge(){const ls=forgeList(),s=fgSel&&getC(fgSel.c,fgSel.k)?fgSel:null,it=s?getC(s.c,s.k):null,pc=PKC[G.pick];
 $('#fg').innerHTML=`<div class="pn wide"><div class="hd"><span>Forge</span><b>${G.gold.toLocaleString()} gold</b><span class="sp"></span><button data-x>Close</button></div><div class="mb"><div class="mats">${ORES.map(o=>`<span title="${o[1]} ore"><i class="ic s" style="${ico('items','ore_'+o[0],2)}"></i>${G.mats[o[0]]||0}</span>`).join('')}</div>
 <p class="mu">Upgrade gear (+1 to +10, each +6% stats), reroll its bonus stats, or upgrade your pickaxe to mine rarer ore. Mine ore from veins in the walls (hold F).</p>
 <div class="pack">${ls.map(x=>cell(x.it,'fg',x.c+':'+x.k,'')).join('')||'<small>No gear.</small>'}</div>
 <div id="sdet">${it?`${det(it,{c:'fg',k:0})}${it.up<10?`<div class="srow"><span>Upgrade to +${it.up+1}: ${costT(upCost(it.up+1))}</span><button data-a="up" ${canPay(upCost(it.up+1))?'class="go"':''}>Upgrade</button></div>`:'<p class="mu">Fully upgraded.</p>'}<div class="srow"><span>Reroll bonus stats: ${costT(rrCost(it))}</span><button data-a="rr" ${canPay(rrCost(it))?'class="go"':''}>Reroll</button></div>`:'<p class="mu">Select a piece of gear.</p>'}</div>
 <div class="srow"><span>Pickaxe tier ${G.pick}/5${pc?': next costs '+Object.keys(pc).map(k=>pc[k]+' '+k).join(', ')+', '+150*G.pick*G.pick+' gold':' (maxed)'}</span>${pc?`<button data-a="pk" ${canPay({g:150*G.pick*G.pick,m:pc})?'class="go"':''}>Upgrade pickaxe</button>`:''}</div></div></div>`}
$('#fg').addEventListener('click',e=>{if(e.target==$('#fg')){closeOv();return}if(e.target.closest('[data-x]')){closeOv();return}
 const c=e.target.closest('.cell[data-c=fg]');if(c){const[a,b]=c.dataset.k.split(':');fgSel={c:a,k:kk(a,b)};rForge();return}
 const b=e.target.closest('[data-a]');if(!b||!fgSel)return;const it=getC(fgSel.c,fgSel.k),a=b.dataset.a;
 if(a=='up'&&it&&it.up<10){const c=upCost(it.up+1);if(canPay(c)){payS(c);it.up++;calc();save();ring(p.x,p.y,40,'#ffd24a',.5,3);toast(it.nm+' is now +'+it.up)}else toast('Not enough gold or ore')}
 else if(a=='rr'&&it){const c=rrCost(it);if(canPay(c)){payS(c);const m=RR[it.r][2],keep={},bk=it.sl=='w'||it.sl=='r'?['fd']:{h:['hp','arm'],c:['hp','arm'],b:['spd','arm'],g:['arm'],k:['hp']}[it.sl]||[];bk.forEach(k=>{if(k in it.st)keep[k]=it.st[k]});
   const na=Object.keys(it.st).length-Object.keys(keep).length,pool=POOL[it.sl].filter(k=>!(k in keep)).sort(()=>R()-.5);for(let i=0;i<na&&i<pool.length;i++)keep[pool[i]]=afv(pool[i],it.l,m);it.st=keep;calc();save();toast('Bonus stats rerolled')}else toast('Not enough gold or ore')}
 else if(a=='pk'){const pc=PKC[G.pick],c={g:150*G.pick*G.pick,m:pc};if(pc&&canPay(c)){payS(c);G.pick++;save();toast('Pickaxe upgraded to tier '+G.pick)}else toast('Not enough gold or ore')}rForge()});
