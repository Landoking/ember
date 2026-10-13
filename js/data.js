const RR=[['Common','#a9a3ba',1],['Fine','#4fc98a',1.2],['Rare','#5b9bf0',1.45],['Epic','#b57cf0',1.8],['Mythic','#f0a23c',2.3]];
const SKIN=['#f6d6bd','#e4b48c','#c48a60','#8a5a3c','#5e3b28','#8fbf6a','#b9c2d9'];
const HAIRC=['#2a1a12','#6b3b1e','#c58b3c','#ead9a2','#c4c4cc','#b03a2a','#3a62b0','#7a3fb0'];
const OUTC=['#b03a3c','#2f6fb0','#3a8f4c','#c9a227','#6a3fa0','#33333f','#d0d0d8','#b8601e'];
const HAIRN=['Short','Long','Spiky','Mohawk','Ponytail'];
const CLS_IDX={warrior:0,rogue:1,ranger:2,mage:3,gunner:4};
const SCH={fire:['Pyromancy','🔥','#ff8a3c'],frost:['Cryomancy','❄️','#7fd4ff'],storm:['Stormcalling','⚡','#ffe14a'],shadow:['Shadowcraft','🌑','#a06bff'],holy:['Radiance','✨','#ffe9a0'],nature:['Verdancy','🍃','#6ddb7a'],phys:['Warcraft','⚔️','#d0d0d8']};
const RACES={
human:{n:'Human',d:'Adaptable and ambitious. +5% to everything. Favors swords and pistols.',fv:['sword','pistol'],st:[['all',5]],sk:0,tr:['Versatility','#d9b45a',[['Adaptable','dmg',2,'% damage'],['Resourceful','soul',4,'% souls'],['Determined','hp',8,' max health']],['Indomitable',[['all',10]],'+10% to all stats']]},
elf:{n:'Elf',d:'Swift and attuned to magic. +10% move speed, +10% ability power. Favors bows and spears.',fv:['bow','spear'],st:[['spd',10],['ap',10]],sk:0,tr:['Sylvan Grace','#7fd8a0',[['Swiftfoot','spd',3,'% move speed'],['Keen Eyes','crit',1.5,'% crit chance'],['Arcane Kin','ap',5,'% ability power']],['Moonlit Focus',[['cdr',15],['ap',15]],'+15% cooldown reduction, +15% ability power']]},
dwarf:{n:'Dwarf',d:'Stout and stubborn. +60 health, +5% armor. Favors axes, maces and rifles.',fv:['axe','mace','rifle'],st:[['hp',60],['arm',5]],sk:2,tr:['Stonebound','#c0a070',[['Stoneskin','arm',2,'% armor'],['Hardy','hp',14,' max health'],['Forgeborn','ibst',4,'% item power']],['Mountain Heart',[['arm',10],['hp',120]],'+10% armor, +120 max health']]},
orc:{n:'Orc',d:'Brutal and relentless. +12% damage, +2% lifesteal. Favors axes, greatswords and maces.',fv:['axe','greatsword','mace'],st:[['dmg',12],['steal',2]],sk:5,tr:['Bloodrage','#e5534b',[['Savagery','dmg',4,'% damage'],['Thick Hide','hp',14,' max health'],['Bloodlust','steal',1,'% lifesteal']],['Warchief',[['dmg',20],['aspd',15]],'+20% damage, +15% attack speed']]},
undead:{n:'Revenant',d:'Risen and patient. +1 regen/s, +10% souls. Favors daggers and crossbows.',fv:['dagger','crossbow'],st:[['regen',1],['soul',10]],sk:6,tr:['Gravebound','#9aa7c7',[['Deathless','regen',.5,' regen per second'],['Soulleech','soul',5,'% souls'],['Cold Touch','ap',4,'% ability power']],['Undying',[['rev',1],['steal',6]],'Survive one killing blow per floor, +6% lifesteal']]}};
const CLS={
warrior:{n:'Warrior',d:'Frontline fighter. +50 health, +6% armor. Favors swords, axes, maces and greatswords.',fv:['sword','axe','mace','greatsword'],st:[['hp',50],['arm',6]],w:'sword',r:null,a:'shockwave'},
rogue:{n:'Rogue',d:'Fast and lethal. +8% crit, +25% crit damage, +6% speed. Favors daggers and bows.',fv:['dagger','bow'],st:[['crit',8],['critd',25],['spd',6]],w:'dagger',r:'bow',a:'shadowstep'},
ranger:{n:'Ranger',d:'Hunter at range. +20% ranged damage, +10% fire rate. Favors bows, crossbows and spears.',fv:['bow','crossbow','spear'],st:[['rdmg',20],['rspd',10]],w:'spear',r:'bow',a:'thorns'},
gunner:{n:'Gunslinger',d:'Deadeye with powder. +25% ranged damage, +5% crit. Favors pistols, rifles and shotguns.',fv:['pistol','rifle','shotgun'],st:[['rdmg',25],['crit',5]],w:'sword',r:'pistol',a:'concuss'},
mage:{n:'Mage',d:'Master of spells. +30% ability power, +10% cooldown reduction. Favors daggers and spears.',fv:['dagger','spear'],st:[['ap',30],['cdr',10]],w:'dagger',r:null,a:'fireball'}};
const WT={
sword:{n:'Sword',sl:'w',dm:1,cd:.42,rc:58,ar:1.9,kb:200,nm:['Blade','Saber','Falchion']},
greatsword:{n:'Greatsword',sl:'w',dm:1.9,cd:.82,rc:76,ar:2.5,kb:360,nm:['Claymore','Zweihander']},
dagger:{n:'Dagger',sl:'w',dm:.6,cd:.24,rc:42,ar:1.3,kb:80,nm:['Dirk','Kris','Stiletto']},
axe:{n:'Axe',sl:'w',dm:1.35,cd:.6,rc:54,ar:2.1,kb:260,nm:['Hatchet','Cleaver','Waraxe']},
mace:{n:'Mace',sl:'w',dm:1.55,cd:.68,rc:50,ar:1.7,kb:480,nm:['Mace','Flail','Maul']},
spear:{n:'Spear',sl:'w',dm:1.1,cd:.5,rc:92,ar:.4,th:1,kb:220,nm:['Spear','Pike','Lance']},
bow:{n:'Bow',sl:'r',dm:1.15,cd:.55,sp:560,pr:0,nm:['Shortbow','Longbow','Recurve']},
crossbow:{n:'Crossbow',sl:'r',dm:2.3,cd:1.05,sp:760,pr:1,nm:['Crossbow','Arbalest']},
pistol:{n:'Pistol',sl:'r',dm:.85,cd:.34,sp:860,pr:0,nm:['Flintlock','Revolver','Pistol']},
rifle:{n:'Rifle',sl:'r',dm:2.7,cd:1.1,sp:1100,pr:2,nm:['Rifle','Musket','Carbine']},
shotgun:{n:'Shotgun',sl:'r',dm:.62,cd:.95,sp:700,pr:0,n2:6,sd:.38,nm:['Blunderbuss','Shotgun']}};
const FIST={n:'Fists',dm:.5,cd:.4,rc:40,ar:1.6,kb:120};
const ARM={h:{t:'helm',nm:['Helm','Cap','Hood','Crown']},c:{t:'chest',nm:['Plate','Mail','Robe','Jerkin']},b:{t:'boots',nm:['Boots','Greaves','Sandals']},n:{t:'ring',nm:['Ring','Band','Signet']},m:{t:'amulet',nm:['Amulet','Talisman','Pendant']}};
const SLN={w:'Weapon',r:'Ranged',h:'Helm',c:'Chest',b:'Boots',n:'Ring',m:'Amulet'};
const AF={dmg:[3,.35,'% damage'],crit:[1.2,.12,'% crit chance'],critd:[6,.5,'% crit damage'],aspd:[3,.25,'% attack speed'],spd:[2,.12,'% move speed'],reach:[3,.2,'% reach'],hp:[8,2.2,' health'],regen:[.2,.03,' regen/s'],arm:[1,.15,'% armor'],soul:[4,.4,'% souls'],drop:[3,.25,'% drops'],steal:[.8,.05,'% lifesteal'],ap:[4,.4,'% ability power'],cdr:[3,.25,'% cooldown reduction'],rdmg:[4,.4,'% ranged damage'],rspd:[3,.25,'% fire rate'],fd:[0,0,' damage']};
const POOL={w:['aspd','reach','crit','critd','dmg','steal','ap'],r:['rspd','rdmg','crit','critd','dmg'],h:['hp','arm','regen','spd','dmg','cdr'],c:['hp','arm','regen','spd','dmg','cdr'],b:['hp','arm','regen','spd','dmg','cdr'],n:['dmg','crit','critd','aspd','spd','hp','regen','arm','soul','drop','steal','ap','cdr','rdmg','rspd','reach'],m:['dmg','crit','critd','aspd','spd','hp','regen','arm','soul','drop','steal','ap','cdr','rdmg','rspd','reach']};
const PF=[['Rusty','Worn','Crude'],['Sturdy','Keen','Polished'],['Runed','Tempered','Gilded'],['Cursed','Arcane','Savage'],['Godforged','Voidtouched','Eternal']];
// abilities: id,name,school,tier,cooldown,kind,params. d = damage multiplier
const AB={};const A=(id,n,s,t,cd,k,o)=>AB[id]=Object.assign({n,s,t,cd,k,d:0},o);
A('fireball','Fireball','fire',1,5,'proj',{d:2.4,sp:380,ex:60,st:'burn'});
A('emberfan','Ember Fan','fire',1,6,'proj',{d:.9,n2:5,sd:.22,sp:420,st:'burn'});
A('flamering','Ring of Fire','fire',2,9,'nova',{d:2.2,rad:110,st:'burn'});
A('dragonbreath','Dragon Breath','fire',3,8,'cone',{d:3,rad:150,ar:.9,st:'burn',kb:200});
A('meteor','Meteor','fire',4,16,'zone',{d:7,rad:90,dl:.9,rg:340});
A('iceshard','Ice Shard','frost',1,5,'proj',{d:1.1,n2:3,sd:.18,sp:460,st:'chill'});
A('frostnova','Frost Nova','frost',2,10,'nova',{d:2,rad:120,st:'chill'});
A('blizzard','Blizzard','frost',3,15,'zone',{d:.7,rad:100,dl:.3,dur:4,tk:.4,st:'chill',rg:260});
A('glacial','Glacial Lance','frost',3,9,'ray',{d:4.5,w:18,rg:420,st:'chill'});
A('lightning','Chain Lightning','storm',2,7,'chain',{d:2,n2:4,rg:150,st:'shock'});
A('thunder','Thunderclap','storm',1,8,'nova',{d:1.6,rad:100,st:'shock',kb:300});
A('stormcall','Storm Call','storm',4,18,'zone',{d:1.8,rad:110,dl:.4,dur:5,tk:.5,st:'shock',rg:240});
A('arcdash','Arc Dash','storm',2,8,'blink',{d:2,dist:170,st:'shock'});
A('haste','Haste','storm',1,16,'buff',{b:[['spd',40],['aspd',30]],dur:6});
A('shadowstep','Shadow Step','shadow',1,6,'blink',{dist:190});
A('souldrain','Soul Drain','shadow',3,12,'nova',{d:1.7,rad:130,hl:.5});
A('darkbolt','Dark Bolt','shadow',1,4,'proj',{d:2,sp:520,pr:1});
A('voidray','Void Ray','shadow',4,14,'ray',{d:6,w:26,rg:520});
A('summon','Call Minions','shadow',3,10,'spawn',{nodrop:1});
A('bonering','Bone Ring','shadow',3,8,'proj',{d:.9,n2:14,sd:.4488,sp:170});
A('mend','Mending Light','holy',1,14,'heal',{pc:35});
A('smite','Smite','holy',2,7,'zone',{d:3.5,rad:60,dl:.5,rg:300});
A('holynova','Holy Nova','holy',3,12,'nova',{d:2,rad:130,hp:18});
A('barrier','Barrier','holy',2,18,'shield',{pc:40,dur:10});
A('thorns','Thorn Volley','nature',1,6,'proj',{d:.8,n2:7,sd:.14,sp:430,st:'poison'});
A('poisoncloud','Poison Cloud','nature',2,12,'zone',{d:.5,rad:90,dl:.2,dur:6,tk:.5,st:'poison',rg:220});
A('regrowth','Regrowth','nature',2,20,'buff',{b:[['regen',6]],dur:8});
A('quake','Earthquake','nature',3,13,'nova',{d:2.6,rad:150,kb:420});
A('shockwave','Shockwave','phys',1,8,'cone',{d:1.8,rad:120,ar:1.2,kb:520});
A('warcry','War Cry','phys',2,20,'buff',{b:[['dmg',35],['aspd',25]],dur:8});
A('whirl','Whirlwind','phys',2,9,'nova',{d:2.4,rad:90,kb:260});
A('charge','Charge','phys',2,8,'blink',{d:2.6,dist:200,kb:300});
A('concuss','Concussive Blast','phys',1,9,'cone',{d:1.5,rad:130,ar:1,kb:380,st:'shock'});
A('stoneskin','Stoneskin','phys',2,18,'buff',{b:[['arm',35]],dur:8});
const KIND={proj:'Projectile',nova:'Burst around you',cone:'Cone blast',zone:'Targeted area',chain:'Chain',ray:'Piercing beam',blink:'Dash',heal:'Heal',buff:'Buff',shield:'Barrier',spawn:'Summon'};
const EOK=['proj','nova','cone','zone','chain','ray','blink'];
const EN={
slime:{n:'Slime',hp:22,sp:46,d:8,r:11,s:2,ai:0,sc:2,f:1},
bat:{n:'Cave Bat',hp:12,sp:100,d:6,r:8,s:2,ai:1,sc:2,f:1},
skeleton:{n:'Skeleton',hp:18,sp:56,d:7,r:10,s:3,ai:2,sc:2,f:2},
brute:{n:'Brute',hp:75,sp:40,d:16,r:14,s:5,ai:3,sc:2.4,f:3,hv:1},
cultist:{n:'Cultist',hp:20,sp:50,d:9,r:10,s:4,ai:4,sc:2,f:2,ab:['fireball','iceshard','darkbolt','thunder']},
wraith:{n:'Wraith',hp:34,sp:60,d:11,r:11,s:6,ai:4,sc:2.2,f:6,ab:['shadowstep','darkbolt','souldrain']}};
const BOSS=[
{n:'Warden',sp:'warden',c:'#d6483b',ab:['shockwave','charge','bonering']},
{n:'Broodmother',sp:'brood',c:'#58b84f',ab:['summon','thorns','poisoncloud']},
{n:'Lich',sp:'lich',c:'#9a63e0',ab:['darkbolt','frostnova','meteor','summon']},
{n:'Stone Golem',sp:'golem',c:'#9096a6',ab:['quake','shockwave','thunder']}];
// skill trees: [name,color,unlockFloor,[lane,key,value,suffix]x3,[keystone,[[key,value]],text],school]
const TREES=[
['Might','#e5534b',1,[['Brutality','dmg',5,'% damage'],['Precision','crit',2,'% crit chance'],['Ruthless','critd',10,'% crit damage']],['Berserker',[['rage',60]],'Up to +60% damage as your health drops']],
['Vitality','#3fb67c',1,[['Vigor','hp',14,' max health'],['Recovery','regen',.5,' health per second'],['Mending','heal',8,'% healing received']],['Second Wind',[['rev',1]],'Once per floor, survive a killing blow at half health']],
['Swiftness','#35b8d4',2,[['Fleet','spd',3,'% move speed'],['Frenzy','aspd',4,'% attack speed'],['Slipstream','dcd',5,'% faster dash']],['Phantom Rush',[['ph',1]],'Dashing damages enemies you pass through']],
['Bulwark','#5a8cee',4,[['Plating','arm',2,'% armor'],['Parry','blk',2,'% block chance'],['Spines','thorn',6,'% damage reflected']],['Aegis',[['aegis',1]],'A shield absorbs one hit each room']],
['Marksman','#d0b070',3,[['Deadly Aim','rdmg',6,'% ranged damage'],['Quickdraw','rspd',4,'% fire rate'],['Piercing','prc',.5,' pierce (rounds down)']],['Deadeye',[['rdmg',30],['crit',10]],'+30% ranged damage, +10% crit chance']],
['Fortune','#e3b02a',6,[['Greed','soul',6,'% souls'],['Scavenger','drop',4,'% item drops'],['Alchemy','rar',5,'% rarer loot']],['Midas Touch',[['soul',100]],'+100% souls from everything']],
['Mastery','#c4bad9',8,[['Studious','ixp',8,'% item experience'],['Packrat','slots',1,' pack slots'],['Artifice','ibst',5,'% item power']],['Ascendant',[['all',20]],'+20% to all stats']],
['Pyromancy','#ff8a3c',3,[['Searing','fire',5,'% fire damage'],['Quickflame','cfire',4,'% faster fire abilities'],['Cinder','burn',6,'% burn damage']],['Inferno Heart',[['fire',40],['cfire',15]],'+40% fire damage, 15% faster fire abilities'],'fire'],
['Cryomancy','#7fd4ff',3,[['Rime','frost',5,'% frost damage'],['Cold Snap','cfrost',4,'% faster frost abilities'],['Deep Freeze','chill',8,'% stronger chill']],['Absolute Zero',[['frost',40],['chill',30]],'+40% frost damage, much stronger chill'],'frost'],
['Stormcalling','#ffe14a',3,[['Static','storm',5,'% storm damage'],['Overcharge','cstorm',4,'% faster storm abilities'],['Conduction','chn',.5,' extra chain jumps']],['Tempest',[['storm',40],['chn',2]],'+40% storm damage, +2 chain jumps'],'storm'],
['Shadowcraft','#a06bff',3,[['Umbra','shadow',5,'% shadow damage'],['Nightfall','cshadow',4,'% faster shadow abilities'],['Siphon','sip',4,'% of ability damage as life']],['Eclipse',[['shadow',40],['sip',10]],'+40% shadow damage, +10% ability life steal'],'shadow'],
['Radiance','#ffe9a0',3,[['Blessing','holy',5,'% holy damage'],['Devotion','choly',4,'% faster holy abilities'],['Grace','heal',8,'% healing received']],['Divinity',[['holy',40],['heal',25]],'+40% holy damage, +25% healing received'],'holy'],
['Verdancy','#6ddb7a',3,[['Bloom','nature',5,'% nature damage'],['Overgrowth','cnature',4,'% faster nature abilities'],['Venom','psn',8,'% poison damage']],['Wild Heart',[['nature',40],['psn',30]],'+40% nature damage, +30% poison damage'],'nature'],
['Warcraft','#d0d0d8',3,[['Force','phys',5,'% martial damage'],['Rally','cphys',4,'% faster martial abilities'],['Impact','kbp',10,'% knockback']],['Warlord',[['phys',40],['kbp',30]],'+40% martial damage, +30% knockback'],'phys']];
const RK=Object.keys(RACES),RO=['I','II','III','IV','V','VI','VII','VIII'];
const TL=TREES.concat(RK.map(k=>{const t=RACES[k].tr;return[t[0],t[1],1,t[2],t[3],null,k]}));
const ND={};
TL.forEach((t,i)=>{const cb=10*(1+t[2]/6);
 t[3].forEach((l,j)=>{for(let k=1;k<=8;k++){const id=i+'.'+j+'.'+k;ND[id]={id,ti:i,j,t:k,nm:l[0]+' '+RO[k-1],e:[[l[1],l[2]]],d:'+'+l[2]+l[3],c:Math.round(cb*1.6**(k-1)*(j==2?2:1)),mf:t[2]+Math.max(0,k-3)*2,rq:k>1?[i+'.'+j+'.'+(k-1)]:[]}}});
 const q=t[4];ND[i+'.k']={id:i+'.k',ti:i,j:1,t:9,nm:q[0],e:q[1],d:q[2],c:Math.round(cb*1.6**8*4),mf:t[2]+12,rq:[0,1,2].map(j=>i+'.'+j+'.8'),ks:1}});
