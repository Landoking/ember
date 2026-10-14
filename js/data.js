const RR=[['Common','#a9a3ba',1],['Fine','#4fc98a',1.2],['Rare','#5b9bf0',1.45],['Epic','#b57cf0',1.8],['Mythic','#f0a23c',2.3]];
const SKIN=['#f6d6bd','#e4b48c','#c48a60','#8a5a3c','#5e3b28','#8fbf6a','#b9c2d9','#d96a5a','#6aa88a'];
const HAIRC=['#2a1a12','#6b3b1e','#c58b3c','#ead9a2','#c4c4cc','#b03a2a','#3a62b0','#7a3fb0','#2fa36b','#e86aa8'];
const OUTC=['#b03a3c','#2f6fb0','#3a8f4c','#c9a227','#6a3fa0','#33333f','#d0d0d8','#b8601e','#1f8f8f','#8f2f6a'];
const HAIRN=['Short','Long','Spiky','Mohawk','Ponytail','Bald','Bun','Bob','Curly','Braid','Undercut','Pigtails'];
const CIDX={warrior:0,rogue:1,ranger:2,gunner:3,mage:4,duelist:5,summoner:6,paladin:7};
const DIFF={
easy:{n:'Easy',eh:.75,ed:.6,en:.8,el:.5,xp:1.15,gd:1.1,d:'Weaker, fewer monsters and fewer elites. Dying only sends you back to the start of your floor.'},
normal:{n:'Normal',eh:1,ed:1,en:1,el:1,xp:1,gd:1,d:'The intended experience. Dying returns you to your last checkpoint floor (1, 6, 11...).'},
hard:{n:'Hard',eh:1.6,ed:1.45,en:1.3,el:1.8,xp:1.35,gd:1.3,d:'Tougher, more numerous monsters and more elites. Dying also costs 20% of your gold.'},
hardcore:{n:'Hardcore',eh:1.9,ed:1.7,en:1.45,el:2.2,xp:1.6,gd:1.5,pm:1,d:'Hard, with permadeath: if you fall, the character is gone for good.'},
sandbox:{n:'Sandbox',eh:1,ed:1,en:1,el:1,xp:1,gd:1,sb:1,d:'Normal monsters, no death penalty, and a menu to spawn gear, abilities, levels and enemies.'}};
const SCH={fire:['Pyromancy','🔥','#ff8a3c','flame'],frost:['Cryomancy','❄️','#7fd4ff','snow'],storm:['Stormcalling','⚡','#ffe14a','bolt'],shadow:['Shadowcraft','🌑','#a06bff','moon'],holy:['Radiance','✨','#ffe9a0','sun'],nature:['Verdancy','🍃','#6ddb7a','leaf'],phys:['Warcraft','⚔️','#d0d0d8','fist'],arcane:['Arcanum','🔮','#6aa8ff','arcane'],blood:['Hemomancy','🩸','#d63b52','blood'],summon:['Conjuration','💀','#7ae0b8','summon']};
const RACES={
human:{n:'Human',d:'Adaptable and ambitious. +5% to everything. Favors swords, rapiers and pistols.',fv:['sword','rapier','pistol'],st:[['all',5]],sk:'#f6d6bd'},
elf:{n:'Elf',d:'Swift and attuned to magic. +10% move speed, +10% ability power. Favors bows, spears and rapiers.',fv:['bow','spear','rapier'],st:[['spd',10],['ap',10]],sk:'#f0d8c0'},
dwarf:{n:'Dwarf',d:'Stout and stubborn. +60 health, +5% armor. Favors axes, maces, hammers and rifles.',fv:['axe','mace','hammer','rifle'],st:[['hp',60],['arm',5]],sk:'#c48a60'},
orc:{n:'Orc',d:'Brutal and relentless. +12% damage, +2% lifesteal. Favors axes, greatswords and halberds.',fv:['axe','greatsword','halberd'],st:[['dmg',12],['steal',2]],sk:'#8fbf6a'},
undead:{n:'Revenant',d:'Risen and patient. +1 regen/s, +10% experience. Favors daggers, scythes and crossbows.',fv:['dagger','scythe','crossbow'],st:[['regen',1],['xpg',10]],sk:'#b9c2d9'},
halfling:{n:'Halfling',d:'Small, lucky and quick. +12% item drops, 10% faster dash. Favors daggers, bows and pistols.',fv:['dagger','bow','pistol'],st:[['drop',12],['dcd',10]],sk:'#e4b48c'},
tiefling:{n:'Tiefling',d:'Touched by hellfire. +12% fire and shadow damage, +8% ability power. Favors staves, scythes and daggers.',fv:['staff','scythe','dagger'],st:[['fire',12],['shadow',12],['ap',8]],sk:'#d96a5a'},
drakeborn:{n:'Drakeborn',d:'Scaled and sturdy. +8% armor, +40 health, fire-breathing pride. Favors greatswords, halberds and hammers.',fv:['greatsword','halberd','hammer'],st:[['arm',8],['hp',40],['burn',10]],sk:'#6aa88a'}};
const CLS={
warrior:{n:'Warrior',d:'Frontline fighter. +50 health, +6% armor. Favors swords, axes, maces and greatswords.',fv:['sword','axe','mace','greatsword'],st:[['hp',50],['arm',6]],w:'sword',o:null,a:'shockwave'},
rogue:{n:'Rogue',d:'Fast and lethal. +8% crit, +25% crit damage, +6% speed. Favors daggers, katanas and bows.',fv:['dagger','katana','bow','claws'],st:[['crit',8],['critd',25],['spd',6]],w:'dagger',o:'bow',a:'shadowstep'},
ranger:{n:'Ranger',d:'Hunter at range. +20% ranged damage, +10% fire rate. Favors bows, crossbows and spears.',fv:['bow','crossbow','spear'],st:[['rdmg',20],['rspd',10]],w:'spear',o:'bow',a:'thorns'},
gunner:{n:'Gunslinger',d:'Deadeye with powder. +25% ranged damage, +5% crit. Favors pistols, rifles and shotguns.',fv:['pistol','rifle','shotgun'],st:[['rdmg',25],['crit',5]],w:'sword',o:'pistol',a:'concuss'},
mage:{n:'Mage',d:'Master of spells. +30% ability power, +10% cooldown reduction. Favors staves, wands and daggers.',fv:['staff','wand','dagger'],st:[['ap',30],['cdr',10]],w:'staff',o:'wand',a:'fireball'},
duelist:{n:'Duelist',d:'Dual-wielder. Left click strikes with both blades; off-hand deals +35% damage; +12% attack speed. Favors rapiers, katanas, daggers and claws.',fv:['rapier','katana','dagger','claws','sword'],st:[['aspd',12],['crit',6],['dual',35],['twin',1]],w:'rapier',o:'dagger',a:'bladeflurry'},
summoner:{n:'Summoner',d:'Commands minions. +20% ability power, +20% summon damage, +1 max minion. Favors staves, wands and daggers.',fv:['staff','wand','dagger'],st:[['ap',20],['summon',20],['summ',1]],w:'staff',o:null,a:'raiseskel'},
paladin:{n:'Paladin',d:'Holy bulwark. +60 health, +8% armor, +15% healing. Favors maces, hammers, swords and halberds.',fv:['mace','hammer','sword','halberd'],st:[['hp',60],['arm',8],['heal',15]],w:'mace',o:null,a:'smite'}};
const WT={
sword:{n:'Sword',sl:'w',dm:1,cd:.42,rc:58,ar:1.9,kb:200,nm:['Blade','Saber','Falchion']},
greatsword:{n:'Greatsword',sl:'w',dm:1.9,cd:.82,rc:76,ar:2.5,kb:360,nm:['Claymore','Zweihander']},
dagger:{n:'Dagger',sl:'w',dm:.6,cd:.24,rc:42,ar:1.3,kb:80,nm:['Dirk','Kris','Stiletto']},
axe:{n:'Axe',sl:'w',dm:1.35,cd:.6,rc:54,ar:2.1,kb:260,nm:['Hatchet','Cleaver','Waraxe']},
mace:{n:'Mace',sl:'w',dm:1.55,cd:.68,rc:50,ar:1.7,kb:480,nm:['Mace','Flail','Maul']},
spear:{n:'Spear',sl:'w',dm:1.1,cd:.5,rc:92,ar:.4,th:1,kb:220,nm:['Spear','Pike','Lance']},
katana:{n:'Katana',sl:'w',dm:.85,cd:.3,rc:66,ar:1.5,kb:120,wp:[['crit',8]],nm:['Katana','Tachi','Wakizashi']},
rapier:{n:'Rapier',sl:'w',dm:.7,cd:.26,rc:78,ar:.35,th:1,kb:90,nm:['Rapier','Estoc','Foil']},
halberd:{n:'Halberd',sl:'w',dm:1.6,cd:.78,rc:100,ar:1.7,kb:300,nm:['Halberd','Glaive','Bardiche']},
hammer:{n:'Warhammer',sl:'w',dm:2.3,cd:1,rc:62,ar:2.1,kb:620,nm:['Warhammer','Maul','Sledge']},
scythe:{n:'Scythe',sl:'w',dm:1.25,cd:.64,rc:84,ar:3.1,kb:240,nm:['Scythe','Reaper','Sickle']},
claws:{n:'Claws',sl:'w',dm:.42,cd:.17,rc:38,ar:1.5,kb:60,nm:['Claws','Talons','Rippers']},
staff:{n:'Staff',sl:'w',dm:.55,cd:.5,rc:76,ar:.5,th:1,kb:180,wp:[['ap',12]],nm:['Staff','Quarterstaff','Rod']},
bow:{n:'Bow',sl:'r',dm:1.15,cd:.55,sp:560,pr:0,nm:['Shortbow','Longbow','Recurve']},
crossbow:{n:'Crossbow',sl:'r',dm:2.3,cd:1.05,sp:760,pr:1,nm:['Crossbow','Arbalest']},
pistol:{n:'Pistol',sl:'r',dm:.85,cd:.34,sp:860,pr:0,nm:['Flintlock','Revolver','Pistol']},
rifle:{n:'Rifle',sl:'r',dm:2.7,cd:1.1,sp:1100,pr:2,nm:['Rifle','Musket','Carbine']},
shotgun:{n:'Shotgun',sl:'r',dm:.62,cd:.95,sp:700,pr:0,n2:6,sd:.38,nm:['Blunderbuss','Shotgun']},
wand:{n:'Wand',sl:'r',dm:.8,cd:.4,sp:540,pr:0,mg:1,wp:[['ap',8]],nm:['Wand','Scepter','Focus']}};
const FIST={n:'Fists',dm:.5,cd:.4,rc:40,ar:1.6,kb:120};
const ARM={h:{t:'helm',nm:['Helm','Cap','Hood','Crown']},c:{t:'chest',nm:['Plate','Mail','Robe','Jerkin']},b:{t:'boots',nm:['Boots','Greaves','Sandals']},n:{t:'ring',nm:['Ring','Band','Signet']},m:{t:'amulet',nm:['Amulet','Talisman','Pendant']},g:{t:'gloves',nm:['Gloves','Gauntlets','Wraps']},k:{t:'cape',nm:['Cape','Cloak','Mantle']}};
const SLN={h:'Helm',m:'Amulet',k:'Cape',w:'Main hand',c:'Chest',o:'Off-hand',n:'Ring',g:'Gloves',b:'Boots'};
const AF={dmg:[3,.35,'% damage'],crit:[1.2,.12,'% crit chance'],critd:[6,.5,'% crit damage'],aspd:[3,.25,'% attack speed'],spd:[2,.12,'% move speed'],reach:[3,.2,'% reach'],hp:[8,2.2,' health'],regen:[.2,.03,' regen/s'],arm:[1,.15,'% armor'],soul:[4,.4,'% gold found'],drop:[3,.25,'% drops'],steal:[.8,.05,'% lifesteal'],ap:[4,.4,'% ability power'],cdr:[3,.25,'% cooldown reduction'],rdmg:[4,.4,'% ranged damage'],rspd:[3,.25,'% fire rate'],xpg:[3,.3,'% experience'],sumd:[4,.4,'% summon damage'],fd:[0,0,' damage']};
const POOL={w:['aspd','reach','crit','critd','dmg','steal','ap'],r:['rspd','rdmg','crit','critd','dmg','ap'],h:['hp','arm','regen','spd','dmg','cdr','xpg'],c:['hp','arm','regen','spd','dmg','cdr','xpg'],b:['hp','arm','regen','spd','dmg','cdr'],g:['arm','aspd','crit','dmg','cdr','rspd'],k:['hp','arm','regen','spd','cdr','sumd'],n:['dmg','crit','critd','aspd','spd','hp','regen','arm','soul','drop','steal','ap','cdr','rdmg','rspd','reach','xpg','sumd'],m:['dmg','crit','critd','aspd','spd','hp','regen','arm','soul','drop','steal','ap','cdr','rdmg','rspd','reach','xpg','sumd']};
const PF=[['Rusty','Worn','Crude'],['Sturdy','Keen','Polished'],['Runed','Tempered','Gilded'],['Cursed','Arcane','Savage'],['Godforged','Voidtouched','Eternal']];
// ---- abilities. kinds: proj nova cone zone chain ray blink heal buff shield orbit trap wall aura ally totem spawn(enemy only)
const AB={};const A=(id,n,s,t,cd,k,o)=>{AB[id]=Object.assign({n,s,t,cd,k,d:0},o)};
A('fireball','Fireball','fire',1,5,'proj',{d:2.4,sp:380,ex:60,st:'burn'});
A('emberfan','Ember Fan','fire',1,6,'proj',{d:.9,n2:5,sd:.22,sp:420,st:'burn'});
A('flamering','Ring of Fire','fire',2,9,'nova',{d:2.2,rad:110,st:'burn'});
A('dragonbreath','Dragon Breath','fire',3,8,'cone',{d:3,rad:150,ar:.9,st:'burn',kb:200});
A('meteor','Meteor','fire',4,16,'zone',{d:7,rad:90,dl:.9,rg:340,st:'burn'});
A('firewall','Wall of Fire','fire',2,11,'wall',{d:.5,len:190,dur:5,tk:.4,st:'burn'});
A('flameorbit','Flame Orbit','fire',3,14,'orbit',{n2:3,dur:7,rad:46,d:.8,st:'burn'});
A('meteorshower','Meteor Shower','fire',4,22,'zone',{d:2.2,rad:130,dl:.5,dur:4,tk:.3,rain:1,rg:300,st:'burn'});
A('infernoaura','Inferno Aura','fire',3,18,'aura',{d:.5,rad:80,dur:7,tk:.5,st:'burn'});
A('iceshard','Ice Shard','frost',1,5,'proj',{d:1.1,n2:3,sd:.18,sp:460,st:'chill'});
A('frostnova','Frost Nova','frost',2,10,'nova',{d:2,rad:120,st:'chill'});
A('blizzard','Blizzard','frost',3,15,'zone',{d:.7,rad:100,dl:.3,dur:4,tk:.4,st:'chill',rg:260,rain:1});
A('glacial','Glacial Lance','frost',3,9,'ray',{d:4.5,w:18,rg:420,st:'chill'});
A('frosttrap','Frost Trap','frost',2,12,'trap',{d:2.4,rad:80,st:'chill',dur:25});
A('frostorbit','Frost Orbit','frost',3,14,'orbit',{n2:4,dur:7,rad:50,d:.7,st:'chill'});
A('frostaura','Frost Aura','frost',3,18,'aura',{d:.4,rad:90,dur:7,tk:.5,st:'chill'});
A('lightning','Chain Lightning','storm',2,7,'chain',{d:2,n2:4,rg:150,st:'shock'});
A('thunder','Thunderclap','storm',1,8,'nova',{d:1.6,rad:100,st:'shock',kb:300});
A('stormcall','Storm Call','storm',4,18,'zone',{d:1.8,rad:110,dl:.4,dur:5,tk:.5,st:'shock',rg:240,rain:1});
A('arcdash','Arc Dash','storm',2,8,'blink',{d:2,dist:170,st:'shock'});
A('haste','Haste','storm',1,16,'buff',{sx:[['haste',6,1]]});
A('ballzap','Ball Lightning','storm',2,9,'proj',{d:1.2,sp:150,zap:.35,l:4,st:'shock',pr:99,r:9});
A('staticfield','Static Field','storm',3,17,'aura',{d:.35,rad:100,dur:7,tk:.4,st:'shock'});
A('thunderstrike','Thunderstrike','storm',3,10,'zone',{d:5,rad:55,dl:.35,rg:360,st:'shock'});
A('shadowstep','Shadow Step','shadow',1,6,'blink',{dist:190});
A('souldrain','Soul Drain','shadow',3,12,'nova',{d:1.7,rad:130,hl:.5});
A('darkbolt','Dark Bolt','shadow',1,4,'proj',{d:2,sp:520,pr:1});
A('voidray','Void Ray','shadow',4,14,'ray',{d:6,w:26,rg:520});
A('hex','Hex','shadow',2,11,'nova',{d:0,rad:140,st:'vuln',st2:'weak'});
A('fearnova','Terror','shadow',2,13,'nova',{d:.8,rad:120,st:'fear'});
A('voidwell','Void Well','shadow',3,16,'zone',{d:.6,rad:110,dl:.3,dur:4,tk:.4,pull:140,rg:300});
A('shadecall','Call Shades','shadow',3,16,'ally',{ty:'shade',n2:2,dur:14});
A('bonering','Bone Ring','shadow',3,8,'proj',{d:.9,n2:14,sd:.4488,sp:170,nodrop:1});
A('summon','Call Minions','shadow',3,10,'spawn',{mob:['slime','bat'],n2:3,nodrop:1});
A('callskel','Raise Dead','shadow',3,12,'spawn',{mob:['skeleton'],n2:2,nodrop:1});
A('callorcs','Rally Cry','phys',3,14,'spawn',{mob:['orc','goblin'],n2:2,nodrop:1});
A('callspiders','Hatch Brood','nature',3,12,'spawn',{mob:['spider'],n2:3,nodrop:1});
A('mend','Mending Light','holy',1,14,'heal',{pc:35});
A('smite','Smite','holy',2,7,'zone',{d:3.5,rad:60,dl:.5,rg:300});
A('holynova','Holy Nova','holy',3,12,'nova',{d:2,rad:130,hp:18});
A('barrier','Barrier','holy',2,18,'shield',{pc:40,dur:10});
A('consecrate','Consecrate','holy',3,16,'zone',{d:.5,rad:100,dl:.2,dur:6,tk:.5,rg:200,heal:1.5});
A('halo','Halo','holy',3,15,'orbit',{n2:2,dur:8,rad:40,d:.9,sx:[['bless',8,1]]});
A('divinebeam','Divine Beam','holy',4,13,'ray',{d:5,w:30,rg:480,hl:.25});
A('thorns','Thorn Volley','nature',1,6,'proj',{d:.8,n2:7,sd:.14,sp:430,st:'poison'});
A('poisoncloud','Poison Cloud','nature',2,12,'zone',{d:.5,rad:90,dl:.2,dur:6,tk:.5,st:'poison',rg:220});
A('regrowth','Regrowth','nature',2,20,'buff',{sx:[['regen',8,6]]});
A('quake','Earthquake','nature',3,13,'nova',{d:2.6,rad:150,kb:420});
A('entangle','Entangle','nature',2,13,'zone',{d:.3,rad:95,dl:.2,dur:3,tk:.5,st:'root',rg:260});
A('sporebomb','Spore Bomb','nature',2,8,'proj',{d:1.4,sp:300,ex:70,st:'poison'});
A('treant','Summon Treant','nature',3,18,'ally',{ty:'treant',n2:1,dur:25});
A('arcanemissiles','Arcane Missiles','arcane',1,6,'proj',{hm:1,n2:4,sd:.5,d:.7,sp:300});
A('arcorb','Arcane Orb','arcane',3,10,'proj',{d:3,sp:200,ex:90,pull:1,r:8});
A('phaseshift','Phase Shift','arcane',2,8,'blink',{dist:210});
A('arcanemine','Arcane Mine','arcane',2,10,'trap',{d:3,rad:75,dur:25});
A('chrono','Time Warp','arcane',3,16,'zone',{d:0,rad:130,dl:.2,dur:5,tk:.5,st:'slow',rg:240});
A('arcaneblades','Arcane Blades','arcane',3,14,'orbit',{n2:3,dur:7,rad:56,d:.9});
A('arcbeam','Arcane Beam','arcane',4,13,'ray',{d:6.5,w:34,rg:480});
A('bloodspear','Blood Spear','blood',2,6,'ray',{d:3.6,w:16,rg:420,hc:6,st:'bleed'});
A('crimsonnova','Crimson Nova','blood',3,11,'nova',{d:2.5,rad:120,hc:8,st:'bleed',hl:.3});
A('bloodlust','Bloodlust','blood',2,20,'buff',{sx:[['haste',8,1],['rage',8,1]],hc:5});
A('pact','Sanguine Pact','blood',4,25,'buff',{sx:[['rage',12,1.7]],hc:15});
A('hemorrhage','Hemorrhage','blood',3,13,'zone',{d:.4,rad:100,dl:.2,dur:5,tk:.4,st:'bleed',rg:240,hc:5});
A('vampaura','Vampiric Aura','blood',3,18,'aura',{d:.4,rad:90,dur:7,tk:.5,st:'bleed',hl:.6,hc:6});
A('raiseskel','Raise Skeletons','summon',1,10,'ally',{ty:'skel',n2:2,dur:25});
A('skelarchers','Bone Archers','summon',2,12,'ally',{ty:'skela',n2:2,dur:22});
A('spiritwolves','Spirit Wolves','summon',2,14,'ally',{ty:'swolf',n2:2,dur:16});
A('fireelem','Fire Elemental','summon',3,18,'ally',{ty:'felem',n2:1,dur:25});
A('bonegolem','Bone Golem','summon',4,24,'ally',{ty:'bgolem',n2:1,dur:30});
A('flametotem','Flame Totem','summon',2,14,'totem',{ty:'tfire',dur:18,rg:200});
A('stormtotem','Storm Totem','summon',3,16,'totem',{ty:'ttorm',dur:18,rg:200});
A('shockwave','Shockwave','phys',1,8,'cone',{d:1.8,rad:120,ar:1.2,kb:520});
A('warcry','War Cry','phys',2,20,'buff',{sx:[['rage',8,1],['haste',8,.6]]});
A('whirl','Whirlwind','phys',2,9,'nova',{d:2.4,rad:90,kb:260});
A('charge','Charge','phys',2,8,'blink',{d:2.6,dist:200,kb:300});
A('concuss','Concussive Blast','phys',1,9,'cone',{d:1.5,rad:130,ar:1,kb:380,st:'shock'});
A('stoneskin','Stoneskin','phys',2,18,'buff',{sx:[['iron',8,1]]});
A('leapslam','Leap Slam','phys',3,12,'blink',{dist:200,land:90,d:3,kb:400});
A('throwaxe','Throwing Axe','phys',2,7,'proj',{d:2.8,sp:380,pr:3,r:7});
A('bladeflurry','Blade Flurry','phys',2,8,'zone',{d:.55,rad:75,dur:.45,tk:.09,self:1,kb:60});
A('bombx','Powder Bomb','fire',1,0,'zone',{d:3,rad:70,dl:.5,rg:230,st:'burn',nodrop:1});
const KIND={proj:'Projectile',nova:'Burst around you',cone:'Cone blast',zone:'Targeted area',chain:'Chain',ray:'Piercing beam',blink:'Dash',heal:'Heal',buff:'Buff',shield:'Barrier',orbit:'Orbiting blades',trap:'Trap',wall:'Wall',aura:'Aura',ally:'Summons allies',totem:'Totem',spawn:'Calls monsters'};
const EOK=['proj','nova','cone','zone','chain','ray','blink','wall'];
// ---- statuses: [name, icon, colour, description, harmful]
const STS={burn:['Burning','burn','#ff8a3c','Takes fire damage over time.',1],poison:['Poisoned','poison','#6ddb7a','Takes poison damage over time.',1],bleed:['Bleeding','bleed','#d63b52','Takes bleed damage over time.',1],
chill:['Chilled','chill','#7fd4ff','Moves and attacks slower. Three stacks freeze.',1],freeze:['Frozen','freeze','#bfefff','Cannot act and takes extra damage.',1],shock:['Stunned','stun','#ffe14a','Cannot act for a moment.',1],
root:['Rooted','vine','#6ddb7a','Cannot move.',1],slow:['Slowed','clock','#a8a0c8','Moves much slower.',1],weak:['Weakened','down','#a09ab0','Deals less damage.',1],vuln:['Marked','target','#d86aff','Takes more damage.',1],fear:['Terrified','fear','#b8a0ff','Flees in terror.',1],
haste:['Haste','wing','#ffe27a','Faster movement and attacks.',0],rage:['Rage','rage','#ff6b5e','Deals more damage.',0],iron:['Ironskin','ironshield','#9fb4d8','Takes less damage.',0],regen:['Regeneration','heartplus','#7fe08f','Recovers health over time.',0],
focus:['Focus','eye','#d9b3ff','Higher critical chance.',0],lucky:['Lucky','clover','#7fe08f','More drops and gold.',0],bless:['Blessed','sun','#ffe9a0','More healing and spell power.',0]};
const MOD={haste:v=>[['spd',35*v],['aspd',25*v]],rage:v=>[['dmg',35*v]],iron:v=>[['arm',35*v]],regen:v=>[['regen',v]],focus:v=>[['crit',15*v]],lucky:()=>[['drop',40],['soul',40]],bless:()=>[['heal',25],['ap',15]],weak:()=>[['dmg',-25]],vuln:()=>[['arm',-25]],chill:()=>[['spd',-35],['aspd',-20]],slow:()=>[['spd',-50]]};
// ---- consumables. fx: heal pct | st id dur val | cleanse | bomb | mirror | tame
const CONS={
hp1:{n:'Minor Healing Potion',ic:'potion_red',r:0,pr:25,fx:['heal',35],d:'Restores 35% of your health.'},
hp2:{n:'Healing Potion',ic:'potion_red',r:1,pr:60,fx:['heal',60],d:'Restores 60% of your health.'},
hp3:{n:'Greater Healing Potion',ic:'potion_red',r:2,pr:140,fx:['heal',100],d:'Restores all of your health.'},
haste:{n:'Elixir of Haste',ic:'potion_yellow',r:1,pr:70,fx:['st','haste',40,1],d:'Haste for 40 seconds.'},
rage:{n:'Draught of Rage',ic:'potion_orange',r:1,pr:70,fx:['st','rage',40,1],d:'Deal more damage for 40 seconds.'},
iron:{n:'Ironskin Tonic',ic:'potion_blue',r:1,pr:70,fx:['st','iron',45,1],d:'Take less damage for 45 seconds.'},
regen:{n:'Regeneration Brew',ic:'potion_green',r:1,pr:80,fx:['st','regen',25,4],d:'Recover 4 health per second for 25 seconds.'},
focus:{n:'Focus Tincture',ic:'potion_purple',r:2,pr:90,fx:['st','focus',40,1],d:'Higher crit chance for 40 seconds.'},
luck:{n:'Four-Leaf Philter',ic:'potion_green',r:2,pr:100,fx:['st','lucky',90,1],d:'More drops and gold for 90 seconds.'},
cleanse:{n:'Antidote',ic:'potion_blue',r:1,pr:45,fx:['cleanse'],d:'Removes every harmful effect and heals a little.'},
bomb:{n:'Powder Bomb',ic:'bomb',r:1,pr:40,fx:['bomb'],d:'Thrown at your cursor. Explodes after a moment and burns.'},
mirror:{n:'Mirror Crystal',ic:'crystal',r:3,pr:300,fx:['mirror'],d:'Lets you change your skin, hair and outfit appearance.'},
treat:{n:'Taming Treat',ic:'treat',r:2,pr:120,fx:['tame'],d:'Use near a weakened beast (below half health) to tame it as a pet.'}};
// ---- allies (summons) and pets
const AL={
skel:{n:'Skeleton',sp:'skeleton',hp:30,dm:.55,spd:78,ai:'melee',rg:22,cd:.9,r:10,sc:2,c:'#e6e4d2'},
skela:{n:'Bone Archer',sp:'skeleton',hp:22,dm:.5,spd:62,ai:'ranged',rg:220,cd:1.2,r:10,sc:2,c:'#e6e4d2',pj:'arrow'},
swolf:{n:'Spirit Wolf',sp:'wolf',hp:26,dm:.45,spd:130,ai:'melee',rg:22,cd:.55,r:10,sc:2,c:'#9be8ff',gh:1},
felem:{n:'Fire Elemental',sp:'fspirit',hp:45,dm:.7,spd:74,ai:'ranged',rg:190,cd:1.1,r:11,sc:2.2,c:'#ff8a3c',pj:'orb',st:'burn'},
bgolem:{n:'Bone Golem',sp:'skeleton',hp:120,dm:.9,spd:54,ai:'melee',rg:30,cd:1.2,r:16,sc:3.2,c:'#e0dccb',slam:1},
shade:{n:'Shade',sp:'wraith',hp:24,dm:.7,spd:120,ai:'melee',rg:24,cd:.6,r:10,sc:2,c:'#a06bff',gh:1},
treant:{n:'Treant',sp:'mushroom',hp:100,dm:.6,spd:50,ai:'melee',rg:28,cd:1.1,r:14,sc:3,c:'#6ddb7a'},
tfire:{n:'Flame Totem',sp:'totem',hp:50,dm:.6,spd:0,ai:'turret',rg:230,cd:.9,r:10,sc:2,c:'#ff8a3c',pj:'orb',st:'burn'},
ttorm:{n:'Storm Totem',sp:'totem',hp:50,dm:.5,spd:0,ai:'zap',rg:170,cd:.8,r:10,sc:2,c:'#ffe14a'},
pup:{n:'Wolf Pup',sp:'pup',hp:40,dm:.4,spd:125,ai:'melee',rg:20,cd:.6,r:9,sc:2,c:'#c8ccdc',pet:1,au:[['aspd',6]],d:'A loyal brawler. Grants 6% attack speed.'},
imp:{n:'Imp',sp:'imp',hp:30,dm:.55,spd:95,ai:'ranged',rg:200,cd:1,r:9,sc:2,c:'#ff6b5e',pj:'orb',st:'burn',pet:1,au:[['fire',8]],d:'Hurls fireballs. Grants 8% fire damage.'},
slimey:{n:'Slime Pal',sp:'slime',hp:70,dm:.3,spd:70,ai:'melee',rg:20,cd:.9,r:10,sc:2,c:'#6bd36f',pet:1,au:[['arm',4],['hp',20]],d:'A squishy tank. Grants 4% armor and 20 health.'},
owl:{n:'Owl',sp:'owl',hp:28,dm:.45,spd:105,ai:'ranged',rg:210,cd:1,r:9,sc:2,c:'#c8a070',pj:'arrow',pet:1,au:[['crit',4],['xpg',6]],d:'Strikes from range. Grants 4% crit and 6% experience.'},
fairy:{n:'Fairy',sp:'fairy',hp:24,dm:0,spd:110,ai:'heal',rg:0,cd:4,r:8,sc:2,c:'#ffb6e6',pet:1,au:[['regen',.6]],d:'Heals you in a pinch. Grants 0.6 regen/s.'},
drake:{n:'Dragonling',sp:'dragonling',hp:55,dm:.7,spd:100,ai:'ranged',rg:170,cd:.9,r:10,sc:2,c:'#ffb36a',pj:'orb',st:'burn',pet:1,au:[['dmg',5],['burn',10]],d:'Breathes fire. Grants 5% damage and 10% burn damage.'}};
// ---- monsters. ai: chase circle kite erratic static. at: melee slam dive leap shoot cast combo
const EN={
slime:{n:'Slime',hp:24,sp:44,d:8,r:11,s:2,sc:2,f:1,w:10,gr:[2,4],ai:'chase',at:'melee',rg:22,wu:.5,cdn:1.4,lg:70,ar:1.3,tm:'slimey'},
bat:{n:'Cave Bat',hp:12,sp:105,d:6,r:8,s:2,sc:2,f:1,w:8,gr:[2,4],ai:'erratic',at:'dive',rg:90,wu:.3,cdn:1.8,lg:220,fly:1},
skeleton:{n:'Skeleton',hp:22,sp:52,d:8,r:10,s:3,sc:2,f:2,w:8,gr:[2,3],ai:'kite',at:'shoot',rg:230,wu:.45,cdn:2},
goblin:{n:'Goblin',hp:20,sp:85,d:8,r:9,s:3,sc:2,f:2,w:8,gr:[2,4],ai:'chase',at:'melee',rg:20,wu:.3,cdn:1,lg:80,ar:1.4,hr:1},
wolf:{n:'Dire Wolf',hp:28,sp:98,d:10,r:10,s:3,sc:2.1,f:2,w:8,gr:[3,4],ai:'circle',at:'dive',rg:90,wu:.35,cdn:2,lg:170,tm:'pup'},
cultist:{n:'Cultist',hp:22,sp:50,d:10,r:10,s:4,sc:2,f:2,w:6,gr:[1,2],ai:'kite',at:'cast',rg:260,wu:.5,cdn:2,ab:['fireball','iceshard','darkbolt','thunder']},
brute:{n:'Brute',hp:85,sp:38,d:18,r:14,s:5,sc:2.4,f:3,w:6,gr:[1,2],ai:'chase',at:'slam',rg:46,wu:.8,cdn:2.6,sr:70,hv:1},
spider:{n:'Cave Spider',hp:26,sp:80,d:9,r:9,s:3,sc:2,f:3,w:7,gr:[1,3],ai:'circle',at:'leap',rg:80,wu:.4,cdn:2.2,lg:150},
mushroom:{n:'Sporecap',hp:42,sp:20,d:9,r:12,s:3,sc:2,f:3,w:5,gr:[1,2],ai:'static',at:'cast',rg:200,wu:.6,cdn:3,ab:['poisoncloud']},
imp:{n:'Imp',hp:20,sp:70,d:10,r:9,s:4,sc:2,f:4,w:5,gr:[1,3],ai:'kite',at:'cast',rg:230,wu:.45,cdn:1.8,ab:['fireball','emberfan'],tm:'imp'},
fspirit:{n:'Ember Spirit',hp:28,sp:70,d:11,r:10,s:4,sc:2,f:4,w:5,gr:[1,2],ai:'erratic',at:'cast',rg:200,wu:.5,cdn:2,fly:1,ab:['flamering','emberfan']},
necro:{n:'Necromancer',hp:46,sp:44,d:9,r:10,s:8,sc:2.1,f:5,w:3,gr:[1,1],ai:'kite',at:'cast',rg:250,wu:.55,cdn:2.2,ab:['callskel','darkbolt','hex']},
orc:{n:'Orc Warrior',hp:95,sp:56,d:16,r:13,s:7,sc:2.2,f:5,w:5,gr:[1,2],ai:'chase',at:'combo',rg:28,wu:.4,cdn:1.6,lg:60,ar:1.5},
iwisp:{n:'Frost Wisp',hp:26,sp:60,d:10,r:10,s:4,sc:2,f:5,w:5,gr:[1,2],ai:'kite',at:'cast',rg:230,wu:.5,cdn:2,fly:1,ab:['iceshard','frostnova']},
wraith:{n:'Wraith',hp:36,sp:58,d:12,r:11,s:6,sc:2.2,f:6,w:4,gr:[1,2],ai:'chase',at:'cast',rg:200,wu:.5,cdn:2,fly:1,ab:['shadowstep','darkbolt','souldrain']},
mimic:{n:'Mimic',hp:70,sp:80,d:14,r:12,s:8,sc:2,f:3,w:0,gr:[1,1],ai:'chase',at:'melee',rg:24,wu:.3,cdn:.9,lg:90,ar:1.4}};
const AFX=[['swift','Swift'],['armored','Armored'],['vampiric','Vampiric'],['explosive','Volatile'],['regen','Regenerating'],['frenzied','Frenzied'],['teleporter','Blinking'],['shielded','Shielded'],['thorned','Thorned']];
const EAB=['fireball','iceshard','darkbolt','thunder','shockwave','flamering','frostnova'];
const BOSS=[
{n:'Warden',sp:'warden',c:'#d6483b',ai:'chase',at:'slam',rg:56,wu:.7,cdn:2.4,sr:80,hv:1,spd:46,ab:['shockwave','charge','bonering','callskel']},
{n:'Broodmother',sp:'brood',c:'#58b84f',ai:'kite',at:'cast',rg:240,wu:.6,cdn:2,spd:42,ab:['callspiders','thorns','poisoncloud']},
{n:'Lich',sp:'lich',c:'#9a63e0',ai:'kite',at:'cast',rg:260,wu:.6,cdn:2,spd:44,ab:['darkbolt','frostnova','meteor','callskel']},
{n:'Stone Golem',sp:'golem',c:'#9096a6',ai:'chase',at:'slam',rg:60,wu:.9,cdn:2.8,sr:100,hv:1,spd:38,ab:['quake','shockwave','thunder']},
{n:'Orc Warlord',sp:'warlord',c:'#6fae4f',ai:'chase',at:'combo',rg:40,wu:.4,cdn:1.4,lg:90,hv:1,spd:62,ab:['charge','callorcs','warcry']},
{n:'Frost Wyrm',sp:'wyrm',c:'#8fd0f5',ai:'kite',at:'cast',rg:250,wu:.55,cdn:2,spd:52,ab:['glacial','blizzard','frostnova','iceshard']},
{n:'Pyre Colossus',sp:'pyre',c:'#f0803a',ai:'chase',at:'slam',rg:64,wu:.8,cdn:2.4,sr:95,hv:1,spd:40,ab:['meteor','firewall','dragonbreath','flamering']}];
const BTITLE=['the Hollow','of Ash','the Unmourned','of Teeth','the Pale','the Ravenous'];
const ORES=[['copper','Copper','#d98a4a',1,1],['iron','Iron','#aab4c4',1,1],['silver','Silver','#dfe8ff',2,5],['mythril','Mythril','#4fe0c8',3,10],['voidstone','Voidstone','#9a5cff',4,18]];
// ---- skill trees (3 lanes x 8 tiers + keystone). u: school:x | flag:x | race:x
const TREES=[];const TR=(k,n,c,f,l,ks,u)=>TREES.push({k,n,c,f,l,ks,u:u||''});
TR('might','Might','#e5534b',1,[['Brutality','dmg',5,'% damage'],['Precision','crit',2,'% crit chance'],['Ruthless','critd',10,'% crit damage']],['Berserker',[['berserk',60]],'Up to +60% damage as your health drops']);
TR('vit','Vitality','#3fb67c',1,[['Vigor','hp',14,' max health'],['Recovery','regen',.5,' health per second'],['Mending','heal',8,'% healing received']],['Second Wind',[['rev',1]],'Once per floor, survive a killing blow at half health']);
TR('swift','Swiftness','#35b8d4',2,[['Fleet','spd',3,'% move speed'],['Frenzy','aspd',4,'% attack speed'],['Slipstream','dcd',5,'% faster dash']],['Phantom Rush',[['ph',1]],'Dashing damages enemies you pass through']);
TR('bulwark','Bulwark','#5a8cee',4,[['Plating','arm',2,'% armor'],['Parry','blk',2,'% block chance'],['Spines','thorn',6,'% damage reflected']],['Aegis',[['aegis',1]],'A shield absorbs one hit each room']);
TR('marks','Marksman','#d0b070',3,[['Deadly Aim','rdmg',6,'% ranged damage'],['Quickdraw','rspd',4,'% fire rate'],['Piercing','prc',.5,' pierce (rounds down)']],['Deadeye',[['rdmg',30],['crit',10]],'+30% ranged damage, +10% crit chance']);
TR('fort','Fortune','#e3b02a',6,[['Greed','soul',6,'% gold found'],['Scavenger','drop',4,'% item drops'],['Alchemy','rar',5,'% rarer loot']],['Midas Touch',[['soul',100]],'+100% gold from everything']);
TR('mast','Mastery','#c4bad9',8,[['Studious','xpg',6,'% experience gained'],['Packrat','slots',1,' pack slots'],['Artifice','ibst',5,'% item power']],['Ascendant',[['all',20]],'+20% to all stats']);
TR('fire','Pyromancy','#ff8a3c',3,[['Searing','fire',5,'% fire damage'],['Quickflame','cfire',4,'% faster fire abilities'],['Cinder','burn',6,'% burn damage']],['Inferno Heart',[['fire',40],['cfire',15]],'+40% fire damage, 15% faster fire abilities'],'school:fire');
TR('frost','Cryomancy','#7fd4ff',3,[['Rime','frost',5,'% frost damage'],['Cold Snap','cfrost',4,'% faster frost abilities'],['Deep Freeze','chill',8,'% stronger chill']],['Absolute Zero',[['frost',40],['chill',30]],'+40% frost damage, much stronger chill'],'school:frost');
TR('storm','Stormcalling','#ffe14a',3,[['Static','storm',5,'% storm damage'],['Overcharge','cstorm',4,'% faster storm abilities'],['Conduction','chn',.5,' extra chain jumps']],['Tempest',[['storm',40],['chn',2]],'+40% storm damage, +2 chain jumps'],'school:storm');
TR('shadow','Shadowcraft','#a06bff',3,[['Umbra','shadow',5,'% shadow damage'],['Nightfall','cshadow',4,'% faster shadow abilities'],['Siphon','sip',4,'% of ability damage as life']],['Eclipse',[['shadow',40],['sip',10]],'+40% shadow damage, +10% ability life steal'],'school:shadow');
TR('holy','Radiance','#ffe9a0',3,[['Blessing','holy',5,'% holy damage'],['Devotion','choly',4,'% faster holy abilities'],['Grace','heal',8,'% healing received']],['Divinity',[['holy',40],['heal',25]],'+40% holy damage, +25% healing received'],'school:holy');
TR('nature','Verdancy','#6ddb7a',3,[['Bloom','nature',5,'% nature damage'],['Overgrowth','cnature',4,'% faster nature abilities'],['Venom','psn',8,'% poison damage']],['Wild Heart',[['nature',40],['psn',30]],'+40% nature damage, +30% poison damage'],'school:nature');
TR('phys','Warcraft','#d0d0d8',3,[['Force','phys',5,'% martial damage'],['Rally','cphys',4,'% faster martial abilities'],['Impact','kbp',10,'% knockback']],['Warlord',[['phys',40],['kbp',30]],'+40% martial damage, +30% knockback'],'school:phys');
TR('human','Versatility','#d9b45a',1,[['Adaptable','dmg',2,'% damage'],['Resourceful','soul',4,'% gold found'],['Determined','hp',8,' max health']],['Indomitable',[['all',10]],'+10% to all stats'],'race:human');
TR('elf','Sylvan Grace','#7fd8a0',1,[['Swiftfoot','spd',3,'% move speed'],['Keen Eyes','crit',1.5,'% crit chance'],['Arcane Kin','ap',5,'% ability power']],['Moonlit Focus',[['cdr',15],['ap',15]],'+15% cooldown reduction, +15% ability power'],'race:elf');
TR('dwarf','Stonebound','#c0a070',1,[['Stoneskin','arm',2,'% armor'],['Hardy','hp',14,' max health'],['Forgeborn','ibst',4,'% item power']],['Mountain Heart',[['arm',10],['hp',120]],'+10% armor, +120 max health'],'race:dwarf');
TR('orc','Bloodrage','#e5534b',1,[['Savagery','dmg',4,'% damage'],['Thick Hide','hp',14,' max health'],['Bloodlust','steal',1,'% lifesteal']],['Warchief',[['dmg',20],['aspd',15]],'+20% damage, +15% attack speed'],'race:orc');
TR('undead','Gravebound','#9aa7c7',1,[['Deathless','regen',.5,' regen per second'],['Soulleech','soul',5,'% gold found'],['Cold Touch','ap',4,'% ability power']],['Undying',[['rev',1],['steal',6]],'Survive one killing blow per floor, +6% lifesteal'],'race:undead');
TR('arcane','Arcanum','#6aa8ff',3,[['Sorcery','arcane',5,'% arcane damage'],['Quickening','carcane',4,'% faster arcane abilities'],['Echo','ap',4,'% ability power']],['Archmage',[['arcane',40],['cdr',10]],'+40% arcane damage, +10% cooldown reduction'],'school:arcane');
TR('blood','Hemomancy','#d63b52',3,[['Thirst','blood',5,'% blood damage'],['Frenzy','cblood',4,'% faster blood abilities'],['Crimson','steal',1,'% lifesteal']],['Crimson King',[['blood',40],['steal',4]],'+40% blood damage, +4% lifesteal'],'school:blood');
TR('summon','Conjuration','#7ae0b8',3,[['Command','summon',5,'% summon damage'],['Bond','sumh',8,'% summon health'],['Legion','summ',.5,' max minions (rounds down)']],['Lord of Bones',[['summon',40],['summ',2]],'+40% summon damage, +2 max minions'],'school:summon');
TR('dual','Dual Wielding','#e8a0a0',3,[['Twin Fangs','dual',6,'% off-hand damage'],['Whirling','aspd',3,'% attack speed'],['Riposte','crit',1.5,'% crit chance']],['Blade Dancer',[['dual',50],['twin',1]],'+50% off-hand damage and twin strikes with any two melee weapons'],'flag:dual');
TR('beast','Beastmastery','#d8b078',3,[['Bond','petd',8,'% pet damage'],['Thick Fur','peth',10,'% pet health'],['Scholar','pete',12,'% pet experience']],['Alpha',[['petd',40],['peth',40]],'+40% pet damage and health'],'flag:beast');
TR('artisan','Artisan','#b8c0d0',4,[['Prospector','pickspd',8,'% faster mining'],['Rich Veins','ore',.5,' extra ore (rounds down)'],['Journeyman','forge',5,'% cheaper forging']],['Grand Artisan',[['ore',2],['forge',25]],'+2 ore per vein, 25% cheaper forging'],'flag:artisan');
TR('halfling','Fortune\'s Favor','#e8c878',1,[['Lucky','drop',4,'% item drops'],['Nimble','dcd',5,'% faster dash'],['Hearty','hp',14,' max health']],['Lucky Charm',[['drop',30],['rar',20]],'+30% drops and +20% rarer loot'],'race:halfling');
TR('tiefling','Infernal Blood','#e0605a',1,[['Infernal','fire',5,'% fire damage'],['Umbral','shadow',5,'% shadow damage'],['Pact','ap',4,'% ability power']],['Hellfire',[['fire',30],['shadow',30]],'+30% fire and shadow damage'],'race:tiefling');
TR('drakeborn','Dragon Scales','#7ac8a0',1,[['Scales','arm',2,'% armor'],['Dragonfire','burn',6,'% burn damage'],['Roar','kbp',10,'% knockback']],['Dragon Heart',[['hp',150],['arm',10]],'+150 max health and +10% armor'],'race:drakeborn');
const ICO={dmg:'sword',crit:'star',critd:'skull',hp:'heart',regen:'heartplus',heal:'cross',spd:'boots',aspd:'hourglass',dcd:'dash',arm:'shield',blk:'rshield',thorn:'spikes',rdmg:'arrow',rspd:'quiver',prc:'pierce',soul:'coin',drop:'bag',rar:'gem',xpg:'book',ixp:'sparkle',slots:'pack',ibst:'anvil',all:'crown',fire:'flame',cfire:'flame',burn:'burn',frost:'snow',cfrost:'snow',chill:'chill',storm:'bolt',cstorm:'bolt',chn:'chain',shadow:'moon',cshadow:'moon',sip:'fangs',holy:'sun',choly:'sun',nature:'leaf',cnature:'leaf',psn:'poison',phys:'fist',cphys:'fist',kbp:'impact',arcane:'arcane',carcane:'arcane',ap:'orb',blood:'blood',cblood:'blood',steal:'fangs',summon:'summon',sumh:'heart',summ:'skullm',dual:'swords2',twin:'swords2',petd:'paw',peth:'heart',pete:'egg',pickspd:'pickaxe',ore:'ore',forge:'hammer',berserk:'rage',rev:'heartplus',ph:'dash',aegis:'rshield',cdr:'clock',sumd:'skullm'};
const SPC=[1,1,2,2,3,3,4,5],RO=['I','II','III','IV','V','VI','VII','VIII'];
const ND={},TBY={};
TREES.forEach(t=>{TBY[t.k]=t;t.l.forEach((l,j)=>{for(let k=1;k<=8;k++){const id=t.k+'.'+j+'.'+k;ND[id]={id,tk:t.k,j,t:k,nm:l[0]+' '+RO[k-1],e:[[l[1],l[2]]],d:'+'+l[2]+l[3],c:Math.ceil(SPC[k-1]*(j==2?1.5:1)),mf:t.f+Math.max(0,k-3)*2,rq:k>1?[t.k+'.'+j+'.'+(k-1)]:[],ic:ICO[l[1]]||'gem'}}});
 const q=t.ks;ND[t.k+'.k']={id:t.k+'.k',tk:t.k,j:1,t:9,nm:q[0],e:q[1],d:q[2],c:12,mf:t.f+12,rq:[0,1,2].map(j=>t.k+'.'+j+'.8'),ks:1,ic:ICO[q[1][0][0]]||'crown'}});
const LEG=['might','vit','swift','bulwark','marks','fort','mast','fire','frost','storm','shadow','holy','nature','phys','human','elf','dwarf','orc','undead'];
