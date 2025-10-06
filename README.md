# LAN Speed Test

Nama proyek: LocalNet Speed Test

Deskripsi
---------
A lightweight local network speed test web app that runs on a single machine or LAN. It provides simple endpoints to measure ping, download, and upload speeds and a minimal browser UI with a gauge and progress bar to display results.

Dibuat oleh: Thyo Surya

Fitur
------
- /ping — simple health endpoint returning JSON {
  "message": "pong"
}
- /download — streams a 10 MB random data file for measuring download speed
- /upload — accepts binary POST body and returns measured size, duration, and throughput
- Frontend UI (`templates/index.html`) with a Chart.js doughnut gauge and a progress bar that animates from 0 → measured Mbps and colors by speed range.

Persyaratan
-----------
- Python 3.10+ (tested on 3.13)
- Virtual environment (recommended)
- Dependencies listed in `requirements.txt` (Flask, requests)

Setup cepat (Windows PowerShell)
-------------------------------
1. Buka terminal di folder project:

```powershell
cd "d:\development\LocalNet-Speed-test"
```

2. Buat & aktifkan virtualenv (jika belum):

```powershell
python -m venv myenv
.\myenv\Scripts\Activate.ps1
```

3. Instal dependensi:

```powershell
pip install flask requests
```

Menjalankan aplikasi
--------------------
Jalankan server Flask (development mode):

```powershell
python run.py
```

Akses UI di browser: http://127.0.0.1:5000

Testing
-------
1. HTTP tests (menggunakan `requests`):

```powershell
python test_backend.py
```

Catatan: Pada beberapa mesin Windows, `test_backend.py` yang melakukan koneksi HTTP ke `127.0.0.1:5000` bisa mendapat `ConnectionRefused` akibat timing/binding/firewall. Jika itu terjadi, ada dua opsi:

- Jalankan `test_backend.py` setelah server jelas-jelas jalan, atau
- Gunakan `run_tests_local.py` yang memanggil Flask `test_client()` secara internal (tidak melalui TCP) untuk memverifikasi handler:

```powershell
python run_tests_local.py
```

Pengembangan front-end
----------------------
- `templates/index.html` memuat Chart.js dari CDN. Jika environment memblok CDN, Anda bisa menaruh Chart.js secara lokal di `static/vendor/chart.min.js` dan mengganti tag script.
- Gauge: Chart.js doughnut digunakan, progress bar di bawah gauge di-animasi dari 0 → measured speed.
- Rentang warna (di `static/js/speedtest.js`) default:
  - <= 10 Mbps: merah
  - <= 50 Mbps: kuning
  - > 50 Mbps: hijau
  Ubah `colorForSpeed()` jika ingin threshold berbeda.

Struktur proyek
----------------
```
run.py
README.md
requirements.txt (optional)
test_backend.py
run_tests_local.py
app/
  __init__.py
  routes/
    __init__.py
    main.py
    download.py
    upload.py
static/
  js/
    speedtest.js
templates/
  index.html
```

Troubleshooting singkat
----------------------
- ConnectionRefused saat menjalankan `test_backend.py`:
  - Pastikan server Flask benar-benar jalan (cek terminal server yang menjalankan `run.py`).
  - Jalankan `test_backend.py` dari mesin yang sama setelah server aktif.
  - Gunakan `run_tests_local.py` untuk tes tanpa jaringan.
- Gauge tidak muncul di UI:
  - Periksa DevTools Console untuk error (Chart undefined, resource blocked).
  - Pastikan Chart.js berhasil dimuat (Network tab).
  - Caching: reload hard (Ctrl+F5) jika Anda perbarui `speedtest.js`/`index.html`.

License & Notes
---------------
This project is a small local utility intended for LAN testing and experimentation. Use responsibly on networks you control.

Authorship
----------
Created by: Thyo Surya
