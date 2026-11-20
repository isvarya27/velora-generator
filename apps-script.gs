// Google Apps Script — simpan & tampilkan ucapan undangan dari Google Sheet.
// Pasang: Sheet > Ekstensi > Apps Script > tempel semua kode ini > Deploy > Deployment baru
// > Jenis: Aplikasi web > Jalankan sebagai: Saya > Akses: Siapa saja > Deploy > salin URL.
var SHEET = 'Ucapan';
function sh_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s = ss.getSheetByName(SHEET) || ss.insertSheet(SHEET);
  if (s.getLastRow() === 0) s.appendRow(['Waktu', 'Nama', 'Ucapan', 'Kehadiran']);
  return s;
}
function doPost(e) {
  var d = JSON.parse(e.postData.contents);
  var n = String(d.n || '').slice(0, 60), m = String(d.m || '').slice(0, 500), h = String(d.h || '').slice(0, 20);
  if (n && m) sh_().appendRow([new Date(), n, m, h]);
  return ContentService.createTextOutput('ok');
}
function doGet() {
  var s = sh_(), v = s.getDataRange().getValues().slice(1).reverse().slice(0, 100);
  var out = v.map(function (r) { return { n: r[1], m: r[2], h: r[3] }; });
  return ContentService.createTextOutput(JSON.stringify(out)).setMimeType(ContentService.MimeType.JSON);
}
