"""Aksen Standar Velora (12 SVG), digambar sendiri dalam kode. Jalankan: python3 _buat.py
Gaya: datar-cetak-geser (isi digeser 2 px kanan-bawah dari kontur), garis-halus, datar-garis, piksel."""
import math, os
D = os.path.dirname(os.path.abspath(__file__))
OFF = 2


def f(v):
    s = f'{v:.1f}'.rstrip('0').rstrip('.')
    return '0' if s == '-0' else s


def P(pts, close=True):
    s = 'M' + ' L'.join(f'{f(x)} {f(y)}' for x, y in pts)
    return s + (' Z' if close else '')


def ell(cx, cy, rx, ry, rot=0, n=24):
    a = math.radians(rot); pts = []
    for i in range(n):
        t = 2 * math.pi * i / n
        x, y = rx * math.cos(t), ry * math.sin(t)
        pts.append((cx + x * math.cos(a) - y * math.sin(a), cy + x * math.sin(a) + y * math.cos(a)))
    return smooth(pts)


def smooth(pts):
    """Catmull-Rom tertutup -> cubic bezier."""
    n = len(pts); s = f'M{f(pts[0][0])} {f(pts[0][1])}'
    for i in range(n):
        p0, p1, p2, p3 = pts[i - 1], pts[i], pts[(i + 1) % n], pts[(i + 2) % n]
        c1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        c2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        s += f' C{f(c1[0])} {f(c1[1])} {f(c2[0])} {f(c2[1])} {f(p2[0])} {f(p2[1])}'
    return s + 'Z'


def rot(pts, cx, cy, deg):
    a = math.radians(deg); c, s = math.cos(a), math.sin(a)
    return [(cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c) for x, y in pts]


def rs(d, fill, ink, sw=1.5, tf='', gap=None, fop=None, off=OFF):
    """Cetak geser: isi digeser off px kanan-bawah, kontur di posisi asli."""
    o = ''
    if fill:
        t = f' transform="translate({off} {off}){(" " + tf) if tf else ""}"'
        o += f'<path d="{d}" fill="{fill}"{t}' + (f' fill-opacity="{fop}"' if fop else '') + '/>'
    if ink:
        t = f' transform="{tf}"' if tf else ''
        g = f' pathLength="100" stroke-dasharray="{gap[0]} {gap[1]} 100"' if gap else ''
        o += f'<path d="{d}" fill="none" stroke="{ink}" stroke-width="{sw}"{t}{g}/>'
    return o


def ln(d, ink, sw=1, extra=''):
    return f'<path d="{d}" fill="none" stroke="{ink}" stroke-width="{sw}"{extra}/>'


def star4(cx, cy, r, fill, ink=None, sw=1):
    k = r * 0.3
    pts = [(cx, cy - r), (cx + k, cy - k), (cx + r, cy), (cx + k, cy + k), (cx, cy + r), (cx - k, cy + k), (cx - r, cy), (cx - k, cy - k)]
    d = 'M' + ' Q'.join([])
    # sisi melengkung ke dalam
    s = f'M{f(pts[0][0])} {f(pts[0][1])}'
    for i in range(0, 8, 2):
        a, b = pts[(i + 2) % 8], (cx, cy)
        s += f' Q{f(cx)} {f(cy)} {f(a[0])} {f(a[1])}'
    s += 'Z'
    return f'<path d="{s}" fill="{fill}"' + (f' stroke="{ink}" stroke-width="{sw}"' if ink else '') + '/>'


def svg(name, w, h, body):
    s = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {h}" width="{w}" height="{h}" '
         f'fill="none" stroke-linecap="round" stroke-linejoin="round">{body}</svg>')
    open(os.path.join(D, name), 'w').write(s)
    print(name, len(s.encode()), 'B')


# 1. Balon udara awan (96x128)
def balon():
    G, B, E, W, A = '#2F4A63', '#3D6E97', '#E2C27D', '#FFFFFF', '#FFF5F4'
    bal = 'M48 8C70 8 84 23 84 41C84 58 68 69 60 84L36 84C28 69 12 58 12 41C12 23 26 8 48 8Z'
    o = '<defs><clipPath id="aks-balon"><path d="' + bal + '" transform="translate(2 2)"/></clipPath></defs>'
    # tali dulu (di belakang)
    for x0, x1 in [(37, 38), (44, 45), (52, 51), (59, 58)]:
        o += ln(f'M{x0} 84L{x1} 99', G, 1)
    # isi lajur, digeser
    o += f'<g clip-path="url(#aks-balon)"><path d="{bal}" fill="{W}" transform="translate(2 2)"/>'
    for k in (0, 2, 4):
        bx = [12 + k * 72 / 5, 12 + (k + 1) * 72 / 5]; nx = [36 + k * 24 / 5, 36 + (k + 1) * 24 / 5]
        a = f'M48 8C{f(48 + (bx[0] - 48) * .9)} 12 {f(bx[0])} 26 {f(bx[0])} 42C{f(bx[0])} 60 {f(nx[0])} 72 {f(nx[0])} 86'
        b = f'L{f(nx[1])} 86C{f(nx[1])} 72 {f(bx[1])} 60 {f(bx[1])} 42C{f(bx[1])} 26 {f(48 + (bx[1] - 48) * .9)} 12 48 8Z'
        o += f'<path d="{a}{b}" fill="{B}" transform="translate(2 2)"/>'
    o += f'<path d="M20 70Q48 80 76 70L76 80Q48 89 20 80Z" fill="{E}" transform="translate(2 2)"/></g>'
    # garis lajur
    for k in (1, 2, 3, 4):
        bx = 12 + k * 72 / 5; nx = 36 + k * 24 / 5
        o += ln(f'M48 8C{f(48 + (bx - 48) * .9)} 12 {f(bx)} 26 {f(bx)} 42C{f(bx)} 58 {f(nx)} 70 {f(nx)} 84', G, 1)
    o += ln('M27 72Q48 79 69 72', G, 1)
    o += rs(bal, None, G, gap=(30, 4))
    # keranjang
    o += rs('M37 99H59Q61 99 61 101L59.5 112Q59 114 57 114H39Q37 114 36.5 112L35 101Q35 99 37 99Z', E, G)
    o += ln('M37 104.5H59', G, 1)
    # awan kecil kiri-bawah
    o += rs('M10 121C5 121 5 114 10 113C10 108 17 107 19 110C21 105 29 106 29 111C34 111 35 117 31 119C30 121 28 121 27 121Z', A, E, sw=1)
    svg('balon-awan.svg', 96, 128, o)


# 2. Teropong (118x118)
def teropong():
    G, B, Y, L = '#1F2F4A', '#2F5C9E', '#F2B93B', '#EAF2FF'
    px, py = 46, 70; tf = f'rotate(-35 {px} {py})'
    o = ''
    # kaki tiga
    for x, y in [(22, 110), (47, 112), (72, 108)]:
        o += ln(f'M{px} {py + 2}L{x} {y}', G, 2.2)
    o += rs(f'M{px - 5} {py + 1}H{px + 5}L{px + 3} {py + 8}H{px - 3}Z', G, G, sw=1.2)
    # tabung (lokal horizontal, pusat px,py)
    def r(x0, x1, hh, rr=2):
        return f'M{px + x0 + rr} {py - hh}H{px + x1 - rr}Q{px + x1} {py - hh} {px + x1} {py - hh + rr}V{py + hh - rr}Q{px + x1} {py + hh} {px + x1 - rr} {py + hh}H{px + x0 + rr}Q{px + x0} {py + hh} {px + x0} {py + hh - rr}V{py - hh + rr}Q{px + x0} {py - hh} {px + x0 + rr} {py - hh}Z'
    o += rs(r(-40, -26, 5), B, G, tf=tf)               # okuler
    o += rs(r(-27, 30, 8, 3), B, G, tf=tf, gap=(58, 3))  # ruas utama
    o += rs(r(29, 50, 10.5, 3), B, G, tf=tf)          # ruas depan
    o += rs(r(-6, 0, 8.6, 1), Y, G, tf=tf)             # cincin
    o += rs(r(25, 30, 9.2, 1), Y, G, tf=tf)
    o += f'<path d="M{px - 22} {py - 4.5}H{px + 22}" stroke="{L}" stroke-width="1.6" stroke-opacity=".55" transform="{tf}"/>'
    # lensa depan
    o += rs(ell(px + 50, py, 3.2, 10.5), L, G, tf=tf)
    o += f'<path d="M{px + 49.5} {py - 6}V{py - 3}" stroke="#FFFFFF" stroke-width="1.6" transform="{tf}"/>'
    o += star4(104, 16, 7, Y, G, 1)
    o += star4(92, 6, 2.6, Y)
    svg('teropong.svg', 118, 118, o)


# 3. Lebah dan kuntum (132x108)
def lebah():
    G, T, S, W, J = '#6B5560', '#C9A27A', '#EEF5FA', '#FFFFFF', '#96605A'
    o = ''
    fx, fy = 30, 70
    # jejak
    o += ln(f'M{fx + 12} {fy - 14}C52 34 68 72 80 52S90 34 92 38', J, 1.2,
            ' stroke-opacity=".6" stroke-dasharray="3 3.4"')
    # tangkai + daun
    o += ln(f'M{fx} {fy + 10}C{fx + 1} 88 {fx - 3} 96 {fx - 4} 102', G, 1.5)
    o += rs(f'M{fx - 1} 92C{fx + 6} 86 {fx + 14} 87 {fx + 16} 90C{fx + 10} 95 {fx + 3} 95 {fx - 1} 92Z', T, G, sw=1.2)
    # kelopak
    for i in range(8):
        a = i * 45 + 10
        cx, cy = fx + 9.5 * math.cos(math.radians(a)), fy + 9.5 * math.sin(math.radians(a))
        o += rs(ell(cx, cy, 6.2, 3.6, a, 10), W, T, sw=1.3)
    o += rs(ell(fx, fy, 5, 5, 0, 12), T, G, sw=1.2)
    # lebah
    bx, by, ang = 102, 38, -18
    tf = f'rotate({ang} {bx} {by})'
    o += rs(ell(bx - 4, by - 13, 8, 7.5, -20, 12), S, G, sw=1)
    o += rs(ell(bx + 5, by - 14, 7, 6.5, 15, 12), S, G, sw=1)
    o += rs(f'M{bx - 15} {by - 1}L{bx - 21} {by + 1}L{bx - 15} {by + 3}Z', G, None, tf=tf, off=0)
    body = ell(bx, by, 16, 10.5, 0, 16)
    o += '<defs><clipPath id="aks-lebah"><path d="' + body + f'" transform="translate(2 2) {tf}"/></clipPath></defs>'
    o += f'<path d="{body}" fill="{T}" transform="translate(2 2) {tf}"/>'
    o += f'<g clip-path="url(#aks-lebah)"><path d="M{bx - 7} {by - 12}h4.5v26h-4.5zM{bx + 2} {by - 12}h4.5v26h-4.5z" fill="{G}" transform="translate(2 2) {tf}"/></g>'
    o += f'<path d="{body}" stroke="{G}" stroke-width="1.5" transform="{tf}"/>'
    o += f'<circle cx="{bx + 11}" cy="{by - 2}" r="1.4" fill="{G}" transform="{tf}"/>'
    o += ln(f'M{bx + 12} {by - 8}Q{bx + 14} {by - 14} {bx + 18} {by - 15}', G, 1, f' transform="{tf}"')
    o += ln(f'M{bx + 14} {by - 6}Q{bx + 18} {by - 10} {bx + 22} {by - 10}', G, 1, f' transform="{tf}"')
    svg('lebah-kuntum.svg', 132, 108, o)


# 4. Baling-baling kertas (78x150)
def baling():
    G, A, Y, M, L = '#3F6B62', '#357A6C', '#B8A06A', '#E6F4EF', '#E8F1F8'
    cx, cy, R = 38, 40, 31
    o = rs(f'M{cx - 2} {cy}L{cx + 2} {cy}L{cx + 13} {cy + 104}L{cx + 9.5} {cy + 104.4}Z', Y, G, sw=1.2)
    cols = [A, M, Y, L]
    tf = f'rotate(12 {cx} {cy})'
    Tn = [(cx + R * math.cos(math.radians(-135 + i * 90)), cy + R * math.sin(math.radians(-135 + i * 90))) for i in range(4)]
    for i in range(4):
        T, U = Tn[i], Tn[(i + 1) % 4]
        Q = (T[0] + (U[0] - T[0]) * .55, T[1] + (U[1] - T[1]) * .55)
        Cc = (T[0] + (U[0] - T[0]) * .3 + (T[0] - cx) * .08, T[1] + (U[1] - T[1]) * .3 + (T[1] - cy) * .08)
        d = f'M{cx} {cy}L{f(T[0])} {f(T[1])}Q{f(Cc[0])} {f(Cc[1])} {f(Q[0])} {f(Q[1])}Z'
        o += rs(d, cols[i], G, sw=1.5, tf=tf, gap=(40, 4) if i == 1 else None)
        Fm = (cx + (T[0] - cx) * .5, cy + (T[1] - cy) * .5)
        o += f'<path d="M{cx} {cy}L{f(Q[0])} {f(Q[1])}L{f(Fm[0])} {f(Fm[1])}Z" fill="{G}" fill-opacity=".22" transform="{tf}"/>'
    o += f'<circle cx="{cx + 1}" cy="{cy + 1}" r="3.4" fill="{G}"/><circle cx="{cx}" cy="{cy}" r="1" fill="{L}"/>'
    svg('baling-baling.svg', 78, 150, o)


# 5. Dua stroberi berpita (112x104)
def stroberi():
    G, R, Pk, Sd = '#8A2E4E', '#B03A62', '#F2A7BC', '#FFF3E3'
    o = ''

    def berry(cx, top, w, h, ang, pfx):
        d = (f'M{f(cx - w / 2)} {f(top + 6)}C{f(cx - w / 2)} {f(top - 2)} {f(cx + w / 2)} {f(top - 2)} {f(cx + w / 2)} {f(top + 6)}'
             f'C{f(cx + w / 2)} {f(top + h * .5)} {f(cx + w * .16)} {f(top + h)} {f(cx)} {f(top + h)}'
             f'C{f(cx - w * .16)} {f(top + h)} {f(cx - w / 2)} {f(top + h * .5)} {f(cx - w / 2)} {f(top + 6)}Z')
        tf = f'rotate({ang} {cx} {top})'
        s = rs(d, R, G, tf=tf, gap=(70, 4))
        # kilap
        s += f'<path d="M{f(cx - w * .36)} {f(top + 8)}Q{f(cx - w * .34)} {f(top + h * .42)} {f(cx - w * .12)} {f(top + h * .7)}" stroke="{Pk}" stroke-width="2.2" transform="translate(2 2) {tf}"/>'
        # biji
        for r_, row in enumerate(range(4)):
            yy = top + 12 + row * h * .19
            half = (w / 2 - 6) * (1 - (yy - top) / h * .85)
            k = 3 - (row // 2)
            for j in range(k):
                xx = cx - half + (2 * half) * (j + (.5 if row % 2 else .2)) / max(k - (0 if row % 2 else .6), 1)
                if abs(xx - cx) < half + .1:
                    s += f'<path d="M{f(xx)} {f(yy - 1.8)}q1.4 1.6 0 3.2q-1.4-1.6 0-3.2z" fill="{Sd}" transform="translate(2 2) {tf}"/>'
        # mahkota
        cr = []
        n = 5
        for j in range(n * 2 + 1):
            a = math.pi * j / (n * 2)
            rr = w * .38 if j % 2 == 0 else w * .14
            cr.append((cx - math.cos(a) * rr, top + 1 + math.sin(a) * rr * .55))
        s += rs(P(cr), G, G, sw=1, tf=tf)
        return s

    o += ln('M56 26Q70 30 80 44', G, 1.6)
    o += berry(80, 44, 30, 36, -10, 's')
    o += ln('M56 26Q44 32 40 48', G, 1.6)
    o += berry(40, 48, 42, 48, 9, 'b')
    # pita kupu-kupu
    o += rs('M55 24L50 38L46 36L52 24Z', Pk, G, sw=1.2)
    o += rs('M57 24L60 38L64 35L58 24Z', Pk, G, sw=1.2)
    o += rs('M55 22C48 12 36 12 37 20C38 27 48 27 55 23Z', Pk, G)
    o += rs('M57 22C64 12 76 12 75 20C74 27 64 27 57 23Z', Pk, G)
    o += rs(ell(56, 23, 3.4, 3.4, 0, 10), Pk, G, sw=1.3)
    o += ln('M41 19Q46 18 51 21M71 19Q66 18 61 21', G, 1)
    svg('stroberi-pita.svg', 112, 104, o)


# 6. Roket piksel (100x120, grid 20x24 sel 5 px)
def roket():
    G, W, B, Y, C = '#123A6B', '#FFFFFF', '#1F5FA8', '#F5B935', '#FFF7DF'
    cols, rows = 20, 24
    grid = [[None] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            p = c - r - 2; v = c + r - 19; av = abs(v)
            k = None
            if -9 <= p <= 5 and av <= 4: k = 'W'
            elif 5 < p and av <= 4 - (p - 5) * .5: k = 'W'
            elif -10 <= p <= -2 and 4 < av <= min(4 + (-2 - p), 7): k = 'F'
            elif p == -10 and av <= 3: k = 'N'
            elif -17 <= p <= -11 and av <= min(3, (p + 18) / 2):
                k = 'y' if av <= (p + 18) / 2 - 1.5 else 'Y'
            if k == 'W' and (p - 1) ** 2 + av ** 2 <= 5: k = 'B'
            grid[r][c] = k
    out = [[None] * cols for _ in range(rows)]
    for r in range(rows):
        for c in range(cols):
            k = grid[r][c]
            if k in ('W',):
                edge = any(not (0 <= r + dr < rows and 0 <= c + dc < cols) or grid[r + dr][c + dc] not in ('W', 'B', 'N')
                           for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)))
                out[r][c] = G if edge else W
            elif k == 'B': out[r][c] = B
            elif k == 'N': out[r][c] = G
            elif k == 'F':
                edge = any(grid[r + dr][c + dc] not in ('F', 'W', 'B', 'N') for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1))
                           if 0 <= r + dr < rows and 0 <= c + dc < cols)
                out[r][c] = G if edge else B
            elif k == 'Y': out[r][c] = Y
            elif k == 'y': out[r][c] = C
    # asap: kotak berbingkai, mengecil ke kiri bawah
    for (c0, r0, s) in [(5, 19, 4), (0, 18, 3), (1, 22, 2)]:
        for r in range(r0, r0 + s):
            for c in range(c0, c0 + s):
                if 0 <= r < rows and 0 <= c < cols and out[r][c] is None:
                    out[r][c] = G if (s < 3 or (r in (r0, r0 + s - 1) and c in (c0, c0 + s - 1) and s == 4 and False) or r in (r0, r0 + s - 1) or c in (c0, c0 + s - 1)) else C
    # gabung per baris
    bycol = {}
    for r in range(rows):
        c = 0
        while c < cols:
            k = out[r][c]
            if k is None: c += 1; continue
            e = c
            while e + 1 < cols and out[r][e + 1] == k: e += 1
            bycol.setdefault(k, []).append(f'M{c * 5} {r * 5}h{(e - c + 1) * 5}v5h-{(e - c + 1) * 5}z')
            c = e + 1
    o = ''.join(f'<path d="{"".join(v)}" fill="{k}"/>' for k, v in bycol.items())
    s = f'<g shape-rendering="crispEdges">{o}</g>'
    svg('roket-piksel.svg', 100, 120, s)
    return out


# 7. Perahu kertas di ombak (100x84)
def perahu():
    G, W, L, F, R = '#1D4466', '#FFFFFF', '#DDEEF8', '#2465A0', '#8CC2E0'
    tf = 'rotate(-4 50 60)'
    o = ''
    o += ln('M50 21V7', G, 1.2, f' transform="{tf}"')
    o += rs('M50 7.5L62 11L50 14.5Z', F, G, sw=1.2, tf=tf)
    o += rs('M50 20L32 52H50Z', W, G, tf=tf)          # layar kiri
    o += rs('M50 20L68 52H50Z', L, G, tf=tf)          # layar kanan (lipatan)
    o += rs('M8 50H92L76 70H24Z', W, G, tf=tf, gap=(62, 3))  # lambung
    o += rs('M8 50L30 60H70L92 50', None, G, sw=1, tf=tf)
    o += f'<path d="M30 60H70L76 70H24Z" fill="{L}" transform="translate(2 2) {tf}"/>'
    o += ln('M14 76Q22 72 30 76T46 76T62 76T78 76T90 75', R, 1.6)
    o += ln('M30 82Q37 78.5 44 82T58 82T72 81', R, 1.4)
    svg('perahu-kertas.svg', 100, 84, o)


# 8. Layang-layang wajik (104x176)
def layang():
    G, A, Y, C = '#2E5226', '#3F7A2E', '#E2B84A', '#FBF7E4'
    cx, cy = 46, 42
    T, Rr, B, Lf = (46, 8), (76, 42), (46, 98), (16, 42)
    pts = lambda *p: rot(list(p), cx, cy, 14)
    o = ''
    # benang kendali ke tepi kanan
    xc = pts((46, 42))[0]
    o += ln(f'M{f(xc[0])} {f(xc[1])}Q90 70 104 110', G, .9, ' stroke-opacity=".75"')
    # ekor
    tb = pts(B)[0]
    tail = f'M{f(tb[0])} {f(tb[1])}C{f(tb[0] - 6)} 116 80 118 76 134S70 156 84 170'
    o += ln(tail, G, 1.2)
    quads = [((46, 42), T, Rr, Y), ((46, 42), Rr, B, A), ((46, 42), B, Lf, Y), ((46, 42), Lf, T, A)]
    for c0, p1, p2, col in quads:
        o += rs(P(pts(c0, p1, p2)), col, None)
    o += rs(P(pts(T, Rr, B, Lf)), None, G, gap=(30, 3))
    a, b = pts(T, B), pts(Lf, Rr)
    o += ln(P(a, False), G, 1.2) + ln(P(b, False), G, 1.2)
    # simpul pita
    for i, (x, y, col) in enumerate([(56, 116, Y), (75, 135, C), (77, 158, Y)]):
        ang = [20, -25, 15][i]
        d = f'M{x} {y}L{x - 7} {y - 4}L{x - 7} {y + 4}ZM{x} {y}L{x + 7} {y - 4}L{x + 7} {y + 4}Z'
        o += rs(d, col, G, sw=1.1, tf=f'rotate({ang} {x} {y})')
    svg('layang-wajik.svg', 104, 176, o)


# 9. Kelinci duduk dan wortel (120x100)
def kelinci():
    G, W, K, O, D = '#7A3A12', '#FFFFFF', '#FDEBD3', '#B04A16', '#8BBF5A'
    o = ''
    # rumput
    o += ln('M14 93H106', D, 1.5)
    for x in (16, 24, 92, 100, 106):
        o += ln(f'M{x} 93L{x - 2} 87M{x} 93L{x + 2} 88', D, 1.3)
    # telinga belakang
    o += rs(ell(56, 21, 4.6, 14, 4, 18), W, G)
    o += rs(ell(64, 22, 5, 15, 18, 18), W, G)
    o += f'<path d="{ell(64, 23, 2.2, 10, 18, 14)}" fill="{K}" transform="translate(2 2)"/>'
    # ekor
    o += rs(ell(97, 80, 6, 6, 0, 12), W, G)
    # badan
    body = 'M42 92C34 82 36 60 52 54C64 49 84 52 93 66C99 76 98 88 90 92Z'
    o += rs(body, W, G, gap=(44, 3))
    o += ln('M70 92C66 82 72 70 84 71', G, 1.1)
    # kepala
    o += rs(ell(50, 44, 14.5, 12.5, -8, 20), W, G)
    o += f'<circle cx="43" cy="41" r="1.5" fill="{G}"/>'
    # wortel di depan dada
    wt = ' transform="rotate(14 36 74)"'
    o += rs('M30 62C30 58 41 58 41 62L37.5 90Q36 93 34 90Z', O, G, sw=1.3, tf='rotate(14 36 74)')
    o += ln('M32 68l3 .6M33.5 76l2.6 .5M34.5 83l2 .4', G, 1, wt)
    for d in ('M34 59C30 52 26 50 21 50', 'M35.5 58C35 51 33 47 30 44', 'M37 59C38 53 40 50 44 48'):
        o += ln(d, D, 2.2, wt)
    # kaki depan & cakar
    o += rs(ell(50, 90.5, 10, 3.4, 0, 14), W, G, sw=1.3)
    o += rs(ell(42, 70, 5.2, 3.8, -25, 12), W, G, sw=1.3)
    svg('kelinci-wortel.svg', 120, 100, o)


# 10. Tangkai sage garis (88x250)
def sage():
    G, Fl = '#4A5A3F', '#7F9A74'
    o = ''

    def leaf(x, y, ang, Lg, Wd):
        a = math.radians(ang); ux, uy = math.cos(a), math.sin(a); vx, vy = -uy, ux
        tip = (x + ux * Lg, y + uy * Lg)
        p1 = (x + ux * Lg * .35 + vx * Wd, y + uy * Lg * .35 + vy * Wd)
        p2 = (x + ux * Lg * .35 - vx * Wd, y + uy * Lg * .35 - vy * Wd)
        q1 = (x + ux * Lg * .85 + vx * Wd * .7, y + uy * Lg * .85 + vy * Wd * .7)
        q2 = (x + ux * Lg * .85 - vx * Wd * .7, y + uy * Lg * .85 - vy * Wd * .7)
        d = (f'M{f(x)} {f(y)}C{f(p1[0])} {f(p1[1])} {f(q1[0])} {f(q1[1])} {f(tip[0])} {f(tip[1])}'
             f'C{f(q2[0])} {f(q2[1])} {f(p2[0])} {f(p2[1])} {f(x)} {f(y)}Z')
        s = f'<path d="{d}" fill="{Fl}" fill-opacity=".18" stroke="{G}" stroke-width="1.25"/>'
        s += ln(f'M{f(x)} {f(y)}L{f(x + ux * Lg * .78)} {f(y + uy * Lg * .78)}', G, .8)
        return s

    stems = [
        # (titik kendali tangkai bezier, jumlah pasang, panjang daun)
        ((74, 250), (72, 170), (66, 90), (64, 14), 6, 19),
        ((80, 250), (78, 210), (70, 160), (50, 112), 4, 17),
        ((84, 250), (86, 228), (86, 200), (82, 172), 3, 14),
    ]
    for p0, p1, p2, p3, n, Lg in stems:
        o += ln(f'M{p0[0]} {p0[1]}C{p1[0]} {p1[1]} {p2[0]} {p2[1]} {p3[0]} {p3[1]}', G, 1.25)
        bz = lambda t: tuple((1 - t) ** 3 * p0[i] + 3 * (1 - t) ** 2 * t * p1[i] + 3 * (1 - t) * t * t * p2[i] + t ** 3 * p3[i] for i in (0, 1))
        for k in range(n):
            t = .3 + .62 * k / max(n - 1, 1)
            x, y = bz(t); x2, y2 = bz(min(t + .01, 1))
            ang = math.degrees(math.atan2(y2 - y, x2 - x))
            sc = 1 - .35 * k / n
            o += leaf(x, y, ang - 48, Lg * sc, 4.6 * sc) + leaf(x, y, ang + 48, Lg * sc, 4.6 * sc)
        x, y = p3
        o += leaf(x, y, math.degrees(math.atan2(p3[1] - p2[1], p3[0] - p2[0])), Lg * .55, 3)
    svg('tangkai-sage.svg', 88, 250, o)


# 11. Toga dan rumbai emas (112x150)
def toga():
    Gd, Pu, K = '#CDB37A', '#6A3F8A', '#E8D6A8'
    cx, cy = 50, 46
    board = rot([(8, 46), (50, 30), (92, 46), (50, 62)], cx, cy, -12)
    o = ''
    o += f'<path d="M28 56L30 76Q50 86 72 74L72 52" fill="{Pu}" fill-opacity=".2" stroke="{Gd}" stroke-width="1.5"/>'
    o += ln('M30 70Q50 79 71 68', Gd, 1)
    o += f'<path d="{P(board)}" fill="{Pu}" fill-opacity=".35" stroke="{Gd}" stroke-width="1.5"/>'
    rc = board[2]
    o += ln(f'M{cx} {cy}L{f(rc[0] - 4)} {f(rc[1] + 1.5)}Q{f(rc[0] + 1)} {f(rc[1])} {f(rc[0] + 1)} {f(rc[1] + 6)}V104', Gd, 1.3)
    o += f'<circle cx="{cx}" cy="{cy}" r="2.4" fill="{Gd}"/>'
    x = rc[0] + 1
    o += f'<path d="M{f(x - 2.5)} 103H{f(x + 2.5)}L{f(x + 2)} 109H{f(x - 2)}Z" fill="{Gd}"/>'
    for i in range(7):
        dx = -4.5 + i * 1.5
        o += ln(f'M{f(x + dx * .4)} 109L{f(x + dx)} 132', Gd, .9)
    o += star4(x - 13, 124, 4, K)
    o += star4(x + 9, 92, 2.2, K)
    svg('toga-rumbai.svg', 112, 150, o)


# 12. Batu bertumpuk (92x112)
def batu():
    G, L, M, N = '#1E2A38', '#E7EBEF', '#9AA8B8', '#2C4A6E'
    o = ''
    o += ln('M26 86C20 72 16 58 12 44', N, 1)
    o += f'<path d="M14 50C6 44 4 34 6 26C14 32 16 42 14 50Z" fill="none" stroke="{N}" stroke-width="1"/>'
    o += ln('M13.6 48C11 40 8 34 6.5 28', N, .8)
    bot = 'M12 92C10 84 22 78 46 78C70 78 84 84 82 93C80 101 66 104 46 104C24 104 13 99 12 92Z'
    mid = 'M22 70C20 62 32 58 46 58C62 58 70 63 69 70C68 78 58 80 44 80C30 80 23 77 22 70Z'
    top = 'M33 50C32 44 40 40 49 40C58 40 63 44 62 49C61 55 55 58 47 58C38 58 34 55 33 50Z'
    o += f'<path d="{bot}" fill="{L}" stroke="{G}" stroke-width="1"/>'
    o += f'<path d="{mid}" fill="{M}" stroke="{G}" stroke-width="1"/>'
    o += f'<path d="{top}" fill="{N}"/>'
    o += ln('M58 98Q68 96 73 91', G, .8, ' stroke-opacity=".5"')
    o += ln('M56 75Q62 73 64 69', G, .8, ' stroke-opacity=".5"')
    svg('batu-tumpuk.svg', 92, 112, o)


if __name__ == '__main__':
    for fn in (balon, teropong, lebah, baling, stroberi, roket, perahu, layang, kelinci, sage, toga, batu):
        fn()
