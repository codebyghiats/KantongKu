# Project Plan: Aplikasi Pencatatan Keuangan Pribadi

## 1. Ringkasan Proyek

Aplikasi pencatatan pengeluaran & pemasukan yang **100% gratis** (termasuk fitur AI-nya), ditujukan untuk individu (mahasiswa & karyawan), dengan diferensiator utama: **OCR scan struk otomatis**, **integrasi ke bank/e-wallet lokal**, dan **AI on-device** yang tidak butuh biaya langganan ke pihak ketiga manapun.

**Masalah yang diselesaikan:** Kebanyakan app finance mengunci fitur-fitur penting (kategorisasi otomatis, insight, integrasi bank) di balik paywall mahal. Aplikasi ini membuat semua fitur itu gratis selamanya dengan menjalankan AI secara lokal di HP pengguna.

---

## 2. Target Pengguna

- **Primary persona:** Mahasiswa & karyawan individu (bukan keluarga/bisnis di MVP awal)
- **Kebutuhan utama:** Pencatatan cepat, tanpa ribet input manual, tanpa biaya tambahan

---

## 3. Platform & Model Bisnis

| Aspek | Keputusan |
|---|---|
| Platform MVP | Android (native/cross-platform TBD di tahap teknis) |
| Model bisnis | Gratis 100%, termasuk fitur AI — tidak ada langganan |
| Monetisasi jangka panjang | Belum diputuskan; bisa dieksplorasi nanti (donasi, versi enterprise B2B, dll) tanpa mengorbankan prinsip "gratis untuk user individu" |

---

## 4. Fitur Unggulan (Diferensiator Utama)

### 4.1 OCR Scan Struk Otomatis
- Foto struk belanja → otomatis terbaca jadi transaksi (nominal, tanggal, merchant, kategori)
- Menghilangkan input manual yang jadi keluhan utama di app lain

### 4.2 Integrasi Bank & E-Wallet Lokal
- Cakupan awal: **BCA, BRI, GoPay, OVO, DANA**, dll (bank & e-wallet populer Indonesia)
- Transaksi otomatis tersinkron tanpa perlu input manual
- *Catatan teknis: perlu riset kepatuhan (API resmi bank, atau via SMS/notifikasi parsing dengan izin user, mengikuti regulasi OJK/BI terkait data finansial)*

### 4.3 AI On-Device (Diferensiator Inti)
- Model AI **kecil, jalan langsung di HP** (bukan di server)
- Fungsi: kategorisasi otomatis transaksi, deteksi pola pengeluaran
- **Kenapa on-device:** tidak ada biaya server/API recurring → bisa gratis selamanya untuk user
- *Catatan: prediksi/rekomendasi AI otomatis sengaja TIDAK dimasukkan di scope awal (lihat poin 4.5)*

### 4.4 Keamanan Data (Standar Wajib, Bukan Opsional)
Semua poin berikut wajib ada sejak MVP:
- Enkripsi data + biometric lock (sidik jari/Face ID)
- Data disimpan lokal di HP (offline-first)
- User punya kontrol penuh: bisa export atau hapus data kapan saja

### 4.5 Fitur Pendukung Lain
- **Budgeting & alert boros** — set limit per kategori, notifikasi kalau mendekati/lewat limit
- **Laporan visual** — grafik & tren pengeluaran bulanan
- ~~Prediksi/rekomendasi otomatis dari AI~~ — di-exclude dari scope (by design choice user)

---

## 5. Prioritas Fitur (Roadmap Bertahap)

**Fase 1 — MVP (Android, fokus diferensiator):**
1. Pencatatan manual dasar (income/expense, kategori)
2. OCR scan struk
3. Keamanan wajib: enkripsi + biometric lock + offline-first + export/delete data
4. Budgeting & alert

**Fase 2 — Integrasi & AI:**
5. Integrasi bank/e-wallet lokal (mulai dari 1-2 partner dulu, misal GoPay/DANA yang API-nya lebih terbuka, sebelum ke bank)
6. Model AI on-device untuk kategorisasi otomatis

**Fase 3 — Penyempurnaan:**
7. Laporan visual & tren bulanan
8. Eksplorasi platform tambahan (iOS/Web) jika Android sudah stabil

---

## 6. Risiko & Hal yang Perlu Diriset Lebih Lanjut

- **Integrasi bank:** butuh riset apakah bank-bank tsb punya open API resmi (open banking), atau alternatif seperti parsing notifikasi SMS/app dengan izin eksplisit user
- **Model AI on-device:** perlu riset ukuran model vs kemampuan HP rata-rata target user (mahasiswa/karyawan umumnya pakai mid-range Android) — model harus ringan tapi tetap akurat untuk kategorisasi
- **Kepatuhan regulasi:** data finansial termasuk data sensitif, perlu cek regulasi OJK/perlindungan data pribadi (UU PDP) untuk fitur integrasi bank

---

## 7. Ringkasan Diferensiasi vs App Finance Lain

| Fitur | App Finance Umumnya | App Ini |
|---|---|---|
| Kategorisasi AI | Berbayar/premium | Gratis (on-device) |
| OCR struk | Sering premium | Gratis |
| Integrasi bank | Premium/terbatas | Gratis, fokus bank lokal |
| Keamanan (enkripsi, biometric) | Kadang basic | Wajib standar tinggi sejak awal |
| Privasi data | Sering ke cloud | Offline-first, kontrol penuh user |
