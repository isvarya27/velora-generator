/* Velora Engine: merender undangan dari data + token tema (docs/themes/SCHEMA.md). Tanpa library. */
(function (g) {
  'use strict';
  var HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  var BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  var OFFSET = { WIB: '+07:00', WITA: '+08:00', WIT: '+09:00' };

  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function js(v) { return JSON.stringify(v).replace(/</g, '\\u003c'); }
  function nl(s) { return esc(s).replace(/\n/g, '<br>'); }
  function pd(v) { var p = String(v || '').split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function tglPanjang(v) { var d = pd(v); return isNaN(d) ? '' : HARI[d.getDay()] + ', ' + d.getDate() + ' ' + BULAN[d.getMonth()] + ' ' + d.getFullYear(); }
  function tglPendek(v) { var d = pd(v); return isNaN(d) ? '' : d.getDate() + ' ' + BULAN[d.getMonth()] + ' ' + d.getFullYear(); }
  function jam(v) { return String(v || '').replace(':', '.'); }
  function iso(s) { return (s.tgl || '2030-01-01') + 'T' + (s.jam || '10:00') + ':00' + (OFFSET[s.zona] || '+07:00'); }
  function inisial(n) { return String(n || '').trim().split(/\s+/)[0].charAt(0).toUpperCase(); }
  function rng(seed) { var x = 0; for (var i = 0; i < seed.length; i++) x = (x * 31 + seed.charCodeAt(i)) >>> 0; return function () { x = (x * 1664525 + 1013904223) >>> 0; return x / 4294967296; }; }

  /* ---------- ornamen SVG orisinal (warna = currentColor) ---------- */
  function blossom(cx, cy, r, rot) {
    var p = '';
    for (var i = 0; i < 5; i++) p += '<ellipse cx="' + cx + '" cy="' + (cy - r * 0.55).toFixed(1) + '" rx="' + (r * 0.42).toFixed(1) + '" ry="' + (r * 0.62).toFixed(1) + '" transform="rotate(' + (rot + i * 72) + ' ' + cx + ' ' + cy + ')"/>';
    return '<g>' + p + '<circle cx="' + cx + '" cy="' + cy + '" r="' + (r * 0.2).toFixed(1) + '" fill="#fff" opacity=".75"/></g>';
  }
  function leaf(cx, cy, rx, ry, rot) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" transform="rotate(' + rot + ' ' + cx + ' ' + cy + ')"/>'; }
  function star4(x, y, s) { return '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M0-10L2.4-2.4 10 0 2.4 2.4 0 10-2.4 2.4-10 0-2.4-2.4Z"/>'; }
  var SUDUT = {
    daun: function () {
      return '<path d="M2 150C36 104 78 56 150 2" fill="none" stroke="currentColor" stroke-width="1.6"/>' +
        leaf(30, 112, 15, 6, -40) + leaf(44, 86, 15, 6, -70) + leaf(62, 82, 15, 6, -20) + leaf(78, 58, 15, 6, -60) + leaf(96, 54, 14, 5.5, -15) + leaf(110, 34, 13, 5, -55) + leaf(126, 26, 12, 5, -10);
    },
    bunga: function () {
      var f = function (cx, cy, r) { var p = ''; for (var i = 0; i < 8; i++) p += leaf(cx, cy - r * 0.6, r * 0.32, r * 0.62, i * 45).replace('transform="rotate(' + (i * 45) + ' ' + cx + ' ' + (cy - r * 0.6) + ')', 'transform="rotate(' + (i * 45) + ' ' + cx + ' ' + cy + ')'); return p + '<circle cx="' + cx + '" cy="' + cy + '" r="' + r * 0.25 + '" fill="#fff" opacity=".6"/>'; };
      return '<g opacity=".55">' + leaf(70, 18, 20, 7, 20) + leaf(16, 72, 20, 7, 70) + leaf(92, 40, 16, 6, 50) + '</g>' + f(34, 34, 30) + '<g opacity=".8">' + f(86, 14, 15) + f(14, 88, 15) + '</g>';
    },
    sakura: function () {
      return '<path d="M0 30C40 34 70 52 96 92M44 40C60 24 78 20 104 22M70 60C86 58 100 66 118 84" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" opacity=".7"/>' +
        blossom(30, 30, 18, 10) + blossom(64, 44, 13, 40) + blossom(100, 22, 12, 20) + blossom(96, 92, 14, 0) + blossom(116, 82, 9, 30) + '<g opacity=".6">' + blossom(14, 64, 9, 15) + blossom(82, 70, 8, 50) + '</g>';
    },
    bintang: function () { return star4(30, 30, 1.6) + star4(76, 22, 0.8) + star4(22, 82, 0.9) + star4(64, 64, 0.55) + '<circle cx="104" cy="40" r="2"/><circle cx="44" cy="110" r="2"/><circle cx="96" cy="88" r="1.5"/>'; },
    awan: function () {
      var c = function (x, y, s) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + s + ')"><g fill="currentColor" opacity=".45" transform="translate(0 5)"><circle cx="20" cy="22" r="16"/><circle cx="44" cy="14" r="20"/><circle cx="68" cy="24" r="14"/><rect x="14" y="22" width="60" height="16" rx="8"/></g><g fill="#fff"><circle cx="20" cy="22" r="16"/><circle cx="44" cy="14" r="20"/><circle cx="68" cy="24" r="14"/><rect x="14" y="22" width="60" height="16" rx="8"/></g></g>'; };
      return c(-10, 6, 1.2) + c(40, 70, 0.7);
    },
    geometris: function () { return '<path d="M8 120V8h112M20 120V20h100" fill="none" stroke="currentColor" stroke-width="1.4"/><path d="M8 8l12 12" stroke="currentColor"/><rect x="32" y="32" width="12" height="12" transform="rotate(45 38 38)" fill="none" stroke="currentColor"/>'; },
    artdeco: function () {
      var p = '';
      for (var i = 1; i <= 4; i++) p += '<path d="M0 ' + (i * 24) + 'A' + (i * 24) + ' ' + (i * 24) + ' 0 0 0 ' + (i * 24) + ' 0" fill="none" stroke="currentColor" stroke-width="' + (i === 4 ? 2 : 1.1) + '"/>';
      for (var k = 0; k < 7; k++) { var a = k * 15 * Math.PI / 180; p += '<line x1="0" y1="0" x2="' + (130 * Math.cos(a)).toFixed(1) + '" y2="' + (130 * Math.sin(a)).toFixed(1) + '" stroke="currentColor" stroke-width=".6" opacity=".6"/>'; }
      return p + '<path d="M6 140V6h134" fill="none" stroke="currentColor" stroke-width="1.6"/>';
    },
    batik: function () { return SUDUT.geometris() + '<g opacity=".8">' + [0, 1, 2].map(function (i) { var x = 60 + i * 22, y = 60 + i * 22; return '<g transform="translate(' + x + ' ' + y + ')"><ellipse rx="5" ry="10"/><ellipse rx="10" ry="5"/><circle r="2.5" fill="#fff"/></g>'; }).join('') + '</g>'; },
    konfeti: function () {
      var r = rng('konfeti'), s = '', cols = ['var(--aksen)', 'var(--emas)', 'var(--ink)'];
      for (var i = 0; i < 16; i++) { var x = (r() * 130).toFixed(0), y = (r() * 130).toFixed(0); s += i % 3 ? '<rect x="' + x + '" y="' + y + '" width="7" height="3.5" rx="1.5" transform="rotate(' + (r() * 180).toFixed(0) + ' ' + x + ' ' + y + ')" style="fill:' + cols[i % 3] + '"/>' : '<circle cx="' + x + '" cy="' + y + '" r="3" style="fill:' + cols[(i + 1) % 3] + '"/>'; }
      return s;
    },
    piksel: function () { var m = [[2, 0], [2, 1], [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [2, 3], [2, 4]], s = ''; [[16, 16, 6], [70, 30, 4], [30, 80, 3.5]].forEach(function (t) { m.forEach(function (p) { s += '<rect x="' + (t[0] + p[0] * t[2]) + '" y="' + (t[1] + p[1] * t[2]) + '" width="' + t[2] + '" height="' + t[2] + '"/>'; }); }); return s; },
    songket: function () {
      var s = '<path d="M4 146V4h142" fill="none" stroke="currentColor" stroke-width="2"/><path d="M14 146V14h132" fill="none" stroke="currentColor" stroke-width=".8"/>';
      for (var i = 0; i < 5; i++) for (var j = 0; j < 5 - i; j++) { var x = 30 + i * 22, y = 30 + j * 22; s += '<path d="M' + x + ' ' + (y - 9) + 'L' + (x + 9) + ' ' + y + 'L' + x + ' ' + (y + 9) + 'L' + (x - 9) + ' ' + y + 'Z" fill="none" stroke="currentColor" stroke-width="1.2"/><circle cx="' + x + '" cy="' + y + '" r="2.2"/>'; }
      return s;
    },
    ukiran: function () {
      var sc = function (x, y, r, rot) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')"><path d="M0 0C' + r + ' 0 ' + r + ' ' + (-r) + ' 0 ' + (-r) + 'S' + (-r * 0.6) + ' ' + (-r * 0.3) + ' ' + (-r * 0.25) + ' ' + (-r * 0.55) + '" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="' + (-r * 0.25) + '" cy="' + (-r * 0.55) + '" r="2.4"/></g>'; };
      return '<path d="M4 120C20 70 50 40 120 4" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>' + sc(26, 92, 22, 20) + sc(48, 62, 20, -10) + sc(76, 40, 18, 30) + sc(104, 20, 15, 0) + leaf(36, 108, 12, 5, -60) + leaf(62, 80, 12, 5, -30) + leaf(90, 54, 11, 4.5, -50) + '<circle cx="14" cy="14" r="6" fill="none" stroke="currentColor" stroke-width="1.6"/><circle cx="14" cy="14" r="2"/>';
    },
    mega: function () {
      var cl = function (x, y, s) { var p = ''; for (var k = 0; k < 3; k++) { var o = k * 7; p += '<path transform="translate(' + x + ' ' + y + ') scale(' + s + ')" d="M' + (6 + o) + ' ' + (40 - o / 2) + 'C' + (6 + o) + ' ' + (22 - o / 2) + ' ' + (26 + o / 2) + ' ' + (18 + o / 2) + ' ' + (32 + o / 2) + ' ' + (28 + o / 2) + 'C' + (36 + o / 2) + ' ' + (12 + o / 2) + ' ' + (62 - o / 2) + ' ' + (12 + o / 2) + ' ' + (64 - o) + ' ' + (30 + o / 2) + 'C' + (80 - o) + ' ' + (24 + o / 2) + ' ' + (92 - o) + ' ' + (34 + o / 2) + ' ' + (88 - o) + ' ' + (40 - o / 2) + 'Z" fill="' + (k ? 'none' : 'currentColor') + '" fill-opacity=".18" stroke="currentColor" stroke-width="' + (k ? 1.4 : 2) + '"/>'; } return p; };
      return cl(-6, 0, 1.3) + cl(40, 60, 0.9) + cl(-10, 92, 0.7);
    },
    bulan: function () {
      var lent = function (x, len, sc) { return '<line x1="' + x + '" y1="0" x2="' + x + '" y2="' + len + '" stroke="currentColor" stroke-width="1.2"/><g transform="translate(' + x + ' ' + len + ') scale(' + sc + ')"><path d="M-8 0h16l4 6v18l-4 6h-16l-4-6V6z" fill="currentColor" opacity=".9"/><path d="M-5 8h10v14h-10z" fill="#fff" opacity=".55"/><path d="M-3 30h6l-3 7z" fill="currentColor"/></g>'; };
      return '<path d="M118 22a26 26 0 1 0 14 44a22 22 0 1 1 -14 -44z" fill="currentColor"/>' + star4(104, 70, 0.7) + lent(26, 40, 1) + lent(56, 70, 0.8) + lent(84, 24, 0.65);
    },
    gelombang: function () { return ''; },
    none: function () { return ''; }
  };
  function sudut(nama, pos) { var f = SUDUT[nama] || SUDUT.none, b = f(); return b ? '<svg class="orn ' + pos + '" viewBox="0 0 150 150" aria-hidden="true" fill="currentColor">' + b + '</svg>' : ''; }
  function empatSudut(nama, bawah) { return sudut(nama, 'tl') + sudut(nama, 'tr') + (bawah ? sudut(nama, 'bl') + sudut(nama, 'br') : ''); }
  function pembatas(nama) {
    var mid = nama === 'sakura' ? blossom(60, 12, 8, 0) : nama === 'bintang' || nama === 'piksel' ? star4(60, 12, 0.9) : '<rect x="55" y="7" width="10" height="10" transform="rotate(45 60 12)"/>';
    return '<svg class="dvd" viewBox="0 0 120 24" aria-hidden="true" fill="currentColor"><line x1="6" y1="12" x2="46" y2="12" stroke="currentColor"/><line x1="74" y1="12" x2="114" y2="12" stroke="currentColor"/>' + mid + '</svg>';
  }
  function polaLatar(nama, warna) {
    var c = encodeURIComponent(warna);
    if (nama === 'batik') return 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2744%27 height=%2744%27%3E%3Cg fill=%27' + c + '%27 opacity=%27.07%27%3E%3Cellipse cx=%2722%27 cy=%2711%27 rx=%276%27 ry=%2710%27/%3E%3Cellipse cx=%2722%27 cy=%2733%27 rx=%276%27 ry=%2710%27/%3E%3Cellipse cx=%2711%27 cy=%2722%27 rx=%2710%27 ry=%276%27/%3E%3Cellipse cx=%2733%27 cy=%2722%27 rx=%2710%27 ry=%276%27/%3E%3C/g%3E%3C/svg%3E")';
    if (nama === 'songket') return 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2730%27 height=%2730%27%3E%3Cpath d=%27M15 3L27 15 15 27 3 15Z%27 fill=%27none%27 stroke=%27' + c + '%27 stroke-opacity=%27.16%27/%3E%3Ccircle cx=%2715%27 cy=%2715%27 r=%271.6%27 fill=%27' + c + '%27 fill-opacity=%27.25%27/%3E%3C/svg%3E")';
    if (nama === 'geometris' || nama === 'artdeco') return 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%2736%27 height=%2736%27%3E%3Cpath d=%27M18 0L36 18 18 36 0 18Z%27 fill=%27none%27 stroke=%27' + c + '%27 stroke-opacity=%27.12%27/%3E%3C/svg%3E")';
    return 'none';
  }

  /* ---------- lapisan gerak (CSS saja) ---------- */
  function gerak(nama, id) {
    if (!nama || nama === 'none') return '';
    var r = rng(id + nama), n = { kelopak: 14, salju: 22, konfeti: 18, gelembung: 12, bintang: 16, kilau: 14, awan: 3, cahaya: 9 }[nama] || 10, s = '';
    for (var i = 0; i < n; i++) {
      var left = (r() * 100).toFixed(1), d = (8 + r() * 10).toFixed(1), del = (-r() * 18).toFixed(1), sz = (0.6 + r() * 0.8).toFixed(2), top = (r() * 100).toFixed(1);
      s += '<i class="m-' + nama + '" style="left:' + left + '%;top:' + (nama === 'bintang' || nama === 'kilau' || nama === 'cahaya' || nama === 'awan' ? top + '%' : '-8%') + ';--d:' + d + 's;--dl:' + del + 's;--z:' + sz + ';--h:' + (r() * 360).toFixed(0) + '"></i>';
    }
    return '<div class="fx" aria-hidden="true">' + s + '</div>';
  }

  function fontLink(f) {
    var fam = [], add = function (n, w) { if (n && fam.indexOf(n) < 0) fam.push(n + (w ? ':wght@' + w : '')); };
    add(f.judul); add(f.skrip); add(f.isi, f.isi === 'Poppins' || f.isi === 'Montserrat' || f.isi === 'Lato' ? '300;400;500' : '');
    return 'https://fonts.googleapis.com/css2?' + fam.map(function (x) { return 'family=' + x.replace(/ /g, '+'); }).join('&') + '&display=swap';
  }

  /* ---------- CSS ---------- */
  function css(t) {
    var w = t.warna, gelap = !!t.gelap;
    return ':root{--bg1:' + w.bg1 + ';--bg2:' + w.bg2 + ';--bg3:' + w.bg3 + ';--ink:' + w.ink + ';--teks:' + w.teks + ';--aksen:' + w.aksen + ';--emas:' + w.emas + ';--kartu:' + w.kartu +
      ';--hf:"' + t.font.judul + '",serif;--bf:"' + t.font.isi + '",sans-serif;--sf:"' + (t.font.skrip || t.font.judul) + '",cursive;--r:' + ({ card: 18, polaroid: 6, frame: 4, artdeco: 0 }[t.layout] != null ? { card: 18, polaroid: 6, frame: 4 }[t.layout] : 14) + 'px}' +
      '*{box-sizing:border-box;margin:0}[hidden]{display:none!important}html{scroll-behavior:smooth}body{font-family:var(--bf);color:var(--teks);background:var(--bg3);-webkit-font-smoothing:antialiased}' +
      '.wrap{max-width:480px;margin:0 auto;min-height:100vh;position:relative;overflow:hidden;background:' + polaLatar(t.ornamen, w.emas) + ',linear-gradient(180deg,var(--bg1),var(--bg2) 50%,var(--bg3));box-shadow:0 0 50px rgba(0,0,0,.18)}' +
      'section{position:relative;z-index:2;padding:64px 28px;text-align:center}.alt{background:color-mix(in srgb,var(--kartu) ' + (gelap ? 6 : 45) + '%,transparent)}' +
      '.ey{font-size:11px;letter-spacing:.32em;text-transform:uppercase;color:var(--ink);font-weight:500}' +
      'h1,h2,h3{font-family:var(--hf);color:var(--ink);font-weight:400}h2{font-size:34px;line-height:1.15;margin:10px 0 16px}h3{font-size:24px}.sk{font-family:var(--sf);font-weight:400}' +
      'p{font-size:14.5px;line-height:1.8}.dvd{display:block;width:120px;height:24px;margin:18px auto;color:var(--emas)}' +
      '.card{background:var(--kartu);border-radius:var(--r);padding:24px 20px;margin:16px 0;box-shadow:0 6px 24px rgba(0,0,0,' + (gelap ? '.35' : '.07') + ');border:1px solid color-mix(in srgb,var(--emas) 45%,transparent)}' +
      '.btn{display:inline-block;padding:13px 28px;border-radius:999px;background:var(--aksen);color:#fff;text-decoration:none;font:500 13px var(--bf);letter-spacing:.1em;border:0;cursor:pointer}' +
      '.btn.o{background:transparent;color:var(--ink);border:1px solid var(--ink)}.btn.s{padding:8px 18px;font-size:12px}.btn:focus-visible{outline:2px solid var(--ink);outline-offset:3px}' +
      /* cover */
      '.cover{min-height:100vh;min-height:100svh;display:flex;flex-direction:column;justify-content:center;align-items:center;padding:150px 28px;overflow:hidden}section.o{padding-top:150px}section.ob{padding-bottom:150px}' +
      '.cover h1{font-size:46px;line-height:1.1;margin:14px 0 6px}.cover .sub{font-size:13px;letter-spacing:.06em}.guest{margin:22px 0 24px;font-size:13px}.guest b{display:block;font:400 24px var(--hf);color:var(--ink);margin-top:6px}' +
      '.ph{overflow:hidden;margin:22px auto;box-shadow:0 14px 34px rgba(0,0,0,.18)}.ph img{width:100%;height:100%;object-fit:cover;display:block}' +
      '.ph-arch{width:220px;height:290px;border-radius:110px 110px 12px 12px;border:3px solid var(--emas);outline:1px solid var(--emas);outline-offset:6px}' +
      '.ph-frame{width:230px;height:290px;border-radius:2px;border:1px solid var(--emas);outline:1px solid var(--emas);outline-offset:8px}' +
      '.ph-polaroid{width:230px;height:290px;background:#fff;padding:10px 10px 38px;transform:rotate(-3deg);border-radius:3px}.ph-polaroid img{border-radius:2px}' +
      '.ph-card{width:200px;height:200px;border-radius:50%;border:4px solid var(--kartu);outline:1px solid var(--emas);outline-offset:6px}' +
      '.ph-split{width:calc(100% + 56px);margin:-56px -28px 24px;height:52vh;border-radius:0 0 50% 50%/0 0 14% 14%;box-shadow:none}' +
      '.cover.full{justify-content:flex-end;background-size:cover;padding:40px 16px 22px}.cover.full .isi{background:color-mix(in srgb,var(--bg1) 86%,transparent);backdrop-filter:blur(6px);border-radius:var(--r);padding:16px 16px 18px;width:100%}.cover.full h1{font-size:34px;margin:6px 0 2px}.cover.full.kt-atas{justify-content:flex-start;padding-top:28px}.cover.full.ob-awan{padding-bottom:100px}.cover.full .guest{margin:10px 0 12px}.cover.full .guest b{font-size:20px}' +
      '.nm{margin:18px auto 12px;position:relative;font-weight:400}.nm .n{display:block;font:400 var(--fz,62px)/1.04 var(--sf);color:var(--ink)}.nm .amp{display:block;font:400 30px var(--hf);color:var(--emas);margin:4px 0}.nm .kt{display:block;font:500 13px var(--bf);letter-spacing:.24em;text-transform:uppercase;color:var(--ink);margin-top:14px}' +
      '.nm-arch{width:262px;padding:74px 18px 50px;border:2px solid var(--emas);border-radius:131px 131px 14px 14px;outline:1px solid var(--emas);outline-offset:7px;background:color-mix(in srgb,var(--kartu) 35%,transparent)}' +
      '.nm-frame{width:278px;padding:50px 18px;border:1px solid var(--emas);outline:1px solid var(--emas);outline-offset:9px}.nm-frame .n{font-family:var(--hf);text-transform:uppercase;letter-spacing:.06em}' +
      '.nm-card{width:286px;height:286px;border-radius:50%;background:var(--kartu);display:flex;flex-direction:column;justify-content:center;border:1px solid var(--emas);box-shadow:0 14px 34px rgba(0,0,0,.12)}' +
      '.nm-polaroid{width:268px;padding:42px 18px 54px;background:#fff;transform:rotate(-3deg);box-shadow:0 14px 30px rgba(0,0,0,.18)}.nm-polaroid:before{content:"";position:absolute;top:-12px;left:50%;width:96px;height:26px;margin-left:-48px;background:color-mix(in srgb,var(--emas) 45%,#fff);opacity:.85;transform:rotate(2deg)}.nm-polaroid .n{color:#3A2E33}.nm-polaroid .kt{color:#3A2E33}' +
      '.nm-split{width:100%;text-align:left;padding:0 6px}.nm-split .n{font-family:var(--hf);line-height:.98}.nm-split .amp{font-family:var(--sf);font-size:44px}' +
      '.nm-full{width:100%;text-align:left;padding:0 6px}.nm-full .n{font-family:var(--hf);text-transform:uppercase;letter-spacing:.02em;line-height:.96}.nm-full .amp{font-size:24px;letter-spacing:.2em;text-transform:lowercase}' +
      '.cover .sub.tp{letter-spacing:.22em;text-transform:uppercase;font-size:12px}.cover.kiri{align-items:flex-start;text-align:left}' +
      '.mono{width:150px;height:150px;border-radius:50%;display:grid;place-items:center;margin:22px auto;border:1px solid var(--emas);outline:1px solid var(--emas);outline-offset:7px;font:400 64px var(--sf);color:var(--ink)}' +
      '.orn{position:absolute;width:150px;height:150px;color:var(--emas);pointer-events:none;z-index:1}.tl{top:0;left:0}.tr{top:0;right:0;transform:scaleX(-1)}.bl{bottom:0;left:0;transform:scaleY(-1)}.br{bottom:0;right:0;transform:scale(-1)}' +
      '.wave{position:absolute;left:0;right:0;bottom:0;height:70px;z-index:1;color:var(--emas);opacity:.5}' +
      '#isi{display:none}#isi.on{display:block}' +
      /* profil, acara, dll */
      '.pf{margin:26px 0}.pf .ph{width:170px;height:210px}.pf h3{font-size:30px;margin:10px 0 4px}.pf .ig{display:inline-block;margin-top:8px;font-size:12px;color:var(--ink)}.amp{font:400 40px var(--sf);color:var(--emas);margin:6px 0}' +
      '.count{display:flex;gap:8px;justify-content:center;margin:18px 0}.count div{background:var(--kartu);border-radius:12px;padding:10px 0;width:66px;border:1px solid color-mix(in srgb,var(--emas) 40%,transparent)}.count b{display:block;font:400 28px var(--hf);color:var(--ink)}.count small{font-size:10px;letter-spacing:.1em}' +
      '.big{font:400 21px var(--hf);color:var(--ink);margin:8px 0}.sesi h3{font-size:26px}.sesi .btn{margin:6px 4px 0}' +
      '.tl-item{text-align:left;border-left:2px solid var(--emas);padding:0 0 22px 18px;position:relative}.tl-item:before{content:"";position:absolute;left:-7px;top:4px;width:12px;height:12px;border-radius:50%;background:var(--aksen)}.tl-item b{font:400 18px var(--hf);color:var(--ink)}' +
      '.gal{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:18px}.gal a{border-radius:calc(var(--r) - 4px);overflow:hidden;aspect-ratio:3/4;display:block}.gal a:first-child:nth-last-child(odd){grid-column:span 2;aspect-ratio:4/3}.gal img{width:100%;height:100%;object-fit:cover;display:block}' +
      '.lb{position:fixed;inset:0;background:rgba(0,0,0,.88);display:none;align-items:center;justify-content:center;z-index:20}.lb.on{display:flex}.lb img{max-width:94vw;max-height:88vh;border-radius:8px}' +
      '.rk{text-align:left}.rk small{display:block;font-size:11px;letter-spacing:.08em;text-transform:uppercase;opacity:.75}.rk b{display:block;font:400 22px var(--hf);color:var(--ink);margin:2px 0 6px;word-break:break-all}' +
      '.dc{display:flex;gap:10px;justify-content:center;margin:14px 0}.dc i{width:36px;height:36px;border-radius:50%;border:2px solid var(--kartu);box-shadow:0 2px 8px rgba(0,0,0,.25)}' +
      '.vi{display:block;width:100%;margin:0 0 10px;padding:13px 15px;font:inherit;font-size:14px;border:1px solid color-mix(in srgb,var(--ink) 30%,transparent);border-radius:10px;background:var(--kartu);color:var(--teks)}' +
      '.rd{display:flex;gap:8px;margin:12px 0}.rd label{flex:1}.rd input{position:absolute;opacity:0}.rd span{display:block;padding:11px 6px;border:1px solid var(--ink);border-radius:10px;cursor:pointer;font-size:13px;color:var(--ink)}.rd input:checked+span{background:var(--ink);color:var(--kartu)}.rd input:focus-visible+span{outline:2px solid var(--aksen);outline-offset:2px}' +
      '@media(max-width:380px){.rd{flex-direction:column}}' +
      '.wl{margin-top:16px;text-align:left}.wc{background:var(--kartu);border-radius:12px;padding:14px 16px;margin-bottom:10px}.wc b{font:400 18px var(--hf);color:var(--ink)}.wc small{opacity:.75;margin-left:6px;font-size:11px}.wc p{margin-top:2px}' +
      '.pg{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-top:6px;font-size:12px}.pg button:disabled{opacity:.4;cursor:default}' +
      '.note{font-size:11px;opacity:.8;padding:0 28px 26px;text-align:center;line-height:1.6;position:relative;z-index:2}' +
      '.fade{opacity:0;transform:translateY(20px);transition:opacity .9s,transform .9s}.fade.in{opacity:1;transform:none}' +
      '#mus{position:fixed;right:14px;bottom:14px;width:44px;height:44px;border-radius:50%;border:0;background:var(--aksen);color:#fff;font-size:18px;display:none;z-index:15;box-shadow:0 4px 14px rgba(0,0,0,.25)}' +
      /* gerak */
      '.fx{position:fixed;top:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;height:100vh;pointer-events:none;overflow:hidden;z-index:1}.fx i{position:absolute;display:block}' +
      '.m-kelopak{width:calc(14px*var(--z));height:calc(10px*var(--z));background:var(--aksen);opacity:.55;border-radius:100% 0 100% 0;animation:jatuh var(--d) linear var(--dl) infinite}' +
      '.m-salju{width:calc(6px*var(--z));height:calc(6px*var(--z));border-radius:50%;background:#fff;opacity:.8;animation:jatuh var(--d) linear var(--dl) infinite}' +
      '.m-konfeti{width:calc(8px*var(--z));height:calc(4px*var(--z));background:hsl(var(--h) 70% 65%);animation:jatuh var(--d) linear var(--dl) infinite}' +
      '.m-gelembung{width:calc(22px*var(--z));height:calc(22px*var(--z));border-radius:50%;border:1px solid var(--emas);top:auto!important;bottom:-40px;animation:naik var(--d) ease-in var(--dl) infinite}' +
      '.m-bintang,.m-kilau{width:calc(10px*var(--z));height:calc(10px*var(--z));background:var(--emas);clip-path:polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%);animation:kedip calc(var(--d)/3) ease-in-out var(--dl) infinite}' +
      '.m-kilau{background:#fff}.m-cahaya{width:calc(70px*var(--z));height:calc(70px*var(--z));border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--emas) 28%,transparent),transparent 70%);opacity:.7;animation:apung var(--d) ease-in-out var(--dl) infinite alternate}' +
      '.m-awan{width:160px;height:50px;border-radius:50px;background:#fff;opacity:.6;filter:blur(2px);animation:geser calc(var(--d)*5) linear var(--dl) infinite}' +
      '@keyframes jatuh{from{transform:translate(0,0) rotate(0)}to{transform:translate(40px,110vh) rotate(540deg)}}@keyframes naik{to{transform:translateY(-115vh)}}@keyframes kedip{0%,100%{opacity:.2;transform:scale(.7)}50%{opacity:1;transform:scale(1.15)}}' +
      '@keyframes apung{to{transform:translate(20px,-30px)}}@keyframes geser{from{transform:translateX(-200px)}to{transform:translateX(560px)}}' +
      '.env{position:absolute;inset:0;z-index:6;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px;background:linear-gradient(180deg,var(--bg1),var(--bg2));transition:transform 1s .6s cubic-bezier(.6,0,.3,1),opacity 1s .6s}.env.open{transform:translateY(105%);opacity:0;pointer-events:none}' +
      '.ev{position:relative;width:300px;height:200px;perspective:900px;filter:drop-shadow(0 16px 26px rgba(0,0,0,.22))}.env .bd{position:absolute;inset:0;border-radius:6px;background:color-mix(in srgb,var(--emas) 30%,var(--kartu))}.env .bd:before{content:"";position:absolute;inset:0;border-radius:6px;background:color-mix(in srgb,var(--emas) 16%,var(--kartu));clip-path:polygon(0 100%,0 30%,50% 64%,100% 30%,100% 100%)}' +
      '.env .fl{position:absolute;left:0;right:0;top:0;height:64%;background:color-mix(in srgb,var(--emas) 46%,var(--kartu));clip-path:polygon(0 0,100% 0,50% 100%);transform-origin:top;transition:transform .7s;z-index:2}.env.open .fl{transform:rotateX(180deg)}' +
      '.env .sl{position:absolute;left:50%;top:64%;transform:translate(-50%,-50%);z-index:3;width:70px;height:70px;border-radius:50%;background:var(--aksen);color:#fff;display:grid;place-items:center;font:400 24px var(--sf);box-shadow:0 4px 12px rgba(0,0,0,.3);border:3px solid color-mix(in srgb,#fff 40%,var(--aksen))}.env .hn{font-size:12px;letter-spacing:.24em;text-transform:uppercase;color:var(--ink)}.env .to{font:400 26px var(--sf);color:var(--ink)}' +
      '.tb{position:fixed;width:12px;height:9px;border-radius:100% 0 100% 0;pointer-events:none;z-index:30;animation:tebar 1.4s ease-out forwards}@keyframes tebar{to{transform:translate(var(--x),var(--y)) rotate(320deg);opacity:0}}.hint{font-size:11px;margin-top:14px;opacity:.85}' +
      '.ix-kartu .fade{opacity:0;transform:perspective(900px) rotateY(-75deg);transform-origin:left center;transition:transform 1s cubic-bezier(.2,.8,.2,1),opacity .8s}.ix-kartu .fade.in{opacity:1;transform:none}' +
      '@media(prefers-reduced-motion:reduce){.fx{display:none}.fade{opacity:1;transform:none;transition:none}}' +
      /* footer standar Velora */
      '.vf{position:relative;z-index:2;padding:34px 24px 40px;text-align:center;background:#6B5560;color:#ECE4E7;font-size:12px;line-height:1.7}.vf-t{font:400 20px var(--hf);color:#fff;margin-bottom:14px}.vf img{display:block;margin:0 auto 10px}.vf b{color:#F2E2C6;font-weight:500}.vf-c{display:inline-block;margin-top:14px;padding:9px 20px;border:1px solid #E3C9A0;border-radius:999px;color:#fff;text-decoration:none}.vf small{display:block;margin-top:12px;color:#F3ECEF;font-size:11px}';
  }

  /* ---------- runtime undangan ---------- */
  function runtime(o) {
    return '<script>\n"use strict";\n' +
      'var SHEET_URL=' + js(o.sheet || '') + ',K=' + js(o.key) + ',T=new Date(' + js(o.target) + '),LAGU_MULAI=' + (o.mulai | 0) + ',LAGU_YOUTUBE=' + js(o.yt || '') + ',UID=' + js(o.uid || '') + ',PER=' + Math.max(1, o.per | 0 || 5) + ',HAL=1,TOT=0,DATA=[];\n' +
      'var q=new URLSearchParams(location.search),to=q.get("to")||q.get("kepada");if(to)document.getElementById("tamu").textContent=to;\n' +
      'function $(i){return document.getElementById(i)}var yt=null;\n' +
      'function ytId(u){var m=u.match(/(?:youtu\\.be\\/|v=|embed\\/)([\\w-]{11})/);return m?m[1]:""}\n' +
      'function lagu(){var id=ytId(LAGU_YOUTUBE);if(id){yt=document.createElement("iframe");yt.allow="autoplay";yt.style.cssText="position:fixed;width:1px;height:1px;opacity:0;border:0";yt.src="https://www.youtube.com/embed/"+id+"?autoplay=1&loop=1&playlist="+id+"&start="+LAGU_MULAI;document.body.appendChild(yt);$("mus").style.display="block";return}\n' +
      ' var a=$("au");if(!a)return;var go=function(){try{a.currentTime=LAGU_MULAI}catch(e){}a.volume=0;a.play().then(function(){var v=0,t=setInterval(function(){v=Math.min(1,v+.05);a.volume=v;if(v>=1)clearInterval(t)},120)}).catch(function(){})};if(a.readyState>0)go();else{a.addEventListener("loadedmetadata",go,{once:true});a.load()}$("mus").style.display="block"}\n' +
      'function buka(){$("isi").classList.add("on");$("isi").scrollIntoView({behavior:"smooth"});var o=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting)x.target.classList.add("in")})},{threshold:.12});document.querySelectorAll(".fade").forEach(function(s){o.observe(s)});lagu()}\n' +
      'document.addEventListener("pointerdown",function(e){if(!document.body.classList.contains("ix-tebar")||e.target.closest("button,a,input,textarea,select,label"))return;var cs=getComputedStyle(document.documentElement),c=[cs.getPropertyValue("--aksen"),cs.getPropertyValue("--emas")];for(var i=0;i<10;i++){var p=document.createElement("i");p.className="tb";var a=Math.random()*6.28,r=60+Math.random()*90;p.style.cssText="left:"+e.clientX+"px;top:"+e.clientY+"px;background:"+c[i%2]+";--x:"+Math.cos(a)*r+"px;--y:"+(Math.sin(a)*r+60)+"px";document.body.appendChild(p);setTimeout(function(x){x.remove()}.bind(null,p),1500)}});\n' +
      'function tg(){if(yt){yt.remove();yt=null;$("mus").style.opacity=.5;return}var a=$("au");if(a){a.paused?a.play():a.pause();$("mus").style.opacity=a.paused?.5:1}}\n' +
      'if($("cd"))setInterval(function(){var d=Math.max(0,T-new Date()),h="";[["Hari",864e5],["Jam",36e5],["Menit",6e4],["Detik",1e3]].forEach(function(x){h+="<div><b>"+Math.floor(d/x[1])%(x[0]=="Hari"?1e6:x[0]=="Jam"?24:60)+"</b><small>"+x[0]+"</small></div>"});$("cd").innerHTML=h},1000);\n' +
      'function cpy(b,t){var ok=function(){var o=b.textContent;b.textContent="Tersalin \\u2713";setTimeout(function(){b.textContent=o},2000)};if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(ok);else{var a=document.createElement("textarea");a.value=t;a.style.cssText="position:fixed;opacity:0";document.body.appendChild(a);a.select();try{document.execCommand("copy");ok()}catch(e){}a.remove()}}\n' +
      'document.querySelectorAll(".gal a").forEach(function(a){a.onclick=function(e){e.preventDefault();$("lbi").src=a.getAttribute("href");$("lb").classList.add("on")}});if($("lb"))$("lb").onclick=function(){this.classList.remove("on")};\n' +
      'function kartu(x){var c=document.createElement("div");c.className="wc";var b=document.createElement("b");b.textContent=x.n;var s=document.createElement("small");s.textContent=(x.h||"")+(x.t?" · "+x.t+" orang":"");b.appendChild(s);var p=document.createElement("p");p.textContent=x.m;c.appendChild(b);c.appendChild(p);return c}\n' +
      'function draw(items,total){var w=$("wl");if(!w)return;w.textContent="";items.forEach(function(x){w.appendChild(kartu(x))});TOT=total;var n=Math.max(1,Math.ceil(total/PER)),pg=$("pg");if(!pg)return;pg.hidden=total<=PER;$("pgi").textContent="Halaman "+HAL+" dari "+n+" · "+total+" ucapan";$("pgp").disabled=HAL<=1;$("pgn").disabled=HAL>=n}\n' +
      'function ld(){if(SHEET_URL){var u=SHEET_URL+(SHEET_URL.indexOf("?")<0?"?":"&")+"id="+encodeURIComponent(UID)+"&page="+HAL+"&size="+PER;fetch(u).then(function(r){return r.json()}).then(function(j){if(Array.isArray(j)){DATA=j;draw(j.slice((HAL-1)*PER,HAL*PER),j.length)}else draw(j.items||[],j.total||0)}).catch(function(){})}\n' +
      ' else{try{DATA=JSON.parse(localStorage.getItem(K)||"[]")}catch(e){DATA=[]}draw(DATA.slice((HAL-1)*PER,HAL*PER),DATA.length)}}\n' +
      'function hal(dx){var n=Math.max(1,Math.ceil(TOT/PER));HAL=Math.min(n,Math.max(1,HAL+dx));ld();var w=$("wl");if(w)w.scrollIntoView({behavior:"smooth",block:"start"})}\n' +
      'var F=$("f");if(F){document.querySelectorAll("input[name=h]").forEach(function(r){r.onchange=function(){$("jt").hidden=r.value!=="Hadir"||!r.checked}});\n' +
      ' F.onsubmit=function(e){e.preventDefault();var n=F.n.value.trim(),m=F.m.value.trim(),st=$("fs");if(!n||m.length<2){st.textContent="Mohon isi nama dan ucapan.";return}var h=(document.querySelector("input[name=h]:checked")||{}).value||"Tidak Konfirmasi",t=h==="Hadir"?$("jt").value:"",d={id:UID,n:n,m:m,h:h,t:t};\n' +
      ' var done=function(){F.m.value="";st.textContent="Terima kasih, ucapan Anda terkirim.";HAL=1;ld()};\n' +
      ' if(SHEET_URL)fetch(SHEET_URL,{method:"POST",headers:{"Content-Type":"text/plain"},body:JSON.stringify(d)}).then(done).catch(function(){st.textContent="Gagal mengirim, periksa koneksi lalu coba lagi."});\n' +
      ' else{try{var a=JSON.parse(localStorage.getItem(K)||"[]");a.unshift(d);localStorage.setItem(K,JSON.stringify(a))}catch(e){}done()}};ld()}\n' +
      '</script>';
  }

  /* ---------- render ---------- */
  function render(d, t, o) {
    o = o || {};
    var on = function (k) { return !d.sembunyi || d.sembunyi.indexOf(k) < 0; };
    var img = o.img || function (k) { return d.foto && d.foto[k]; };
    var mode = d.mode || 'pasangan', w = t.warna, lay = t.layout || 'arch';
    var namaUtama = mode === 'pasangan' ? (d.p1.panggil || d.p1.nama) + ' & ' + (d.p2.panggil || d.p2.nama) : (d.p1.panggil || d.p1.nama);
    var s1 = d.sesi[0] || {};
    var h = [];
    var ph = function (k, cls, alt, pos) { var u = img(k); return u ? '<div class="ph ' + cls + '"><img src="' + esc(u) + '" alt="' + esc(alt) + '" loading="lazy" style="object-position:' + (pos || t.posisiFoto || '50% 30%') + '"></div>' : ''; };

    /* cover */
    var coverImg = o.tanpaFotoSampul ? '' : img('cover'), fullBg = lay === 'full' && coverImg;
    var nmBlok = function () {
      var a = d.p1.panggil || d.p1.nama, b = mode === 'pasangan' ? (d.p2.panggil || d.p2.nama) : '';
      var base = { arch: 54, frame: 44, card: 50, polaroid: 56, split: 76, full: 70 }[lay] || 60, pjg = Math.max(String(a).length, String(b).length);
      var fz = Math.max(28, Math.min(base, Math.floor(base * 7 / Math.max(7, pjg))));
      return '<h1 class="nm nm-' + lay + '" style="--fz:' + fz + 'px"><span class="n">' + esc(a) + '</span>' + (b ? '<span class="amp">' + (lay === 'full' ? 'and' : '&amp;') + '</span><span class="n">' + esc(b) + '</span>' : (d.p1.keterangan ? '<span class="kt">' + esc(d.p1.keterangan) + '</span>' : '')) + '</h1>';
    };
    var kiri = !coverImg && (lay === 'split' || lay === 'full');
    h.push('<section class="cover' + (kiri ? ' kiri' : '') + (fullBg ? ' full' + (t.posisiKartu === 'atas' ? ' kt-atas' : '') + (t.ornamen === 'awan' ? ' ob-awan' : '') : '') + '" id="cover"' + (fullBg ? ' style="background-image:url(\'' + esc(coverImg) + '\');background-position:' + esc(t.posisiFoto || '50% 25%') + '"' : '') + '>' + (t.ornamen === 'gelombang' ? '' : empatSudut(t.ornamen, true)) +
      (fullBg ? '<div class="isi">' : '') +
      '<div class="ey">' + esc(d.judulAcara) + '</div>' +
      (fullBg ? '' : coverImg ? ph('cover', 'ph-' + (lay === 'full' ? 'arch' : lay), namaUtama) : '') +
      (coverImg ? '<h1 class="sk">' + esc(namaUtama) + '</h1><div class="sub">' + esc(tglPanjang(s1.tgl)) + '</div>' : nmBlok() + '<div class="sub tp">' + esc(tglPanjang(s1.tgl)) + '</div>') +
      '<div class="guest">Kepada Yth. Bapak/Ibu/Saudara/i<b id="tamu">Tamu Undangan</b></div><button class="btn" onclick="buka()">Buka Undangan</button>' + (t.interaksi === 'tebar' ? '<div class="hint">Ketuk layar untuk menebar ' + ((t.ornamen === 'bintang' || t.gerak === 'bintang' || t.gerak === 'kilau') ? 'bintang' : 'kelopak') + '</div>' : '') +
      (fullBg ? '</div>' : '') + (t.ornamen === 'gelombang' ? wave() : t.ornamen === 'awan' ? awanBawah() : '') + (t.interaksi === 'amplop' ? '<div class="env" onclick="this.classList.add(\'open\')" role="button" aria-label="Buka amplop"><div class="to">' + esc(namaUtama) + '</div><div class="ev"><div class="bd"></div><div class="fl"></div><div class="sl">' + esc(mode === 'pasangan' ? inisial(d.p1.panggil || d.p1.nama) + inisial(d.p2.panggil || d.p2.nama) : inisial(d.p1.panggil || d.p1.nama)) + '</div></div><div class="hn">Ketuk untuk membuka</div></div>' : '') + '</section>');
    h.push('<div id="isi">');

    /* pembuka */
    if (on('pembuka')) h.push('<section class="alt fade"><div class="ey">' + esc(d.salam || 'Bismillahirrahmanirrahim') + '</div>' + pembatas(t.ornamen) +
      (d.kutipan ? '<p style="font-style:italic">“' + nl(d.kutipan) + '”</p>' + (d.sumber ? '<p style="font-size:12px;margin-top:8px;opacity:.85">' + esc(d.sumber) + '</p>' : '') : '') +
      (on('hitung') ? '<div class="count" id="cd" aria-label="Hitung mundur acara"></div>' : '') + '</section>');

    /* profil */
    if (on('profil')) {
      var prof = function (p, k, ket) {
        return '<div class="pf">' + ph(k, 'ph-' + (lay === 'card' || lay === 'polaroid' ? lay : lay === 'frame' ? 'frame' : 'arch'), p.nama) + '<h3 class="sk">' + esc(p.nama) + '</h3>' +
          (ket ? '<p>' + ket + '</p>' : '') + (p.ig ? '<a class="ig" href="https://instagram.com/' + esc(p.ig.replace(/^@/, '')) + '" target="_blank" rel="noopener">@' + esc(p.ig.replace(/^@/, '')) + '</a>' : '') + '</div>';
      };
      var ortu = function (p) { return p.ayah || p.ibu ? esc((p.status || '') + ' dari') + '<br><b>' + esc(p.ayah) + '</b>' + (p.ayah && p.ibu ? ' &amp; ' : '') + '<b>' + esc(p.ibu) + '</b>' : ''; };
      h.push('<section class="fade' + (t.ornamen !== 'none' && t.ornamen !== 'gelombang' ? ' o' : '') + '">' + empatSudut(t.ornamen, false) + '<div class="ey">' + esc(mode === 'pasangan' ? 'Mempelai' : mode === 'anak' ? 'Buah Hati' : 'Profil') + '</div>' +
        (d.pengantar ? '<p style="margin-top:12px">' + nl(d.pengantar) + '</p>' : '') +
        prof(d.p1, 'p1', mode === 'tunggal' ? esc(d.p1.keterangan || '') : (d.p1.lahir ? 'Lahir ' + esc(tglPendek(d.p1.lahir)) + '<br>' : '') + ortu(d.p1)) +
        (mode === 'pasangan' ? '<div class="amp">&amp;</div>' + prof(d.p2, 'p2', ortu(d.p2)) : '') + '</section>');
    }

    /* acara */
    if (on('acara')) {
      h.push('<section class="alt fade"><div class="ey">Waktu &amp; Tempat</div><h2>' + esc(d.judulBagianAcara || 'Rangkaian Acara') + '</h2>' +
        d.sesi.map(function (s) {
          var mulai = new Date(iso(s)), akhir = s.jam2 ? new Date(s.tgl + 'T' + s.jam2 + ':00' + (OFFSET[s.zona] || '+07:00')) : new Date(mulai.getTime() + 3 * 36e5);
          var f = function (x) { return isNaN(x) ? '' : x.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, ''); };
          var cal = 'https://www.google.com/calendar/render?action=TEMPLATE&text=' + encodeURIComponent(s.nama + ' ' + namaUtama) + '&details=' + encodeURIComponent(d.judulAcara + ' ' + namaUtama) + '&location=' + encodeURIComponent(s.tempat || '') + '&dates=' + f(mulai) + '/' + f(akhir);
          var maps = s.maps || 'https://maps.google.com/?q=' + encodeURIComponent((s.tempat || '').replace(/\s+/g, ' '));
          return '<div class="card sesi"><h3>' + esc(s.nama) + '</h3><div class="big">' + esc(tglPanjang(s.tgl)) + '</div><p>Pukul ' + esc(jam(s.jam)) + (s.jam2 ? ' – ' + esc(jam(s.jam2)) + ' ' + esc(s.zona) : ' ' + esc(s.zona) + ' – selesai') + '</p>' +
            (s.gedung ? '<p><b>' + esc(s.gedung) + '</b></p>' : '') + '<p>' + nl(s.tempat) + '</p><a class="btn o s" href="' + esc(maps) + '" target="_blank" rel="noopener">Buka Peta</a>' +
            (on('kalender') ? '<a class="btn o s" href="' + esc(cal) + '" target="_blank" rel="noopener">Simpan Tanggal</a>' : '') + '</div>';
        }).join('') + '</section>');
    }
    if (on('live') && d.live) h.push('<section class="fade"><div class="ey">Siaran Langsung</div><h2>Live Streaming</h2><p>' + esc(d.liveTeks || 'Bagi keluarga dan sahabat yang berhalangan hadir, acara dapat disaksikan secara virtual.') + '</p><br><a class="btn" href="' + esc(d.live) + '" target="_blank" rel="noopener">Tonton Siaran</a></section>');
    if (on('dress') && (d.dress || (d.dressWarna || []).length)) h.push('<section class="alt fade"><div class="ey">Dresscode</div><h2>Busana</h2><p>' + esc(d.dress) + '</p><div class="dc">' + (d.dressWarna || []).filter(function (c) { return /^#[0-9a-f]{3,8}$/i.test(c); }).map(function (c) { return '<i style="background:' + c + '" title="' + c + '"></i>'; }).join('') + '</div></section>');
    if (on('kisah') && (d.kisah || []).length) h.push('<section class="fade"><div class="ey">Perjalanan</div><h2>' + esc(mode === 'pasangan' ? 'Kisah Kami' : 'Cerita') + '</h2><div style="margin-top:20px">' + d.kisah.map(function (k) { return '<div class="tl-item"><b>' + esc(k.judul) + '</b><p>' + nl(k.isi) + '</p></div>'; }).join('') + '</div></section>');
    var gal = (o.galeri || d.galeri || []);
    if (on('galeri') && gal.length) h.push('<section class="alt fade"><div class="ey">Galeri</div><h2>Momen Bahagia</h2><div class="gal">' + gal.map(function (u) { return '<a href="' + esc(u) + '"><img src="' + esc(u) + '" alt="" loading="lazy"></a>'; }).join('') + '</div></section>');
    var rek = (d.rekening || []).filter(function (r) { return r.no; });
    if (on('kado') && (rek.length || d.alamatKado)) h.push('<section class="fade"><div class="ey">Tanda Kasih</div><h2>Hadiah</h2><p>' + esc(d.kadoTeks || 'Doa restu Anda adalah hadiah terindah bagi kami. Bila ingin memberi tanda kasih, dapat melalui:') + '</p>' +
      rek.map(function (r) { return '<div class="card rk"><small>' + esc(r.bank || 'Rekening') + '</small><b>' + esc(r.no) + '</b><small>Atas nama</small><p style="margin-bottom:10px">' + esc(r.an) + '</p><button class="btn o s" type="button" onclick="cpy(this,' + esc(js(r.no)) + ')">Salin</button></div>'; }).join('') +
      (d.alamatKado ? '<div class="card rk"><small>Alamat kado</small><p style="margin:6px 0 10px">' + nl(d.alamatKado) + '</p><button class="btn o s" type="button" onclick="cpy(this,' + esc(js(d.alamatKado)) + ')">Salin</button></div>' : '') + '</section>');
    if (on('ucapan')) h.push('<section class="alt fade"><div class="ey">Doa &amp; Ucapan</div><h2>Ucapan &amp; Kehadiran</h2><p>Berikan doa dan ucapan terbaik Anda.</p><br>' +
      '<form id="f" novalidate><input class="vi" id="n" name="n" placeholder="Nama" maxlength="60" aria-label="Nama"><textarea class="vi" id="m" name="m" rows="3" placeholder="Ucapan" maxlength="500" aria-label="Ucapan"></textarea>' +
      '<div class="rd" role="radiogroup" aria-label="Konfirmasi kehadiran"><label><input type="radio" name="h" value="Hadir"><span>Hadir</span></label><label><input type="radio" name="h" value="Tidak Hadir"><span>Tidak Hadir</span></label><label><input type="radio" name="h" value="Ragu"><span>Masih Ragu</span></label></div>' +
      '<select class="vi" id="jt" hidden aria-label="Jumlah tamu"><option value="1">1 orang</option><option value="2">2 orang</option><option value="3">3 orang</option><option value="4">4 orang</option><option value="5">5 orang</option></select>' +
      '<button class="btn" style="width:100%">Kirim</button><p id="fs" role="status" style="font-size:12px;margin-top:8px"></p></form><div class="wl" id="wl"></div><div class="pg" id="pg" hidden><button type="button" class="btn o s" id="pgp" onclick="hal(-1)">‹ Sebelumnya</button><span id="pgi" role="status"></span><button type="button" class="btn o s" id="pgn" onclick="hal(1)">Berikutnya ›</button></div></section>');
    if (on('penutup')) h.push('<section class="fade' + (t.ornamen !== 'none' && t.ornamen !== 'gelombang' ? ' o ob' : ' ob') + '">' + (t.ornamen === 'gelombang' ? '' : empatSudut(t.ornamen, true)) + pembatas(t.ornamen) + '<h2>Terima Kasih</h2><p>' + nl(d.penutup || 'Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.') + '</p><p style="margin-top:16px">Kami yang berbahagia,</p><h3 class="sk" style="font-size:30px;margin-top:6px">' + esc(d.tuanRumah || namaUtama) + '</h3>' + (t.ornamen === 'gelombang' ? wave() : '') + '</section>');
    if (on('catatan')) h.push('<div class="note">Mohon maaf apabila terdapat kesalahan dalam penulisan nama atau gelar.</div>');
    h.push('<footer class="vf"><div class="vf-t">Terima kasih atas doa dan kehadiran Anda.</div><img src="img/velora-logo-white.svg" alt="Velora" height="38"><div>Undangan digital oleh <b>Velora Digital Invitation</b><br><i>Kabar Bahagia, Terukir Indah</i></div><a class="vf-c" href="' + esc(o.situs || 'https://isvarya27.github.io/velora-generator/') + '" target="_blank" rel="noopener">Buat undangan Anda di Velora</a>' + (o.kredit ? '<small>' + esc(o.kredit) + '</small>' : '') + '</footer>');
    h.push('</div>');

    var head = '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(d.judulAcara + ' ' + namaUtama) + '</title>' + (o.og || '') +
      '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 64 64%27%3E%3Crect width=%2764%27 height=%2764%27 rx=%2714%27 fill=%27%236B5560%27/%3E%3Ctext x=%2732%27 y=%2742%27 font-size=%2728%27 text-anchor=%27middle%27 fill=%27%23fff%27 font-family=%27serif%27%3EVL%3C/text%3E%3C/svg%3E"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="' + w.bg1 + '"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="' + fontLink(t.font) + '" rel="stylesheet"><style>' + css(t) + '</style></head><body class="' + (t.gelap ? 'gelap ' : '') + 'ix-' + (t.interaksi || 'none') + '"><div class="wrap">' + gerak(t.gerak, t.id);
    var tail = '</div><div class="lb" id="lb"><img id="lbi" alt=""></div><button id="mus" onclick="tg()" aria-label="Putar atau jeda musik">&#9835;</button>' + (o.audio ? '<audio id="au" src="' + esc(o.audio) + '" loop preload="none"></audio>' : '') +
      runtime({ uid: d.uuid, per: d.perHalaman || t.ucapanPerHalaman || 5, sheet: d.sheet, key: 'ucapan-' + (o.kunci || '') + String(namaUtama).toLowerCase().replace(/[^a-z0-9]+/g, '-'), target: iso(s1), mulai: d.mulai, yt: o.yt }) + '</body></html>';
    return head + h.join('\n') + tail;
  }
  function awanBawah() {
    var c = function (x, s) { return '<g transform="translate(' + x + ' 30) scale(' + s + ')"><g fill="currentColor" opacity=".45" transform="translate(0 6)"><circle cx="20" cy="22" r="16"/><circle cx="44" cy="14" r="20"/><circle cx="68" cy="24" r="14"/><rect x="10" y="22" width="70" height="40"/></g><g fill="#fff"><circle cx="20" cy="22" r="16"/><circle cx="44" cy="14" r="20"/><circle cx="68" cy="24" r="14"/><rect x="10" y="22" width="70" height="40"/></g></g>'; };
    return '<svg class="wave" style="height:110px;opacity:1" viewBox="0 0 480 110" preserveAspectRatio="none" aria-hidden="true">' + c(-30, 1.6) + c(90, 1.2) + c(190, 1.7) + c(330, 1.3) + c(400, 1.5) + '<rect y="90" width="480" height="20" fill="#fff"/></svg>';
  }
  function wave() { return '<svg class="wave" viewBox="0 0 480 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40C80 10 160 70 240 40S400 10 480 40V70H0Z" fill="currentColor"/><path d="M0 52C90 30 170 74 260 50S410 30 480 52V70H0Z" fill="currentColor" opacity=".6"/></svg>'; }

  g.VeloraEngine = { render: render, tglPanjang: tglPanjang, esc: esc };
})(typeof window !== 'undefined' ? window : globalThis);
