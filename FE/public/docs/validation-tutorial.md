# ✅ Tutorial Validation Soal

Panduan lengkap untuk menggunakan fitur **Validation** - memvalidasi dan memeriksa kualitas soal agar sesuai standar dan siap digunakan.

---

## 🎯 Apa itu Validation?

Fitur **Validation** membantu Anda memeriksa kelengkapan, konsistensi, dan kualitas soal-soal yang sudah Anda miliki. Sistem akan memberikan feedback detail tentang masalah yang ditemukan dan saran perbaikan.

### Manfaat Validation:
- ✅ Memastikan semua soal lengkap (pertanyaan, opsi, jawaban)
- ✅ Mendeteksi duplikasi soal
- ✅ Memeriksa konsistensi format
- ✅ Validasi logika soal
- ✅ Quality assurance sebelum publikasi

---

## 📋 Langkah-langkah Penggunaan

### **Step 1: Upload File Soal**

1. Klik **"Upload Files"** atau drag & drop file
2. Format yang didukung:
   - **CSV** (`.csv`) - Excel/Google Sheets export

3. File harus memiliki kolom standar:
   ```
   Number | Question | A | B | C | D | E | Answer | Explanation
   ```

4. Tunggu proses upload selesai

> 💡 **Tips:** Gunakan template CSV yang disediakan untuk hasil terbaik

---

### **Step 2: Pilih Jenis Validasi**

Pilih aspek mana yang ingin divalidasi:

#### **1. Basic Validation (Gratis)**
Pemeriksaan dasar tanpa AI:
- ✅ Kelengkapan kolom (semua field terisi)
- ✅ Format jawaban (A/B/C/D/E valid)
- ✅ Jumlah opsi (minimal 2, maksimal 5)
- ✅ Duplikasi nomor soal

**Cocok untuk:** Quick check sebelum publish

#### **2. Advanced Validation (AI-Powered)**
Pemeriksaan mendalam dengan AI:
- ✅ Semua dari Basic Validation
- ✅ **Grammar & Spelling** - Deteksi typo dan kesalahan bahasa
- ✅ **Logic Check** - Apakah soal masuk akal?
- ✅ **Duplicate Detection** - Soal yang mirip/sama
- ✅ **Difficulty Level** - Estimasi tingkat kesulitan
- ✅ **Answer Plausibility** - Apakah jawaban masuk akal?

**Cocok untuk:** Quality assurance profesional

#### **3. Custom Validation**
Validasi sesuai aturan khusus Anda:
- Atur minimal/maksimal panjang pertanyaan
- Atur jumlah opsi yang diinginkan
- Tentukan format spesifik
- Custom rules untuk domain tertentu

---

### **Step 3: Review Hasil Validasi**

Sistem akan menampilkan laporan lengkap:

#### **📊 Summary Dashboard**
```
✅ Valid Questions: 85/100 (85%)
⚠️ Warning: 10 questions
❌ Error: 5 questions
```

#### **📋 Detailed Report**

Setiap soal akan diberi status:

**✅ VALID** - Tidak ada masalah
```
No: 1
Status: ✅ Valid
Question: "Apa ibukota Indonesia?"
```

**⚠️ WARNING** - Ada yang perlu diperhatikan (tidak blocking)
```
No: 2
Status: ⚠️ Warning
Question: "siapa presiden indonesia?"
Issues:
  - Grammar: Huruf kapital di awal kalimat
  - Suggestion: "Siapa presiden Indonesia?"
```

**❌ ERROR** - Harus diperbaiki (blocking)
```
No: 3
Status: ❌ Error
Question: "Pertanyaan tidak jelas"
Issues:
  - Missing options: Hanya 2 opsi, minimal 4
  - No correct answer: Jawaban benar tidak ditandai
```

---

### **Step 4: Perbaiki Masalah**

Untuk setiap issue yang ditemukan:

#### **Auto-Fix (Jika tersedia)**
Klik tombol **"Auto Fix"** untuk perbaikan otomatis:
- Grammar correction
- Format standardization
- Missing data completion (berbasis AI)

#### **Manual Edit**
Klik **"Edit"** untuk memperbaiki manual:
- Edit pertanyaan
- Ubah opsi jawaban
- Ganti jawaban benar
- Tambah penjelasan

#### **Bulk Actions**
Untuk multiple issues:
- **Fix All Warnings** - Perbaiki semua warning sekaligus
- **Delete Invalid** - Hapus soal yang error
- **Export Issues** - Download daftar masalah (CSV)

---

### **Step 5: Re-Validate & Export**

Setelah memperbaiki masalah:

1. Klik **"Re-Validate"** untuk cek ulang
2. Pastikan semua status ✅ Valid
3. Klik **"Export Clean Data"** untuk download hasil final

Export format:
- **CSV** - Untuk sistem lain

---

## 🔍 Jenis Validasi Detail

### **1. Structural Validation**
Memeriksa struktur data:
- ✅ Semua kolom wajib ada
- ✅ Tipe data sesuai (number, text)
- ✅ No duplikasi ID/nomor
- ✅ Konsistensi format

### **2. Content Validation**
Memeriksa isi konten:
- ✅ Pertanyaan tidak kosong
- ✅ Minimal 2 opsi, maksimal 5
- ✅ Semua opsi terisi
- ✅ Ada jawaban benar
- ✅ Jawaban benar valid (ada di opsi)

### **3. Semantic Validation (AI)**
Memeriksa makna & logika:
- ✅ Grammar & spelling
- ✅ Soal jelas dan tidak ambigu
- ✅ Opsi tidak bertabrakan
- ✅ Jawaban benar sesuai konteks
- ✅ Tingkat kesulitan seimbang

### **4. Duplicate Detection (AI)**
Mencari soal yang sama/mirip:
- ✅ Exact duplicate (100% sama)
- ✅ Near duplicate (>80% similarity)
- ✅ Paraphrase detection
- ✅ Semantic similarity

---

## 📊 Severity Levels

### **🔴 ERROR (Critical)**
**Harus diperbaiki** sebelum bisa digunakan:
- ❌ Missing required fields
- ❌ Invalid answer key
- ❌ Corrupt data format
- ❌ Duplicate IDs

### **🟡 WARNING (Important)**
**Sebaiknya diperbaiki** untuk kualitas optimal:
- ⚠️ Grammar/spelling issues
- ⚠️ Unclear questions
- ⚠️ Similar duplicates
- ⚠️ Inconsistent format

### **🔵 INFO (Optional)**
**Nice to have** - saran perbaikan:
- ℹ️ Better wording suggestions
- ℹ️ Add more explanation
- ℹ️ Difficulty balancing
- ℹ️ Metadata enrichment

---

## ✨ Advanced Features

### **Batch Validation**
Validasi multiple files sekaligus:
1. Upload beberapa file CSV/JSON
2. Pilih validation mode
3. Sistem process semua file
4. Download report gabungan

### **Custom Rules**
Buat aturan validasi sendiri:
```javascript
{
  "minQuestionLength": 20,
  "maxQuestionLength": 500,
  "requiredOptions": 4,
  "allowExplanation": true,
  "strictGrammar": true
}
```

### **Validation Templates**
Gunakan template untuk domain spesifik:
- 📚 **Academic** - Standar soal akademik
- 🏢 **Corporate** - Standar training perusahaan
- 🎓 **Certification** - Standar sertifikasi
- 🎯 **Custom** - Aturan sendiri

---

## 🔧 Troubleshooting

### **Banyak false positives?**
- Sesuaikan sensitivity level
- Gunakan custom rules
- Whitelist kata/frasa tertentu

### **AI validation terlalu strict?**
- Turunkan threshold
- Pilih mode "Warning only"
- Review manual untuk borderline cases

### **File besar lambat?**
- Split menjadi beberapa batch
- Gunakan Basic Validation dulu
- Process di background (async)

---

## 📈 Best Practices

### **Sebelum Validation:**
1. ✅ Backup file original
2. ✅ Gunakan template standar
3. ✅ Bersihkan data manual dulu
4. ✅ Pisahkan soal per kategori

### **Saat Validation:**
1. ✅ Mulai dengan Basic Validation
2. ✅ Perbaiki ERROR dulu
3. ✅ Review WARNING satu-satu
4. ✅ Abaikan INFO jika tidak penting

### **Setelah Validation:**
1. ✅ Re-validate setelah fix
2. ✅ Test sample soal
3. ✅ Backup hasil clean
4. ✅ Dokumentasikan perubahan

---

## 📊 Validation Report Example

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 VALIDATION REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

File: soal_matematika.csv
Date: 2025-01-15 14:30:00
Total Questions: 100

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Valid:    85 (85%)
⚠️ Warning:  10 (10%)
❌ Error:     5 (5%)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔍 ISSUES BREAKDOWN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Grammar Issues:        8
Duplicate Questions:   2
Missing Options:       3
Invalid Answers:       2

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 RECOMMENDATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Fix 5 critical errors immediately
2. Review 10 warnings for quality
3. Consider adding explanations
4. Balance difficulty levels
```

---

## 📞 Butuh Bantuan?

Jika ada pertanyaan atau kendala:
1. Cek FAQ di website
2. Hubungi support team
3. Join komunitas user

---

**Happy Validating! ✅**
