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
var THEMES = [], LAGU = [], SUASANA = {}, acara = 'pernikahan', kol = 'Semua', tema = null, laguManual = false;
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
  if (!laguManual) { var id = (SUASANA[t.musik] || [])[0] || (SUASANA.lembut || [])[0]; if (id) $('lagu').value = id; }
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
    penutup: val('penutup'), tuanRumah: val('tuanRumah'), sheet: val('sheet'), mulai: parseInt(val('mulai'), 10) || 0
  };
}
function laguDipilih() { return LAGU.filter(function (l) { return l.id === $('lagu').value; })[0]; }
function kredit() { var l = laguDipilih(); return $('lsrc').value === 'lib' && l ? 'Musik: “' + l.judul + '” oleh ' + l.artis + ' (incompetech.com), lisensi CC BY 4.0' : ''; }

function render(zip) {
  var src = $('lsrc').value, l = laguDipilih(), audio = '';
  if (src === 'lib' && l) audio = zip ? 'musik.mp3' : l.file;
  if (src === 'up' && mp3) audio = zip ? 'musik.mp3' : mp3url;
  var o = { audio: audio, yt: src === 'yt' ? val('yt') : '', kredit: kredit(), situs: 'https://isvarya27.github.io/velora-generator/',
    img: function (k) { return foto[k] ? (zip ? 'img/' + k + '.jpg' : foto[k]) : ''; },
    galeri: galeri.map(function (g, i) { return zip ? 'img/gal' + (i + 1) + '.jpg' : g; }) };
  var d = data();
  if (zip && val('base') && (foto.cover || foto.p1)) {
    var b = val('base').replace(/\/?$/, '/');
    o.og = '<meta property="og:type" content="website"><meta property="og:title" content="' + esc(d.judulAcara + ' ' + (d.p1.panggil || d.p1.nama) + (d.mode === 'pasangan' ? ' & ' + (d.p2.panggil || d.p2.nama) : '')) + '"><meta property="og:description" content="' + esc(VeloraEngine.tglPanjang(d.sesi[0] && d.sesi[0].tgl) + '. Kami mengundang Anda untuk hadir dan memberikan doa restu.') + '"><meta property="og:image" content="' + esc(b + 'img/og.jpg') + '"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta name="twitter:card" content="summary_large_image">';
  }
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
async function unduh() {
  var st = $('st'); st.textContent = 'Menyiapkan paket…';
  try {
    var zip = new JSZip(), d = data(), nama = (d.p1.panggil || d.p1.nama).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    zip.file('index.html', render(true));
    ['cover', 'p1', 'p2'].forEach(function (k) { if (foto[k]) b64(zip, 'img/' + k + '.jpg', foto[k]); });
    galeri.forEach(function (g, i) { b64(zip, 'img/gal' + (i + 1) + '.jpg', g); });
    if (val('base') && (foto.cover || foto.p1)) b64(zip, 'img/og.jpg', await ogDari(foto.cover || foto.p1));
    zip.file('img/velora-logo-white.svg', await ambil('img/velora-logo-white.svg'));
    if ($('lsrc').value === 'lib' && laguDipilih()) zip.file('musik.mp3', await ambil(laguDipilih().file));
    if ($('lsrc').value === 'up' && mp3) zip.file('musik.mp3', mp3);
    zip.file('apps-script.gs', await ambil('apps-script.gs')); zip.file('.nojekyll', '');
    zip.file('BACA-DULU.txt', 'Paket undangan Velora (tema: ' + tema.nama + ')\n\n1. Unggah SEMUA isi folder ini ke hosting (mis. repo GitHub Pages).\n2. Link per tamu: buka link.html di Studio, atau ALAMAT/?to=Nama+Tamu\n3. Ucapan tersimpan: pasang apps-script.gs di Google Sheet (Ekstensi > Apps Script > Deploy Aplikasi web) lalu isi URL di Studio dan unduh ulang.\n4. Uji di HP sebelum dikirim ke klien.\n');
    var blob = await zip.generateAsync({ type: 'blob' }), a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = 'undangan-' + (nama || 'velora') + '-' + tema.id + '.zip'; a.click();
    st.textContent = 'Paket diunduh (' + Math.round(blob.size / 1024) + ' KB).';
  } catch (e) { st.textContent = 'Gagal: ' + e.message + '. Buka Studio lewat http(s), bukan file://.'; }
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
    LAGU = await (await fetch('musik/lagu.json')).json();
    SUASANA = await (await fetch('musik/suasana.json')).json();
  } catch (e) { $('st').textContent = 'Jalankan lewat server: python3 -m http.server 8080 lalu buka http://localhost:8080'; return; }
  $('acara').innerHTML = Object.keys(ACARA).map(function (k) { return '<button type="button" data-a="' + k + '">' + ACARA[k].label + '</button>'; }).join('');
  $('acara').onclick = function (e) { var b = e.target.closest('button'); if (b) pasangAcara(b.dataset.a); };
  $('kol').onclick = function (e) { var b = e.target.closest('button'); if (b) { kol = b.dataset.k; daftarTema(); } };
  $('tg').onclick = function (e) { var b = e.target.closest('.tc'); if (b) pilihTema(THEMES.filter(function (t) { return t.id === b.dataset.id; })[0]); };
  $('secs').innerHTML = SECS.map(function (s) { return '<label><input type="checkbox" class="sec" data-k="' + s[0] + '"' + (s[2] ? ' checked' : '') + '> ' + s[1] + '</label>'; }).join('');
  document.querySelectorAll('.sec').forEach(function (c) { var x = $('x_' + c.dataset.k), f = function () { if (x) x.hidden = !c.checked; }; c.addEventListener('change', f); f(); });
  $('lagu').innerHTML = LAGU.map(function (l) { return '<option value="' + l.id + '">' + esc(l.judul) + ' (' + esc(l.suasana) + ')</option>'; }).join('');
  $('lagu').addEventListener('change', function () { laguManual = true; });
  $('lsrc').addEventListener('change', function () { ['lib', 'up', 'yt'].forEach(function (k) { $('x_' + k).hidden = $('lsrc').value !== k; }); });
  $('addSesi').onclick = function () { var n = document.querySelectorAll('[data-sesi]').length; if (n < 3) { $('sesi').insertAdjacentHTML('beforeend', sesiHtml(n, 'Sesi ' + (n + 1))); wire(); refresh(); } };
  $('kisah').innerHTML = kisahHtml(); $('addKisah').onclick = function () { if (document.querySelectorAll('.kisah-i').length < 4) { $('kisah').insertAdjacentHTML('beforeend', kisahHtml()); wire(); } };
  [['f_cover', 'cover'], ['f_p1img', 'p1'], ['f_p2img', 'p2']].forEach(function (p) { $(p[0]).onchange = async function () { foto[p[1]] = this.files[0] ? await bacaFoto(this.files[0], 1100) : null; thumbs(); refresh(); }; });
  $('f_gal').onchange = async function () { galeri = []; for (var i = 0; i < Math.min(10, this.files.length); i++) galeri.push(await bacaFoto(this.files[i], 1000)); thumbs(); refresh(); };
  $('f_mp3').onchange = function () { mp3 = this.files[0] || null; mp3url = mp3 ? URL.createObjectURL(mp3) : ''; refresh(); };
  $('dl').onclick = unduh;
  $('op').onclick = function () { var w = window.open('', '_blank'); w.document.write('<base href="' + location.href.replace(/[^/]*$/, '') + '">' + render(false)); w.document.close(); };
  var q = new URLSearchParams(location.search);
  pasangAcara(ACARA[q.get('acara')] ? q.get('acara') : 'pernikahan');
  if (q.get('tema')) pilihTema(THEMES.filter(function (t) { return t.id === q.get('tema'); })[0] || tema);
  wire(); refresh();
}
init();
