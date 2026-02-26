# 📝 Tutorial Formatting Soal

Panduan lengkap untuk menggunakan fitur **Formatting** - mengubah format soal dari berbagai sumber menjadi format standar yang rapi dan konsisten.

---

## 🎯 Apa itu Formatting?

Fitur **Formatting** membantu Anda mengubah soal-soal yang berantakan atau dalam format tidak standar menjadi format yang rapi, terstruktur, dan siap digunakan.

### Contoh Kasus:
- ✅ Soal dari scan PDF yang berantakan
- ✅ Soal copy-paste dari berbagai sumber
- ✅ Soal dengan format penomoran tidak konsisten
- ✅ Soal tanpa struktur yang jelas

---

## 📋 Langkah-langkah Penggunaan

### **Step 1: Upload File**

1. Klik tombol **"Upload Files"** atau drag & drop file ke area upload
2. File yang didukung:
   - **PDF** (`.pdf`) - Hasil scan atau dokumen digital

3. Anda bisa upload **multiple files** sekaligus
4. Tunggu hingga upload selesai (ada indikator progress)

> 💡 **Tips:** Pastikan file tidak corrupt dan bisa dibuka dengan baik

#### Persyaratan file PDF
- File PDF harus memuat:
  - Soal (pertanyaan)
  - Kunci jawaban (answer key)
  - Pembahasan/penjelasan (opsional, tetapi sangat dianjurkan)
- Batas halaman: maksimal 6 halaman per file. Jika lebih dari 6 halaman, bagi menjadi beberapa file atau gunakan batch kecil.
- Pastikan scan/tangkapan teks jelas, bukan password-protected, dan dapat diekstrak oleh sistem.

---

### **Step 2: AI Processing**

Setelah file terupload, sistem akan:

1. **Membaca konten** dari semua file yang diupload
2. **Menganalisis struktur** soal dengan AI
3. **Memformat ulang** sesuai standar yang ditentukan
4. **Menampilkan preview** hasil formatting

**Proses ini otomatis dan memakan waktu beberapa detik hingga menit tergantung jumlah soal.**

> ⚡ **Catatan:** Semakin banyak soal, semakin lama prosesnya

---

### **Step 3: Review Hasil**

Setelah proses selesai, Anda akan melihat:

#### **Preview Soal Terformat:**
- ✅ Nomor soal yang konsisten
- ✅ Pertanyaan yang terstruktur
- ✅ Opsi jawaban (A, B, C, D, E) yang rapi
- ✅ Penanda jawaban benar
- ✅ Penjelasan (jika ada)

#### **Informasi Processing:**
- 📊 Total soal yang berhasil diformat
- ⏱️ Waktu pemrosesan
- 💰 Biaya API (jika menggunakan OpenAI berbayar)

**Anda bisa melakukan:**
- **Edit manual** jika ada yang perlu diperbaiki
- **Hapus soal** yang tidak diperlukan
- **Tambah soal** baru secara manual

---

### **Step 4: Export Hasil**

Setelah yakin dengan hasil formatting, pilih format export:

#### **1. CSV Export**
Format tabel yang kompatibel dengan Excel/Google Sheets:
```
No,Question,A,B,C,D,E,Answer,Explanation
1,Apa ibukota Indonesia?,Jakarta,Bandung,Surabaya,Medan,Bali,A,Jakarta adalah ibukota RI
```

**Kegunaan:**
- Import ke sistem soal
- Analisis data dengan spreadsheet
- Database soal

#### **2. JSON Export**
Format terstruktur untuk developer:
```json
{
  "questions": [
    {
      "no": "1",
      "question": "Apa ibukota Indonesia?",
      "options": ["Jakarta", "Bandung", "Surabaya", "Medan", "Bali"],
      "answer": "A",
      "explanation": "Jakarta adalah ibukota RI"
    }
  ]
}
```

**Kegunaan:**
- Integrasi dengan aplikasi
- API endpoints
- Modern web apps

#### **3. Markdown Export**
Format text dengan syntax Markdown:
```markdown
## 1. Apa ibukota Indonesia?

A. Jakarta ✓
B. Bandung
C. Surabaya
D. Medan
E. Bali

**Penjelasan:** Jakarta adalah ibukota RI
```

**Kegunaan:**
- Dokumentasi
- Blog posts
- GitHub/GitLab wikis
- Platform pembelajaran online

---

## ✨ Fitur Tambahan

### **Auto-Detection**
AI akan otomatis mendeteksi:
- Format soal (pilihan ganda, essay, dll)
- Penomoran (1, 2, 3 atau A, B, C)
- Jawaban benar (★, ✓, atau tanda lainnya)
- Section/kategori soal

### **Batch Processing**
- Process multiple files sekaligus
- Gabungkan hasil dari berbagai sumber
- Penomoran otomatis berurutan

### **Quality Check**
Sistem akan memberi warning jika:
- ⚠️ Soal tidak lengkap (kurang opsi)
- ⚠️ Tidak ada jawaban benar
- ⚠️ Format tidak standar
- ⚠️ File PDF tidak berisi kunci jawaban atau pembahasan yang diperlukan
- ⚠️ File PDF melebihi 6 halaman — bagi menjadi beberapa file atau kurangi halaman

---

## 🔧 Troubleshooting

### **File tidak terbaca dengan baik?**
- Pastikan file tidak terproteksi password
- Gunakan format yang didukung (PDF, DOCX, TXT, MD)
- Cek kualitas scan jika dari PDF hasil scan

### **Hasil formatting kurang akurat?**
- Upload ulang dengan file yang lebih jelas
- Edit manual di step review
- Pisahkan file besar menjadi beberapa file kecil

### **Proses terlalu lama?**
- Normal untuk file besar (>100 soal)
- Coba split menjadi beberapa batch kecil
- Refresh browser jika loading lebih dari 5 menit

---

## 📞 Butuh Bantuan?

Jika mengalami kendala atau ada pertanyaan:
1. Hubungi tim support via email/chat
2. Cek dokumentasi lengkap di website
3. Join komunitas user untuk tips & trik

---

**Happy Formatting! 🎉**
