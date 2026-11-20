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
      '.cover.full{justify-content:flex-end;background-size:cover;background-position:center 30%}.cover.full .isi{background:color-mix(in srgb,var(--bg1) 88%,transparent);backdrop-filter:blur(4px);border-radius:var(--r);padding:22px 18px;width:100%}' +
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
      '@media(prefers-reduced-motion:reduce){.fx{display:none}.fade{opacity:1;transform:none;transition:none}}' +
      /* footer standar Velora */
      '.vf{position:relative;z-index:2;padding:34px 24px 40px;text-align:center;background:#6B5560;color:#ECE4E7;font-size:12px;line-height:1.7}.vf-t{font:400 20px var(--hf);color:#fff;margin-bottom:14px}.vf img{display:block;margin:0 auto 10px}.vf b{color:#E3C9A0;font-weight:500}.vf-c{display:inline-block;margin-top:14px;padding:9px 20px;border:1px solid #E3C9A0;border-radius:999px;color:#fff;text-decoration:none}.vf small{display:block;margin-top:12px;opacity:.8;font-size:11px}';
  }

  /* ---------- runtime undangan ---------- */
  function runtime(o) {
    return '<script>\n"use strict";\n' +
      'var SHEET_URL=' + js(o.sheet || '') + ',K=' + js(o.key) + ',T=new Date(' + js(o.target) + '),LAGU_MULAI=' + (o.mulai | 0) + ',LAGU_YOUTUBE=' + js(o.yt || '') + ';\n' +
      'var q=new URLSearchParams(location.search),to=q.get("to")||q.get("kepada");if(to)document.getElementById("tamu").textContent=to;\n' +
      'function $(i){return document.getElementById(i)}var yt=null;\n' +
      'function ytId(u){var m=u.match(/(?:youtu\\.be\\/|v=|embed\\/)([\\w-]{11})/);return m?m[1]:""}\n' +
      'function lagu(){var id=ytId(LAGU_YOUTUBE);if(id){yt=document.createElement("iframe");yt.allow="autoplay";yt.style.cssText="position:fixed;width:1px;height:1px;opacity:0;border:0";yt.src="https://www.youtube.com/embed/"+id+"?autoplay=1&loop=1&playlist="+id+"&start="+LAGU_MULAI;document.body.appendChild(yt);$("mus").style.display="block";return}\n' +
      ' var a=$("au");if(!a)return;var go=function(){try{a.currentTime=LAGU_MULAI}catch(e){}a.volume=0;a.play().then(function(){var v=0,t=setInterval(function(){v=Math.min(1,v+.05);a.volume=v;if(v>=1)clearInterval(t)},120)}).catch(function(){})};if(a.readyState>0)go();else{a.addEventListener("loadedmetadata",go,{once:true});a.load()}$("mus").style.display="block"}\n' +
      'function buka(){$("isi").classList.add("on");$("isi").scrollIntoView({behavior:"smooth"});var o=new IntersectionObserver(function(e){e.forEach(function(x){if(x.isIntersecting)x.target.classList.add("in")})},{threshold:.12});document.querySelectorAll(".fade").forEach(function(s){o.observe(s)});lagu()}\n' +
      'function tg(){if(yt){yt.remove();yt=null;$("mus").style.opacity=.5;return}var a=$("au");if(a){a.paused?a.play():a.pause();$("mus").style.opacity=a.paused?.5:1}}\n' +
      'if($("cd"))setInterval(function(){var d=Math.max(0,T-new Date()),h="";[["Hari",864e5],["Jam",36e5],["Menit",6e4],["Detik",1e3]].forEach(function(x){h+="<div><b>"+Math.floor(d/x[1])%(x[0]=="Hari"?1e6:x[0]=="Jam"?24:60)+"</b><small>"+x[0]+"</small></div>"});$("cd").innerHTML=h},1000);\n' +
      'function cpy(b,t){var ok=function(){var o=b.textContent;b.textContent="Tersalin \\u2713";setTimeout(function(){b.textContent=o},2000)};if(navigator.clipboard&&window.isSecureContext)navigator.clipboard.writeText(t).then(ok);else{var a=document.createElement("textarea");a.value=t;a.style.cssText="position:fixed;opacity:0";document.body.appendChild(a);a.select();try{document.execCommand("copy");ok()}catch(e){}a.remove()}}\n' +
      'document.querySelectorAll(".gal a").forEach(function(a){a.onclick=function(e){e.preventDefault();$("lbi").src=a.getAttribute("href");$("lb").classList.add("on")}});if($("lb"))$("lb").onclick=function(){this.classList.remove("on")};\n' +
      'function draw(a){var w=$("wl");if(!w)return;w.textContent="";a.forEach(function(x){var c=document.createElement("div");c.className="wc";var b=document.createElement("b");b.textContent=x.n;var s=document.createElement("small");s.textContent=(x.h||"")+(x.t?" \\u00b7 "+x.t+" orang":"");b.appendChild(s);var p=document.createElement("p");p.textContent=x.m;c.appendChild(b);c.appendChild(p);w.appendChild(c)})}\n' +
      'function ld(){if(SHEET_URL)fetch(SHEET_URL).then(function(r){return r.json()}).then(draw).catch(function(){});else{try{draw(JSON.parse(localStorage.getItem(K)||"[]"))}catch(e){}}}\n' +
      'var F=$("f");if(F){document.querySelectorAll("input[name=h]").forEach(function(r){r.onchange=function(){$("jt").hidden=r.value!=="Hadir"||!r.checked}});\n' +
      ' F.onsubmit=function(e){e.preventDefault();var n=F.n.value.trim(),m=F.m.value.trim(),st=$("fs");if(!n||m.length<2){st.textContent="Mohon isi nama dan ucapan.";return}var h=(document.querySelector("input[name=h]:checked")||{}).value||"Tidak Konfirmasi",t=h==="Hadir"?$("jt").value:"",d={n:n,m:m,h:h,t:t};\n' +
      ' var done=function(){F.m.value="";st.textContent="Terima kasih, ucapan Anda terkirim.";ld()};\n' +
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
    var ph = function (k, cls, alt, pos) { var u = img(k); return u ? '<div class="ph ' + cls + '"><img src="' + esc(u) + '" alt="' + esc(alt) + '" loading="lazy" style="object-position:' + (pos || '50% 30%') + '"></div>' : ''; };

    /* cover */
    var coverImg = img('cover'), fullBg = lay === 'full' && coverImg;
    h.push('<section class="cover' + (fullBg ? ' full' : '') + '" id="cover"' + (fullBg ? ' style="background-image:url(\'' + esc(coverImg) + '\')"' : '') + '>' + (t.ornamen === 'gelombang' ? '' : empatSudut(t.ornamen, true)) +
      (fullBg ? '<div class="isi">' : '') +
      '<div class="ey">' + esc(d.judulAcara) + '</div>' +
      (fullBg ? '' : coverImg ? ph('cover', 'ph-' + (lay === 'full' ? 'arch' : lay), namaUtama) : '<div class="mono">' + esc(mode === 'pasangan' ? inisial(d.p1.panggil || d.p1.nama) + '&' + inisial(d.p2.panggil || d.p2.nama) : inisial(d.p1.panggil || d.p1.nama)) + '</div>') +
      '<h1 class="sk">' + esc(namaUtama) + '</h1><div class="sub">' + esc(tglPanjang(s1.tgl)) + '</div>' +
      '<div class="guest">Kepada Yth. Bapak/Ibu/Saudara/i<b id="tamu">Tamu Undangan</b></div><button class="btn" onclick="buka()">Buka Undangan</button>' +
      (fullBg ? '</div>' : '') + (t.ornamen === 'gelombang' ? wave() : t.ornamen === 'awan' ? awanBawah() : '') + '</section>');
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
      '<button class="btn" style="width:100%">Kirim</button><p id="fs" role="status" style="font-size:12px;margin-top:8px"></p></form><div class="wl" id="wl"></div></section>');
    if (on('penutup')) h.push('<section class="fade' + (t.ornamen !== 'none' && t.ornamen !== 'gelombang' ? ' o ob' : ' ob') + '">' + (t.ornamen === 'gelombang' ? '' : empatSudut(t.ornamen, true)) + pembatas(t.ornamen) + '<h2>Terima Kasih</h2><p>' + nl(d.penutup || 'Merupakan suatu kebahagiaan dan kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.') + '</p><p style="margin-top:16px">Kami yang berbahagia,</p><h3 class="sk" style="font-size:30px;margin-top:6px">' + esc(d.tuanRumah || namaUtama) + '</h3>' + (t.ornamen === 'gelombang' ? wave() : '') + '</section>');
    if (on('catatan')) h.push('<div class="note">Mohon maaf apabila terdapat kesalahan dalam penulisan nama atau gelar.</div>');
    h.push('<footer class="vf"><div class="vf-t">Terima kasih atas doa dan kehadiran Anda.</div><img src="img/velora-logo-white.svg" alt="Velora" height="38"><div>Undangan digital oleh <b>Velora Digital Invitation</b><br><i>Kabar Bahagia, Terukir Indah</i></div><a class="vf-c" href="' + esc(o.situs || 'https://isvarya27.github.io/velora-generator/') + '" target="_blank" rel="noopener">Buat undangan Anda di Velora</a>' + (o.kredit ? '<small>' + esc(o.kredit) + '</small>' : '') + '</footer>');
    h.push('</div>');

    var head = '<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(d.judulAcara + ' ' + namaUtama) + '</title>' + (o.og || '') +
      '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 64 64%27%3E%3Crect width=%2764%27 height=%2764%27 rx=%2714%27 fill=%27%236B5560%27/%3E%3Ctext x=%2732%27 y=%2742%27 font-size=%2728%27 text-anchor=%27middle%27 fill=%27%23fff%27 font-family=%27serif%27%3EVL%3C/text%3E%3C/svg%3E"><meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="' + w.bg1 + '"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="' + fontLink(t.font) + '" rel="stylesheet"><style>' + css(t) + '</style></head><body' + (t.gelap ? ' class="gelap"' : '') + '><div class="wrap">' + gerak(t.gerak, t.id);
    var tail = '</div><div class="lb" id="lb"><img id="lbi" alt=""></div><button id="mus" onclick="tg()" aria-label="Putar atau jeda musik">&#9835;</button>' + (o.audio ? '<audio id="au" src="' + esc(o.audio) + '" loop preload="none"></audio>' : '') +
      runtime({ sheet: d.sheet, key: 'ucapan-' + (o.kunci || '') + String(namaUtama).toLowerCase().replace(/[^a-z0-9]+/g, '-'), target: iso(s1), mulai: d.mulai, yt: o.yt }) + '</body></html>';
    return head + h.join('\n') + tail;
  }
  function awanBawah() {
    var c = function (x, s) { return '<g transform="translate(' + x + ' 30) scale(' + s + ')"><g fill="currentColor" opacity=".45" transform="translate(0 6)"><circle cx="20" cy="22" r="16"/><circle cx="44" cy="14" r="20"/><circle cx="68" cy="24" r="14"/><rect x="10" y="22" width="70" height="40"/></g><g fill="#fff"><circle cx="20" cy="22" r="16"/><circle cx="44" cy="14" r="20"/><circle cx="68" cy="24" r="14"/><rect x="10" y="22" width="70" height="40"/></g></g>'; };
    return '<svg class="wave" style="height:110px;opacity:1" viewBox="0 0 480 110" preserveAspectRatio="none" aria-hidden="true">' + c(-30, 1.6) + c(90, 1.2) + c(190, 1.7) + c(330, 1.3) + c(400, 1.5) + '<rect y="90" width="480" height="20" fill="#fff"/></svg>';
  }
  function wave() { return '<svg class="wave" viewBox="0 0 480 70" preserveAspectRatio="none" aria-hidden="true"><path d="M0 40C80 10 160 70 240 40S400 10 480 40V70H0Z" fill="currentColor"/><path d="M0 52C90 30 170 74 260 50S410 30 480 52V70H0Z" fill="currentColor" opacity=".6"/></svg>'; }

  g.VeloraEngine = { render: render, tglPanjang: tglPanjang, esc: esc };
})(typeof window !== 'undefined' ? window : globalThis);
