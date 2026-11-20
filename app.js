/* Velora Generator Undangan — Aqiqah. Murni di browser (tanpa server). */
'use strict';
var THEMES = [
  { id: 'pastel', nama: 'Pastel Lebah', warna: 'linear-gradient(90deg,#FBE6E2,#DCEBF5,#FFF1CC)', video: true,
    font: 'Fredoka:wght@400;500;600&family=Mali:ital,wght@0,500;1,500&family=Poppins:wght@300;400;500', css: '' },
  { id: 'mint', nama: 'Mint Awan', warna: 'linear-gradient(90deg,#D6ECE4,#E8F1F8,#FFF8E6)', video: false,
    font: 'Baloo+2:wght@500;600&family=Mali:ital,wght@0,500;1,500&family=Poppins:wght@300;400;500',
    css: ':root{--hf:"Baloo 2",sans-serif;--ink:#3F6B62;--gold:#B8A06A;--rose:#357A6C;--txt:#2F4A45;--vf-bg:#3F6B62}' +
      '.wrap{background:linear-gradient(#F4FBF6,#E6F4EF 45%,#E8F1F8 75%,#FFF8E6)}' +
      '.cover{background:linear-gradient(180deg,rgba(230,244,239,.85),rgba(232,241,248,.75) 60%,rgba(244,251,246,.6))}' +
      '.soft{background:rgba(214,236,228,.55)}.soft2{background:rgba(232,244,226,.6)}' },
  { id: 'blush', nama: 'Peony Blush', warna: 'linear-gradient(90deg,#FADEE8,#F6E6F6,#FFF6E8)', video: false,
    font: 'Sniglet:wght@400;800&family=Mali:ital,wght@0,500;1,500&family=Poppins:wght@300;400;500',
    css: ':root{--hf:Sniglet,sans-serif;--ink:#8A4E66;--gold:#C79468;--rose:#B05476;--txt:#5A3C48;--vf-bg:#8A4E66}' +
      '.wrap{background:linear-gradient(#FFF7F7,#FDE9EE 40%,#F6EAF6 75%,#FFF6E8)}' +
      '.cover{background:linear-gradient(180deg,rgba(253,233,238,.85),rgba(246,234,246,.75) 60%,rgba(255,247,247,.6))}' +
      '.soft{background:rgba(250,222,232,.6)}.soft2{background:rgba(246,230,246,.6)}' }
];
var HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
var OFFSET = { WIB: '+07:00', WITA: '+08:00', WIT: '+09:00' };
var $ = function (id) { return document.getElementById(id); };
var photos = { cover: null, hero: null, gal: [] }, LAGU = [], TEMPLATE = '', mp3File = null;

function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function js(v) { return JSON.stringify(v).replace(/</g, '\\u003c'); }
function slug(s) { return (s || 'undangan').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'undangan'; }
function parseDate(v) { var p = v.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
function tglId(v) { var d = parseDate(v); return HARI[d.getDay()] + ', ' + d.getDate() + ' ' + BULAN[d.getMonth()] + ' ' + d.getFullYear(); }
function lahirId(v) { var d = parseDate(v); return d.getDate() + ' ' + BULAN[d.getMonth()] + ' ' + d.getFullYear(); }
function jam(v) { return v.replace(':', '.'); }
function nameHtml(n) {
  var w = n.trim().split(/\s+/).filter(Boolean).map(esc);
  if (w.length <= 1) return w[0] || '';
  if (w.length === 2) return w[0] + '<br>' + w[1];
  return w[0] + '<br><em>' + w.slice(1, -1).join(' ') + '</em> ' + w[w.length - 1];
}
function theme() { var r = document.querySelector('input[name=tema]:checked'); return THEMES.filter(function (t) { return t.id === (r && r.value); })[0] || THEMES[0]; }

function readImage(file, max) {
  return new Promise(function (ok, no) {
    var fr = new FileReader();
    fr.onerror = no;
    fr.onload = function () {
      var im = new Image();
      im.onerror = no;
      im.onload = function () {
        var s = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas');
        c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
        c.getContext('2d').drawImage(im, 0, 0, c.width, c.height);
        ok(c.toDataURL('image/jpeg', 0.82));
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}
function ogImage(dataUrl) {
  return new Promise(function (ok) {
    var im = new Image();
    im.onload = function () {
      var c = document.createElement('canvas'); c.width = 1200; c.height = 630;
      var s = Math.max(1200 / im.width, 630 / im.height), w = im.width * s, h = im.height * s;
      c.getContext('2d').drawImage(im, (1200 - w) / 2, (630 - h) * 0.3, w, h);
      ok(c.toDataURL('image/jpeg', 0.8));
    };
    im.src = dataUrl;
  });
}

function state() {
  var g = function (id) { return $(id).value; };
  var d30 = new Date(Date.now() + 30 * 864e5), pad = function (n) { return (n < 10 ? '0' : '') + n; };
  var def = { nama: 'Nama Anak Anda', ayah: 'Nama Ayah', ibu: 'Nama Ibu', tempat: 'Alamat acara', tgl: d30.getFullYear() + '-' + pad(d30.getMonth() + 1) + '-' + pad(d30.getDate()), jam: '12:00' };
  var v = function (id) { return $(id).value.trim() || def[id] || ''; };
  return {
    nama: v('nama'), pang: g('pang').trim() || v('nama').split(/\s+/)[0], jk: g('jk'), ke: g('ke'), lahir: g('lahir'),
    ayah: v('ayah'), ibu: v('ibu'), pengantar: g('pengantar').trim(), acara: g('acara'), tgl: v('tgl'), jam: v('jam'), jam2: g('jam2'),
    zona: g('zona'), tempat: v('tempat'), maps: g('maps').trim(), lsrc: g('lsrc'), lagu: g('lagu'), yt: g('ytl').trim(),
    mulai: parseInt(g('mulai'), 10) || 0, sheet: g('sheet').trim(), base: g('base').trim(), video: $('video').checked
  };
}

/* mode: 'preview' (foto = data URL, lagu dari pustaka) | 'zip' (path file di paket) */
function build(mode, extra) {
  var s = state(), t = theme(), z = mode === 'zip', h = TEMPLATE, o = {};
  var img = function (k, i) { return z ? (i === undefined ? 'img/' + k + '.jpg' : 'img/gal' + (i + 1) + '.jpg') : (i === undefined ? photos[k] : photos.gal[i]); };
  var pic = lagu();
  o.TITLE = esc('Undangan ' + s.acara + ' ' + s.nama);
  o.OG = '';
  if (z && s.base && photos.cover) {
    var base = s.base.replace(/\/?$/, '/');
    o.OG = '<meta property="og:type" content="website"><meta property="og:title" content="' + esc(s.acara + ' ' + s.nama) + '">' +
      '<meta property="og:description" content="' + esc(s.jk + ' ' + s.ke.toLowerCase() + ' ' + s.ayah + ' & ' + s.ibu + '. ' + tglId(s.tgl) + '. Kami mengundang Anda untuk berbagi doa dan kebahagiaan.') + '">' +
      '<meta property="og:image" content="' + esc(base + 'img/og.jpg') + '"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">';
  }
  o.FONT_LINK = 'https://fonts.googleapis.com/css2?family=' + t.font + '&display=swap';
  o.THEME_CSS = t.css;
  o.BGV = (s.video && t.video) ? '<video id="bgv" autoplay muted loop playsinline preload="auto" onerror="this.remove()" oncanplay="this.parentNode.classList.add(\'hasv\')"><source src="bg.mp4" type="video/mp4"></video>' : '';
  o.EVENT_NAME = esc(s.acara);
  o.EVENT_SHORT = esc(s.acara.replace(/^(Tasyakuran|Syukuran)\s+/, ''));
  o.COVER_BLOCK = photos.cover ? '<div class="arch"><img src="' + img('cover') + '" alt="' + esc(s.pang) + '" style="object-position:50% 35%"></div>' : '<div style="height:18px"></div>';
  o.NAME_HTML = nameHtml(s.nama);
  o.LAHIR_BLOCK = s.lahir ? '<div class="lahir">Lahir ' + lahirId(s.lahir) + '</div>' : '';
  o.PENGANTAR = esc(s.pengantar).replace(/\n/g, '<br>');
  o.HERO_BLOCK = photos.hero ? '<div class="hero"><img src="' + img('hero') + '" alt="' + esc(s.pang) + '" style="object-position:50% 35%"></div>' : '';
  o.NAMA_PENUH = esc(s.nama);
  o.ORTU_TITLE = esc(s.jk + ' ' + s.ke + ' Tercinta dari');
  o.ORTU_NAMES = '<b>' + esc(s.ayah) + '</b> &amp; <b>' + esc(s.ibu) + '</b>';
  o.DATE_TEXT = esc(tglId(s.tgl));
  o.TIME_TEXT = s.jam2 ? 'Pukul ' + jam(s.jam) + ' – ' + jam(s.jam2) + ' ' + s.zona : 'Pukul ' + jam(s.jam) + ' ' + s.zona + ' – selesai';
  o.TEMPAT = esc(s.tempat).replace(/\n/g, '<br>');
  o.MAPS_URL = esc(s.maps || 'https://maps.google.com/?q=' + encodeURIComponent(s.tempat.replace(/\s+/g, ' ')));
  o.GAL_SECTION = photos.gal.length ? '<section class="fade"><div class="eyebrow">Galeri</div><h2>Momen ' + esc(s.pang) + '</h2><div class="gal">' +
    photos.gal.map(function (_, i) { return '<figure><img src="' + img('gal', i) + '" alt=""></figure>'; }).join('') + '</div></section>' : '';
  o.PANGGILAN = esc(s.pang);
  o.EVENT_ISO = js(s.tgl + 'T' + s.jam + ':00' + OFFSET[s.zona]);
  o.SHEET_URL = js(s.sheet);
  o.STORAGE_KEY = js('ucapan-' + slug(s.pang));
  o.LAGU_YOUTUBE = js(s.lsrc === 'yt' ? s.yt : '');
  o.LAGU_MULAI = String(s.mulai);
  var src = '';
  if (s.lsrc === 'lib' && pic) src = z ? 'musik.mp3' : pic.file;
  if (s.lsrc === 'up' && mp3File) src = z ? 'musik.mp3' : (extra && extra.mp3url) || '';
  o.AUDIO_TAG = src ? '<audio id="au" src="' + esc(src) + '" loop preload="auto"></audio>' : '';
  o.CREDIT = (s.lsrc === 'lib' && pic) ? '<div class="vf-s" style="margin-top:12px;font-size:11px;opacity:.7">Musik: “' + esc(pic.judul) + '” oleh ' + esc(pic.artis) + ' (incompetech.com), lisensi CC BY 4.0</div>' : '';
  Object.keys(o).forEach(function (k) { h = h.split('{{' + k + '}}').join(o[k]); });
  return h;
}
function lagu() { return LAGU.filter(function (l) { return l.id === $('lagu').value; })[0]; }

var timer;
function refresh() {
  clearTimeout(timer);
  timer = setTimeout(function () {
    var extra = {};
    if (mp3File) { if (!refresh.u) refresh.u = URL.createObjectURL(mp3File); extra.mp3url = refresh.u; }
    $('pv').srcdoc = '<base href="' + location.href.replace(/[^/]*$/, '') + '">' + build('preview', extra);
  }, 250);
}
function dataToZip(zip, path, dataUrl) { zip.file(path, dataUrl.split(',')[1], { base64: true }); }
async function grab(path) { var r = await fetch(path); if (!r.ok) throw new Error(path); return r.blob(); }

async function download() {
  var st = $('st'); st.textContent = 'Menyiapkan paket…';
  try {
    var s = state(), zip = new JSZip();
    zip.file('index.html', build('zip'));
    if (photos.cover) { dataToZip(zip, 'img/cover.jpg', photos.cover); if (s.base) dataToZip(zip, 'img/og.jpg', await ogImage(photos.cover)); }
    if (photos.hero) dataToZip(zip, 'img/hero.jpg', photos.hero);
    photos.gal.forEach(function (d, i) { dataToZip(zip, 'img/gal' + (i + 1) + '.jpg', d); });
    zip.file('img/velora-logo-white.svg', await grab('img/velora-logo-white.svg'));
    if (s.video && theme().video) zip.file('bg.mp4', await grab('bg.mp4'));
    if (s.lsrc === 'lib' && lagu()) zip.file('musik.mp3', await grab(lagu().file));
    if (s.lsrc === 'up' && mp3File) zip.file('musik.mp3', mp3File);
    zip.file('apps-script.gs', await grab('apps-script.gs'));
    zip.file('.nojekyll', '');
    zip.file('BACA-DULU.txt', 'Paket undangan Velora\n\n1. Unggah SEMUA isi folder ini ke hosting (mis. repo GitHub Pages).\n2. Bagikan link dengan nama tamu: ALAMAT/?to=Nama+Tamu\n3. Agar ucapan tersimpan: tempel apps-script.gs di Google Sheet (Ekstensi > Apps Script), Deploy sebagai Aplikasi web, lalu isi URL-nya di index.html pada baris var SHEET_URL.\n4. Uji di HP sebelum dikirim ke klien.\n');
    var blob = await zip.generateAsync({ type: 'blob' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'undangan-' + slug(s.pang) + '.zip'; a.click();
    st.textContent = 'Paket diunduh (' + Math.round(blob.size / 1024) + ' KB).';
  } catch (e) {
    st.textContent = 'Gagal menyiapkan paket: ' + e.message + '. Buka generator lewat alamat http(s), bukan file://.';
  }
}

async function init() {
  $('tp').innerHTML = THEMES.map(function (t, i) {
    return '<label><input type="radio" name="tema" value="' + t.id + '"' + (i ? '' : ' checked') + '><span><i style="background:' + t.warna + '"></i>' + t.nama + '</span></label>';
  }).join('');
  $('video').checked = true;
  var qt = new URLSearchParams(location.search).get('tema'); if (qt) { var rr = document.querySelector('input[name=tema][value=' + qt.replace(/[^a-z]/g, '') + ']'); if (rr) { rr.checked = true; $('video').checked = theme().video; } }
  try {
    TEMPLATE = await (await fetch('templates/aqiqah.html')).text();
    LAGU = await (await fetch('musik/lagu.json')).json();
  } catch (e) { $('st').textContent = 'Jalankan lewat server: python3 -m http.server 8080 lalu buka http://localhost:8080'; return; }
  $('lagu').innerHTML = LAGU.map(function (l) { return '<option value="' + l.id + '">' + esc(l.judul) + ' — ' + esc(l.artis) + '</option>'; }).join('');
  document.querySelectorAll('#fm input,#fm select,#fm textarea').forEach(function (el) { el.addEventListener('input', refresh); el.addEventListener('change', refresh); });
  $('lsrc').addEventListener('change', function () { ['lib', 'up', 'yt'].forEach(function (k) { $(k).hidden = $('lsrc').value !== k; }); });
  document.querySelectorAll('input[name=tema]').forEach(function (r) { r.addEventListener('change', function () { $('video').checked = theme().video; refresh(); }); });
  $('fcover').onchange = async function () { photos.cover = this.files[0] ? await readImage(this.files[0], 1000) : null; thumbs(); refresh(); };
  $('fhero').onchange = async function () { photos.hero = this.files[0] ? await readImage(this.files[0], 1000) : null; thumbs(); refresh(); };
  $('fgal').onchange = async function () { photos.gal = []; for (var i = 0; i < Math.min(6, this.files.length); i++) photos.gal.push(await readImage(this.files[i], 900)); thumbs(); refresh(); };
  $('fmp3').onchange = function () { mp3File = this.files[0] || null; refresh.u = null; refresh(); };
  $('dl').onclick = download;
  $('op').onclick = function () { var w = window.open('', '_blank'); w.document.write('<base href="' + location.href.replace(/[^/]*$/, '') + '">' + build('preview', mp3File ? { mp3url: URL.createObjectURL(mp3File) } : {})); w.document.close(); };
  refresh();
}
function thumbs() { $('th').innerHTML = [photos.cover, photos.hero].concat(photos.gal).filter(Boolean).map(function (d) { return '<img src="' + d + '" alt="">'; }).join(''); }
init();
