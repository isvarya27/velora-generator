// Render semua tema di themes/themes.json menjadi halaman demo katalog/<id>/index.html (versi Tanpa Foto, data contoh).
import fs from 'fs'; import vm from 'vm'; import path from 'path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const ctx = { globalThis: {} }; vm.createContext(ctx); vm.runInContext(fs.readFileSync(root + '/engine.js', 'utf8'), ctx);
const E = ctx.globalThis.VeloraEngine;
const themes = JSON.parse(fs.readFileSync(root + '/themes/themes.json', 'utf8'));
let FOTO = {}; try { FOTO = JSON.parse(fs.readFileSync(root + '/themes/foto-demo.json', 'utf8')); } catch (e) {}
const lagu = JSON.parse(fs.readFileSync(root + '/musik/lagu.json', 'utf8')), suasana = JSON.parse(fs.readFileSync(root + '/musik/suasana.json', 'utf8'));
const sesi = (n, t, j, j2) => ({ nama: n, tgl: t, jam: j, jam2: j2, zona: 'WIB', gedung: 'Gedung Velora Indah', tempat: 'Jl. Velora Indah No. 21, Jakarta' });
const contoh = {
  pasangan: { mode: 'pasangan', judulAcara: 'The Wedding of', salam: 'Bismillahirrahmanirrahim',
    kutipan: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan pasangan untukmu dari jenismu sendiri, agar kamu merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.', sumber: 'QS. Ar-Rum: 21',
    pengantar: 'Dengan memohon rahmat Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami:',
    p1: { nama: 'Vela Ananda', panggil: 'Vela', status: 'Putri pertama', ayah: 'Bapak Arif', ibu: 'Ibu Sari', ig: 'vela.contoh' },
    p2: { nama: 'Loka Pratama', panggil: 'Loka', status: 'Putra kedua', ayah: 'Bapak Budi', ibu: 'Ibu Rina', ig: 'loka.contoh' },
    sesi: [sesi('Akad Nikah', '2027-06-12', '08:00', '10:00'), sesi('Resepsi', '2027-06-12', '11:00', '14:00')],
    live: 'https://youtube.com/', dress: 'Nuansa lembut senada tema', dressWarna: ['#E8D5C4', '#C9A27A', '#6B5560'],
    kisah: [{ judul: '2023 · Pertemuan', isi: 'Kami bertemu di sebuah acara kampus.' }, { judul: '2025 · Lamaran', isi: 'Dua keluarga bertemu dan merestui.' }],
    rekening: [{ bank: 'Bank Contoh', no: '1234567890', an: 'Vela Ananda' }], alamatKado: 'Jl. Velora Indah No. 21, Jakarta' },
  anak: { mode: 'anak', judulAcara: 'Tasyakuran Aqiqah', salam: 'Bismillahirrahmanirrahim', kutipan: 'Setiap anak tergadai dengan aqiqahnya.', sumber: 'HR. Abu Dawud, At-Tirmidzi',
    pengantar: 'Dengan rasa syukur, kami mengundang Bapak/Ibu/Saudara/i untuk mendoakan buah hati kami:',
    p1: { nama: 'Nadira Velora Putri', panggil: 'Nadira', lahir: '2027-03-01', status: 'Putri pertama', ayah: 'Bapak Arif', ibu: 'Ibu Sari' }, p2: {},
    sesi: [sesi('Acara Aqiqah', '2027-04-11', '10:00', '')], rekening: [{ bank: 'Bank Contoh', no: '1234567890', an: 'Arif' }] },
  tunggal: { mode: 'tunggal', judulAcara: 'Undangan Ulang Tahun', salam: 'Hai, teman-teman!', pengantar: 'Ayo rayakan hari spesial bersama!',
    p1: { nama: 'Raka Velora', panggil: 'Raka', keterangan: 'Ulang tahun ke-7' }, p2: {}, sesi: [sesi('Pesta Ulang Tahun', '2027-05-02', '15:00', '18:00')] }
};
const modeDari = a => ['aqiqah', 'khitan'].includes(a) ? 'anak' : ['ultah-anak', 'ultah', 'wisuda', 'formal'].includes(a) ? 'tunggal' : 'pasangan';
for (const t of themes) {
  const a = t.acara[0], d = JSON.parse(JSON.stringify(contoh[modeDari(a)]));
  if (a === 'wisuda') { d.judulAcara = 'Syukuran Wisuda'; d.salam = 'Assalamu\'alaikum'; d.pengantar = 'Dengan rasa syukur, kami mengundang Anda pada syukuran kelulusan:'; d.p1 = { nama: 'Raka Velora, S.T.', panggil: 'Raka', keterangan: 'Wisuda Sarjana Teknik' }; d.sesi[0].nama = 'Syukuran Wisuda'; }
  if (a === 'formal') { d.judulAcara = 'Undangan Resmi'; d.salam = 'Dengan hormat,'; d.pengantar = 'Kami mengundang Bapak/Ibu untuk menghadiri acara:'; d.p1 = { nama: 'Peluncuran Program Velora', panggil: 'Velora Fest', keterangan: 'Peluncuran Program 2027' }; d.sesi[0].nama = 'Acara Utama'; }
  if (a === 'khitan') { d.judulAcara = 'Tasyakuran Khitan'; d.kutipan = ''; d.p1 = { nama: 'Raka Velora Putra', panggil: 'Raka', status: 'Putra pertama', ayah: 'Bapak Arif', ibu: 'Ibu Sari' }; d.sesi[0].nama = 'Acara Khitanan'; }
  const id = (suasana[t.musik] || [])[0] || (suasana.lembut || [])[0], l = lagu.find(x => x.id === id);
  const html = E.render(d, t, { audio: l ? '../../' + l.file : '', kredit: l ? 'Musik: ' + l.judul + ' oleh ' + l.artis + ' (incompetech.com), CC BY 4.0' : '', situs: '../../', kunci: t.id + '-' })
    .replace('src="img/velora-logo-white.svg"', 'src="../../img/velora-logo-white.svg"');
  fs.mkdirSync(root + '/katalog/' + t.id, { recursive: true }); fs.writeFileSync(root + '/katalog/' + t.id + '/index.html', html);
  // versi Pakai Foto (bila ada pilihan foto dari designer)
  const fd = FOTO[t.id];
  if (fd) {
    const f = n => '../../../demo-foto/f' + n + '.jpg';
    const map = { cover: f(fd.cover), p1: f(fd.p1), p2: f(fd.p2) };
    const t2 = Object.assign({}, t, { posisiFoto: fd.posisi, posisiKartu: fd.kartu });
    const h2 = E.render(d, t2, { img: k => map[k] || '', galeri: (fd.galeri || []).map(f), audio: l ? '../../../' + l.file : '', kredit: l ? 'Musik: ' + l.judul + ' oleh ' + l.artis + ' (incompetech.com), CC BY 4.0' : '', situs: '../../../', kunci: t.id + '-foto-' })
      .replace('src="img/velora-logo-white.svg"', 'src="../../../img/velora-logo-white.svg"');
    fs.mkdirSync(root + '/katalog/' + t.id + '/foto', { recursive: true }); fs.writeFileSync(root + '/katalog/' + t.id + '/foto/index.html', h2);
  }
  console.log(t.id, html.length);
}
