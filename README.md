# 🏪 Warung Kelontong Bawen - Toko Online Sembako

Aplikasi toko online modern, ringan, dan cepat untuk **Warung Kelontong Bawen**. Aplikasi ini dibuat menggunakan **HTML5, Tailwind CSS (via CDN), dan Vanilla JavaScript** tanpa framework, sehingga sangat mudah dan gratis untuk di-publish ke **GitHub Pages**.

---

## 🚀 Panduan Upload & Publish ke GitHub Pages (GRATIS)

Berikut adalah langkah-langkah mudah untuk meng-upload dan mengaktifkan website ini di GitHub Pages:

### Langkah 1: Buat Repositori Baru di GitHub
1. Masuk ke akun [GitHub](https://github.com/) Anda (buat akun baru jika belum punya).
2. Klik tombol **New** (atau tanda **+** di pojok kanan atas lalu pilih **New repository**).
3. Isi **Repository name** dengan nama bebas, misalnya: `warung-bawen`.
4. Atur visibilitas ke **Public** (wajib agar bisa menggunakan GitHub Pages gratis).
5. Jangan centang "Add a README file" karena kita sudah memilikinya.
6. Klik tombol **Create repository**.

### Langkah 2: Upload File Website
1. Di halaman repositori baru Anda, klik link yang bertuliskan **"uploading an existing file"** pada bagian bawah instruksi setup.
2. Drag & drop (seret) atau pilih 3 file utama berikut dari komputer Anda:
   - `index.html`
   - `style.css`
   - `script.js`
3. Tunggu hingga proses upload selesai.
4. Di bagian bawah ("Commit changes"), klik tombol hijau **Commit changes**.

### Langkah 3: Aktifkan GitHub Pages
1. Di halaman repositori GitHub Anda, buka menu **Settings** (ikon gerigi di baris atas).
2. Di menu sebelah kiri, cari bagian **Code and automation** dan klik **Pages**.
3. Pada bagian **Build and deployment** -> **Source**, pilih **Deploy from a branch**.
4. Di bawah bagian **Branch**, ubah pilihan `None` menjadi **`main`** (atau `master`), lalu biarkan foldernya tetap `/ (root)`.
5. Klik tombol **Save**.
6. Tunggu sekitar 1 hingga 2 menit. Refresh halaman tersebut.
7. Di bagian atas halaman **Pages**, Anda akan melihat banner berwarna hijau dengan alamat URL website Anda, contohnya: 
   `https://username-anda.github.io/warung-bawen/`
8. Selesai! Website Toko Online "Warung Kelontong Bawen" Anda sekarang sudah aktif dan bisa diakses oleh siapa saja di internet!

---

## 🛠️ Cara Mengubah Pengaturan Toko

Semua konfigurasi toko diletakkan di bagian paling atas file `script.js`. Anda dapat membukanya menggunakan text editor (seperti Notepad atau VS Code) dan mengubah variabel berikut sebelum di-upload ke GitHub:

```javascript
// Ganti nomor WhatsApp pemilik warung di sini (Format internasional tanpa '+' atau spasi)
const OWNER_WA_NUMBER = '6281329241551'; 

// PIN Keamanan untuk masuk ke Panel Admin di website
const ADMIN_PIN = '1234'; 

// Batas minimum pembelanjaan untuk mendapatkan gratis ongkos kirim
const FREE_SHIPPING_MINIMUM = 50000;

// Tarif flat ongkos kirim jika belanjaan di bawah batas minimum
const FLAT_SHIPPING_FEE = 5000;
```

---

## ✨ Fitur-Fitur Unggulan

1. **Desain Minimarket Modern**: Tampilan profesional dengan perpaduan warna hijau segar (Emerald) khas minimarket modern yang bersih dan bersih.
2. **Kategori Produk Praktis**: Dilengkapi filter slider horizontal yang interaktif (Beras, Minyak Goreng, Telur, Gula, Mie Instan, Minuman, Snack, dan Sabun).
3. **Pencarian Real-Time**: Kolom pencarian responsif untuk mencari produk secara cepat di HP maupun komputer.
4. **Sistem Keranjang Cerdas**: Menghitung otomatis subtotal, ongkir, sisa belanja untuk gratis ongkir, dan total pembayaran secara real-time.
5. **Form Checkout COD & WhatsApp**: Pembeli dapat langsung mengisi Nama, Alamat, Metode Bayar, dan Catatan di keranjang, lalu mengirimkan rincian pesanan langsung ke WhatsApp pemilik dalam format teks rapi.
6. **Panel Admin Sederhana**: Dilengkapi passcode gate keamanan untuk mengubah **Nama Produk, Harga, dan Stok barang** secara real-time langsung di website! (Stok akan otomatis berkurang setiap kali ada pemesanan).
7. **100% Mobile Friendly**: Tata letak yang sangat nyaman diakses dari smartphone, karena mayoritas pelanggan berbelanja menggunakan HP.
