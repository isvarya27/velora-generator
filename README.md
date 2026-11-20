# Velora Studio Undangan

Alat internal tim Velora, murni di browser. Isi data klien, pilih acara dan tema, lihat pratinjau, lalu unduh paket .zip siap hosting.

- `index.html` + `studio.js`: Studio multi-acara (pernikahan, lamaran, aqiqah, khitan, ultah anak, ultah, wisuda, formal).
- `engine.js`: mesin tema, merender undangan dari token tema (warna, font, layout, ornamen, gerak). Format tema: `docs/themes/SCHEMA.md` di repo utama.
- `themes/themes.json`: katalog tema. Cek kontras: `python3 themes/cek_kontras.py themes/themes.json`.
- `katalog.html` + `katalog/<id>/`: halaman contoh tiap tema. Render ulang: `node tools/render_katalog.mjs`.
- `link.html`: pembuat link per tamu. `aqiqah-lama.html`: generator aqiqah versi pertama.
- Musik: pustaka CC BY 4.0 (Kevin MacLeod), atribusi otomatis di footer. `musik/suasana.json` memetakan suasana tema ke lagu.
- Setiap bagian undangan bisa disembunyikan (permintaan klien) lewat centang di Studio.
- Semua tema orisinal (SVG/CSS buatan sendiri, Google Fonts). Template Luxee tidak boleh dipakai di sini (lisensi).

Jalankan lokal: `python3 -m http.server 8080` lalu buka http://localhost:8080
