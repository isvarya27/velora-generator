// Velora — pusat ucapan untuk SEMUA pesanan (satu Google Sheet).
// Tiap ucapan disimpan dengan UUID pesanan, sehingga data tiap klien terpisah.
// Pasang: buat Google Sheet "Velora Ucapan" > Ekstensi > Apps Script > tempel kode ini > Simpan >
// Deploy > Deployment baru > Aplikasi web > Jalankan sebagai: Saya > Akses: Siapa saja > Deploy > salin URL ke Studio.
//
// GET  ?id=<uuid>&page=1&size=5   -> {"total":n,"page":1,"size":5,"items":[{n,m,h,t,w}]}  (terbaru dulu)
// GET  ?id=<uuid>&ringkas=1        -> {"total":n,"hadir":x,"tidak":y,"ragu":z,"tamu":jumlah}
// POST body JSON {id,n,m,h,t}      -> {"ok":true}

var SHEET = 'Ucapan';
var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function sh_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (s.getLastRow() === 0) { s.appendRow(['Waktu', 'UUID Pesanan', 'Nama', 'Ucapan', 'Kehadiran', 'Jumlah Tamu']); s.setFrozenRows(1); }
  return s;
}
function out_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function rows_(id) {
  var v = sh_().getDataRange().getValues().slice(1);
  return v.filter(function (r) { return String(r[1]) === id; }).reverse();
}
function doGet(e) {
  var p = (e && e.parameter) || {}, id = String(p.id || '');
  if (!UUID_RE.test(id)) return out_({ error: 'id tidak valid', total: 0, items: [] });
  var r = rows_(id);
  if (p.ringkas) {
    var o = { total: r.length, hadir: 0, tidak: 0, ragu: 0, tamu: 0 };
    r.forEach(function (x) { if (x[4] === 'Hadir') { o.hadir++; o.tamu += Number(x[5]) || 1; } else if (x[4] === 'Tidak Hadir') o.tidak++; else o.ragu++; });
    return out_(o);
  }
  var size = Math.min(50, Math.max(1, parseInt(p.size, 10) || 5)), page = Math.max(1, parseInt(p.page, 10) || 1);
  var items = r.slice((page - 1) * size, page * size).map(function (x) {
    return { w: x[0] instanceof Date ? x[0].toISOString() : String(x[0]), n: x[2], m: x[3], h: x[4], t: x[5] };
  });
  return out_({ total: r.length, page: page, size: size, items: items });
}
function doPost(e) {
  var d = {};
  try { d = JSON.parse(e.postData.contents); } catch (x) { return out_({ ok: false, error: 'format' }); }
  var id = String(d.id || '');
  var n = String(d.n || '').slice(0, 60), m = String(d.m || '').slice(0, 500);
  var h = ['Hadir', 'Tidak Hadir', 'Ragu', 'Tidak Konfirmasi'].indexOf(d.h) > -1 ? d.h : 'Tidak Konfirmasi';
  var t = h === 'Hadir' ? Math.min(10, Math.max(1, parseInt(d.t, 10) || 1)) : '';
  if (!UUID_RE.test(id) || !n || m.length < 2) return out_({ ok: false, error: 'data tidak lengkap' });
  var lock = LockService.getScriptLock(); lock.waitLock(5000);
  try { sh_().appendRow([new Date(), id, n, m, h, t]); } finally { lock.releaseLock(); }
  return out_({ ok: true });
}
