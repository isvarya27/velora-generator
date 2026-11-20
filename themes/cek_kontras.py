import json,sys
ENUM=dict(koleksi="Special Luxury Motion Art Interaktif Adat Anime Kids Minimalis".split(),tier="Standar Premium Signature".split(),
 layout="arch full frame polaroid split card".split(),ornamen="none daun bunga sakura bintang awan batik geometris artdeco gelombang konfeti piksel songket ukiran mega".split(),
 gerak="none kelopak bintang awan gelembung kilau salju konfeti cahaya".split(),musik="romantis lembut ceria khidmat megah tradisional".split())
INTERAKSI="none amplop tebar kartu".split()
ACARA="pernikahan engagement aqiqah khitan ultah-anak ultah wisuda formal".split()
def L(h):
    h=h.lstrip('#');c=[int(h[i:i+2],16)/255 for i in(0,2,4)]
    c=[x/12.92 if x<=0.03928 else((x+0.055)/1.055)**2.4 for x in c];return .2126*c[0]+.7152*c[1]+.0722*c[2]
def cr(a,b):
    a,b=L(a),L(b);return (max(a,b)+.05)/(min(a,b)+.05)
T=json.load(open(sys.argv[1]));fail=0;ids=set()
for t in T:
    w=t['warna'];assert t['id'] not in ids;ids.add(t['id'])
    for k,v in ENUM.items(): assert t[k] in v,(t['id'],k)
    assert all(a in ACARA for a in t['acara'])
    assert t.get('interaksi','none') in INTERAKSI,(t['id'],'interaksi')
    r={'teks/bg1':cr(w['teks'],w['bg1']),'teks/kartu':cr(w['teks'],w['kartu']),'teks/bg3':cr(w['teks'],w['bg3']),
       'ink/bg1':cr(w['ink'],w['bg1']),'putih/aksen':cr('#FFFFFF',w['aksen'])}
    bad=[k for k,v in r.items() if v<4.5];fail+=len(bad)
    print(f"{t['id']:26}"+" ".join(f"{k}={v:.2f}" for k,v in r.items()),"GAGAL:"+",".join(bad) if bad else "OK")
print("total gagal:",fail,"| tema:",len(T))
