let tt,abEl=[],NC,NS,pvd=0,selI=null,tab=0,selN=null;
const uiOpen=()=>!!$('.ov.on');
function showOv(id){$$('.ov').forEach(o=>o.classList.remove('on'));$('#'+id).classList.add('on')}
function closeOv(){$$('.ov').forEach(o=>o.classList.remove('on'))}
function togOv(id){if(scene!='play'||p.dead)return;const was=$('#'+id).classList.contains('on');closeOv();if(!was){showOv(id);if(id=='sv')rTree();if(id=='iv')rInv()}}
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');clearTimeout(tt);tt=setTimeout(()=>e.classList.remove('on'),2600)}
function modal(h){$('#md').innerHTML='<div class="pn">'+h+'</div>';showOv('md')}
// ---- HUD
function rAb(){const b=$('#ab');b.className=CFG.side;if(!G){b.innerHTML='';abEl=[];return}
 b.innerHTML=G.ab.map((it,i)=>{if(!it)return`<div class="as e" data-i="${i}"><span class="k">${i+1}</span></div>`;const a=AB[it.t],s=SCH[a.s];
  return`<div class="as" data-i="${i}" style="--c:${s[2]}"><span class="k">${i+1}</span><b>${s[1]}</b><span class="n">${a.n}</span><u>Lv ${it.lv}</u><i class="cd"></i><em></em></div>`}).join('');
 abEl=[...b.children].map(e=>({cd:e.querySelector('.cd'),em:e.querySelector('em')}))}
function hud(){$('#hp').style.width=Math.max(0,p.hp/P.mhp*100)+'%';$('#ht').textContent=Math.ceil(Math.max(0,p.hp))+' / '+P.mhp;
 $('#fl').textContent='Floor '+G.floor+', room '+G.room+'/5'+(rt=='boss'?' (boss)':rt=='fight'?', '+es.length+' left':'');$('#so').textContent=G.souls.toLocaleString()+' ✦';$('#po').textContent='🧪 '+G.pot;
 abEl.forEach((x,i)=>{if(!x.cd)return;x.cd.style.height=(p.acm[i]?p.acd[i]/p.acm[i]*100:0)+'%';x.em.textContent=p.acd[i]>0?p.acd[i].toFixed(1):''})}
$('#ab').addEventListener('pointerdown',e=>{const s=e.target.closest('.as');if(s&&scene=='play'&&!uiOpen())useAb(+s.dataset.i)});
$('#bs').onclick=()=>togOv('sv');$('#bi').onclick=()=>togOv('iv');$('#bm').onclick=()=>{if(uiOpen())closeOv();else modPause()};
// ---- main menu
function rMain(){$('#mm').innerHTML=`<div class="pn big"><div class="ttl">Ember Depths</div><p class="mu c">An endless dungeon built from a seed. Choose a slot.</p>`+[0,1,2].map(i=>{const s=getSlot(i);
 return`<div class="slot"><div>${s&&RACES[s.rc]&&CLS[s.cl]?`<b>${esc(s.nm)}</b><br><small>${RACES[s.rc].n} ${CLS[s.cl].n} · floor ${s.floor} (best ${s.max}) · seed ${esc(s.seed)}</small>`:'<i class="mu">Empty slot</i>'}</div><span>${s?`<button data-a="play" data-i="${i}">Continue</button> <button data-a="del" data-i="${i}">Delete</button>`:`<button data-a="new" data-i="${i}">New character</button>`}</span></div>`}).join('')
 +`<div class="srow"><button data-a="imp">Import code</button><button data-a="set">Settings</button></div></div>`}
$('#mm').addEventListener('click',e=>{const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a,i=+b.dataset.i;
 if(a=='play')playSlot(i);else if(a=='new')openCC(i);else if(a=='imp')modCode();else if(a=='set')modSettings('mm');
 else if(a=='del'){if(b.dataset.c){try{localStorage.removeItem('ed.slot'+i)}catch(x){}rMain()}else{b.dataset.c=1;b.textContent='Click again to delete'}}});
// ---- character creator
function openCC(slot){NC={nm:'Hero',rc:'human',cl:'warrior',sk:0,hs:0,hc:1,oc:0,seed:''};NS=slot;rCC();showOv('cc')}
const sw=(k,arr)=>`<div class="sw">${arr.map((c,i)=>`<i class="${NC[k]==i?'a':''}" data-${k}="${i}" style="background:${c}"></i>`).join('')}</div>`;
const chs=(k,o,f)=>`<div class="chs">${Object.keys(o).map(x=>`<button class="${NC[k]==x?'a':''}" data-${k}="${x}">${f(x)}</button>`).join('')}</div>`;
function rCC(){$('#cc').innerHTML=`<div class="pn big"><div class="hd"><span>Create your character</span><span class="sp"></span><button data-a="back">Back</button></div><div class="ccb"><div class="pv"><canvas id="pvc" width="128" height="160" data-a="turn" title="Click to turn"></canvas>
 <input id="nm" maxlength="14" value="${esc(NC.nm)}" placeholder="Name"><label class="mu">World seed <input id="sd" maxlength="16" value="${esc(NC.seed)}" placeholder="random"></label></div><div class="opts">
 <div class="lb">Race</div>${chs('rc',RACES,x=>RACES[x].n)}<p class="mu">${RACES[NC.rc].d}</p>
 <div class="lb">Class</div>${chs('cl',CLS,x=>CLS[x].n)}<p class="mu">${CLS[NC.cl].d}</p>
 <div class="lb">Skin</div>${sw('sk',SKIN)}<div class="lb">Hair style</div><div class="chs">${HAIRN.map((n,i)=>`<button class="${NC.hs==i?'a':''}" data-hs="${i}">${n}</button>`).join('')}</div>
 <div class="lb">Hair colour</div>${sw('hc',HAIRC)}<div class="lb">Outfit colour</div>${sw('oc',OUTC)}</div></div><div class="foot"><button data-a="start" class="go">Begin the descent</button></div></div>`;drawPv()}
function drawPv(){const c=$('#pvc');if(!c)return;const x=c.getContext('2d');x.imageSmoothingEnabled=false;x.fillStyle='#1b1626';x.fillRect(0,0,128,160);x.save();if(pvd==3){x.translate(128,0);x.scale(-1,1)}x.drawImage(heroC(NC,pvd==3?1:pvd,0),0,0,128,160);x.restore()}
$('#cc').addEventListener('click',e=>{const t=e.target.closest('[data-rc],[data-cl],[data-sk],[data-hs],[data-hc],[data-oc],[data-a]');if(!t)return;const d=t.dataset;
 if(d.a=='back'){showOv('mm');rMain();return}if(d.a=='start'){beginNew(NC,NS);return}if(d.a=='turn'){pvd=(pvd+1)%4;drawPv();return}
 for(const k of['rc','cl'])if(d[k]){NC[k]=d[k];if(k=='rc')NC.sk=RACES[d[k]].sk}for(const k of['sk','hs','hc','oc'])if(d[k]!=null)NC[k]=+d[k];rCC()});
$('#cc').addEventListener('input',e=>{if(e.target.id=='nm')NC.nm=e.target.value;if(e.target.id=='sd')NC.seed=e.target.value});
// ---- pause, settings, codes
function modPause(){modal(`<div class="hd"><span>Paused</span></div><div class="mb mcol"><button data-a="res">Resume</button><button data-a="sv">Save game</button><button data-a="inv">Pack and gear</button><button data-a="tr">Skill trees</button><button data-a="set">Settings</button><button data-a="ctl">Controls</button><button data-a="code">Export / import code</button><button data-a="quit">Save and quit to main menu</button></div>`)}
const srow=(l,k,o)=>`<div class="srow"><span>${l}</span><span>${o.map(x=>`<button class="${CFG[k]==x[0]?'a':''}" data-set="${k}:${x[0]}">${x[1]}</button>`).join('')}</span></div>`;
function modSettings(from){modal(`<div class="hd"><span>Settings</span></div><div class="mb">${srow('Ability bar','side',[['left','Left'],['right','Right']])}${srow('Screen shake','shake',[[1,'On'],[0,'Off']])}${srow('Damage numbers','num',[[1,'On'],[0,'Off']])}${srow('Dark vignette','vig',[[1,'On'],[0,'Off']])}<div class="srow"><span></span><button data-a="back" data-f="${from}">Back</button></div></div>`)}
function modCode(){modal(`<div class="hd"><span>Save code</span></div><div class="mb"><p class="mu">${G?'Copy this code to carry your character to another browser. ':''}Paste a code below and import it into an empty slot.</p><textarea id="cd" rows="5">${G?encG():''}</textarea><div class="srow"><button data-a="imp2">Import into empty slot</button><button data-a="back" data-f="${G?'pause':'mm'}">Back</button></div></div>`)}
function modControls(){modal(`<div class="hd"><span>Controls</span></div><div class="mb"><p>Move: WASD or arrows<br>Melee: left click or Space<br>Ranged weapon: right click or K<br>Abilities: 1 2 3 4<br>Dash: Shift<br>Potion: Q<br>Skill trees: T · Pack: I · Menu: Esc</p><p class="mu">Clear every enemy to open the green gate. Every fifth room is a boss. Weapons, armor and abilities level up the more you use them.</p><div class="srow"><span></span><button data-a="back" data-f="pause">Back</button></div></div>`)}
function showDeath(c){$('#dv').innerHTML=`<div class="pn"><div class="hd">You fell</div><div class="mb"><p>Checkpoint: floor ${c}. Your souls, skills and gear are safe.</p><button data-a="rise" class="go">Rise again</button></div></div>`;showOv('dv')}
$('#md').addEventListener('click',e=>{const s=e.target.closest('[data-set]');if(s){const[k,v]=s.dataset.set.split(':');CFG[k]=isNaN(v)?v:+v;svCfg();rAb();modSettings(s.closest('.pn').querySelector('[data-f]').dataset.f);return}
 const b=e.target.closest('[data-a]');if(!b)return;const a=b.dataset.a;
 if(a=='res')closeOv();else if(a=='sv'){save();toast('Game saved')}else if(a=='inv')togOv('iv');else if(a=='tr')togOv('sv');else if(a=='set')modSettings('pause');else if(a=='ctl')modControls();else if(a=='code')modCode();else if(a=='quit')toMenu();
 else if(a=='back'){if(b.dataset.f=='mm'){showOv('mm');rMain()}else modPause()}
 else if(a=='imp2'){try{const o=JSON.parse(decodeURIComponent(escape(atob($('#cd').value.trim())))),sl=[0,1,2].find(i=>!getSlot(i));if(sl==null)return toast('All slots are full. Delete one first.');const keep=G;loadG(o,sl);save();G=keep;toast('Imported into slot '+(sl+1));if(scene!='play'){showOv('mm');rMain()}}catch(x){toast('That code is not valid')}}});
$('#dv').addEventListener('click',e=>{if(e.target.closest('[data-a=rise]')){p.dead=0;p.rv=0;p.hp=P.mhp;closeOv();newRoom()}});
$$('.ov').forEach(o=>o.addEventListener('click',e=>{if(e.target==o&&['sv','iv','md'].includes(o.id)&&scene=='play')o.classList.remove('on');if(e.target.closest('[data-x]'))o.classList.remove('on')}));
// ---- inventory
const itOf=s=>s?(s.s=='inv'?G.inv[s.k]:s.s=='eq'?G.eq[s.k]:G.ab[s.k]):null;
const icn=it=>{const a=ATLAS.items[ic(it)];return`<i class="ic" style="background-position:-${a[0]*3}px -${a[1]*3}px"></i>`};
function cell(it,s,k,lab){const on=selI&&selI.s==s&&selI.k==k;return`<div class="cell${on?' sel':''}${it?'':' emp'}" data-s="${s}" data-k="${k}" ${it?`style="--c:${RR[it.r][1]}"`:''}>${it?icn(it)+(it.sl=='ab'?`<b class="bg">${SCH[AB[it.t].s][1]}</b>`:'')+`<u>${it.lv}</u>`:`<small>${lab}</small>`}</div>`}
function stl(it){const C=CLS[G.cl],Rc=RACES[G.rc],ib=1+(S.ibst||0)/100,f=(it.sl=='w'||it.sl=='r')?1+(C.fv.includes(it.t)?.25:0)+(Rc.fv.includes(it.t)?.15:0):1;
 return Object.keys(it.st).map(k=>'+'+(it.st[k]*LM(it)*ib*(k=='fd'?f:1)).toFixed(k=='hp'?0:1)+AF[k][2]).join('<br>')}
function det(it,s){if(!it)return'<p class="mu">Select an item to inspect it. Everything you use levels up: weapons when they hit, armor when you take hits, jewelry on kills, abilities when cast.</p>';
 const q=RR[it.r];let h=`<div class="dh" style="color:${q[1]}"><b>${esc(it.nm)}</b> <small>${q[0]} ${it.sl=='ab'?'ability':SLN[it.sl]}</small></div><div class="mu">Item level ${it.lv}${it.lv<12?` (${Math.floor(it.xp)}/${need(it.lv)} xp)`:' (max)'}</div>`;
 if(it.sl=='ab'){const a=AB[it.t],sc=SCH[a.s];h+=`<div>${sc[1]} ${sc[0]} · ${KIND[a.k]}</div><div class="mu">Cooldown ${a.cd}s${a.d?' · power '+Math.round(a.d*100*(1+.08*(it.lv-1)))+'%':''}${a.st?' · applies '+a.st:''}</div>`}
 else{const w=WT[it.t];if(w){const C=CLS[G.cl],Rc=RACES[G.rc];h+=`<div class="mu">Reach ${Math.round((w.rc||0)*(1+(S.reach||0)/100))||'ranged'} · ${(1/w.cd).toFixed(1)} attacks/s${w.n2?' · '+w.n2+' pellets':''}${w.pr?' · pierces':''}</div>`;if(C.fv.includes(it.t))h+='<div class="fv">Class favored: +25% damage</div>';if(Rc.fv.includes(it.t))h+='<div class="fv">Race favored: +15% damage</div>'}h+=`<div>${stl(it)}</div>`}
 const b=[];if(s.s=='inv'){if(it.sl=='ab')for(let i=0;i<4;i++)b.push(`<button data-do="slot${i}">Slot ${i+1}</button>`);else b.push('<button data-do="equip">Equip</button>');b.push(`<button data-do="salvage">Salvage +${val(it)} ✦</button>`)}else b.push('<button data-do="unequip">Unequip</button>');
 return h+`<div class="srow">${b.join('')}</div>`}
function rInv(){if(selI&&!itOf(selI))selI=null;const it=itOf(selI),ml=G.eq.w?WT[G.eq.w.t].dm:FIST.dm;
 $('#ib').innerHTML=`<div class="eq">Damage ${((8+(S.fdw||0))*ml*P.dm).toFixed(1)} · Health ${P.mhp} · Crit ${P.crit.toFixed(0)}% · Armor ${P.arm.toFixed(0)}% · Potions ${G.pot} (Q)</div><div class="ibody"><div class="doll">`
 +Object.keys(SLN).map(k=>cell(G.eq[k],'eq',k,SLN[k])).join('')+[0,1,2,3].map(i=>cell(G.ab[i],'ab',i,'Ability '+(i+1))).join('')
 +`</div><div class="pack">`+Array.from({length:cap()},(_,i)=>cell(G.inv[i],'inv',i,'')).join('')+`</div></div><div id="det">${det(it,selI)}</div>`}
$('#ib').addEventListener('click',e=>{const c=e.target.closest('.cell');if(c){selI={s:c.dataset.s,k:c.dataset.s=='eq'?c.dataset.k:+c.dataset.k};rInv();return}
 const b=e.target.closest('[data-do]');if(!b||!selI)return;const d=b.dataset.do,s=selI;
 if(d=='equip')equipInv(s.k);else if(d=='unequip'){if(s.s=='eq')unequip(s.k);else unslotAb(s.k)}else if(d=='salvage')salvage(s.k);else if(d.startsWith('slot'))slotAb(s.k,+d[4]);
 selI=null;rAb();rInv()});
// ---- skill trees
const treeOpen=i=>{const t=TL[i];if(t[6])return t[6]==G.rc;if(t[5])return!!G.disc[t[5]]&&G.max>=t[2];return G.max>=t[2]};
const lockWhy=i=>{const t=TL[i];return t[5]&&!G.disc[t[5]]?`Find a ${SCH[t[5]][0]} ability scroll to unlock this tree`:`Reach floor ${t[2]} to unlock this tree`};
function nst(id){const n=ND[id];if(G.own[id])return'own';if(!treeOpen(n.ti))return'tree';if(G.max<n.mf)return'floor';if(n.rq.some(q=>!G.own[q]))return'req';return G.souls<n.c?'cost':'ok'}
const npos=n=>n.ks?[180,712]:[60+n.j*120+(n.t%2?-9:9),140+(n.t-1)*66];
function rTree(){const vis=TL.map((t,i)=>i).filter(i=>!TL[i][6]||TL[i][6]==G.rc);if(!vis.includes(tab))tab=vis[0];const t=TL[tab];let l='',b='';
 $('#sb').textContent=G.souls.toLocaleString()+' ✦';
 $('#tabs').innerHTML=vis.map(i=>`<button data-t="${i}" class="${i==tab?'a':''}" style="--c:${TL[i][1]}">${treeOpen(i)?'':'🔒 '}${TL[i][0]}</button>`).join('');
 for(const id in ND){const n=ND[id];if(n.ti!=tab)continue;const[x,y]=npos(n),s=nst(id);
  for(const q of n.rq.length?n.rq:[null]){const a=q?npos(ND[q]):[180,28];l+=`<path class="${G.own[id]&&(!q||G.own[q])?'on':''}" d="M${a[0]} ${a[1]} C${a[0]} ${a[1]+34},${x} ${y-34},${x} ${y}"/>`}
  b+=`<button class="nd ${n.ks?'ks ':''}${s}" data-n="${id}" style="left:${x}px;top:${y}px">${n.ks?'★':RO[n.t-1]}</button>`}
 const lh=t[3].map((x,j)=>`<div class="lh" style="left:${60+j*120}px"><b>${x[0]}</b><small>+${x[2]}${x[3]}</small></div>`).join('');
 $('#tr').style.setProperty('--c',t[1]);$('#tr').innerHTML=`<svg width="360" height="780">${l}</svg><div class="rt" style="left:180px;top:28px">◆</div>${lh}${b}<div class="lh" style="left:180px;top:752px"><small>${treeOpen(tab)?'':lockWhy(tab)}</small></div>`;inf(selN&&ND[selN]&&ND[selN].ti==tab?selN:null)}
function inf(id){selN=id;const e=$('#inf');if(!id){e.innerHTML='<span class="mu">Hover or tap a node to read it, then click or tap again to buy. Higher tiers need deeper floors. School trees unlock when you find an ability of that school.</span>';return}
 const n=ND[id],s=nst(id),m={own:'Owned',tree:lockWhy(n.ti),floor:'Locked: reach floor '+n.mf,req:'Locked: buy the earlier nodes first',cost:'Need '+(n.c-G.souls).toLocaleString()+' more souls',ok:'Ready to buy'}[s];
 e.innerHTML=`<b>${n.nm}</b> &nbsp; ${n.d}<br><span class="mu">${s=='own'?'':n.c.toLocaleString()+' ✦ · '}${m}</span>`}
function buy(id){if(nst(id)!='ok'){inf(id);return}G.souls-=ND[id].c;G.own[id]=1;calc();save();rTree()}
$('#tabs').addEventListener('click',e=>{const b=e.target.closest('[data-t]');if(b){tab=+b.dataset.t;selN=null;rTree()}});
$('#tr').addEventListener('pointerover',e=>{const b=e.target.closest('[data-n]');if(b&&e.pointerType=='mouse')inf(b.dataset.n)});
$('#tr').addEventListener('click',e=>{const b=e.target.closest('[data-n]');if(!b)return;const id=b.dataset.n;if(selN===id)buy(id);else inf(id)});
document.documentElement.style.setProperty('--isz',(ATLAS.sheets.items[0]*3)+'px '+(ATLAS.sheets.items[1]*3)+'px');
