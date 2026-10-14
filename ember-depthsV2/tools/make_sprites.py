#!/usr/bin/env python3
# Ember Depths sprite generator (needs Pillow). Run: python3 make_sprites.py
# Writes ../sprites/*.png and ../sprites/atlas.js. Edit any function and re-run to restyle.
import os, json, random
from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sprites')
os.makedirs(OUT, exist_ok=True)
INK = (18, 12, 26, 255)
AT = {'sheets': {}}
ST = (206, 212, 224); SD = (150, 158, 176); GD = (232, 190, 72); BR = (150, 98, 54); WD = (112, 74, 44); RD = (205, 60, 70); DKC = (30, 26, 40); WH = (245, 245, 250)
GRN = (96, 206, 112); BLU = (90, 150, 240); PUR = (150, 100, 220); ORG = (240, 140, 60); CYN = (110, 220, 255); YEL = (250, 220, 90); IV = (240, 236, 214)

def img(w=16, h=16): return Image.new('RGBA', (w, h), (0, 0, 0, 0))

def shade(im, hi=1.22, lo=.72):
    w, h = im.size; s = im.load(); o = im.copy(); q = o.load()
    for y in range(h):
        for x in range(w):
            r, g, b, a = s[x, y]
            if not a: continue
            up = s[x, y-1][3] if y else 0
            dn = s[x, y+1][3] if y < h-1 else 0
            lf = s[x-1, y][3] if x else 0
            f = hi if not up else (1.08 if not lf else 1)
            if not dn: f = lo
            q[x, y] = (min(255, int(r*f)), min(255, int(g*f)), min(255, int(b*f)), a)
    return o

def outline(im):
    w, h = im.size; s = im.load(); o = im.copy(); q = o.load()
    for y in range(h):
        for x in range(w):
            if s[x, y][3] == 0 and any(0 <= x+dx < w and 0 <= y+dy < h and s[x+dx, y+dy][3] for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                q[x, y] = INK
    return o

def mk(fn, w=16, h=16, *a):
    im = img(w, h); fn(ImageDraw.Draw(im), *a); return outline(shade(im))

def L(d, pts, c, w=1): d.line(pts, fill=c, width=w)
def save(name, im): im.save(os.path.join(OUT, name + '.png')); AT['sheets'][name] = list(im.size)
def lit(c, n=70): return tuple(min(255, v+n) for v in c)

# ================= items / props (16x16) =================
def sword(d): L(d, [(4, 11), (12, 3)], ST, 2); d.point((13, 2), fill=ST); L(d, [(3, 8), (7, 12)], GD); L(d, [(4, 11), (2, 13)], BR, 2); d.point((1, 14), fill=GD)
def greatsword(d): L(d, [(5, 10), (13, 2)], ST, 3); L(d, [(3, 8), (8, 13)], GD, 2); L(d, [(5, 10), (1, 14)], BR, 2)
def dagger(d): L(d, [(6, 9), (11, 4)], ST, 2); d.point((12, 3), fill=ST); L(d, [(5, 7), (8, 10)], GD); L(d, [(6, 9), (4, 11)], BR, 2)
def axe(d): L(d, [(3, 13), (11, 5)], WD, 2); d.polygon([(8, 2), (13, 2), (14, 7), (11, 8), (10, 5)], fill=ST)
def mace(d): L(d, [(3, 13), (9, 7)], WD, 2); d.ellipse([8, 2, 13, 7], fill=SD); d.point((10, 3), fill=ST)
def spear(d): L(d, [(2, 14), (11, 5)], WD, 2); L(d, [(10, 6), (14, 2)], ST, 2); d.point((15, 1), fill=ST)
def katana(d): L(d, [(4, 12), (13, 3)], ST, 2); d.point((14, 2), fill=ST); L(d, [(3, 9), (7, 13)], GD); L(d, [(4, 12), (2, 14)], RD, 2)
def rapier(d): L(d, [(5, 11), (14, 2)], ST, 1); d.ellipse([2, 9, 7, 14], outline=GD); L(d, [(3, 13), (5, 11)], BR, 2)
def halberd(d): L(d, [(3, 14), (11, 4)], WD, 2); d.polygon([(8, 2), (13, 1), (14, 6), (10, 7), (10, 4)], fill=ST); L(d, [(11, 4), (14, 1)], ST)
def hammer(d): L(d, [(3, 14), (10, 7)], WD, 2); d.rectangle([7, 2, 14, 7], fill=SD); d.rectangle([7, 2, 14, 3], fill=ST)
def scythe(d): L(d, [(3, 14), (12, 3)], WD, 2); d.polygon([(11, 3), (15, 5), (14, 9), (12, 6)], fill=ST); L(d, [(8, 4), (12, 3)], ST)
def claws(d):
    L(d, [(4, 13), (6, 3)], ST, 1); L(d, [(7, 13), (9, 2)], ST, 1); L(d, [(10, 13), (12, 3)], ST, 1); d.rectangle([3, 12, 12, 14], fill=BR)
def staff(d): L(d, [(4, 14), (10, 5)], WD, 2); d.ellipse([9, 1, 14, 6], fill=CYN); d.point((11, 3), fill=WH)
def wand(d): L(d, [(4, 13), (11, 6)], WD, 2); d.polygon([(11, 2), (12, 4), (14, 4), (12, 6), (13, 8), (11, 7), (9, 8), (10, 6), (8, 4), (10, 4)], fill=GD)
def bow(d): L(d, [(7, 1), (10, 4), (11, 8), (10, 12), (7, 15)], WD, 2); L(d, [(7, 1), (7, 15)], (235, 235, 235)); L(d, [(2, 8), (10, 8)], BR); d.point((2, 7), fill=RD); d.point((2, 9), fill=RD)
def crossbow(d): L(d, [(2, 9), (12, 9)], WD, 2); L(d, [(10, 3), (10, 14)], WD, 2); L(d, [(10, 3), (3, 9), (10, 14)], (235, 235, 235))
def pistol(d): d.rectangle([3, 5, 13, 7], fill=SD); d.rectangle([3, 5, 13, 5], fill=ST); d.rectangle([3, 7, 6, 12], fill=BR)
def rifle(d): d.rectangle([1, 6, 14, 7], fill=SD); d.polygon([(1, 6), (5, 6), (5, 11), (1, 10)], fill=BR); d.rectangle([7, 4, 10, 5], fill=ST)
def shotgun(d): d.rectangle([2, 5, 14, 6], fill=SD); d.rectangle([2, 7, 14, 8], fill=SD); d.polygon([(1, 5), (5, 5), (5, 12), (1, 10)], fill=BR); d.rectangle([7, 9, 9, 10], fill=WD)
def helm(d): d.ellipse([3, 3, 12, 12], fill=ST); d.rectangle([3, 8, 12, 12], fill=ST); d.rectangle([5, 8, 10, 9], fill=DKC); d.polygon([(7, 3), (8, 0), (9, 3)], fill=RD)
def chest(d): d.polygon([(3, 3), (12, 3), (14, 6), (12, 13), (4, 13), (2, 6)], fill=SD); L(d, [(5, 4), (10, 4)], GD); d.rectangle([7, 3, 8, 5], fill=DKC); L(d, [(8, 6), (8, 12)], ST)
def boots(d):
    for r in ([2, 3, 5, 10], [2, 9, 7, 12], [9, 3, 12, 10], [9, 9, 14, 12]): d.rectangle(r, fill=BR)
    d.rectangle([2, 3, 5, 4], fill=ST); d.rectangle([9, 3, 12, 4], fill=ST)
def ring(d): d.ellipse([3, 6, 12, 14], fill=GD); d.ellipse([5, 8, 10, 12], fill=(0, 0, 0, 0)); d.ellipse([6, 3, 9, 7], fill=(90, 200, 255))
def amulet(d): L(d, [(3, 1), (8, 9), (13, 1)], GD); d.ellipse([5, 8, 11, 14], fill=GD); d.ellipse([7, 10, 9, 12], fill=RD)
def gloves(d): d.rectangle([3, 6, 7, 13], fill=BR); d.rectangle([9, 6, 13, 13], fill=BR); d.rectangle([3, 5, 7, 6], fill=ST); d.rectangle([9, 5, 13, 6], fill=ST); d.rectangle([2, 8, 3, 10], fill=BR); d.rectangle([13, 8, 14, 10], fill=BR)
def cape(d): d.polygon([(4, 2), (11, 2), (14, 14), (2, 14)], fill=RD); d.rectangle([4, 2, 11, 3], fill=GD); d.ellipse([7, 2, 9, 4], fill=GD); L(d, [(8, 5), (8, 13)], (150, 36, 50))
def pickaxe(d): L(d, [(3, 14), (11, 6)], WD, 2); d.polygon([(6, 2), (13, 4), (14, 8), (11, 6), (8, 4)], fill=ST)
def anvil(d): d.polygon([(2, 6), (14, 6), (12, 9), (10, 9), (11, 13), (5, 13), (6, 9), (4, 9)], fill=SD); d.rectangle([2, 5, 14, 6], fill=ST); d.rectangle([4, 13, 12, 14], fill=DKC)
def egg(d): d.ellipse([4, 2, 11, 14], fill=(236, 228, 200)); d.ellipse([6, 6, 8, 8], fill=(120, 200, 140)); d.ellipse([8, 10, 10, 12], fill=(200, 120, 160)); d.ellipse([6, 3, 7, 4], fill=WH)
def crystal(d): d.polygon([(8, 1), (13, 6), (8, 15), (3, 6)], fill=CYN); L(d, [(8, 1), (8, 15)], (200, 250, 255)); L(d, [(3, 6), (13, 6)], (170, 240, 255))
def treat(d): L(d, [(4, 11), (11, 4)], IV, 3); d.ellipse([2, 10, 5, 13], fill=IV); d.ellipse([10, 2, 13, 5], fill=IV)
def coin(d): d.ellipse([3, 3, 12, 12], fill=GD); d.ellipse([5, 5, 10, 10], outline=(180, 130, 30)); d.point((7, 4), fill=WH)
def bomb(d): d.ellipse([3, 5, 12, 14], fill=(46, 46, 60)); L(d, [(10, 5), (12, 2)], BR); d.point((13, 1), fill=(255, 170, 60)); d.point((6, 8), fill=(120, 120, 140))
def potion(d, c=RD): d.rectangle([7, 2, 8, 4], fill=(190, 190, 200)); d.rectangle([6, 1, 9, 2], fill=BR); d.ellipse([4, 5, 11, 13], fill=c); d.point((6, 7), fill=lit(c, 90))
def scroll(d, c=RD):
    d.rectangle([3, 3, 12, 12], fill=(226, 208, 160)); d.ellipse([1, 2, 4, 13], fill=(200, 176, 120)); d.ellipse([11, 2, 14, 13], fill=(200, 176, 120))
    d.ellipse([6, 6, 9, 9], fill=c); L(d, [(5, 5), (10, 5)], (120, 90, 50)); L(d, [(5, 10), (10, 10)], (120, 90, 50))
def chunk(d, c):
    d.polygon([(3, 12), (2, 8), (5, 4), (10, 3), (13, 7), (12, 12)], fill=(96, 92, 108)); d.polygon([(5, 10), (5, 6), (8, 5), (10, 8), (9, 11)], fill=c); d.point((7, 6), fill=lit(c, 90)); d.point((9, 8), fill=lit(c, 60))
def vein(d, c):
    for x, y, s in ((3, 9, 3), (8, 5, 4), (10, 10, 3)): d.polygon([(x, y+s), (x+1, y), (x+s, y+1), (x+s, y+s)], fill=c)
    d.point((9, 6), fill=lit(c, 90)); d.point((4, 10), fill=lit(c, 90))
def chestc(d): d.rectangle([2, 7, 13, 13], fill=BR); d.rectangle([2, 5, 13, 7], fill=WD); d.rectangle([7, 5, 8, 13], fill=GD); d.rectangle([7, 8, 8, 9], fill=ST)
def chesto(d): d.rectangle([2, 8, 13, 13], fill=BR); d.rectangle([2, 2, 13, 5], fill=WD); d.rectangle([3, 6, 12, 8], fill=(255, 220, 110))
def shrine(d): d.rectangle([3, 10, 12, 14], fill=SD); d.rectangle([5, 6, 10, 10], fill=ST); d.polygon([(8, 0), (11, 4), (8, 6), (5, 4)], fill=(110, 210, 255)); d.point((8, 3), fill=WH)
def gate0(d): d.rectangle([2, 4, 13, 14], fill=(70, 64, 84)); d.ellipse([2, 1, 13, 8], fill=(70, 64, 84)); d.rectangle([5, 6, 10, 14], fill=(24, 18, 32)); d.ellipse([5, 4, 10, 8], fill=(24, 18, 32)); d.point((8, 9), fill=RD)
def gate1(d): gate0(d); d.ellipse([5, 5, 10, 14], fill=(90, 240, 170)); d.ellipse([6, 7, 9, 13], fill=(210, 255, 235))
def spike0(d):
    d.rectangle([2, 2, 13, 13], fill=(66, 60, 80))
    for x in (4, 8, 11):
        for y in (4, 8, 11): d.point((x, y), fill=(34, 30, 44))
def spike1(d):
    d.rectangle([2, 2, 13, 13], fill=(96, 56, 64))
    for x in (4, 8, 11):
        for y in (4, 8, 11): d.point((x, y), fill=(255, 90, 80))
def spike2(d):
    d.rectangle([2, 2, 13, 13], fill=(66, 60, 80))
    for x in (3, 7, 11):
        for y in (3, 8): d.polygon([(x, y+4), (x+1, y), (x+2, y+4)], fill=ST)
def turret(d): d.rectangle([2, 3, 13, 13], fill=(92, 88, 108)); d.ellipse([5, 5, 10, 10], fill=DKC); d.rectangle([2, 3, 13, 4], fill=(124, 120, 140)); d.point((7, 7), fill=(255, 120, 60))
def vent0(d):
    d.rectangle([2, 2, 13, 13], fill=(60, 56, 70))
    for y in (4, 7, 10): L(d, [(3, y), (12, y)], DKC)
def vent1(d): vent0(d); d.polygon([(8, 1), (11, 6), (10, 11), (8, 14), (6, 11), (5, 6)], fill=ORG); d.polygon([(8, 6), (9, 10), (7, 10)], fill=YEL)
def crate(d): d.rectangle([2, 4, 13, 14], fill=WD); d.rectangle([2, 4, 13, 5], fill=BR); L(d, [(2, 4), (13, 14)], BR); L(d, [(13, 4), (2, 14)], BR)
def barrel(d): d.ellipse([3, 2, 12, 14], fill=WD); d.rectangle([3, 5, 12, 6], fill=SD); d.rectangle([3, 10, 12, 11], fill=SD); L(d, [(7, 3), (7, 13)], BR)
def bones(d): L(d, [(3, 12), (12, 8)], IV, 2); L(d, [(4, 7), (12, 13)], IV, 2); d.ellipse([6, 3, 10, 7], fill=IV); d.point((7, 5), fill=DKC); d.point((9, 5), fill=DKC)
def candle(d): d.rectangle([6, 7, 9, 14], fill=IV); d.polygon([(8, 2), (10, 6), (8, 8), (6, 6)], fill=YEL); d.point((8, 5), fill=ORG)
def fungus(d):
    for x, y, c in ((4, 9, RD), (9, 6, (90, 160, 230)), (11, 11, PUR)): d.ellipse([x-2, y-2, x+2, y+1], fill=c); d.rectangle([x, y+1, x, y+4], fill=IV)

SCHC = {'fire': ORG, 'frost': CYN, 'storm': YEL, 'shadow': PUR, 'holy': (255, 233, 160), 'nature': GRN, 'phys': (208, 208, 216), 'arcane': (106, 168, 255), 'blood': (214, 59, 82), 'summon': (122, 224, 184)}
POT = {'red': RD, 'blue': BLU, 'green': GRN, 'yellow': YEL, 'purple': PUR, 'orange': ORG}
ORE = {'copper': (217, 138, 74), 'iron': (170, 180, 196), 'silver': (223, 232, 255), 'mythril': (79, 224, 200), 'voidstone': (154, 92, 255)}
ITEMS = [('sword', sword), ('greatsword', greatsword), ('dagger', dagger), ('axe', axe), ('mace', mace), ('spear', spear), ('katana', katana), ('rapier', rapier), ('halberd', halberd), ('hammer', hammer),
         ('scythe', scythe), ('claws', claws), ('staff', staff), ('wand', wand), ('bow', bow), ('crossbow', crossbow), ('pistol', pistol), ('rifle', rifle), ('shotgun', shotgun),
         ('helm', helm), ('chest', chest), ('boots', boots), ('ring', ring), ('amulet', amulet), ('gloves', gloves), ('cape', cape), ('pickaxe', pickaxe), ('anvil', anvil), ('egg', egg), ('crystal', crystal),
         ('treat', treat), ('coin', coin), ('bomb', bomb), ('chestc', chestc), ('chesto', chesto), ('shrine', shrine), ('gate0', gate0), ('gate1', gate1),
         ('spike0', spike0), ('spike1', spike1), ('spike2', spike2), ('turret', turret), ('vent0', vent0), ('vent1', vent1), ('crate', crate), ('barrel', barrel), ('bones', bones), ('candle', candle), ('fungus', fungus)]
ITEMS += [('potion_' + k, (lambda c: lambda d: potion(d, c))(v)) for k, v in POT.items()]
ITEMS += [('scroll_' + k, (lambda c: lambda d: scroll(d, c))(v)) for k, v in SCHC.items()]
ITEMS += [('ore_' + k, (lambda c: lambda d: chunk(d, c))(v)) for k, v in ORE.items()]
ITEMS += [('vein_' + k, (lambda c: lambda d: vein(d, c))(v)) for k, v in ORE.items()]
cols = 10; sh = Image.new('RGBA', (16*cols, 16*((len(ITEMS)+cols-1)//cols)), (0, 0, 0, 0)); AT['items'] = {}
for i, (k, fn) in enumerate(ITEMS):
    x, y = (i % cols)*16, (i//cols)*16; sh.paste(mk(fn), (x, y)); AT['items'][k] = [x, y, 16, 16, 1]
save('items', sh)

# ================= monsters, allies, pets, NPCs (16x16, 2 frames) =================
def slime(d, f):
    g = (96, 206, 112); y = 7+f
    d.ellipse([2, y, 13, 14], fill=g); d.rectangle([2, y+3, 13, 14], fill=g); d.ellipse([4, y+1, 7, y+3], fill=(205, 255, 210))
    d.rectangle([5, y+4, 6, y+6], fill=(24, 40, 34)); d.rectangle([9, y+4, 10, y+6], fill=(24, 40, 34)); d.point((5, y+4), fill=WH); d.point((9, y+4), fill=WH)
def bat(d, f):
    b = (128, 92, 178); w = (92, 66, 134)
    d.polygon([(6, 7), (1, 3+3*f), (2, 10), (6, 10)], fill=w); d.polygon([(10, 7), (14, 3+3*f), (13, 10), (10, 10)], fill=w)
    d.ellipse([6, 5, 10, 12], fill=b); d.point((6, 4), fill=b); d.point((10, 4), fill=b); d.point((7, 7), fill=(255, 90, 90)); d.point((9, 7), fill=(255, 90, 90))
def skeleton(d, f):
    bn = (230, 228, 212); dk = (40, 34, 48)
    d.ellipse([5, 1, 10, 6], fill=bn); d.rectangle([6, 6, 9, 7], fill=bn); d.rectangle([6, 3, 7, 4], fill=dk); d.rectangle([8, 3, 9, 4], fill=dk)
    d.rectangle([5, 8, 10, 11], fill=bn); L(d, [(5, 9), (10, 9)], dk); L(d, [(5, 11), (10, 11)], dk); L(d, [(4, 8), (3, 12)], bn); L(d, [(11, 8), (12, 12)], bn)
    L(d, [(6, 12), (6, 14+f)], bn); L(d, [(9, 12), (9, 15-f)], bn); L(d, [(13, 5), (14, 8), (13, 11)], BR); L(d, [(13, 5), (13, 11)], (235, 235, 235))
def brute(d, f):
    s = (184, 112, 90); dk = (96, 56, 48)
    d.rectangle([4, 5, 11, 12], fill=s); d.rectangle([5, 1, 10, 5], fill=s); d.rectangle([2, 6, 3, 10+f], fill=s); d.rectangle([12, 6, 13, 11-f], fill=s)
    d.rectangle([4, 12, 6, 14+f], fill=dk); d.rectangle([9, 12, 11, 15-f], fill=dk); d.rectangle([4, 9, 11, 9], fill=dk)
    d.point((6, 3), fill=(255, 70, 50)); d.point((9, 3), fill=(255, 70, 50)); d.point((6, 5), fill=IV); d.point((9, 5), fill=IV)
def cultist(d, f):
    r = (116, 64, 160); dk = (26, 14, 36)
    d.polygon([(8, 2), (3, 14+f), (13, 14+f)], fill=r); d.ellipse([5, 1, 10, 7], fill=r); d.rectangle([6, 3, 9, 5], fill=dk)
    d.point((7, 4), fill=(255, 220, 70)); d.point((9, 4), fill=(255, 220, 70)); L(d, [(13, 3), (13, 14)], BR); d.ellipse([12, 1, 14, 3], fill=CYN)
def wraith(d, f):
    c = (150, 190, 235); dk = (20, 30, 60)
    d.ellipse([4, 1, 11, 8], fill=c); d.polygon([(4, 6), (11, 6), (13, 14), (11, 12+f), (9, 15), (7, 12+f), (5, 15), (3, 14)], fill=c)
    d.rectangle([5, 3, 10, 5], fill=dk); d.point((6, 4), fill=(160, 255, 255)); d.point((9, 4), fill=(160, 255, 255))
def spider(d, f):
    for y in (6, 8, 10, 12):
        L(d, [(7, 9), (2, y-2+f), (1, y+3)], (50, 36, 66)); L(d, [(9, 9), (14, y-2+f), (15, y+3)], (50, 36, 66))
    d.ellipse([5, 6, 11, 13], fill=(70, 50, 90)); d.ellipse([6, 3, 10, 7], fill=(90, 66, 112)); d.point((7, 5), fill=(255, 70, 70)); d.point((9, 5), fill=(255, 70, 70)); d.point((8, 10), fill=(200, 60, 120))
def goblin(d, f):
    g = (120, 176, 70); dk = (70, 110, 50)
    d.rectangle([5, 6, 10, 11], fill=(140, 96, 60)); d.ellipse([4, 1, 11, 7], fill=g); d.polygon([(4, 3), (1, 2), (4, 5)], fill=g); d.polygon([(11, 3), (14, 2), (11, 5)], fill=g)
    d.point((6, 4), fill=(255, 230, 60)); d.point((9, 4), fill=(255, 230, 60)); d.rectangle([5, 11, 6, 14+f], fill=dk); d.rectangle([9, 11, 10, 15-f], fill=dk); L(d, [(12, 8), (14, 5)], ST)
def wolf(d, f):
    c = (138, 142, 156); dk = (86, 88, 104)
    d.ellipse([3, 6, 12, 12], fill=c); d.polygon([(11, 5), (15, 7), (14, 10), (11, 9)], fill=c); d.polygon([(11, 5), (12, 2), (13, 6)], fill=dk); d.point((13, 7), fill=(255, 200, 60))
    L(d, [(3, 7), (0, 5+f)], c, 2); d.rectangle([4, 11, 5, 14+f], fill=dk); d.rectangle([10, 11, 11, 15-f], fill=dk)
def mushroom(d, f):
    d.rectangle([6, 8, 9, 13], fill=(236, 226, 200)); d.ellipse([2, 2, 13, 9], fill=(200, 60, 70)); d.ellipse([4, 3, 6, 5], fill=WH); d.ellipse([9, 4, 11, 6], fill=WH)
    d.point((7, 10), fill=DKC); d.point((9, 10), fill=DKC); d.rectangle([5, 13, 10, 14+f], fill=(190, 176, 150))
def imp(d, f):
    r = (200, 60, 60); dk = (120, 30, 40)
    d.ellipse([5, 5, 10, 12], fill=r); d.ellipse([5, 1, 10, 6], fill=r); d.polygon([(5, 2), (3, 0), (6, 3)], fill=dk); d.polygon([(10, 2), (12, 0), (9, 3)], fill=dk)
    d.polygon([(5, 7), (1, 4+3*f), (5, 10)], fill=dk); d.polygon([(10, 7), (14, 4+3*f), (10, 10)], fill=dk); d.point((6, 3), fill=YEL); d.point((9, 3), fill=YEL); L(d, [(8, 12), (11, 14), (12, 12)], r)
def necro(d, f):
    rb = (48, 40, 70); gl = (120, 255, 160)
    d.polygon([(8, 3), (3, 14+f), (13, 14+f)], fill=rb); d.ellipse([5, 1, 10, 7], fill=(220, 220, 206)); d.rectangle([6, 3, 9, 5], fill=DKC); d.point((7, 4), fill=gl); d.point((9, 4), fill=gl)
    L(d, [(13, 2), (13, 14)], BR); d.ellipse([12, 0, 14, 2], fill=gl); d.polygon([(5, 4), (8, 0), (11, 4)], fill=rb)
def orc(d, f):
    g = (110, 160, 80); dk = (60, 90, 50); mt = (120, 124, 140)
    d.rectangle([4, 6, 11, 12], fill=g); d.rectangle([4, 6, 11, 8], fill=mt); d.rectangle([5, 1, 10, 6], fill=g); d.rectangle([2, 6, 3, 10+f], fill=g); d.rectangle([12, 6, 13, 11-f], fill=g)
    d.rectangle([5, 12, 6, 14+f], fill=dk); d.rectangle([9, 12, 10, 15-f], fill=dk); d.point((6, 3), fill=RD); d.point((9, 3), fill=RD); d.point((6, 5), fill=IV); d.point((9, 5), fill=IV)
    L(d, [(14, 3), (14, 12)], WD); d.polygon([(13, 2), (15, 2), (15, 5), (13, 5)], fill=ST)
def fspirit(d, f):
    d.polygon([(8, f), (12, 6), (13, 11), (8, 15), (3, 11), (4, 6)], fill=(240, 130, 50)); d.polygon([(8, 4), (10, 8), (10, 12), (8, 14), (6, 12), (6, 8)], fill=(255, 210, 80)); d.point((7, 8), fill=DKC); d.point((9, 8), fill=DKC)
def iwisp(d, f):
    d.polygon([(8, 1), (12, 6), (11, 12+f), (8, 15), (5, 12+f), (4, 6)], fill=(150, 210, 245)); d.polygon([(8, 4), (10, 8), (8, 13), (6, 8)], fill=(225, 247, 255)); d.point((7, 7), fill=(30, 60, 120)); d.point((9, 7), fill=(30, 60, 120))
def mimic(d, f):
    d.rectangle([2, 7, 13, 13], fill=BR); d.rectangle([2, 3, 13, 6+f], fill=WD); d.rectangle([7, 3, 8, 13], fill=GD)
    d.rectangle([3, 7, 12, 8], fill=IV); d.rectangle([4, 9, 11, 11], fill=(210, 60, 90)); d.point((5, 4), fill=YEL); d.point((10, 4), fill=YEL)
    for x in (3, 6, 9, 11): d.point((x, 9), fill=IV)
def pup(d, f):
    c = (176, 180, 196); dk = (110, 112, 130)
    d.ellipse([3, 7, 11, 12], fill=c); d.ellipse([9, 4, 14, 9], fill=c); d.polygon([(10, 4), (10, 1), (12, 4)], fill=dk); d.polygon([(13, 4), (14, 1), (14, 5)], fill=dk)
    d.point((12, 6), fill=DKC); d.rectangle([4, 11, 5, 14+f], fill=dk); d.rectangle([9, 11, 10, 15-f], fill=dk); L(d, [(3, 8), (1, 6+f)], c, 2)
def dragonling(d, f):
    g = (110, 200, 120); dk = (60, 130, 80)
    d.ellipse([4, 6, 11, 13], fill=g); d.ellipse([8, 3, 14, 8], fill=g); d.polygon([(9, 3), (9, 0), (11, 3)], fill=dk); d.polygon([(4, 8), (0, 4+3*f), (5, 11)], fill=dk)
    d.point((12, 5), fill=DKC); L(d, [(4, 12), (1, 14), (2, 11)], g); d.rectangle([5, 12, 6, 14], fill=dk); d.rectangle([9, 12, 10, 14], fill=dk); d.point((14, 6), fill=ORG)
def owl(d, f):
    c = (150, 110, 70); lt = (226, 200, 150)
    d.ellipse([3, 3, 12, 14], fill=c); d.ellipse([5, 6, 10, 13], fill=lt); d.polygon([(3, 4), (4, 1), (6, 3)], fill=c); d.polygon([(12, 4), (11, 1), (9, 3)], fill=c)
    d.ellipse([4, 4, 7, 7], fill=WH); d.ellipse([8, 4, 11, 7], fill=WH); d.point((6, 6), fill=DKC); d.point((9, 6), fill=DKC); d.polygon([(7, 7), (8, 7), (8, 9)], fill=GD)
    d.polygon([(2, 8), (0, 8+2*f), (3, 12)], fill=c); d.polygon([(13, 8), (15, 8+2*f), (12, 12)], fill=c)
def fairy(d, f):
    d.polygon([(7, 7), (1, 3+2*f), (3, 9), (7, 9)], fill=(200, 240, 255)); d.polygon([(9, 7), (15, 3+2*f), (13, 9), (9, 9)], fill=(200, 240, 255))
    d.ellipse([6, 3, 10, 7], fill=(250, 220, 190)); d.rectangle([6, 7, 10, 11], fill=(255, 150, 200)); d.rectangle([7, 11, 7, 13], fill=(250, 220, 190)); d.rectangle([9, 11, 9, 13], fill=(250, 220, 190))
    d.rectangle([6, 2, 10, 3], fill=YEL); d.point((7, 5), fill=DKC); d.point((9, 5), fill=DKC)
def totem(d, f):
    d.rectangle([5, 5, 10, 14], fill=(120, 116, 136)); d.rectangle([4, 13, 11, 15], fill=(90, 86, 106)); d.rectangle([6, 7, 9, 8], fill=DKC); d.rectangle([6, 10, 9, 11], fill=DKC)
    d.polygon([(8, f), (11, 4), (8, 6), (5, 4)], fill=WH); d.point((7, 4), fill=GD)
def shopA(d, f):
    d.polygon([(8, 5), (3, 15), (13, 15)], fill=(150, 70, 60)); d.ellipse([5, 3, 10, 8], fill=(240, 200, 160)); d.polygon([(3, 4), (8, 0), (13, 4)], fill=(60, 90, 150)); d.rectangle([4, 3, 12, 4], fill=(60, 90, 150))
    d.point((7, 6), fill=DKC); d.point((9, 6), fill=DKC); d.rectangle([6, 8, 9, 8+f], fill=(200, 150, 120)); d.rectangle([11, 9, 13, 12], fill=GD)
def shopB(d, f):
    d.rectangle([4, 7, 11, 14], fill=(120, 100, 80)); d.ellipse([5, 2, 10, 8], fill=(230, 180, 140)); d.polygon([(5, 7), (10, 7), (9, 12+f), (6, 12+f)], fill=(210, 110, 50)); d.rectangle([4, 2, 11, 3], fill=(100, 70, 40))
    d.point((7, 5), fill=DKC); d.point((9, 5), fill=DKC); d.rectangle([5, 14, 6, 15], fill=DKC); d.rectangle([9, 14, 10, 15], fill=DKC); L(d, [(12, 6), (14, 10+f)], WD, 2); d.rectangle([12, 4, 15, 6], fill=SD)
MOBS = [('slime', slime), ('bat', bat), ('skeleton', skeleton), ('brute', brute), ('cultist', cultist), ('wraith', wraith), ('spider', spider), ('goblin', goblin), ('wolf', wolf), ('mushroom', mushroom),
        ('imp', imp), ('necro', necro), ('orc', orc), ('fspirit', fspirit), ('iwisp', iwisp), ('mimic', mimic), ('pup', pup), ('dragonling', dragonling), ('owl', owl), ('fairy', fairy), ('totem', totem), ('shopA', shopA), ('shopB', shopB)]
def strip(rows, cw, ch):
    nf = max(len(f) for _, f in rows); sh = Image.new('RGBA', (cw*nf, ch*len(rows)), (0, 0, 0, 0)); at = {}
    for i, (k, fr) in enumerate(rows):
        for j, f in enumerate(fr): sh.paste(f, (j*cw, i*ch))
        at[k] = [0, i*ch, cw, ch, len(fr)]
    return sh, at
sh, AT['mobs'] = strip([(n, [mk(fn, 16, 16, f) for f in (0, 1)]) for n, fn in MOBS], 16, 16)
save('mobs', sh)

# ================= bosses (32x32, 2 frames) =================
def warden(d, f):
    S = (176, 184, 198); M = (158, 66, 62); D = (66, 30, 38); H = (230, 224, 210)
    d.rectangle([10, 11, 21, 24], fill=M); d.rectangle([8, 10, 23, 13], fill=S); d.ellipse([5, 9, 11, 16], fill=S); d.ellipse([20, 9, 26, 16], fill=S); d.rectangle([5, 13, 8, 22], fill=M)
    d.rectangle([11, 2, 20, 11], fill=S); d.polygon([(11, 4), (6, 0), (9, 6)], fill=H); d.polygon([(20, 4), (25, 0), (22, 6)], fill=H); d.rectangle([13, 6, 18, 7], fill=(255, 80, 50))
    d.rectangle([11, 24, 14, 29+f], fill=D); d.rectangle([17, 24, 20, 30-f], fill=D); L(d, [(27, 8+f), (29, 27)], S, 3); L(d, [(25, 12+f), (30, 12+f)], GD, 2)
def brood(d, f):
    g = (58, 104, 54); dk = (24, 46, 28); lg = (98, 150, 80)
    d.ellipse([7, 13, 25, 29], fill=g)
    for i in range(4):
        y = 10+i*3; o = 1 if (i+f) % 2 else -1
        L(d, [(12, y), (4, 6+i*5+o), (3, 14+i*5)], dk, 2); L(d, [(20, y), (28, 6+i*5-o), (29, 14+i*5)], dk, 2)
    d.ellipse([11, 6, 21, 16], fill=lg)
    for x, y in ((13, 9), (15, 8), (17, 8), (19, 9)): d.point((x, y), fill=(255, 60, 60))
    d.rectangle([14, 14, 15, 16], fill=IV); d.rectangle([17, 14, 18, 16], fill=IV); d.ellipse([12, 18, 19, 24], fill=(120, 200, 100))
def lich(d, f):
    bn = (232, 230, 214); rb = (88, 52, 138); dk = (24, 16, 40)
    d.polygon([(16, 12), (5, 30), (27, 30)], fill=rb); d.ellipse([10, 3, 21, 14], fill=bn); d.rectangle([12, 13, 19, 15], fill=bn)
    d.rectangle([12, 7, 14, 9], fill=dk); d.rectangle([17, 7, 19, 9], fill=dk); d.point((13, 8), fill=(120, 255, 255)); d.point((18, 8), fill=(120, 255, 255))
    d.polygon([(10, 4), (11, 1), (13, 3), (16, 0), (19, 3), (21, 1), (22, 4)], fill=(240, 200, 70)); L(d, [(26, 6), (26, 29)], BR, 2); d.ellipse([24, 2+f, 28, 6+f], fill=(150, 90, 255))
    d.ellipse([6, 16+f, 10, 20+f], fill=(120, 255, 220)); d.ellipse([22, 17-f, 26, 21-f], fill=(120, 255, 220))
def golem(d, f):
    s = (128, 132, 142); m = (84, 110, 84)
    d.rectangle([8, 9, 23, 24], fill=s); d.rectangle([11, 2, 20, 9], fill=s); d.rectangle([2, 10, 8, 22+f], fill=s); d.rectangle([23, 10, 29, 23-f], fill=s)
    d.rectangle([9, 24, 14, 30+f], fill=s); d.rectangle([17, 24, 22, 31-f], fill=s); d.rectangle([13, 5, 14, 6], fill=(255, 150, 40)); d.rectangle([17, 5, 18, 6], fill=(255, 150, 40))
    d.ellipse([13, 13, 18, 18], fill=(255, 140, 40)); d.rectangle([8, 9, 12, 10], fill=m); d.rectangle([20, 22, 23, 24], fill=m)
def warlord(d, f):
    g = (104, 168, 84); dk = (60, 100, 52); mt = (120, 120, 136); rd = (170, 50, 40)
    d.rectangle([9, 10, 22, 24], fill=g); d.rectangle([9, 10, 22, 13], fill=mt); d.ellipse([4, 9, 10, 16], fill=mt); d.ellipse([21, 9, 27, 16], fill=mt)
    d.rectangle([4, 13, 8, 23], fill=g); d.rectangle([23, 13, 27, 23], fill=g); d.rectangle([11, 2, 20, 10], fill=g); d.rectangle([11, 2, 20, 5], fill=mt)
    d.polygon([(11, 4), (6, 1), (10, 7)], fill=ST); d.polygon([(20, 4), (25, 1), (21, 7)], fill=ST); d.point((13, 7), fill=rd); d.point((18, 7), fill=rd)
    d.rectangle([13, 9, 14, 10], fill=IV); d.rectangle([17, 9, 18, 10], fill=IV); d.rectangle([10, 24, 14, 29+f], fill=dk); d.rectangle([17, 24, 21, 30-f], fill=dk)
    L(d, [(27, 4+f), (28, 26)], WD, 2); d.polygon([(25, 4+f), (31, 5+f), (30, 11+f), (26, 10+f)], fill=ST)
def wyrm(d, f):
    c = (150, 200, 236); dk = (80, 120, 170); lt = (220, 244, 255)
    d.polygon([(22, 18), (31, 22), (26, 27), (20, 24)], fill=dk); d.polygon([(10, 16), (1, 6+3*f), (6, 22)], fill=dk); d.polygon([(20, 16), (29, 6+3*f), (24, 22)], fill=dk)
    d.ellipse([6, 14, 24, 28], fill=c); d.ellipse([8, 4, 20, 15], fill=c); d.polygon([(9, 6), (6, 1), (11, 5)], fill=lt); d.polygon([(19, 6), (22, 1), (17, 5)], fill=lt)
    d.rectangle([10, 8, 12, 9], fill=DKC); d.rectangle([16, 8, 18, 9], fill=DKC); d.point((11, 8), fill=(255, 255, 160)); d.point((17, 8), fill=(255, 255, 160)); d.rectangle([12, 12, 16, 14], fill=lt)
    d.ellipse([11, 18, 19, 26], fill=lt); d.rectangle([9, 27, 12, 30], fill=dk); d.rectangle([17, 27, 20, 30], fill=dk)
def pyre(d, f):
    r = (120, 40, 34); o = (240, 130, 40); y = (255, 220, 90); dk = (50, 20, 24)
    d.rectangle([9, 10, 22, 25], fill=r); d.rectangle([11, 2, 20, 10], fill=r); d.rectangle([2, 11, 8, 23+f], fill=r); d.rectangle([23, 11, 29, 24-f], fill=r)
    d.rectangle([10, 25, 14, 30+f], fill=dk); d.rectangle([17, 25, 21, 31-f], fill=dk); d.ellipse([12, 13, 19, 20], fill=o); d.ellipse([14, 15, 17, 18], fill=y)
    d.rectangle([13, 5, 14, 6], fill=y); d.rectangle([17, 5, 18, 6], fill=y); d.polygon([(12, 3), (14, 0), (16, 3), (18, 0), (20, 3)], fill=o)
    d.polygon([(3, 11), (4, 7+f), (6, 11)], fill=o); d.polygon([(25, 11), (27, 7+f), (28, 11)], fill=o)
BOSSES = [('warden', warden), ('brood', brood), ('lich', lich), ('golem', golem), ('warlord', warlord), ('wyrm', wyrm), ('pyre', pyre)]
sh, AT['bosses'] = strip([(n, [mk(fn, 32, 32, f) for f in (0, 1)]) for n, fn in BOSSES], 32, 32)
save('bosses', sh)

# ================= hero layers (16x20 cells; columns = dir*2+frame; dirs: down, side(right), up). Tinted in game =================
W = (238, 238, 238); EY = (30, 22, 44)
HN = ['legs', 'body', 'cloth', 'eyes', 'ears', 'tusks', 'beard', 'horns', 'tail', 'frill'] + ['hair%d' % i for i in range(12)] + ['cls%d' % i for i in range(8)]
def hair(h, i, dr):
    if i == 5: return
    if i == 3:
        h.rectangle([6, 0, 8, 6] if dr == 1 else [7, 0, 8, 6], fill=W); return
    if dr == 2: h.ellipse([4, 2, 11, 10], fill=W)
    elif dr == 1: h.rectangle([4, 3, 8, 8], fill=W); h.rectangle([5, 2, 10, 4], fill=W)
    else: h.rectangle([4, 2, 11, 5], fill=W); h.point((4, 6), fill=W); h.point((11, 6), fill=W)
    if i == 1:
        if dr == 1: h.rectangle([3, 4, 6, 13], fill=W)
        else: h.rectangle([3, 3, 4, 12], fill=W); h.rectangle([11, 3, 12, 12], fill=W)
    if i == 2:
        for x in (5, 8, 10): h.polygon([(x-1, 2), (x, 0), (x+1, 2)], fill=W)
    if i == 4:
        if dr == 1: h.rectangle([2, 4, 4, 10], fill=W)
        else: h.rectangle([12, 5, 13, 10], fill=W)
    if i == 6: h.ellipse([6, 0, 10, 3], fill=W)
    if i == 7:
        if dr == 1: h.rectangle([3, 3, 6, 9], fill=W)
        else: h.rectangle([3, 3, 4, 9], fill=W); h.rectangle([11, 3, 12, 9], fill=W)
    if i == 8: h.ellipse([2, 0, 13, 8], fill=W)
    if i == 9:
        if dr == 1: h.rectangle([3, 5, 4, 14], fill=W)
        elif dr == 2: h.rectangle([7, 8, 8, 15], fill=W)
        else: h.rectangle([11, 6, 12, 14], fill=W)
    if i == 10 and dr == 2: h.rectangle([5, 1, 10, 7], fill=W)
    if i == 11:
        if dr == 1: h.rectangle([3, 4, 4, 11], fill=W)
        else: h.rectangle([2, 4, 3, 11], fill=W); h.rectangle([12, 4, 13, 11], fill=W)
def hero(dr, f):
    I = {n: img(16, 20) for n in HN}; D = {n: ImageDraw.Draw(I[n]) for n in HN}
    ll, rl = (18, 17) if f == 0 else (17, 18)
    if dr == 1: D['legs'].rectangle([5+f, 15, 6+f, 18], fill=W); D['legs'].rectangle([8-f, 15, 9-f, 18], fill=W)
    else: D['legs'].rectangle([5, 15, 6, ll], fill=W); D['legs'].rectangle([9, 15, 10, rl], fill=W)
    b, c, e = D['body'], D['cloth'], D['eyes']
    if dr == 1:
        b.ellipse([5, 3, 11, 10], fill=W); b.point((11, 8), fill=W); b.point((8, 14), fill=W)
        c.rectangle([5, 11, 10, 15], fill=W); c.rectangle([8, 11, 9, 13], fill=W); e.point((9, 7), fill=EY)
        D['ears'].polygon([(6, 6), (3, 4), (6, 8)], fill=W); D['tusks'].point((10, 10), fill=IV); D['beard'].polygon([(8, 9), (11, 9), (10, 13), (7, 11)], fill=W)
        D['horns'].polygon([(7, 3), (5, 0), (8, 1)], fill=W); D['tail'].line([(4, 14), (1, 15), (1, 12+f)], fill=W, width=1)
        D['frill'].polygon([(4, 3), (2, 2), (4, 6)], fill=W); D['frill'].polygon([(5, 2), (4, 0), (7, 2)], fill=W)
    else:
        b.ellipse([4, 3, 11, 10], fill=W); b.point((3, 14), fill=W); b.point((12, 14), fill=W)
        c.rectangle([4, 11, 11, 15], fill=W); c.rectangle([3, 11, 3, 13], fill=W); c.rectangle([12, 11, 12, 13], fill=W)
        if dr == 0: e.point((6, 7), fill=EY); e.point((9, 7), fill=EY); D['tusks'].point((6, 10), fill=IV); D['tusks'].point((9, 10), fill=IV)
        D['ears'].polygon([(4, 6), (1, 4), (4, 8)], fill=W); D['ears'].polygon([(11, 6), (14, 4), (11, 8)], fill=W); D['beard'].polygon([(5, 8), (10, 8), (9, 13), (6, 13)], fill=W)
        D['horns'].polygon([(4, 4), (2, 0), (6, 3)], fill=W); D['horns'].polygon([(11, 4), (13, 0), (9, 3)], fill=W)
        if dr == 0: D['tail'].line([(11, 15), (14, 16), (14, 13+f)], fill=W, width=1)
        else: D['tail'].line([(8, 15), (8, 18), (11, 18+f)], fill=W, width=1)
        D['frill'].polygon([(8, 0), (6, 3), (10, 3)], fill=W); D['frill'].polygon([(4, 3), (2, 2), (4, 6)], fill=W); D['frill'].polygon([(11, 3), (13, 2), (11, 6)], fill=W)
    for i in range(12): hair(D['hair%d' % i], i, dr)
    g = D['cls0']; g.ellipse([2, 10, 5, 13], fill=W); g.ellipse([10, 10, 13, 13], fill=W); g.rectangle([4, 14, 11, 14], fill=W)
    g = D['cls1']; g.rectangle([3, 11, 12, 12], fill=W)
    if dr != 2: g.rectangle([4, 9, 11, 10], fill=W)
    g = D['cls2']; g.polygon([(3, 6), (8, 0), (12, 6)], fill=W)
    g = D['cls3']; g.polygon([(3, 5), (12, 5), (8, 0)], fill=W); g.rectangle([2, 4, 13, 5], fill=W)
    g = D['cls4']; g.rectangle([2, 4, 13, 4], fill=W); g.rectangle([5, 1, 10, 4], fill=W); g.line([(4, 11), (11, 15)], fill=W)
    g = D['cls5']; g.rectangle([4, 3, 11, 4], fill=W); g.line([(4, 10), (11, 14)], fill=W); g.line([(11, 10), (4, 14)], fill=W)
    g = D['cls6']; g.polygon([(3, 6), (8, 0), (12, 6)], fill=W); g.rectangle([7, 10, 8, 12], fill=W); g.rectangle([3, 11, 12, 11], fill=W)
    g = D['cls7']; g.rectangle([4, 1, 11, 3], fill=W); g.rectangle([7, 0, 8, 1], fill=W); g.rectangle([6, 11, 9, 15], fill=W)
    return I
cells = {n: [] for n in HN}
for dr in range(3):
    for f in range(2):
        I = hero(dr, f)
        for n in HN: cells[n].append(I[n] if n in ('eyes', 'tusks') else shade(I[n]))
sh = Image.new('RGBA', (96, 20*len(HN)), (0, 0, 0, 0))
for r, n in enumerate(HN):
    for c, im in enumerate(cells[n]): sh.paste(im, (c*16, r*20))
save('hero', sh); AT['hero'] = {'rows': {n: i for i, n in enumerate(HN)}}

# ================= tiles: 8 biomes x [floor0..3, face, top, door, crack, waterA, waterB, bridge] =================
BIO = [((74, 78, 102), (104, 108, 138)), ((60, 86, 68), (92, 116, 84)), ((100, 66, 58), (140, 88, 72)), ((104, 138, 168), (150, 184, 210)), ((82, 60, 112), (116, 88, 156)),
       ((82, 134, 66), (46, 98, 52)), ((206, 218, 230), (52, 100, 86)), ((86, 76, 72), (64, 54, 54))]
WAT = {5: ((58, 118, 188), (120, 180, 236)), 6: ((150, 200, 232), (214, 238, 252)), 7: ((226, 96, 38), (255, 196, 80))}
def mul(c, k): return tuple(max(0, min(255, int(v*k))) for v in c)
def tile(bi, kind, seed, v=0):
    fb, wb = BIO[bi]; r = random.Random(seed); im = img(); p = im.load(); out = bi >= 5; tone = {}; d = ImageDraw.Draw(im)
    def put(c, k=1.0): return mul(c, k) + (255,)
    if kind == 'floor':
        for y in range(16):
            for x in range(16):
                k = 1 + r.uniform(-.05, .05)
                if not out:
                    if y == 0 or x == 0: k *= 1.1
                    if y == 15 or x == 15: k *= .78
                p[x, y] = put(fb, k)
        if v == 2 and not out:
            for i in range(7): p[3+i, 5+(i*2)//3] = put(fb, .5)
        if v == 3:
            for _ in range(5): p[r.randrange(2, 14), r.randrange(2, 14)] = put(fb, 1.3 if bi != 7 else .7)
    elif kind in ('face', 'crack', 'door', 'top') and not out:
        for y in range(16):
            for x in range(16):
                if kind == 'top': k = .52 + r.uniform(-.03, .03)
                else:
                    row = y // 4; off = (row % 2)*4; b2 = (x+off) // 8; bx = (x+off) % 8
                    t = tone.setdefault((row, b2), r.uniform(.9, 1.1)); k = t*(.6 if (y % 4 == 3 or bx == 7) else (1.14 if y % 4 == 0 else 1))
                p[x, y] = put(wb, k)
    elif kind in ('face', 'top', 'crack', 'door') and out:
        d.rectangle([0, 0, 15, 15], fill=put(wb, .6 if kind == 'top' else .72))
        for i in range(7):
            x, y = r.randrange(-1, 12), r.randrange(-1, 12); d.ellipse([x, y, x+6, y+6], fill=put(wb, r.uniform(.85, 1.3 if kind != 'top' else 1.05)))
        if kind != 'top': d.rectangle([7, 12, 9, 15], fill=put((96, 66, 40)))
    if kind == 'crack':
        for a, b2 in (((7, 0), (6, 5)), ((6, 5), (9, 8)), ((9, 8), (7, 12)), ((7, 12), (8, 15)), ((6, 5), (3, 7))): d.line([a, b2], fill=(18, 12, 26, 255), width=1)
    if kind == 'door':
        d.rectangle([2, 0, 13, 15], fill=put((110, 74, 44))); d.rectangle([2, 0, 13, 1], fill=put((70, 46, 28)))
        for x in (5, 8, 11): d.line([(x, 2), (x, 15)], fill=put((80, 54, 34)), width=1)
        d.rectangle([2, 7, 13, 8], fill=(150, 150, 164, 255)); d.ellipse([10, 9, 12, 11], fill=(232, 190, 72, 255))
    if kind in ('waterA', 'waterB'):
        a, b2 = WAT.get(bi, WAT[5]); sh2 = 0 if kind == 'waterA' else 4
        d.rectangle([0, 0, 15, 15], fill=a + (255,))
        for y in (3, 8, 13):
            for x0 in range(-4+sh2, 16, 8): d.line([(max(0, x0), y), (min(15, x0+3), y)], fill=b2 + (255,), width=1)
    if kind == 'bridge':
        d.rectangle([0, 0, 15, 15], fill=(110, 74, 44, 255))
        for x in range(0, 16, 4): d.line([(x, 0), (x, 15)], fill=(70, 46, 28, 255), width=1)
        d.rectangle([0, 0, 15, 1], fill=(150, 104, 62, 255)); d.rectangle([0, 14, 15, 15], fill=(70, 46, 28, 255))
        for x in (1, 5, 9, 13): d.point((x, 7), fill=(210, 210, 220, 255))
    return im
TK = ['floor0', 'floor1', 'floor2', 'floor3', 'face', 'top', 'door', 'crack', 'waterA', 'waterB', 'bridge']
sh = Image.new('RGBA', (16*len(TK), 16*len(BIO)), (0, 0, 0, 0))
for bi in range(len(BIO)):
    for ci, k in enumerate(TK):
        kind, v = (('floor', int(k[-1])) if k.startswith('floor') else (k, 0))
        sh.paste(tile(bi, kind, bi*100+ci, v), (ci*16, bi*16))
save('tiles', sh)

# ================= icons (skill nodes, statuses) =================
def star(d): d.polygon([(8, 1), (10, 6), (15, 8), (10, 10), (8, 15), (6, 10), (1, 8), (6, 6)], fill=YEL)
def skull(d): d.ellipse([3, 2, 12, 10], fill=(232, 230, 214)); d.rectangle([5, 9, 10, 13], fill=(232, 230, 214)); d.rectangle([5, 5, 6, 7], fill=DKC); d.rectangle([9, 5, 10, 7], fill=DKC); d.point((8, 9), fill=DKC)
def heart(d): d.ellipse([2, 3, 8, 9], fill=RD); d.ellipse([7, 3, 13, 9], fill=RD); d.polygon([(2, 7), (13, 7), (8, 14)], fill=RD)
def heartplus(d): heart(d); d.rectangle([7, 5, 8, 9], fill=WH); d.rectangle([5, 7, 10, 8], fill=WH)
def hourglass(d): d.polygon([(4, 2), (12, 2), (8, 8)], fill=GD); d.polygon([(8, 8), (4, 14), (12, 14)], fill=GD); d.rectangle([3, 1, 12, 2], fill=BR); d.rectangle([3, 14, 12, 15], fill=BR)
def dash(d): L(d, [(2, 4), (7, 8), (2, 12)], CYN, 2); L(d, [(8, 4), (13, 8), (8, 12)], CYN, 2)
def shield(d): d.polygon([(3, 2), (13, 2), (13, 8), (8, 14), (3, 8)], fill=SD); d.polygon([(5, 4), (11, 4), (11, 8), (8, 11), (5, 8)], fill=BLU)
def rshield(d): d.ellipse([2, 2, 13, 13], fill=SD); d.ellipse([5, 5, 10, 10], fill=GD)
def spikes(d):
    for x in (2, 6, 10): d.polygon([(x, 13), (x+2, 3), (x+4, 13)], fill=ST)
def arrow(d): L(d, [(2, 13), (12, 3)], BR, 1); d.polygon([(10, 1), (15, 1), (15, 6)], fill=ST); d.polygon([(2, 10), (2, 13), (5, 13)], fill=RD)
def quiver(d):
    d.rectangle([5, 4, 10, 14], fill=BR)
    for x in (6, 8, 10): L(d, [(x, 4), (x, 1)], ST)
def pierce(d): L(d, [(1, 8), (15, 8)], ST, 2); d.polygon([(11, 4), (15, 8), (11, 12)], fill=ST); d.ellipse([5, 5, 9, 11], outline=RD)
def bag(d): d.ellipse([3, 5, 12, 14], fill=BR); d.rectangle([6, 2, 9, 6], fill=BR); d.rectangle([5, 3, 10, 4], fill=GD)
def gem(d): d.polygon([(3, 5), (8, 1), (13, 5), (8, 15)], fill=CYN); L(d, [(3, 5), (13, 5)], WH); L(d, [(8, 1), (8, 15)], (170, 240, 255))
def book(d): d.rectangle([3, 2, 12, 13], fill=(110, 60, 150)); d.rectangle([4, 3, 11, 12], fill=(236, 228, 200)); L(d, [(5, 6), (10, 6)], BR); L(d, [(5, 9), (10, 9)], BR)
def pack(d): d.rectangle([3, 4, 12, 14], fill=BR); d.rectangle([5, 1, 10, 5], fill=WD); d.rectangle([4, 9, 11, 10], fill=GD)
def crown(d): d.polygon([(2, 12), (2, 4), (5, 8), (8, 2), (11, 8), (14, 4), (14, 12)], fill=GD); d.rectangle([2, 11, 14, 13], fill=GD); d.point((8, 8), fill=RD)
def flame(d): d.polygon([(8, 1), (12, 7), (13, 11), (8, 15), (3, 11), (4, 6)], fill=ORG); d.polygon([(8, 6), (10, 10), (8, 14), (6, 10)], fill=YEL)
def snow(d): L(d, [(8, 1), (8, 15)], CYN, 2); L(d, [(1, 8), (15, 8)], CYN, 2); L(d, [(3, 3), (13, 13)], CYN); L(d, [(13, 3), (3, 13)], CYN)
def bolt(d): d.polygon([(9, 1), (3, 9), (7, 9), (6, 15), (13, 6), (8, 6)], fill=YEL)
def moon(d): d.ellipse([3, 2, 13, 14], fill=PUR); d.ellipse([6, 1, 15, 12], fill=(0, 0, 0, 0))
def sun(d):
    d.ellipse([4, 4, 11, 11], fill=YEL)
    for a, b in ((7, 0), (7, 14), (0, 7), (14, 7), (2, 2), (12, 2), (2, 12), (12, 12)): d.rectangle([a, b, a+1, b+1], fill=YEL)
def leaf(d): d.polygon([(3, 13), (4, 5), (11, 2), (13, 9), (7, 13)], fill=GRN); L(d, [(3, 13), (11, 5)], (40, 110, 50))
def fist(d):
    d.rectangle([4, 5, 12, 12], fill=(226, 176, 140))
    for x in (5, 7, 9, 11): L(d, [(x, 5), (x, 8)], (190, 140, 110))
    d.rectangle([2, 7, 4, 10], fill=(226, 176, 140))
def clock(d): d.ellipse([2, 2, 13, 13], fill=WH); d.ellipse([2, 2, 13, 13], outline=DKC); L(d, [(8, 8), (8, 4)], DKC); L(d, [(8, 8), (11, 8)], DKC)
def orb(d): d.ellipse([3, 3, 12, 12], fill=(110, 150, 255)); d.ellipse([5, 5, 7, 7], fill=WH)
def cross(d): d.rectangle([6, 2, 9, 13], fill=GRN); d.rectangle([2, 6, 13, 9], fill=GRN)
def fangs(d): d.polygon([(3, 3), (7, 3), (5, 12)], fill=WH); d.polygon([(8, 3), (12, 3), (10, 12)], fill=WH); d.rectangle([3, 2, 12, 3], fill=RD)
def drip(d): d.polygon([(8, 1), (12, 8), (8, 14), (4, 8)], fill=(210, 40, 70)); d.ellipse([4, 7, 12, 14], fill=(210, 40, 70)); d.point((6, 9), fill=(255, 150, 160))
def vine(d): L(d, [(3, 14), (6, 9), (10, 7), (13, 2)], GRN, 2); d.ellipse([9, 2, 12, 5], fill=(90, 200, 100))
def eye(d): d.ellipse([1, 5, 14, 11], fill=WH); d.ellipse([5, 5, 10, 11], fill=PUR); d.point((7, 8), fill=DKC)
def clover(d):
    for x, y in ((5, 5), (10, 5), (5, 10), (10, 10)): d.ellipse([x-2, y-2, x+2, y+2], fill=GRN)
    L(d, [(8, 8), (8, 15)], (40, 110, 50))
def wing(d): d.polygon([(2, 12), (5, 3), (13, 2), (9, 8), (12, 9), (7, 13)], fill=YEL)
def rage(d): fist(d); d.polygon([(8, 0), (10, 3), (6, 3)], fill=RD)
def ironshield(d): shield(d); d.polygon([(5, 4), (11, 4), (11, 8), (8, 11), (5, 8)], fill=(150, 170, 200))
def target(d): d.ellipse([2, 2, 13, 13], outline=RD); d.ellipse([5, 5, 10, 10], outline=RD); d.point((8, 8), fill=RD)
def down(d): d.polygon([(8, 14), (2, 6), (6, 6), (6, 2), (10, 2), (10, 6), (14, 6)], fill=(150, 150, 170))
def chain(d): d.ellipse([1, 2, 7, 8], outline=ST); d.ellipse([5, 5, 11, 11], outline=ST); d.ellipse([9, 8, 15, 14], outline=ST)
def impact(d):
    for a in ((8, 1, 8, 5), (8, 11, 8, 15), (1, 8, 5, 8), (11, 8, 15, 8), (3, 3, 6, 6), (12, 3, 9, 6), (3, 13, 6, 10), (12, 13, 9, 10)): L(d, [(a[0], a[1]), (a[2], a[3])], ST, 2)
def paw(d):
    d.ellipse([4, 8, 11, 14], fill=BR)
    for x, y in ((2, 6), (5, 3), (9, 3), (12, 6)): d.ellipse([x-1, y-1, x+1, y+1], fill=BR)
def skullm(d): d.ellipse([3, 2, 12, 10], fill=(160, 255, 200)); d.rectangle([5, 9, 10, 13], fill=(160, 255, 200)); d.rectangle([5, 5, 6, 7], fill=DKC); d.rectangle([9, 5, 10, 7], fill=DKC)
def swords2(d): L(d, [(2, 13), (11, 4)], ST, 2); L(d, [(13, 13), (4, 4)], ST, 2); L(d, [(1, 11), (4, 14)], GD); L(d, [(14, 11), (11, 14)], GD)
def sparkle(d):
    for x, y in ((4, 4), (11, 6), (6, 11)): L(d, [(x-2, y), (x+2, y)], YEL); L(d, [(x, y-2), (x, y+2)], YEL)
def arcane(d): d.ellipse([2, 2, 13, 13], outline=(110, 150, 255)); d.ellipse([5, 5, 10, 10], outline=(180, 200, 255)); d.point((8, 8), fill=WH); d.point((2, 7), fill=WH)
def summon(d): d.ellipse([1, 1, 14, 14], outline=SCHC['summon']); L(d, [(8, 2), (3, 12), (13, 12), (8, 2)], SCHC['summon']); d.point((8, 8), fill=WH)
def freeze(d): d.rectangle([3, 3, 12, 12], fill=(190, 235, 255)); d.rectangle([3, 3, 12, 4], fill=WH); L(d, [(5, 6), (7, 6)], WH); L(d, [(5, 6), (5, 10)], WH)
def stun(d):
    for x, y in ((4, 4), (11, 4), (8, 11)): d.polygon([(x, y-3), (x+1, y-1), (x+3, y), (x+1, y+1), (x, y+3), (x-1, y+1), (x-3, y), (x-1, y-1)], fill=YEL)
def poison(d): d.polygon([(8, 1), (12, 8), (8, 14), (4, 8)], fill=GRN); d.ellipse([4, 7, 12, 14], fill=GRN); d.rectangle([7, 8, 8, 10], fill=DKC)
def chill(d): L(d, [(8, 2), (8, 14)], BLU, 2); L(d, [(2, 8), (14, 8)], BLU, 2); L(d, [(4, 4), (12, 12)], CYN); L(d, [(12, 4), (4, 12)], CYN)
def bless(d): d.ellipse([3, 1, 12, 5], outline=GD); d.ellipse([5, 6, 10, 14], fill=WH)
def fear(d): d.ellipse([3, 2, 12, 10], fill=(210, 200, 250)); d.rectangle([3, 6, 12, 13], fill=(210, 200, 250)); d.rectangle([5, 5, 6, 7], fill=DKC); d.rectangle([9, 5, 10, 7], fill=DKC); d.ellipse([6, 9, 9, 12], fill=DKC)
def lock(d): d.rectangle([3, 7, 12, 14], fill=GD); d.ellipse([4, 1, 11, 9], outline=SD); d.rectangle([7, 9, 8, 12], fill=DKC)
def cog(d):
    d.ellipse([3, 3, 12, 12], fill=SD); d.ellipse([6, 6, 9, 9], fill=(0, 0, 0, 0))
    for r in ([7, 0, 8, 2], [7, 13, 8, 15], [0, 7, 2, 8], [13, 7, 15, 8]): d.rectangle(r, fill=SD)
def orei(d): chunk(d, ORE['iron'])
ICONS = [('sword', sword), ('star', star), ('skull', skull), ('heart', heart), ('heartplus', heartplus), ('boots', boots), ('hourglass', hourglass), ('dash', dash), ('shield', shield), ('rshield', rshield),
         ('spikes', spikes), ('arrow', arrow), ('quiver', quiver), ('pierce', pierce), ('coin', coin), ('bag', bag), ('gem', gem), ('book', book), ('pack', pack), ('anvil', anvil), ('crown', crown),
         ('flame', flame), ('snow', snow), ('bolt', bolt), ('moon', moon), ('sun', sun), ('leaf', leaf), ('fist', fist), ('clock', clock), ('orb', orb), ('cross', cross), ('fangs', fangs), ('blood', drip),
         ('vine', vine), ('eye', eye), ('clover', clover), ('wing', wing), ('rage', rage), ('ironshield', ironshield), ('target', target), ('down', down), ('chain', chain), ('impact', impact), ('paw', paw),
         ('egg', egg), ('skullm', skullm), ('swords2', swords2), ('pickaxe', pickaxe), ('hammer', hammer), ('sparkle', sparkle), ('arcane', arcane), ('summon', summon), ('freeze', freeze), ('stun', stun),
         ('poison', poison), ('burn', flame), ('chill', chill), ('bleed', drip), ('bless', bless), ('fear', fear), ('lock', lock), ('cog', cog), ('ore', orei), ('wand', wand), ('staff', staff)]
cols = 10; sh = Image.new('RGBA', (16*cols, 16*((len(ICONS)+cols-1)//cols)), (0, 0, 0, 0)); AT['icons'] = {}
for i, (k, fn) in enumerate(ICONS):
    x, y = (i % cols)*16, (i//cols)*16; sh.paste(mk(fn), (x, y)); AT['icons'][k] = [x, y]
save('icons', sh)

open(os.path.join(OUT, 'atlas.js'), 'w').write('const ATLAS=' + json.dumps(AT) + ';\n')
print('sprites written to', os.path.abspath(OUT))
