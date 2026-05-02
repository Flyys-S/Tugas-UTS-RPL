# Script Video Demonstrasi Aplikasi: MMS Service Report

Berikut adalah naskah yang bisa Anda baca (naskah dalam kotak) beserta panduan visual saat melakukan rekaman video.

---

## BAGIAN 1: PEMBUKAAN (Intro)
**Visual:** Tampilkan halaman utama aplikasi dalam Mode Terang (Light Mode).
> "Halo semuanya! Nama saya [Sebutkan Nama Anda], dan hari ini saya akan mendemonstrasikan proyek UTS Rekayasa Perangkat Lunak saya, yaitu **MMS Service Report Generator**. Aplikasi ini dirancang khusus untuk teknisi di perusahaan **Mitra Maju Sejati** agar dapat membuat laporan servis AC yang profesional, cepat, dan terorganisir secara digital."

---

## BAGIAN 2: UI & DASHBOARD
**Visual:** Arahkan kursor ke Sidebar, lalu klik tombol Toggle Dark Mode.
> "Aplikasi ini dibangun dengan desain yang modern dan premium menggunakan palet warna Sage Green. Seperti yang Anda lihat, sistem ini mendukung **Dark Mode** untuk kenyamanan mata teknisi saat bekerja di lapangan. Navigasinya sangat simpel, terdiri dari tiga menu utama: Service Report, Riwayat, dan Data Customer."

---

## BAGIAN 3: DEMO FITUR - MEMBUAT LAPORAN
**Visual:** Klik menu "Service Report" dan mulai isi data (misal: Daikin Inverter). Saat mengisi nama customer, tunjukkan fitur autocomplete.
> "Sekarang kita coba buat satu laporan. Di bagian **Informasi Unit**, kita bisa memasukkan model dan serial number. Menariknya, di bagian **Informasi Customer**, aplikasi ini memiliki fitur **Autocomplete**. Jika customer tersebut sudah pernah diservis sebelumnya, datanya akan muncul otomatis dari database, sehingga teknisi tidak perlu mengetik ulang alamatnya."

**Visual:** Scroll ke bawah ke Tabel Pengukuran. Tambah satu baris baru, lalu hapus.
> "Bagian paling krusial adalah **Tabel Pengukuran**. Di sini teknisi memasukkan data teknis seperti Voltage dan Ampere, baik sebelum maupun sesudah perbaikan. Tabel ini bersifat dinamis; kita bisa menambah atau menghapus baris sesuai kebutuhan pengecekan di lapangan."

---

## BAGIAN 4: GENERATE & PREVIEW PDF
**Visual:** Klik tombol "Generate & Preview Report". Tampilkan preview surat. Klik "Cetak / Save PDF".
> "Setelah data lengkap, kita cukup klik **Generate**. Aplikasi akan menyusun data tadi ke dalam format **Letterhead profesional**. Tampilan ini sudah dioptimalkan untuk cetak. Jika kita klik 'Cetak', sistem akan otomatis menyiapkan file PDF yang siap dikirimkan ke klien melalui WhatsApp atau Email."

---

## BAGIAN 5: RIWAYAT & DATABASE
**Visual:** Klik menu "Riwayat". Buka salah satu detail laporan menggunakan modal.
> "Semua laporan yang dibuat otomatis tersimpan di menu **Riwayat**. Kita bisa melihat kembali detail laporan lama melalui modal tanpa harus berpindah halaman. Data ini tersimpan secara aman di cloud, sehingga tidak akan hilang meskipun browser ditutup."

---

## BAGIAN 6: PENJELASAN TEKNIS (CODING)
**Visual:** Buka VS Code, tunjukkan file `App.tsx` lalu `storage.ts`.

**Penjelasan App.tsx:**
> "Dari sisi teknis, aplikasi ini dibangun menggunakan **React** dengan **TypeScript** untuk menjamin keamanan tipe data. Saya menggunakan **State Management** yang reaktif di `App.tsx` untuk menangani form data yang kompleks secara real-time."

**Penjelasan Storage & Supabase:**
> "Untuk penyimpanan data, saya mengintegrasikan aplikasi ini dengan **Supabase** sebagai Backend-as-a-Service. Di file `storage.ts`, Anda bisa melihat bagaimana fungsi `saveReport` bekerja secara asinkron untuk mengirim data ke database PostgreSQL melalui API Supabase."

**Penjelasan CSS:**
> "Terakhir, untuk styling saya menggunakan **Vanilla CSS** dengan variabel khusus untuk sistem tema. Saya juga menerapkan **Media Queries khusus print** di file `index.css` agar hasil cetakan PDF terlihat bersih dan tanpa elemen navigasi."

---

## BAGIAN 7: PENUTUP
**Visual:** Kembali ke tampilan aplikasi (Main Dashboard).
> "Itulah demonstrasi dari aplikasi MMS Service Report. Dengan sistem ini, proses administrasi teknisi menjadi jauh lebih efisien dan terlihat lebih profesional di mata pelanggan. Terima kasih atas perhatiannya!"

---

### Tips Rekaman:
1. **Resolusi:** Gunakan resolusi 1080p agar teks koding terlihat jelas.
2. **Kecepatan:** Jangan bicara terlalu cepat. Beri jeda 1-2 detik saat transisi antar menu.
3. **Cursor:** Gerakkan kursor secara perlahan untuk menyorot bagian yang sedang dijelaskan.
