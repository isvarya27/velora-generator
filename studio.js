var ADG = {};
/* Velora Studio: UI generator multi-acara + multi-tema. Memakai engine.js. */
'use strict';
var $ = function (id) { return document.getElementById(id); };
var esc = VeloraEngine.esc;
var HARGA = { Standar: [99000, 79000], Premium: [149000, 129000], Signature: [199000, 179000] };
var ACARA = {
  pernikahan: { label: 'Pernikahan', mode: 'pasangan', judul: 'The Wedding of', salam: 'Bismillahirrahmanirrahim', sumber: 'QS. Ar-Rum: 21',
    kutipan: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.',
    pengantar: 'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:', sesi: ['Akad Nikah', 'Resepsi'] },
  engagement: { label: 'Lamaran', mode: 'pasangan', judul: 'Engagement of', salam: 'Bismillahirrahmanirrahim', sumber: '', kutipan: '', pengantar: 'Dengan penuh syukur, kami mengundang Anda pada acara lamaran:', sesi: ['Acara Lamaran'] },
  aqiqah: { label: 'Aqiqah', mode: 'anak', judul: 'Tasyakuran Aqiqah', salam: 'Bismillahirrahmanirrahim', sumber: 'HR. Abu Dawud, At-Tirmidzi', kutipan: 'Setiap anak tergadai dengan aqiqahnya.', pengantar: 'Atas karunia Allah SWT, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan mendoakan buah hati kami:', sesi: ['Acara Aqiqah'] },
  khitan: { label: 'Khitan', mode: 'anak', judul: 'Tasyakuran Khitan', salam: 'Bismillahirrahmanirrahim', sumber: '', kutipan: '', pengantar: 'Dengan rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan mendoakan putra kami:', sesi: ['Acara Khitanan'] },
  'ultah-anak': { label: 'Ultah Anak', mode: 'tunggal', judul: 'Undangan Ulang Tahun', salam: 'Hai, teman-teman!', sumber: '', kutipan: '', pengantar: 'Ayo datang dan rayakan hari spesialku!', sesi: ['Pesta Ulang Tahun'], ket: 'Ulang tahun ke-5' },
  ultah: { label: 'Ulang Tahun', mode: 'tunggal', judul: 'Birthday Celebration', salam: 'Halo!', sumber: '', kutipan: '', pengantar: 'Dengan senang hati kami mengundang Anda untuk merayakan:', sesi: ['Perayaan'], ket: 'Ulang tahun ke-30' },
  wisuda: { label: 'Wisuda', mode: 'tunggal', judul: 'Syukuran Wisuda', salam: 'Assalamu\'alaikum', sumber: '', kutipan: '', pengantar: 'Dengan rasa syukur, kami mengundang Anda pada syukuran kelulusan:', sesi: ['Syukuran'], ket: 'Sarjana Teknik' },
  formal: { label: 'Formal', mode: 'tunggal', judul: 'Undangan Resmi', salam: 'Dengan hormat,', sumber: '', kutipan: '', pengantar: 'Kami mengundang Bapak/Ibu untuk menghadiri acara:', sesi: ['Acara'], ket: 'Peluncuran Program' }
};
var SECS = [['pembuka', 'Pembuka & kutipan', 1], ['hitung', 'Hitung mundur', 1], ['profil', 'Profil', 1], ['acara', 'Waktu & tempat', 1], ['kalender', 'Tombol Simpan Tanggal', 1], ['live', 'Live streaming', 0],
  ['dress', 'Dresscode', 0], ['kisah', 'Kisah / cerita', 0], ['galeri', 'Galeri', 1], ['kado', 'Hadiah: rekening & kado', 0], ['ucapan', 'Ucapan & RSVP', 1], ['penutup', 'Penutup', 1], ['catatan', 'Catatan maaf nama/gelar', 1]];
var THEMES = [], LAGU = [], SUASANA = {}, TEMA_LAGU = {}, acara = 'pernikahan', kol = 'Semua', tema = null, laguManual = false;
var foto = { cover: null, p1: null, p2: null }, galeri = [], mp3 = null, mp3url = '';

function fmt(n) { return 'Rp' + n.toLocaleString('id-ID'); }
function val(id) { var e = $(id); return e ? e.value.trim() : ''; }

/* ---------- formulir dinamis ---------- */
function orangHtml(k, mode, judul) {
  var f = function (id, lab, ph, type) { return '<div><label>' + lab + '</label><input id="' + k + '_' + id + '"' + (type ? ' type="' + type + '"' : '') + (ph ? ' placeholder="' + esc(ph) + '"' : '') + '></div>'; };
  var h = '<label style="color:var(--ink);font-weight:600;margin-top:14px">' + judul + '</label><div class="row">' + f('nama', 'Nama lengkap', 'Nama lengkap') + f('panggil', 'Nama panggilan', 'Panggilan') + '</div>';
  if (mode === 'tunggal') return h + '<label>Keterangan</label><input id="' + k + '_keterangan">';
  h += '<div class="row">' + (mode === 'anak' ? f('lahir', 'Tanggal lahir', '', 'date') : f('ig', 'Instagram (opsional)', '@username')) + f('status', 'Status', mode === 'anak' ? 'Putri pertama' : 'Putri pertama') + '</div>';
  return h + '<div class="row">' + f('ayah', 'Nama ayah', 'Bapak ...') + f('ibu', 'Nama ibu', 'Ibu ...') + '</div>';
}
function sesiHtml(i, nama) {
  return '<div class="sub" data-sesi="' + i + '" style="margin-bottom:10px"><div class="row"><div><label>Nama sesi</label><input class="s_nama" value="' + esc(nama) + '"></div><div><label>Tanggal</label><input class="s_tgl" type="date"></div></div>' +
    '<div class="row3"><div><label>Mulai</label><input class="s_jam" type="time" value="10:00"></div><div><label>Selesai</label><input class="s_jam2" type="time"></div><div><label>Zona</label><select class="s_zona"><option>WIB</option><option>WITA</option><option>WIT</option></select></div></div>' +
    '<label>Nama gedung / tempat</label><input class="s_gedung"><label>Alamat</label><textarea class="s_tempat"></textarea><label>Link Google Maps (opsional)</label><input class="s_maps">' +
    (i ? '<button type="button" class="o mini" onclick="this.parentNode.remove();refresh()" style="margin-top:8px">Hapus sesi</button>' : '') + '</div>';
}
function kisahHtml() { return '<div class="kisah-i" style="margin-bottom:8px"><label>Judul / tahun</label><input class="k_judul" placeholder="2023 · Pertemuan"><label>Cerita</label><textarea class="k_isi"></textarea></div>'; }

function pasangAcara(a) {
  acara = a; var A = ACARA[a];
  document.querySelectorAll('#acara button').forEach(function (b) { b.classList.toggle('on', b.dataset.a === a); });
  $('judulAcara').value = A.judul; $('salam').value = A.salam; $('kutipan').value = A.kutipan; $('sumber').value = A.sumber; $('pengantar').value = A.pengantar;
  $('f_p1').innerHTML = orangHtml('p1', A.mode, A.mode === 'pasangan' ? 'Mempelai wanita' : A.mode === 'anak' ? 'Anak' : 'Nama');
  $('f_p2').innerHTML = A.mode === 'pasangan' ? orangHtml('p2', A.mode, 'Mempelai pria') : '';
  if (A.ket && $('p1_keterangan')) $('p1_keterangan').value = A.ket;
  $('rowp2').hidden = A.mode !== 'pasangan'; $('lp1').textContent = A.mode === 'pasangan' ? 'Foto mempelai wanita' : 'Foto profil';
  $('sesi').innerHTML = A.sesi.map(function (s, i) { return sesiHtml(i, s); }).join('');
  var d = new Date(Date.now() + 60 * 864e5), iso = d.toISOString().slice(0, 10);
  document.querySelectorAll('.s_tgl').forEach(function (x) { x.value = iso; });
  wire(); daftarTema();
}
function daftarTema() {
  var koleksi = ['Semua'];
  THEMES.forEach(function (t) { if (t.acara.indexOf(acara) > -1 && koleksi.indexOf(t.koleksi) < 0) koleksi.push(t.koleksi); });
  if (koleksi.indexOf(kol) < 0) kol = 'Semua';
  $('kol').innerHTML = koleksi.map(function (k) { return '<button type="button" data-k="' + esc(k) + '" class="' + (k === kol ? 'on' : '') + '">' + esc(k) + '</button>'; }).join('');
  var list = THEMES.filter(function (t) { return t.acara.indexOf(acara) > -1 && (kol === 'Semua' || t.koleksi === kol); });
  if (!list.length) list = THEMES.filter(function (t) { return kol === 'Semua' || t.koleksi === kol; });
  if (!tema || list.indexOf(tema) < 0) pilihTema(list[0], true);
  $('tg').innerHTML = list.map(function (t) {
    var w = t.warna;
    return '<button type="button" class="tc' + (t === tema ? ' on' : '') + '" data-id="' + t.id + '"><div class="sw" style="background:linear-gradient(135deg,' + w.bg1 + ',' + w.bg2 + ' 55%,' + w.aksen + ');color:' + w.ink + '">Aa</div><div class="in"><b>' + esc(t.nama) + '</b><small>' + esc(t.koleksi) + ' · ' + esc(t.tier) + ' · ' + fmt(HARGA[t.tier][0]) + '</small><a href="katalog/' + t.id + '/" target="_blank" rel="noopener" onclick="event.stopPropagation()">Lihat contoh ↗</a></div></button>';
  }).join('');
}
function pilihTema(t, diam) {
  tema = t; if (!t) return;
  if (t.ucapanPerHalaman) $('perHalaman').value = t.ucapanPerHalaman;
  if (!laguManual) { var id = ((TEMA_LAGU[t.id] || []).filter(function (x) { return LAGU.some(function (l) { return l.id === x; }); })[0]) || (SUASANA[t.musik] || [])[0] || (SUASANA.lembut || [])[0]; if (id) { $('lagu').value = id; setMulai(); } }
  var h = HARGA[t.tier];
  $('price').innerHTML = '<b>' + esc(t.nama) + '</b> · ' + esc(t.tier) + '<br>Web: ' + fmt(h[0]) + ' (Tanpa Foto ' + fmt(h[1]) + ')';
  if (!diam) daftarTema();
  refresh();
}

/* ---------- data ---------- */
function orang(k) { var g = function (f) { return val(k + '_' + f); }; return { nama: g('nama'), panggil: g('panggil'), lahir: g('lahir'), status: g('status'), ayah: g('ayah'), ibu: g('ibu'), ig: g('ig'), keterangan: g('keterangan') }; }
function data() {
  var A = ACARA[acara], ph = { pasangan: [['Vela Ananda', 'Vela'], ['Loka Pratama', 'Loka']], anak: [['Nama Anak', 'Si Kecil']], tunggal: [['Nama', 'Nama']] }[A.mode];
  var p1 = orang('p1'), p2 = orang('p2');
  if (!p1.nama) { p1.nama = ph[0][0]; p1.panggil = p1.panggil || ph[0][1]; }
  if (A.mode === 'pasangan' && !p2.nama) { p2.nama = ph[1][0]; p2.panggil = p2.panggil || ph[1][1]; }
  var sesi = [].map.call(document.querySelectorAll('[data-sesi]'), function (el) {
    var q = function (c) { return el.querySelector(c).value.trim(); };
    return { nama: q('.s_nama'), tgl: q('.s_tgl'), jam: q('.s_jam') || '10:00', jam2: q('.s_jam2'), zona: q('.s_zona'), gedung: q('.s_gedung'), tempat: q('.s_tempat') || 'Alamat acara', maps: q('.s_maps') };
  });
  var sembunyi = SECS.filter(function (s) { var c = document.querySelector('.sec[data-k=' + s[0] + ']'); return c && !c.checked; }).map(function (s) { return s[0]; });
  return {
    mode: A.mode, judulAcara: val('judulAcara'), salam: val('salam'), kutipan: val('kutipan'), sumber: val('sumber'), pengantar: val('pengantar'), p1: p1, p2: p2, sesi: sesi, sembunyi: sembunyi,
    live: val('live'), dress: val('dress'), dressWarna: val('dressWarna').split(',').map(function (x) { return x.trim(); }).filter(Boolean),
    kisah: [].map.call(document.querySelectorAll('.kisah-i'), function (el) { return { judul: el.querySelector('.k_judul').value.trim(), isi: el.querySelector('.k_isi').value.trim() }; }).filter(function (k) { return k.judul || k.isi; }),
    rekening: [{ bank: val('bk1'), no: val('no1'), an: val('an1') }, { bank: val('bk2'), no: val('no2'), an: val('an2') }], alamatKado: val('alamatKado'),
    penutup: val('penutup'), tuanRumah: val('tuanRumah'), sheet: val('sheet'), uuid: val('uuid'), perHalaman: parseInt(val('perHalaman'), 10) || (tema && tema.ucapanPerHalaman) || 5, mulai: parseInt(val('mulai'), 10) || 0
  };
}
function setMulai() { var l = laguDipilih(); if (l && l.mulai != null) $('mulai').value = l.mulai; }
function laguDipilih() { return LAGU.filter(function (l) { return l.id === $('lagu').value; })[0]; }
function kredit() { var l = laguDipilih(); return $('lsrc').value === 'lib' && l && (!l.sumber || l.sumber === 'cc-by') ? 'Musik: “' + l.judul + '” oleh ' + l.artis + ' (incompetech.com), lisensi CC BY 4.0' : ''; }

function render(zip) {
  var src = $('lsrc').value, l = laguDipilih(), audio = '';
  if (src === 'lib' && l) audio = zip ? 'musik.mp3' : l.file;
  if (src === 'up' && mp3) audio = zip ? 'musik.mp3' : mp3url;
  var vid = tema && tema.video ? (zip ? { video: 'video.mp4', videoWebm: 'video.webm', videoPoster: 'video.jpg' } : { video: 'video/' + tema.id + '.mp4', videoWebm: 'video/' + tema.id + '.webm', videoPoster: 'video/' + tema.id + '.jpg' }) : {};
  var o = { audio: audio, yt: src === 'yt' ? val('yt') : '', kredit: kredit(), situs: 'https://isvarya27.github.io/velora-generator/',
    img: function (k) { return foto[k] ? (zip ? 'img/' + k + '.jpg' : foto[k]) : ''; },
    galeri: galeri.map(function (g, i) { return zip ? 'img/gal' + (i + 1) + '.jpg' : g; }) };
  var d = data();
  if (zip && val('base') && (foto.cover || foto.p1)) {
    var b = val('base').replace(/\/?$/, '/');
    o.og = '<meta property="og:type" content="website"><meta property="og:title" content="' + esc(d.judulAcara + ' ' + (d.p1.panggil || d.p1.nama) + (d.mode === 'pasangan' ? ' & ' + (d.p2.panggil || d.p2.nama) : '')) + '"><meta property="og:description" content="' + esc(VeloraEngine.tglPanjang(d.sesi[0] && d.sesi[0].tgl) + '. Kami mengundang Anda untuk hadir dan memberikan doa restu.') + '"><meta property="og:image" content="' + esc(b + 'img/og.jpg') + '"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">';
  }
  Object.assign(o, vid);
  o.adeganBase = zip ? new URL('adegan/', document.baseURI).href : 'adegan/';
  if (tema && tema.adegan && ADG[tema.adegan]) o.adegan = ADG[tema.adegan];
  return VeloraEngine.render(d, tema, o);
}

var timer;
function refresh() {
  clearTimeout(timer);
  timer = setTimeout(function () { if (tema) $('pv').srcdoc = '<base href="' + location.href.replace(/[^/]*$/, '') + '">' + render(false); }, 300);
}

/* ---------- foto ---------- */
function bacaFoto(file, max) {
  return new Promise(function (ok, no) {
    var fr = new FileReader(); fr.onerror = no;
    fr.onload = function () { var im = new Image(); im.onerror = no; im.onload = function () { var s = Math.min(1, max / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); ok(c.toDataURL('image/jpeg', 0.82)); }; im.src = fr.result; };
    fr.readAsDataURL(file);
  });
}
function ogDari(u) { return new Promise(function (ok) { var im = new Image(); im.onload = function () { var c = document.createElement('canvas'); c.width = 1200; c.height = 630; var s = Math.max(1200 / im.width, 630 / im.height), w = im.width * s, h = im.height * s; c.getContext('2d').drawImage(im, (1200 - w) / 2, (630 - h) * 0.3, w, h); ok(c.toDataURL('image/jpeg', 0.8)); }; im.src = u; }); }
function thumbs() { $('th').innerHTML = [foto.cover, foto.p1, foto.p2].concat(galeri).filter(Boolean).map(function (d) { return '<img src="' + d + '" alt="">'; }).join(''); }

/* ---------- unduh ---------- */
function b64(zip, p, u) { zip.file(p, u.split(',')[1], { base64: true }); }
async function ambil(p) { var r = await fetch(p); if (!r.ok) throw new Error(p); return r.blob(); }
async function paket() {
  var d = data(), f = {}, s = state_wp();
  if (s) { $('sheet').value = s.rest + 'ucapan'; if (val('slug')) $('base').value = s.situs + 'u/' + val('slug') + '/'; }
  f['index.html'] = render(true);
  ['cover', 'p1', 'p2'].forEach(function (k) { if (foto[k]) f['img/' + k + '.jpg'] = foto[k]; });
  galeri.forEach(function (g, i) { f['img/gal' + (i + 1) + '.jpg'] = g; });
  if (val('base') && (foto.cover || foto.p1)) f['img/og.jpg'] = await ogDari(foto.cover || foto.p1);
  f['img/velora-logo-white.svg'] = await ambil('img/velora-logo-white.svg');
  if ($('lsrc').value === 'lib' && laguDipilih()) f['musik.mp3'] = await ambil(laguDipilih().file);
  if (tema.video) { for (var ex of ['mp4', 'webm', 'jpg']) { try { f['video.' + ex] = await ambil('video/' + tema.id + '.' + ex); } catch (e) {} } }
  if ($('lsrc').value === 'up' && mp3) f['musik.mp3'] = mp3;
  return { d: d, f: f };
}
function state_wp() { return window.VELORA_WP || null; }
function keBase64(v) {
  if (typeof v === 'string' && v.indexOf('data:') === 0) return Promise.resolve(v.split(',')[1]);
  return new Promise(function (ok) { var r = new FileReader(); r.onload = function () { ok(String(r.result).split(',')[1]); }; r.readAsDataURL(v); });
}
async function unduh() {
  var st = $('st'); st.textContent = 'Menyiapkan paket…';
  try {
    var p = await paket(), d = p.d, zip = new JSZip(), nama = (d.p1.panggil || d.p1.nama).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    Object.keys(p.f).forEach(function (k) { var v = p.f[k]; if (typeof v === 'string' && v.indexOf('data:') === 0) b64(zip, k, v); else zip.file(k, v); });
    zip.file('apps-script.gs', await ambil('apps-script.gs')); zip.file('.nojekyll', '');
    zip.file('BACA-DULU.txt', 'Paket undangan Velora (tema: ' + tema.nama + ')\nKode pesanan: ' + d.uuid + '\n\n1. Unggah SEMUA isi folder ini ke hosting.\n2. Link per tamu: ALAMAT/?to=Nama+Tamu (atau link.html di Studio).\n3. Uji di HP sebelum dikirim ke klien.\n');
    var blob = await zip.generateAsync({ type: 'blob' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'undangan-' + (nama || 'velora') + '-' + tema.id + '.zip'; a.click();
    st.textContent = 'Paket diunduh (' + Math.round(blob.size / 1024) + ' KB).';
  } catch (e) { st.textContent = 'Gagal: ' + e.message + '. Buka Studio lewat http(s), bukan file://.'; }
}
async function terbit() {
  var w = state_wp(), st = $('st');
  if (!w) return;
  var slug = val('slug').toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
  if (slug.length < 3) { st.textContent = 'Isi alamat undangan (/u/…) minimal 3 huruf.'; $('slug').focus(); return; }
  $('slug').value = slug; st.textContent = 'Menerbitkan…';
  try {
    var p = await paket(), files = {};
    for (var k in p.f) files[k] = k === 'index.html' ? p.f[k] : await keBase64(p.f[k]);
    var r = await fetch(w.rest + 'terbit', { method: 'POST', credentials: 'same-origin', headers: { 'X-WP-Nonce': w.nonce, 'Content-Type': 'text/plain' },
      body: JSON.stringify({ uuid: p.d.uuid, slug: slug, judul: p.d.judulAcara + ' ' + (p.d.p1.panggil || p.d.p1.nama) + (p.d.mode === 'pasangan' ? ' & ' + (p.d.p2.panggil || p.d.p2.nama) : ''), tema: tema.nama, paket: tema.tier + (foto.cover || foto.p1 ? '' : ' (Tanpa Foto)'), klien: val('klien'), wa: val('wa'), bulan: parseInt(val('bulan'), 10) || 12, files: files }) });
    var j = await r.json();
    if (!r.ok || !j.ok) throw new Error(j.message || j.error || ('HTTP ' + r.status));
    st.innerHTML = 'Terbit: <a href="' + esc(j.url) + '" target="_blank" rel="noopener">' + esc(j.url) + '</a> · aktif s.d. ' + esc(j.sampai) + '<br>Rekap untuk klien: <a href="' + esc(j.ucapan) + '" target="_blank" rel="noopener">buka</a>';
  } catch (e) { st.textContent = 'Gagal menerbitkan: ' + e.message; }
}

/* ---------- sambungan ---------- */
function wire() {
  document.querySelectorAll('#fm input,#fm select,#fm textarea').forEach(function (el) {
    if (el.dataset.w) return; el.dataset.w = 1;
    el.addEventListener('input', refresh); el.addEventListener('change', refresh);
  });
}
async function init() {
  try {
    THEMES = await (await fetch('themes/themes.json')).json();
    THEMES.forEach(function (x) { if (x.adegan && !(x.adegan in ADG)) { ADG[x.adegan] = null; fetch('adegan/' + x.adegan + '.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (j) { ADG[x.adegan] = j; }).catch(function () {}); } });
    LAGU = await (await fetch('musik/lagu.json')).json();
    SUASANA = await (await fetch('musik/suasana.json')).json();
    try { // pustaka internal (hanya ada di Studio WordPress, tidak di repo publik)
      var tim = await (await fetch('musik/lagu-tim.json')).json(); if (Array.isArray(tim)) LAGU = tim.concat(LAGU);
      TEMA_LAGU = await (await fetch('musik/tema-lagu.json')).json();
    } catch (e) {}
  } catch (e) { $('st').textContent = 'Jalankan lewat server: python3 -m http.server 8080 lalu buka http://localhost:8080'; return; }
  $('acara').innerHTML = Object.keys(ACARA).map(function (k) { return '<button type="button" data-a="' + k + '">' + ACARA[k].label + '</button>'; }).join('');
  $('acara').onclick = function (e) { var b = e.target.closest('button'); if (b) pasangAcara(b.dataset.a); };
  $('kol').onclick = function (e) { var b = e.target.closest('button'); if (b) { kol = b.dataset.k; daftarTema(); } };
  $('tg').onclick = function (e) { var b = e.target.closest('.tc'); if (b) pilihTema(THEMES.filter(function (t) { return t.id === b.dataset.id; })[0]); };
  $('secs').innerHTML = SECS.map(function (s) { return '<label><input type="checkbox" class="sec" data-k="' + s[0] + '"' + (s[2] ? ' checked' : '') + '> ' + s[1] + '</label>'; }).join('');
  document.querySelectorAll('.sec').forEach(function (c) { var x = $('x_' + c.dataset.k), f = function () { if (x) x.hidden = !c.checked; }; c.addEventListener('change', f); f(); });
  var vokal = function (l) { return l.sumber === 'populer' && !/karaoke/.test(l.id); };
  LAGU.sort(function (a, b) { return (vokal(b) ? 1 : 0) - (vokal(a) ? 1 : 0); });
  $('lagu').innerHTML = LAGU.map(function (l) { return '<option value="' + l.id + '">' + esc(l.judul) + (l.artis ? ' — ' + esc(l.artis) : '') + ' (' + (vokal(l) ? 'vokal' : 'instrumental') + ')</option>'; }).join('');
  $('lagu').addEventListener('change', function () { laguManual = true; setMulai(); refresh(); });
  $('lsrc').addEventListener('change', function () { ['lib', 'up', 'yt'].forEach(function (k) { $('x_' + k).hidden = $('lsrc').value !== k; }); });
  $('addSesi').onclick = function () { var n = document.querySelectorAll('[data-sesi]').length; if (n < 3) { $('sesi').insertAdjacentHTML('beforeend', sesiHtml(n, 'Sesi ' + (n + 1))); wire(); refresh(); } };
  $('kisah').innerHTML = kisahHtml(); $('addKisah').onclick = function () { if (document.querySelectorAll('.kisah-i').length < 4) { $('kisah').insertAdjacentHTML('beforeend', kisahHtml()); wire(); } };
  [['f_cover', 'cover'], ['f_p1img', 'p1'], ['f_p2img', 'p2']].forEach(function (p) { $(p[0]).onchange = async function () { foto[p[1]] = this.files[0] ? await bacaFoto(this.files[0], 1100) : null; thumbs(); refresh(); }; });
  $('f_gal').onchange = async function () { galeri = []; for (var i = 0; i < Math.min(10, this.files.length); i++) galeri.push(await bacaFoto(this.files[i], 1000)); thumbs(); refresh(); };
  $('f_mp3').onchange = function () { mp3 = this.files[0] || null; mp3url = mp3 ? URL.createObjectURL(mp3) : ''; refresh(); };
  var bu = function () { $('uuid').value = (crypto.randomUUID ? crypto.randomUUID() : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); })); refresh(); };
  if (!(state_wp() && state_wp().pesanan && state_wp().pesanan.uuid)) bu(); $('uuidBaru').onclick = bu;
  try { var cf = await (await fetch('config.json')).json(); if (cf.pusatUcapan && !$('sheet').value) $('sheet').value = cf.pusatUcapan; } catch (e) {}
  $('dl').onclick = unduh;
  if (state_wp()) { $('x_wp').hidden = false; $('terbit').hidden = false; $('terbit').onclick = terbit; $('sheet').value = state_wp().rest + 'ucapan'; $('sheet').readOnly = true; }
  $('op').onclick = function () { var w = window.open('', '_blank'); w.document.write('<base href="' + location.href.replace(/[^/]*$/, '') + '">' + render(false)); w.document.close(); };
  var q = new URLSearchParams(location.search);
  pasangAcara(ACARA[q.get('acara')] ? q.get('acara') : 'pernikahan');
  if (q.get('tema')) pilihTema(THEMES.filter(function (t) { return t.id === q.get('tema'); })[0] || tema);
  var ps = state_wp() && state_wp().pesanan; // draft pesanan dari formulir Order situs
  if (ps) {
    var tp = THEMES.filter(function (t) { return t.id === ps.tema; })[0];
    if (tp) { pasangAcara(tp.acara[0]); pilihTema(tp); }
    if (ps.uuid) $('uuid').value = ps.uuid;
    $('klien').value = ps.klien || ''; $('wa').value = ps.wa || '';
    $('slug').value = ps.slug || (ps.klien || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    if (ps.tanggal) { var tg = document.querySelector('.s_tgl'); if (tg) tg.value = ps.tanggal; }
    $('st').textContent = 'Mengerjakan pesanan: ' + (ps.klien || '') + (tp ? ' · tema ' + tp.nama : ' · tema belum dipilih');
  }
  wire(); refresh();
}
init();

/* ---------- Template WP (Premium dkk) — hanya di Studio internal WordPress ---------- */
(function () {
  var w = window.VELORA_WP; if (!w) return;
  var fm = document.getElementById('fm'); if (!fm) return;
  var box = document.createElement('div');
  box.innerHTML = '<fieldset><legend>Sumber desain</legend><div class="chips" id="src"><button type="button" class="on" data-s="studio">Tema Studio (otomatis)</button><button type="button" data-s="wp">Template WP: Premium dkk (edit di Elementor)</button></div>' +
    '<div class="hint">Template WP hanya untuk tim internal (lisensi Luxee). Pesanan disalin ke /u/nama-klien/ lalu diedit di Elementor.</div></fieldset>' +
    '<div id="wpbox" hidden><fieldset><legend>Template WP</legend><div class="chips" id="wpkat"></div><div class="tg" id="wpgrid" style="margin-top:10px"></div></fieldset>' +
    '<fieldset id="wpform" hidden><legend>Buat pesanan dari <span id="wpnama"></span></legend>' +
    '<label>Alamat undangan: /u/…</label><input id="wpslug" placeholder="nama-klien"><div class="row"><div><label>Nama klien</label><input id="wpklien"></div><div><label>WhatsApp klien</label><input id="wpwa"></div></div>' +
    '<label>Masa aktif (bulan)</label><input type="number" id="wpbulan" value="12" min="1" max="36"><br><br><button type="button" id="wpbuat">Buat pesanan</button><div class="hint" id="wpst" style="margin-top:8px"></div></fieldset></div>';
  fm.insertBefore(box, fm.firstChild.nextSibling);
  var lain = [].slice.call(fm.children).filter(function (el) { return el !== box && el.tagName === 'FIELDSET'; });
  var data = [], kat = 'Semua', pilih = null;
  function e(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function gambar() {
    var ks = ['Semua']; data.forEach(function (t) { if (ks.indexOf(t.kategori) < 0) ks.push(t.kategori); });
    $('wpkat').innerHTML = ks.map(function (k) { return '<button type="button" class="' + (k === kat ? 'on' : '') + '" data-k="' + e(k) + '">' + e(k) + '</button>'; }).join('');
    $('wpgrid').innerHTML = data.filter(function (t) { return kat === 'Semua' || t.kategori === kat; }).map(function (t) {
      return '<div class="tc' + (pilih && pilih.slug === t.slug ? ' on' : '') + '" data-s="' + e(t.slug) + '" role="button" tabindex="0">' + (t.sampul ? '<img src="' + e(t.sampul) + '" alt="" style="width:100%;aspect-ratio:3/4;object-fit:cover;object-position:top;display:block">' : '') +
        '<div class="in"><b>' + e(t.nama.replace(/^Velora /, '')) + '</b><small>' + e(t.kategori) + ' · ' + e(t.tier) + '</small><a href="' + e(t.demo) + '" target="_blank" rel="noopener" onclick="event.stopPropagation()">Lihat demo ↗</a></div></div>';
    }).join('');
  }
  $('src').onclick = function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    [].forEach.call($('src').children, function (x) { x.classList.toggle('on', x === b); });
    var wp = b.dataset.s === 'wp'; $('wpbox').hidden = !wp; lain.forEach(function (f) { f.hidden = wp; });
    document.querySelector('.pv').hidden = wp; $('price').hidden = wp;
    if (wp && !data.length) fetch(w.rest + 'template-wp', { headers: { 'X-WP-Nonce': w.nonce }, credentials: 'same-origin' }).then(function (r) { return r.json(); }).then(function (j) { data = j; gambar(); });
  };
  $('wpkat').onclick = function (ev) { var b = ev.target.closest('button'); if (b) { kat = b.dataset.k; gambar(); } };
  $('wpgrid').onclick = function (ev) {
    var c = ev.target.closest('.tc'); if (!c) return;
    pilih = data.filter(function (t) { return t.slug === c.dataset.s; })[0]; gambar();
    $('wpform').hidden = false; $('wpnama').textContent = pilih.nama.replace(/^Velora /, ''); $('wpform').scrollIntoView({ behavior: 'smooth' });
    var ps = w.pesanan; if (ps) { $('wpklien').value = ps.klien || ''; $('wpwa').value = ps.wa || ''; $('wpslug').value = ps.slug || (ps.klien || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''); }
  };
  $('wpbuat').onclick = function () {
    if (!pilih) return; var slug = $('wpslug').value.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-|-$/g, '');
    if (slug.length < 3) { $('wpst').textContent = 'Isi alamat minimal 3 huruf.'; return; }
    $('wpst').textContent = 'Membuat pesanan…';
    fetch(w.rest + 'klon', { method: 'POST', credentials: 'same-origin', headers: { 'X-WP-Nonce': w.nonce, 'Content-Type': 'text/plain' },
      body: JSON.stringify({ template: pilih.slug, slug: slug, klien: $('wpklien').value, wa: $('wpwa').value, bulan: +$('wpbulan').value || 12, uuid: (w.pesanan && w.pesanan.uuid) || '' }) })
      .then(function (r) { return r.json().then(function (j) { if (!r.ok || !j.ok) throw new Error(j.message || 'gagal'); return j; }); })
      .then(function (j) { $('wpst').innerHTML = 'Pesanan dibuat: <a href="' + e(j.url) + '" target="_blank" rel="noopener">' + e(j.url) + '</a> · aktif s.d. ' + e(j.sampai) + '<br><a href="' + e(j.edit) + '" target="_blank" rel="noopener"><b>Edit nama, foto, dan teks di Elementor →</b></a>'; })
      .catch(function (er) { $('wpst').textContent = 'Gagal: ' + er.message; });
  };
})();
