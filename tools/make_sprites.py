#!/usr/bin/env python3
# Ember Depths sprite generator (needs Pillow). Run: python3 make_sprites.py
# Writes ../sprites/*.png and ../sprites/atlas.js. Edit any function and re-run to restyle.
import os, json, random
from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'sprites')
os.makedirs(OUT, exist_ok=True)
INK = (18, 12, 26, 255)
AT = {'sheets': {}}

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

def save(name, im):
    im.save(os.path.join(OUT, name + '.png')); AT['sheets'][name] = list(im.size)

# ---------- items / props (16x16, melee icons point up-right, ranged icons point right)
ST = (206, 212, 224); SD = (150, 158, 176); GD = (232, 190, 72); BR = (150, 98, 54); WD = (112, 74, 44); RD = (205, 60, 70); DKC = (30, 26, 40)
def sword(d): L(d, [(4, 11), (12, 3)], ST, 2); d.point((13, 2), fill=ST); L(d, [(3, 8), (7, 12)], GD); L(d, [(4, 11), (2, 13)], BR, 2); d.point((1, 14), fill=GD)
def greatsword(d): L(d, [(5, 10), (13, 2)], ST, 3); L(d, [(3, 8), (8, 13)], GD, 2); L(d, [(5, 10), (1, 14)], BR, 2)
def dagger(d): L(d, [(6, 9), (11, 4)], ST, 2); d.point((12, 3), fill=ST); L(d, [(5, 7), (8, 10)], GD); L(d, [(6, 9), (4, 11)], BR, 2)
def axe(d): L(d, [(3, 13), (11, 5)], WD, 2); d.polygon([(8, 2), (13, 2), (14, 7), (11, 8), (10, 5)], fill=ST)
def mace(d): L(d, [(3, 13), (9, 7)], WD, 2); d.ellipse([8, 2, 13, 7], fill=SD); d.point((10, 3), fill=ST)
def spear(d): L(d, [(2, 14), (11, 5)], WD, 2); L(d, [(10, 6), (14, 2)], ST, 2); d.point((15, 1), fill=ST)
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
def scroll(d):
    d.rectangle([3, 3, 12, 12], fill=(226, 208, 160)); d.ellipse([1, 2, 4, 13], fill=(200, 176, 120)); d.ellipse([11, 2, 14, 13], fill=(200, 176, 120))
    d.ellipse([6, 6, 9, 9], fill=RD); L(d, [(5, 5), (10, 5)], (120, 90, 50)); L(d, [(5, 10), (10, 10)], (120, 90, 50))
def potion(d): d.rectangle([7, 2, 8, 4], fill=(190, 190, 200)); d.rectangle([6, 1, 9, 2], fill=BR); d.ellipse([4, 5, 11, 13], fill=RD); d.point((6, 7), fill=(255, 170, 180))
def chestc(d): d.rectangle([2, 7, 13, 13], fill=BR); d.rectangle([2, 5, 13, 7], fill=WD); d.rectangle([7, 5, 8, 13], fill=GD); d.rectangle([7, 8, 8, 9], fill=ST)
def chesto(d): d.rectangle([2, 8, 13, 13], fill=BR); d.rectangle([2, 2, 13, 5], fill=WD); d.rectangle([3, 6, 12, 8], fill=(255, 220, 110))
def shrine(d): d.rectangle([3, 10, 12, 14], fill=SD); d.rectangle([5, 6, 10, 10], fill=ST); d.polygon([(8, 0), (11, 4), (8, 6), (5, 4)], fill=(110, 210, 255)); d.point((8, 3), fill=(255, 255, 255))
def gate0(d): d.rectangle([2, 4, 13, 14], fill=(70, 64, 84)); d.ellipse([2, 1, 13, 8], fill=(70, 64, 84)); d.rectangle([5, 6, 10, 14], fill=(24, 18, 32)); d.ellipse([5, 4, 10, 8], fill=(24, 18, 32)); d.point((8, 9), fill=RD)
def gate1(d): gate0(d); d.ellipse([5, 5, 10, 14], fill=(90, 240, 170)); d.ellipse([6, 7, 9, 13], fill=(210, 255, 235))

ITEMS = [('sword', sword), ('greatsword', greatsword), ('dagger', dagger), ('axe', axe), ('mace', mace), ('spear', spear), ('bow', bow), ('crossbow', crossbow),
         ('pistol', pistol), ('rifle', rifle), ('shotgun', shotgun), ('helm', helm), ('chest', chest), ('boots', boots), ('ring', ring), ('amulet', amulet),
         ('scroll', scroll), ('potion', potion), ('chestc', chestc), ('chesto', chesto), ('shrine', shrine), ('gate0', gate0), ('gate1', gate1)]
cols = 8; sh = Image.new('RGBA', (16*cols, 16*((len(ITEMS)+cols-1)//cols)), (0, 0, 0, 0)); AT['items'] = {}
for i, (k, fn) in enumerate(ITEMS):
    x, y = (i % cols)*16, (i//cols)*16; sh.paste(mk(fn), (x, y)); AT['items'][k] = [x, y, 16, 16, 1]
save('items', sh)

# ---------- monsters (2 frames each)
def slime(d, f):
    g = (96, 206, 112); y = 7+f
    d.ellipse([2, y, 13, 14], fill=g); d.rectangle([2, y+3, 13, 14], fill=g); d.ellipse([4, y+1, 7, y+3], fill=(205, 255, 210))
    d.rectangle([5, y+4, 6, y+6], fill=(24, 40, 34)); d.rectangle([9, y+4, 10, y+6], fill=(24, 40, 34)); d.point((5, y+4), fill=(255, 255, 255)); d.point((9, y+4), fill=(255, 255, 255))
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
    d.point((6, 3), fill=(255, 70, 50)); d.point((9, 3), fill=(255, 70, 50)); d.point((6, 5), fill=(240, 236, 214)); d.point((9, 5), fill=(240, 236, 214))
def cultist(d, f):
    r = (116, 64, 160); dk = (26, 14, 36)
    d.polygon([(8, 2), (3, 14+f), (13, 14+f)], fill=r); d.ellipse([5, 1, 10, 7], fill=r); d.rectangle([6, 3, 9, 5], fill=dk)
    d.point((7, 4), fill=(255, 220, 70)); d.point((9, 4), fill=(255, 220, 70)); L(d, [(13, 3), (13, 14)], BR); d.ellipse([12, 1, 14, 3], fill=(110, 220, 255))
def wraith(d, f):
    c = (150, 190, 235); dk = (20, 30, 60)
    d.ellipse([4, 1, 11, 8], fill=c); d.polygon([(4, 6), (11, 6), (13, 14), (11, 12+f), (9, 15), (7, 12+f), (5, 15), (3, 14)], fill=c)
    d.rectangle([5, 3, 10, 5], fill=dk); d.point((6, 4), fill=(160, 255, 255)); d.point((9, 4), fill=(160, 255, 255))

def strip(rows, cw, ch):
    nf = max(len(f) for _, f in rows); sh = Image.new('RGBA', (cw*nf, ch*len(rows)), (0, 0, 0, 0)); at = {}
    for i, (k, fr) in enumerate(rows):
        for j, f in enumerate(fr): sh.paste(f, (j*cw, i*ch))
        at[k] = [0, i*ch, cw, ch, len(fr)]
    return sh, at

sh, AT['mobs'] = strip([(n, [mk(fn, 16, 16, f) for f in (0, 1)]) for n, fn in (('slime', slime), ('bat', bat), ('skeleton', skeleton), ('brute', brute), ('cultist', cultist), ('wraith', wraith))], 16, 16)
save('mobs', sh)

# ---------- bosses (32x32, 2 frames)
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
    d.rectangle([14, 14, 15, 16], fill=(240, 236, 214)); d.rectangle([17, 14, 18, 16], fill=(240, 236, 214)); d.ellipse([12, 18, 19, 24], fill=(120, 200, 100))
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
sh, AT['bosses'] = strip([(n, [mk(fn, 32, 32, f) for f in (0, 1)]) for n, fn in (('warden', warden), ('brood', brood), ('lich', lich), ('golem', golem))], 32, 32)
save('bosses', sh)

# ---------- hero layers (16x20 cells; columns = dir*2+frame, dirs: down, side(right), up). Tinted in the game.
W = (238, 238, 238); EY = (30, 22, 44); IV = (240, 236, 214)
HN = ['legs', 'body', 'cloth', 'eyes', 'ears', 'tusks', 'beard'] + ['hair%d' % i for i in range(5)] + ['cls%d' % i for i in range(5)]
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
    else:
        b.ellipse([4, 3, 11, 10], fill=W); b.point((3, 14), fill=W); b.point((12, 14), fill=W)
        c.rectangle([4, 11, 11, 15], fill=W); c.rectangle([3, 11, 3, 13], fill=W); c.rectangle([12, 11, 12, 13], fill=W)
        if dr == 0: e.point((6, 7), fill=EY); e.point((9, 7), fill=EY); D['tusks'].point((6, 10), fill=IV); D['tusks'].point((9, 10), fill=IV)
        D['ears'].polygon([(4, 6), (1, 4), (4, 8)], fill=W); D['ears'].polygon([(11, 6), (14, 4), (11, 8)], fill=W); D['beard'].polygon([(5, 8), (10, 8), (9, 13), (6, 13)], fill=W)
    for i in range(5):
        h = D['hair%d' % i]
        if dr == 2: h.ellipse([4, 2, 11, 10], fill=W)
        elif dr == 1: h.rectangle([4, 3, 8, 8], fill=W); h.rectangle([5, 2, 10, 4], fill=W)
        else: h.rectangle([4, 2, 11, 5], fill=W); h.point((4, 6), fill=W); h.point((11, 6), fill=W)
        if i == 1:
            if dr == 1: h.rectangle([3, 4, 6, 13], fill=W)
            else: h.rectangle([3, 3, 4, 12], fill=W); h.rectangle([11, 3, 12, 12], fill=W)
        if i == 2:
            for x in (5, 8, 10): h.polygon([(x-1, 2), (x, 0), (x+1, 2)], fill=W)
        if i == 3: h.rectangle([3, 2, 12, 10], fill=(0, 0, 0, 0)); h.rectangle([6, 0, 8, 6] if dr == 1 else [7, 0, 8, 6], fill=W)
        if i == 4:
            if dr == 1: h.rectangle([2, 4, 4, 10], fill=W)
            else: h.rectangle([12, 5, 13, 10], fill=W)
    g = D['cls0']; g.ellipse([2, 10, 5, 13], fill=W); g.ellipse([10, 10, 13, 13], fill=W); g.rectangle([4, 14, 11, 14], fill=W)
    g = D['cls1']; g.rectangle([3, 11, 12, 12], fill=W)
    if dr != 2: g.rectangle([4, 9, 11, 10], fill=W)
    g = D['cls2']; g.polygon([(3, 6), (8, 0), (12, 6)], fill=W)
    g = D['cls3']; g.polygon([(3, 5), (12, 5), (8, 0)], fill=W); g.rectangle([2, 4, 13, 5], fill=W)
    g = D['cls4']; g.rectangle([2, 4, 13, 4], fill=W); g.rectangle([5, 1, 10, 4], fill=W); g.line([(4, 11), (11, 15)], fill=W)
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

# ---------- tiles: 5 biomes x [floor0..3, wall face, wall top]
BIO = [((74, 78, 102), (104, 108, 138)), ((60, 86, 68), (92, 116, 84)), ((100, 66, 58), (140, 88, 72)), ((104, 138, 168), (150, 184, 210)), ((82, 60, 112), (116, 88, 156))]
def tile(base, kind, seed, v=0):
    r = random.Random(seed); im = img(); p = im.load(); tone = {}
    for y in range(16):
        for x in range(16):
            if kind == 'face':
                row = y // 4; off = (row % 2)*4; bi = (x+off) // 8; bx = (x+off) % 8
                t = tone.setdefault((row, bi), r.uniform(.9, 1.1)); k = t*(.6 if (y % 4 == 3 or bx == 7) else (1.14 if y % 4 == 0 else 1))
            elif kind == 'top': k = .52 + r.uniform(-.03, .03)
            else:
                k = 1 + r.uniform(-.05, .05)
                if y == 0 or x == 0: k *= 1.1
                if y == 15 or x == 15: k *= .78
            p[x, y] = tuple(max(0, min(255, int(c*k))) for c in base) + (255,)
    if kind == 'floor' and v == 2:
        for i in range(7): p[3+i, 5+(i*2)//3] = tuple(int(c*.5) for c in base) + (255,)
    if kind == 'floor' and v == 3:
        for _ in range(4): p[r.randrange(2, 14), r.randrange(2, 14)] = tuple(min(255, int(c*1.3)) for c in base) + (255,)
    return im
sh = Image.new('RGBA', (96, 80), (0, 0, 0, 0))
for b, (fb, wb) in enumerate(BIO):
    for v in range(4): sh.paste(tile(fb, 'floor', b*10+v, v), (v*16, b*16))
    sh.paste(tile(wb, 'face', b*10+5), (64, b*16)); sh.paste(tile(wb, 'top', b*10+6), (80, b*16))
save('tiles', sh)

open(os.path.join(OUT, 'atlas.js'), 'w').write('const ATLAS=' + json.dumps(AT) + ';\n')
print('sprites written to', os.path.abspath(OUT))
