# PRD: Aplikasi Pencatatan Keuangan Pribadi

**Versi:** 1.0
**Status:** Draft
**Platform target:** Android (MVP)

---

## 1. Latar Belakang & Masalah

Aplikasi pencatatan keuangan yang ada saat ini umumnya mengunci fitur-fitur bernilai tinggi (kategorisasi otomatis, OCR struk, integrasi bank) di balik paywall berlangganan. Bagi individu (mahasiswa & karyawan) yang justru paling butuh kontrol keuangan, biaya langganan ini jadi penghalang.

**Pernyataan masalah:** User butuh cara mencatat pengeluaran/pemasukan yang cepat, akurat, dan aman — tanpa harus membayar langganan untuk fitur-fitur dasar yang seharusnya jadi standar.

---

## 2. Tujuan Produk

1. Menyediakan pencatatan keuangan yang **100% gratis**, termasuk fitur AI, tanpa biaya recurring ke pihak ketiga.
2. Menghilangkan friksi input manual lewat **OCR struk** dan **integrasi bank/e-wallet otomatis**.
3. Menjamin **keamanan & privasi data** sebagai standar wajib, bukan fitur tambahan.

### Non-tujuan (Out of Scope untuk MVP)
- Prediksi/rekomendasi keuangan otomatis berbasis AI (sengaja dikecualikan)
- Fitur kolaborasi multi-user/keluarga
- Platform iOS/Web (menyusul setelah Android stabil)
- Dukungan bank/e-wallet di luar daftar prioritas awal

---

## 3. Target Pengguna & Persona

**Persona utama:** Individu (mahasiswa/karyawan), pengguna Android, mid-range device, sensitif terhadap biaya berlangganan, ingin kontrol keuangan pribadi tanpa ribet.

---

## 4. User Stories

| ID | Sebagai... | Saya ingin... | Supaya... |
|---|---|---|---|
| US-01 | Pengguna | mencatat transaksi manual (income/expense) dengan kategori | pengeluaran saya tercatat rapi |
| US-02 | Pengguna | memfoto struk belanja | transaksi otomatis tercatat tanpa input manual |
| US-03 | Pengguna | menghubungkan akun bank/e-wallet saya | transaksi tersinkron otomatis |
| US-04 | Pengguna | mengunci app dengan sidik jari/Face ID | data keuangan saya tetap privat |
| US-05 | Pengguna | mengatur limit anggaran per kategori | mendapat alert saat mendekati/melebihi limit |
| US-06 | Pengguna | melihat grafik tren pengeluaran bulanan | memahami pola keuangan saya |
| US-07 | Pengguna | mengekspor atau menghapus semua data saya | saya punya kontrol penuh atas data pribadi |

---

## 5. Functional Requirements

### 5.1 Pencatatan Transaksi
- FR-1.1: User dapat menambah transaksi manual (nominal, tanggal, kategori, catatan, income/expense)
- FR-1.2: User dapat mengedit/menghapus transaksi
- FR-1.3: User dapat membuat/mengelola kategori custom

### 5.2 OCR Scan Struk
- FR-2.1: User dapat mengambil foto atau upload gambar struk
- FR-2.2: Sistem mengekstrak nominal, tanggal, dan nama merchant dari struk secara otomatis
- FR-2.3: Sistem menyarankan kategori berdasarkan hasil OCR
- FR-2.4: User dapat mengoreksi hasil OCR sebelum disimpan

### 5.3 Integrasi Bank & E-Wallet
- FR-3.1: User dapat menghubungkan akun (prioritas: BCA, BRI, GoPay, OVO, DANA)
- FR-3.2: Transaksi dari akun terhubung masuk otomatis ke pencatatan
- FR-3.3: User dapat memutuskan koneksi akun kapan saja
- *Dependency: butuh riset ketersediaan API resmi per bank/e-wallet (lihat bagian 8)*

### 5.4 AI On-Device
- FR-4.1: Model AI berjalan lokal di perangkat (tanpa kirim data ke server eksternal)
- FR-4.2: AI mengkategorikan transaksi baru secara otomatis berdasarkan histori
- FR-4.3: User dapat override/koreksi kategorisasi AI, dan koreksi ini dipakai untuk memperbaiki akurasi berikutnya

### 5.5 Budgeting & Alert
- FR-5.1: User dapat menetapkan limit anggaran per kategori per periode (mingguan/bulanan)
- FR-5.2: Sistem mengirim notifikasi saat pengeluaran mendekati (misal 80%) dan melewati limit

### 5.6 Laporan Visual
- FR-6.1: Dashboard menampilkan grafik pengeluaran vs pemasukan per bulan
- FR-6.2: User dapat melihat tren per kategori dari waktu ke waktu

### 5.7 Keamanan & Privasi (Wajib)
- FR-7.1: Autentikasi biometrik (sidik jari/Face ID) untuk membuka app
- FR-7.2: Data transaksi dienkripsi saat disimpan
- FR-7.3: Data disimpan lokal di perangkat (offline-first); tidak wajib ada koneksi internet untuk fitur inti
- FR-7.4: User dapat mengekspor seluruh datanya (misal ke CSV)
- FR-7.5: User dapat menghapus seluruh data aplikasi secara permanen kapan saja

---

## 6. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| Performa | Model AI on-device harus ringan agar tidak membebani device mid-range |
| Ketersediaan | Fitur pencatatan inti (manual, lihat laporan) harus tetap berfungsi tanpa internet |
| Keamanan | Enkripsi data at-rest; tidak ada data keuangan mentah yang dikirim ke server tanpa izin eksplisit |
| Biaya | Tidak ada biaya recurring ke pengguna maupun ketergantungan API AI berbayar pihak ketiga |
| Kepatuhan | Mengikuti regulasi perlindungan data pribadi (UU PDP) dan aturan sektor finansial (OJK/BI) terkait akses data bank |

---

## 7. Metrik Keberhasilan (Success Metrics)

- % transaksi yang tercatat via OCR/integrasi otomatis vs manual (target: mayoritas otomatis)
- Akurasi kategorisasi AI on-device (dikoreksi user vs tidak)
- Retention rate pengguna bulanan
- Jumlah user yang mengaktifkan fitur keamanan (biometric lock)

---

## 8. Risiko & Open Questions

1. **Ketersediaan API resmi bank/e-wallet** — perlu konfirmasi mana yang punya open API vs perlu pendekatan alternatif (misal parsing notifikasi dengan izin user)
2. **Ukuran & akurasi model AI on-device** — perlu riset trade-off ukuran model vs performa di HP mid-range
3. **Kepatuhan regulasi** — perlu legal review untuk fitur integrasi data finansial pihak ketiga

---

## 9. Roadmap Rilis

- **Fase 1 (MVP):** FR-1, FR-2, FR-5, FR-6, FR-7 (semua fitur keamanan wajib sejak awal)
- **Fase 2:** FR-3 (integrasi bank/e-wallet, mulai dari partner dengan API paling terbuka), FR-4 (AI on-device)
- **Fase 3:** Penyempurnaan laporan, eksplorasi platform baru (iOS/Web)
