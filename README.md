<div align="center">

# 👛 KantongKu

**Aplikasi pencatatan keuangan pribadi — gratis selamanya, AI jalan di HP kamu sendiri.**

[![Platform](https://img.shields.io/badge/platform-Web%20%7C%20PWA%20%7C%20Android-3DDC84?logo=android&logoColor=white)](#)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](#-lisensi)
[![Status](https://img.shields.io/badge/status-MVP%20Released-brightgreen)](#-roadmap)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#-kontribusi)

[Fitur](#-fitur-unggulan) •
[Kenapa KantongKu](#-kenapa-KantongKu) •
[Roadmap](#-roadmap) •
[Tech Stack](#-tech-stack) •
[Kontribusi](#-kontribusi)

</div>

## 📖 Tentang

**KantongKu** adalah aplikasi pencatatan pengeluaran & pemasukan yang dirancang untuk individu (mahasiswa & karyawan) yang capek dengan app finance lain yang mengunci fitur-fitur penting di balik paywall.

Semua fitur di KantongKu — termasuk AI kategorisasi otomatis — **gratis selamanya**, karena AI-nya berjalan langsung di perangkat pengguna (on-device), bukan lewat API server berbayar.

> 💡 **Filosofi kami:** kategorisasi otomatis, scan struk, dan keamanan data yang kuat seharusnya jadi standar dasar — bukan fitur premium.

---

## 📱 Cara Install Aplikasi di HP (Android & iOS)

**KantongKu** dilengkapi teknologi **Progressive Web App (PWA)** offline-first, sehingga dapat di-install secara instan ke layar utama (*Home Screen*) HP Anda tanpa biaya & tanpa perlu lewat Play Store!

### 📲 Langkah Instalasi Cepat:

#### 🤖 For Android (Chrome / Edge / Brave):
1. Buka tautan aplikasi **KantongKu** di browser HP Anda.
2. Klik tombol **"Install Aplikasi"** pada banner hijau yang muncul di atas Dashboard.
3. *Atau* tekan menu titik tiga `⋮` di pojok kanan atas browser ➔ Pilih **"Tambahkan ke Layar Utama" (Add to Home Screen)** / **"Install Aplikasi"**.

#### 🍏 For iPhone / iOS (Safari):
1. Buka tautan aplikasi di browser **Safari** pada iPhone Anda.
2. Tekan tombol **Share / Bagikan** (ikon kotak dengan panah mengarah ke atas di bagian bawah).
3. Gulir ke bawah lalu pilih **"Tambah ke Layar Utama" (Add to Home Screen)**.
4. Klik **Tambah**. Aplikasi **KantongKu** akan langsung terpasang di layar utama iPhone Anda!

---

## ❓ Kenapa KantongKu?

<div align="center">

| | App Finance Umumnya | 👛 KantongKu |
|---|:---:|:---:|
| Kategorisasi AI | 🔒 Premium/berlangganan | ✅ Gratis (on-device) |
| Scan struk (OCR) | 🔒 Sering premium | ✅ Gratis |
| Integrasi bank/e-wallet | 🔒 Terbatas | ✅ Fokus bank lokal Indonesia |
| Keamanan (enkripsi + biometrik) | ⚠️ Kadang basic | ✅ Wajib sejak awal |
| Privasi data | ☁️ Sering ke cloud | ✅ Offline-first, kontrol penuh user |

</div>

---

## ✨ Fitur Unggulan

<details open>
<summary><b>🧾 OCR Scan Struk Otomatis</b></summary>
<br>

Foto struk belanja kamu → nominal, tanggal, dan merchant otomatis terbaca jadi transaksi. Gak perlu ketik manual lagi.

</details>

<details>
<summary><b>🏦 Integrasi Bank & E-Wallet Lokal</b></summary>
<br>

Hubungkan akun **BCA, BRI, GoPay, OVO, DANA**, dan lainnya. Transaksi masuk otomatis tanpa perlu dicatat satu-satu.

</details>

<details>
<summary><b>🤖 AI On-Device (Bukan di Server)</b></summary>
<br>

Model AI kecil yang jalan langsung di HP kamu untuk mengkategorikan transaksi otomatis. Karena gak butuh server, gak ada biaya langganan — dan data kamu gak perlu keluar dari HP.

</details>

<details>
<summary><b>🔐 Keamanan & Privasi (Standar Wajib)</b></summary>
<br>

- Enkripsi data + kunci biometrik (sidik jari/Face ID)
- Offline-first — data tersimpan lokal di HP
- Export atau hapus data kamu kapan saja, kontrol penuh di tangan kamu

</details>

<details>
<summary><b>📊 Budgeting & Laporan Visual</b></summary>
<br>

- Set limit anggaran per kategori + alert kalau mendekati/lewat limit
- Grafik tren pengeluaran & pemasukan bulanan

</details>

---

## 🗺️ Roadmap

```
Fase 1 — MVP (Android)
  ├── ✅ Pencatatan transaksi manual
  ├── ✅ OCR scan struk
  ├── ✅ Keamanan wajib (enkripsi, biometrik, offline-first, export/delete)
  └── ✅ Budgeting & alert

Fase 2 — Integrasi & AI
  ├── 🔄 Integrasi bank/e-wallet lokal
  └── 🔄 AI on-device untuk kategorisasi otomatis

Fase 3 — Penyempurnaan
  ├── ⏳ Laporan visual lanjutan
  └── ⏳ Eksplorasi platform iOS/Web
```

> Detail lengkap requirement ada di [`prd.md`](./prd.md)

---

## 🛠️ Tech Stack

<div align="center">

![React](https://img.shields.io/badge/-React%2018-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/-Tailwind%20CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Tesseract.js](https://img.shields.io/badge/-Tesseract.js%20(OCR)-5C2D91?style=for-the-badge&logo=tesseract&logoColor=white)
![Recharts](https://img.shields.io/badge/-Recharts-22B5BF?style=for-the-badge&logo=chart.js&logoColor=white)

</div>

---

## 📦 Struktur Dokumen Project

```
📁 kantongku/
 ├── 📄 README.md              ← kamu di sini
 ├── 📄 prd.md                 ← Product Requirements Document
 └── 📄 project-plan.md        ← Rencana proyek awal
```

---

## 🤝 Kontribusi

Project ini masih di tahap perencanaan. Kontribusi, ide, dan diskusi sangat terbuka!

1. Fork repo ini
2. Buat branch baru (`git checkout -b fitur/nama-fitur`)
3. Commit perubahan kamu (`git commit -m 'Tambah fitur X'`)
4. Push ke branch (`git push origin fitur/nama-fitur`)
5. Buka Pull Request

---

## 📄 Lisensi

Belum ditentukan — akan diupdate seiring project berjalan.

---

<div align="center">

Dibuat dengan 👛 untuk orang-orang yang capek bayar langganan cuma buat lihat ke mana uangnya pergi.

</div>
