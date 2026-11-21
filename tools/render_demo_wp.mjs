// Render demo semua tema untuk situs WordPress (publik di domain Velora) dengan lagu ber-vokal pemilik.
// Keluaran: <WP>/wp-content/uploads/velora-demo/<id>/index.html (+ foto/) ; aset di velora-demo/{musik,demo-foto,img}
import fs from 'fs'; import vm from 'vm'; import path from 'path'; import os from 'os';
const H = os.homedir(), root = H + '/Workspace/velora/generator', OUT = H + '/Local Sites/ve-lora/app/public/wp-content/uploads/velora-demo', BASE = '/wp-content/uploads/velora-demo/';
const ctx = { globalThis: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(root + '/engine.js', 'utf8'), ctx); const E = ctx.globalThis.VeloraEngine;
const themes = JSON.parse(fs.readFileSync(root + '/themes/themes.json', 'utf8'));
const FOTO = JSON.parse(fs.readFileSync(root + '/themes/foto-demo.json', 'utf8'));
const KAT = JSON.parse(fs.readFileSync(H + '/Workspace/velora/assets/music/katalog.json', 'utf8'));
const MAP = JSON.parse(fs.readFileSync(H + '/Workspace/velora/assets/music/tema-lagu.json', 'utf8'));
const src = fs.readFileSync(root + '/tools/render_katalog.mjs', 'utf8');
const contoh = vm.runInNewContext('(' + src.slice(src.indexOf('const contoh = {') + 'const contoh = '.length, src.indexOf('};\nconst modeDari') + 1) + ')', { sesi: (n, t, j, j2) => ({ nama: n, tgl: t, jam: j, jam2: j2, zona: 'WIB', gedung: 'Gedung Velora Indah', tempat: 'Jl. Velora Indah No. 21, Bandung' }) });
const modeDari = a => ['aqiqah', 'khitan'].includes(a) ? 'anak' : ['ultah-anak', 'ultah', 'wisuda', 'formal'].includes(a) ? 'tunggal' : 'pasangan';
fs.mkdirSync(OUT + '/musik', { recursive: true }); fs.mkdirSync(OUT + '/demo-foto', { recursive: true }); fs.mkdirSync(OUT + '/img', { recursive: true });
fs.copyFileSync(root + '/img/velora-logo-white.svg', OUT + '/img/velora-logo-white.svg');
for (const f of fs.readdirSync(root + '/demo-foto')) fs.copyFileSync(root + '/demo-foto/' + f, OUT + '/demo-foto/' + f);
let n = 0;
for (const t of themes) {
  const a = t.acara[0], d = JSON.parse(JSON.stringify(contoh[modeDari(a)]));
  if (a === 'khitan') { d.judulAcara = 'Tasyakuran Khitan'; d.kutipan = ''; d.p1 = { nama: 'Raka Velora Putra', panggil: 'Raka', status: 'Putra pertama', ayah: 'Bapak Arif', ibu: 'Ibu Sari' }; d.sesi[0].nama = 'Acara Khitanan'; }
  if (a === 'wisuda') { d.judulAcara = 'Syukuran Wisuda'; d.p1 = { nama: 'Raka Velora, S.T.', panggil: 'Raka', keterangan: 'Wisuda Sarjana Teknik' }; d.sesi[0].nama = 'Syukuran Wisuda'; }
  if (a === 'formal') { d.judulAcara = 'Undangan Resmi'; d.salam = 'Dengan hormat,'; d.p1 = { nama: 'Peluncuran Program Velora', panggil: 'Velora Fest', keterangan: 'Peluncuran Program 2027' }; d.sesi[0].nama = 'Acara Utama'; }
  const lg = KAT.find(x => x.id === (MAP[t.id] || [])[0]);
  let audio = '', kredit = '';
  if (lg) {
    const fsrc = lg.sumber === 'cc-by' ? root + '/musik/' + path.basename(lg.file) : H + '/Workspace/velora/assets/music/' + lg.file;
    const fn = path.basename(fsrc); if (!fs.existsSync(OUT + '/musik/' + fn)) fs.copyFileSync(fsrc, OUT + '/musik/' + fn);
    audio = BASE + 'musik/' + fn; d.mulai = lg.mulai_viral_detik || lg.mulai_reff_detik || 0;
    if (lg.sumber === 'cc-by') kredit = 'Musik: ' + lg.judul + ' oleh ' + lg.artis + ' (incompetech.com), CC BY 4.0';
  }
  const opt = { audio, kredit, situs: '/', kunci: 'wp-' + t.id + '-' };
  if (t.adegan && fs.existsSync(root + '/adegan/' + t.adegan + '.json')) { fs.cpSync(root + '/adegan', OUT + '/adegan', { recursive: true }); Object.assign(opt, { adegan: JSON.parse(fs.readFileSync(root + '/adegan/' + t.adegan + '.json', 'utf8')), adeganBase: BASE + 'adegan/' }); }
  if (fs.existsSync(root + '/video/' + t.id + '.mp4')) { fs.mkdirSync(OUT + '/video', { recursive: true }); for (const e of ['mp4', 'webm', 'jpg']) if (fs.existsSync(root + '/video/' + t.id + '.' + e)) fs.copyFileSync(root + '/video/' + t.id + '.' + e, OUT + '/video/' + t.id + '.' + e); Object.assign(opt, { video: BASE + 'video/' + t.id + '.mp4', videoWebm: BASE + 'video/' + t.id + '.webm', videoPoster: BASE + 'video/' + t.id + '.jpg' }); }
  const fix = h => h.replace('src="img/velora-logo-white.svg"', 'src="' + BASE + 'img/velora-logo-white.svg"');
  fs.mkdirSync(OUT + '/' + t.id, { recursive: true }); fs.writeFileSync(OUT + '/' + t.id + '/index.html', fix(E.render(d, t, opt))); n++;
  const fd = FOTO[t.id];
  if (fd) {
    const f = k => BASE + 'demo-foto/f' + k + '.jpg', map = { cover: f(fd.cover), p1: f(fd.p1), p2: f(fd.p2) };
    const t2 = Object.assign({}, t, { posisiFoto: fd.posisi, posisiKartu: fd.kartu });
    fs.mkdirSync(OUT + '/' + t.id + '/foto', { recursive: true });
    fs.writeFileSync(OUT + '/' + t.id + '/foto/index.html', fix(E.render(d, t2, Object.assign({}, opt, { img: k => map[k] || '', galeri: (fd.galeri || []).map(f), kunci: 'wp-' + t.id + '-foto-', tanpaFotoSampul: true })))); n++;
  }
}
console.log('demo WP:', n, 'halaman, lagu:', fs.readdirSync(OUT + '/musik').length);
