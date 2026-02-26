# 🏷️ Tutorial Tagging Soal

Panduan lengkap untuk menggunakan fitur **Tagging** - memberikan label kategori dan chapter pada soal-soal secara otomatis dengan AI atau manual.

---

## 🎯 Apa itu Tagging?

Fitur **Tagging** membantu Anda mengorganisir soal-soal dengan memberikan label **kategori** dan **sub-kategori (chapter)** secara otomatis menggunakan AI, atau secara manual untuk kontrol penuh.

### Manfaat Tagging:
- ✅ Organisir soal berdasarkan topik
- ✅ Mudah mencari soal spesifik
- ✅ Buat bank soal terstruktur
- ✅ Analisis distribusi topik
- ✅ Personalisasi pembelajaran

---

## 📋 Persiapan Awal

### **1. Siapkan Master Data (Taxonomy)**

Master data adalah daftar kategori dan chapter yang akan digunakan untuk tagging.

**Format File:** JSON
**Nama File:** `master-data.json` atau `snbt.json`

**Struktur:**
```json
{
  "info": {
    "title": "SNBT Master Data",
    "description": "Kategori soal SNBT 2024",
    "notes": "Mencakup semua materi TPS & TKA"
  },
  "categories": [
    {
      "id": "cat-bahasa-indonesia",
      "name": "Bahasa Indonesia",
      "description": "Materi bahasa dan sastra Indonesia",
      "chapters": [
        {
          "id": "ch-ejaan",
          "name": "Ejaan dan Tata Bahasa",
          "description": "EYD, tanda baca, struktur kalimat",
          "keywords": ["ejaan", "EYD", "tanda baca", "kalimat"],
          "examples": [
            "Manakah penulisan yang benar?",
            "Perbaiki kalimat berikut..."
          ]
        },
        {
          "id": "ch-paragraf",
          "name": "Sintaksis dan Paragraf",
          "description": "Struktur paragraf, ide pokok",
          "keywords": ["paragraf", "ide pokok", "kalimat utama"],
          "examples": [
            "Ide pokok paragraf tersebut adalah...",
            "Kalimat tidak padu pada paragraf..."
          ]
        }
      ]
    },
    {
      "id": "cat-matematika",
      "name": "Matematika Dasar",
      "description": "Konsep matematika fundamental",
      "chapters": [
        {
          "id": "ch-aljabar",
          "name": "Aljabar",
          "description": "Persamaan, pertidaksamaan, fungsi",
          "keywords": ["persamaan", "variabel", "fungsi", "akar"],
          "examples": [
            "Tentukan nilai x dari persamaan...",
            "Akar-akar persamaan kuadrat..."
          ]
        }
      ]
    }
  ]
}
```

> 💡 **Tips:** Semakin detail description, keywords, dan examples, semakin akurat AI tagging!

---

## 📋 Langkah-langkah Penggunaan

### **Step 1: Upload Master Data**

1. Buka halaman **Tagging**
2. Klik **"Upload Master Data"** (Step 1)
3. Pilih file JSON master data Anda
4. Sistem akan validasi format
5. Jika valid, Anda akan melihat preview:
   - 📊 Total kategori
   - 📚 Total chapter
   - 🏷️ Daftar kategori dengan dropdown

**Atau pilih dari server:**
- Lihat daftar master data yang sudah tersimpan
- Klik **"Use This Master Data"** pada yang diinginkan

---

### **Step 2: Upload File Soal (CSV)**

1. Klik **"Upload CSV Files"** (Step 2)
2. Upload satu atau lebih file CSV
3. Format CSV yang diperlukan:
   ```
   Number,Question,SubCategory,SubSubCategory,A,B,C,D,E,Correct,Explanation
   ```

4. File akan divalidasi:
   - ✅ Format kolom benar
   - ✅ Ada pertanyaan dan opsi
   - ✅ Jawaban valid (A/B/C/D/E)

5. Daftar file muncul di list

> ⚡ **Catatan:** Anda bisa upload multiple CSV untuk di-process sekaligus

---

### **Step 3: Pilih Kategori (Opsional)**

**Untuk Admin Manual Mode:**
1. Centang kategori yang relevan untuk soal Anda
2. AI hanya akan tagging dari kategori yang dipilih
3. Berguna untuk focus domain (misal: hanya Matematika)

**Untuk AI Auto Mode:**
- Skip step ini, AI akan scan semua kategori

---

### **Step 4: Pilih Mode Tagging**

Pilih output version yang diinginkan:

#### **🤖 AI Auto (Recommended)**
AI akan otomatis menentukan tag:
- ✅ **Cepat** - Process ratusan soal dalam menit
- ✅ **Multi-label** - 1 soal bisa punya >1 tag
- ✅ **Smart matching** - Gunakan keywords & examples
- ✅ **Konsisten** - Tidak capek, tidak bias

**Cocok untuk:**
- Bank soal besar (>100 soal)
- Soal baru yang belum dikategorikan
- Quick initial tagging

#### **👤 Admin Manual**
Anda yang menentukan tag secara manual:
- ✅ **Kontrol penuh** - Anda yang memutuskan
- ✅ **Domain expert** - Gunakan keahlian Anda
- ✅ **Quality assurance** - Pastikan 100% akurat

**Cocok untuk:**
- Soal penting (ujian resmi)
- Domain khusus dengan nuansa halus
- Review hasil AI Auto

#### **🔄 Both (AI Auto + Admin Manual)**
Dapatkan keduanya untuk perbandingan:
- ✅ AI sebagai suggestion
- ✅ Manual sebagai ground truth
- ✅ Analisis akurasi AI
- ✅ Training data untuk improve AI

**Cocok untuk:**
- Quality control
- Benchmark AI performance
- Research & development

---

### **Step 5: Review & Edit Tags**

Setelah processing selesai:

#### **📊 Processing Info**
Lihat informasi proses:
- ✅ Status: Processing/Completed
- ⏱️ Duration: Waktu yang dibutuhkan
- 📈 Progress: X/Y soal selesai
- 💰 Cost: Biaya API (jika applicable)
- 🤖 Model: Model AI yang digunakan

#### **📋 Question List**
Semua soal ditampilkan dengan:

**Layout (Jika Both Mode):**
```
┌─────────────────────────────────────────┐
│ #1                                       │
├─────────────────────────────────────────┤
│ Pertanyaan: [BlockNote Editor]          │
├──────────────────┬──────────────────────┤
│ ▎AI Auto         │ ▎Admin Manual       │
│ ▎📁 Bahasa Indo  │ ▎📁 Bahasa Indo     │
│ ▎  📄 Ejaan      │ ▎  📄 Paragraf      │
│ ▎📁 Matematika   │ ▎                   │
│ ▎  📄 Aljabar    │ ▎                   │
│ ▎[+ Add Tag]     │ ▎[+ Add Tag]        │
└──────────────────┴──────────────────────┘
```

**Layout (Jika Single Mode):**
```
┌─────────────────────────────────────────┐
│ #1                        [AI Auto]      │
├─────────────────────────────────────────┤
│ Pertanyaan: [BlockNote Editor]          │
├─────────────────────────────────────────┤
│ 📁 Bahasa Indonesia                     │
│    📄 Ejaan dan Tata Bahasa             │
│ 📁 Matematika Dasar                     │
│    📄 Aljabar                            │
│                                          │
│ [+ Add Category/Chapter]                │
└─────────────────────────────────────────┘
```

#### **✏️ Edit Tags**

Untuk setiap soal, Anda bisa:

**Remove Tag:**
- Hover pada badge kategori/chapter
- Klik **X** yang muncul
- Tag akan dihapus

**Add Tag:**
1. Klik **"+ Add Category/Chapter"**
2. Dialog muncul dengan daftar kategori
3. Pilih kategori:
   - Klik **"Add Category"** untuk tambah seluruh kategori
4. Pilih chapter:
   - Klik **"Add"** di samping chapter tertentu
5. Tag ditambahkan otomatis

> 💡 **Multi-Tag:** Satu soal bisa punya banyak kategori dan chapter!

---

### **Step 6: Download Hasil**

Setelah review selesai, download hasil tagging:

#### **Download Options:**

**1. Download AI Auto CSV**
File CSV dengan tag dari AI:
```csv
Number,Question,A,B,C,D,E,Correct,Explanation,Category,Chapter
1,"Pertanyaan...","Opt A","Opt B","Opt C","Opt D","Opt E","A","Penjelasan","Bahasa Indonesia | Matematika","Ejaan | Aljabar"
```

**2. Download Admin Manual CSV**
File CSV dengan tag manual Anda:
```csv
Number,Question,A,B,C,D,E,Correct,Explanation,Category,Chapter
1,"Pertanyaan...","Opt A","Opt B","Opt C","Opt D","Opt E","A","Penjelasan","Bahasa Indonesia","Paragraf"
```

**Multi-Tag Format:**
- Multiple categories: `"Cat A | Cat B | Cat C"`
- Multiple chapters: `"Ch 1 | Ch 2 | Ch 3"`

---

## 🎯 AI Tagging Details

### **Bagaimana AI Bekerja?**

AI menggunakan **GPT-4o-mini** dengan langkah:

1. **Analyze Question**
   - Baca pertanyaan, opsi, jawaban
   - Extract keywords penting
   - Pahami konteks

2. **Match with Master Data**
   - Bandingkan dengan description tiap chapter
   - Cek keyword matching
   - Similarity dengan examples

3. **Assign Tags**
   - Pilih 1-3 tag paling relevan
   - Multi-label jika question lintas-topik
   - Return confidence score

### **Faktor yang Mempengaruhi Akurasi:**

✅ **Master Data Quality:**
- Description yang detail
- Keywords yang lengkap
- Examples yang representatif

✅ **Question Quality:**
- Pertanyaan jelas tidak ambigu
- Menggunakan istilah standar
- Konteks yang cukup

✅ **Domain Specificity:**
- Domain yang well-defined
- Kategori tidak overlap
- Hierarki yang jelas

---

## 📊 Use Cases

### **1. Bank Soal SNBT/UTBK**
```
Master Data: snbt-2024.json
Categories:
  - TPS (Penalaran Umum, Pemahaman Bacaan, dll)
  - Matematika
  - Fisika, Kimia, Biologi
  - Sejarah, Geografi, Ekonomi
```

### **2. Corporate Training**
```
Master Data: training-sales.json
Categories:
  - Product Knowledge
  - Sales Techniques
  - Customer Service
  - Compliance
```

### **3. School Curriculum**
```
Master Data: kurikulum-merdeka.json
Categories:
  - Kelas 10, 11, 12
  - Per mata pelajaran
  - Per kompetensi dasar
```

---

## ✨ Advanced Features

### **File Manager**
Kelola file master dan hasil:
- 📂 View semua file
- 🗑️ Delete file lama
- 📥 Download file existing
- 📊 Filter by type/date

### **Cost Tracking**
Monitor biaya API usage:
- 💰 Cost per batch
- 📈 Total cost today/month
- 📊 Usage analytics
- 🎯 Budget alerts

### **Model Selection**
Pilih AI model sesuai kebutuhan:
- **gpt-4o-mini** - Cepat & murah (recommended)
- **gpt-4o** - Lebih akurat, lebih mahal
- **gpt-4-turbo** - Balance speed & accuracy

### **Batch Processing**
Process banyak file sekaligus:
1. Upload 10+ CSV files
2. Pilih mode tagging
3. Process semua parallel
4. Download hasil gabungan

---

## 🔧 Troubleshooting

### **Master data tidak valid?**
Cek format JSON:
- ✅ Valid JSON syntax
- ✅ Ada field `categories`
- ✅ Setiap category punya `chapters`
- ✅ Setiap chapter punya `id` dan `name`

### **AI tagging tidak akurat?**
Improve master data:
- Tambahkan `description` detail
- Lengkapi `keywords`
- Sertakan `examples` yang banyak
- Review dan adjust hasil manual

### **Proses terlalu lama?**
Optimasi:
- Split batch besar (>100 soal)
- Gunakan model lebih cepat
- Filter kategori (Admin mode)
- Process di off-peak hours

### **Multi-tag tidak muncul?**
Cek:
- AI confidence threshold
- Question benar-benar multi-topic?
- Master data chapter tidak overlap?

---

## 📈 Best Practices

### **Master Data:**
1. ✅ Gunakan ID yang konsisten (`cat-xxx`, `ch-xxx`)
2. ✅ Description minimal 2-3 kalimat
3. ✅ Keywords 10-20 per chapter
4. ✅ Examples 3-5 per chapter
5. ✅ Update berkala sesuai soal baru

### **Tagging Process:**
1. ✅ Mulai dengan AI Auto untuk initial tag
2. ✅ Review sample (10-20%) untuk QC
3. ✅ Manual edit jika perlu
4. ✅ Re-tag jika akurasi <80%
5. ✅ Export dan backup hasil

### **Quality Control:**
1. ✅ Bandingkan AI vs Manual
2. ✅ Cek distribusi tag (balanced?)
3. ✅ Review edge cases
4. ✅ Document tag decisions
5. ✅ Iterate master data

---

## 📊 Tagging Report Example

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏷️  TAGGING REPORT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Batch ID: batch-20250106-143000
Mode: AI Auto + Admin Manual
Files: 3 CSV files
Questions: 150 total

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 AI AUTO RESULTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Tagged: 148/150 (98.7%)
Untagged: 2 (too ambiguous)

Multi-tag Questions: 45 (30%)
Single-tag Questions: 103 (68.7%)

Average tags per question: 1.4

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 CATEGORY DISTRIBUTION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Bahasa Indonesia:    45 questions
Matematika:          62 questions
Fisika:              28 questions
Biologi:             18 questions

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 COST SUMMARY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Model: gpt-4o-mini
Tokens Used:
  - Input: 125,000 tokens
  - Output: 8,500 tokens
  - Cached: 85,000 tokens

Total Cost: $0.035

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏱️  PERFORMANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Duration: 2m 34s
Speed: ~60 questions/minute
```

---

## 🎓 Pro Tips

### **Untuk Akurasi Maksimal:**
1. 🎯 Buat master data domain-specific (jangan terlalu general)
2. 📚 Include domain terminology di keywords
3. 🔍 Review AI suggestions sebelum accept all
4. 🔄 Iterate: Tag → Review → Improve master → Re-tag

### **Untuk Efisiensi:**
1. ⚡ Batch process file besar saat off-peak
2. 💰 Gunakan gpt-4o-mini untuk draft, gpt-4o untuk final
3. 🎯 Filter kategori di Admin mode untuk focus tagging
4. 📊 Monitor cost dan set budget alerts

### **Untuk Maintenance:**
1. 📅 Review master data setiap 3-6 bulan
2. 📈 Analyze tag distribution untuk balance
3. 🔍 Track problematic questions (hard to tag)
4. 💡 Collect feedback dari user untuk improve

---

## 📞 Butuh Bantuan?

### **Resources:**
- 📖 Full API documentation
- 🎥 Video tutorials
- 💬 Community forum
- 📧 Email support

### **FAQ:**
**Q: Berapa biaya per soal?**
A: ~$0.0002 - $0.0005 per soal (gpt-4o-mini)

**Q: Bisa offline?**
A: Tidak, butuh koneksi untuk AI tagging

**Q: Berapa akurasi AI?**
A: 75-90% tergantung quality master data

**Q: Support bahasa lain?**
A: Ya, support multi-language (EN, ID, etc)

---

**Happy Tagging! 🏷️**
