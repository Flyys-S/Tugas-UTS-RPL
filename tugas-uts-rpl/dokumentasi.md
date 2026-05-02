# Dokumentasi Teknis: MMS Service Report Generator

## 1. Pendahuluan
**MMS Service Report Generator** adalah aplikasi berbasis web (PWA) yang dirancang untuk memodernisasi proses pembuatan laporan servis AC bagi teknisi di perusahaan **Mitra Maju Sejati**. Aplikasi ini memungkinkan pembuatan laporan yang konsisten, manajemen data pelanggan yang terorganisir, dan ekspor dokumen ke format PDF profesional yang siap kirim.

---

## 2. Teknologi & Framework (Tech Stack)
Aplikasi ini dibangun menggunakan teknologi modern untuk memastikan performa tinggi, keamanan data, dan kemudahan pengembangan:

- **Core Framework**: [React.js 19](https://react.dev/) - Library JavaScript untuk membangun antarmuka pengguna yang reaktif.
- **Build Tool**: [Vite 8](https://vitejs.dev/) - Frontend tool next-generation yang sangat cepat untuk development dan bundling.
- **Language**: [TypeScript 6](https://www.typescriptlang.org/) - Memberikan keamanan tipe data (type safety) untuk mencegah bug saat pengembangan.
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) - Utility-first CSS framework untuk desain UI yang premium dan responsif.
- **Database & Backend**: [Supabase](https://supabase.com/) - Backend-as-a-Service (BaaS) berbasis PostgreSQL untuk penyimpanan data cloud secara real-time.
- **PWA Capabilities**: `vite-plugin-pwa` - Memungkinkan aplikasi diinstal di perangkat (HP/Laptop) dan diakses secara offline.

---

## 3. Library yang Digunakan
- **lucide-react**: Set ikon vektor yang modern dan ringan untuk elemen UI.
- **@supabase/supabase-js**: Library client resmi untuk berinteraksi dengan database Supabase.
- **Vite Plugin PWA**: Plugin untuk menangani service worker dan manifest aplikasi.
- **PostCSS & Autoprefixer**: Tooling CSS untuk memastikan kompatibilitas browser.

---

## 4. Struktur Folder & File
Berikut adalah penjelasan mengenai arsitektur file dalam proyek ini:

```text
tugas-uts-rpl/
├── src/
│   ├── components/
│   │   ├── Customer.tsx      # Manajemen database pelanggan (CRUD).
│   │   ├── ReportModal.tsx   # Logika Preview & Export PDF laporan servis.
│   │   └── Riwayat.tsx       # Daftar laporan yang tersimpan dengan fitur filter.
│   ├── assets/               # Gambar, logo, dan aset statis.
│   ├── App.tsx               # Entry point utama & manajemen state form laporan.
│   ├── storage.ts            # Service layer untuk komunikasi ke Supabase (API).
│   ├── supabaseClient.ts     # Konfigurasi koneksi ke Supabase.
│   ├── types.ts              # Definisi interface TypeScript (State & Data).
│   ├── index.css             # Konfigurasi Tailwind & Global Styling (Sage Palette).
│   └── main.tsx              # Render aplikasi ke DOM.
├── public/                   # File statis (favicon, manifest).
├── index.html                # Template HTML utama.
├── package.json              # Daftar library & script perintah (build, dev).
└── vite.config.ts            # Konfigurasi build & plugin Vite.
```

---

## 5. Analisis Kode Utama

### A. Data Model (`types.ts`)
Aplikasi menggunakan dua interface utama untuk standarisasi data:
- **`FormData`**: Menyimpan metadata laporan seperti Model unit, Serial Number, Nama Teknisi, Hasil Diagnosa, dll.
- **`MeasurementData`**: Struktur data untuk tabel pengukuran yang terdiri dari kategori, parameter, unit, nilai referensi, serta nilai sebelum dan sesudah servis.

### B. State Management (`App.tsx`)
Menggunakan React `useState` untuk menangani input form secara real-time. Tabel pengukuran menggunakan **Fixed Template** (initial measurements) yang berisi 21 parameter teknis standar industri (Kelistrikan, Suhu, Tekanan).

### C. Backend Logic (`storage.ts`)
Fungsi-fungsi asinkron (`getAllReports`, `saveReport`, `ensureCustomer`) menangani operasi database:
- Menggunakan query Supabase untuk operasi CRUD.
- Melakukan mapping data dari format database (snake_case) ke format aplikasi (camelCase).
- Menyimpan data pengukuran secara relasional ke tabel terpisah.

---

## 6. Antarmuka Pengguna (UI) & Desain
Aplikasi mengusung konsep **Premium & Professional Aesthetic**:

- **Sage Green Palette**: Menggunakan variasi warna hijau sage (`#2d4a3e`, `#e8f0ed`) yang memberikan kesan tenang namun profesional.
- **Dark Mode Support**: Mendukung mode gelap otomatis atau manual untuk kenyamanan teknisi.
- **Glassmorphism**: Beberapa elemen modal menggunakan efek blur transparan untuk tampilan modern.
- **Responsive Layout**: Sidebar yang fleksibel dan grid sistem yang menyesuaikan ukuran layar (Mobile Friendly).

---

## 7. Skema Database (Supabase)
Terdapat tiga tabel utama di Supabase:

1. **`reports`**:
   - Kolom: `id`, `indoor_model`, `outdoor_model`, `technician_name`, `technician_code_branch`, `diagnosis`, `report_date`, dll.
2. **`measurements`**:
   - Kolom: `id`, `report_id` (FK), `category`, `parameter`, `unit`, `before_value`, `after_value`.
3. **`customers`**:
   - Kolom: `id`, `name`, `address`, `phone`, `created_at`.

---

## 8. Fitur Unggulan
1. **Letterhead Generator**: Menghasilkan dokumen PDF dengan kop surat formal perusahaan secara otomatis.
2. **Auto-Save Customer**: Jika nama pelanggan baru dimasukkan di form, sistem otomatis menyimpannya ke database pelanggan.
3. **Fixed Template Measurement**: Mempercepat teknisi karena parameter pengecekan sudah tersedia secara standar (tidak perlu mengetik manual).
4. **Offline Ready**: Berkat teknologi PWA, aplikasi tetap stabil meski koneksi internet tidak stabil di lokasi servis.

---
*Dokumentasi ini dibuat untuk kebutuhan UTS Rekayasa Perangkat Lunak 2026.*
