// ✅ عناوين الأقسام
const sectionTitles = [
  "تفسير القرآن الكريم",
  "أصول التفسير وعلوم القرآن",
  "الحديث",
  "شروح الحديث",
  "مصطلح الحديث",
  "العقيدة والأديان والفرق",
  "الفقه",
  "أصول الفقه",
  "الفتاوى",
  "السيرة",
  "التاريخ",
  "التراجم",
  "اللغة",
  "الدعوة",
  "مجموعات",
  "متفرقات",
  "مطويات",
  "مجلات",
  "كتب بالأردية"
];

// ✅ أسماء الملفات
const files = Array.from({ length: 20 }, (_, i) =>
  `books/librarydata${(i + 1).toString().padStart(2, '0')}.json`
);

// ✅ رؤوس الأعمدة
const headers = [
  "الرقم",
  "اسم الكتاب",
  "المؤلف",
  "المحقق",
  "المجلد",
  "دار النشر",
  "الطبعة",
  "الرقم العام"
];

// ✅ بيانات الكتب
let allData = [];

// ✅ تحميل وتحويل البيانات
Promise.all(
  files.map((file, index) =>
    fetch(file)
      .then(res => res.json())
      .then(data => {
        const books = data.map(row => {
          let book = {};
          headers.forEach((key, i) => {
            book[key] = row[i] ?? "-";
          });
          return book;
        });
        return { section: index + 1, books };
      })
      .catch(() => ({ section: index + 1, books: [] }))
  )
).then(data => {
  allData = data;
  displayResults('');
});

// ✅ تطبيع العربية (إزالة الحركات)
function normalizeArabic(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .normalize("NFD")
    .replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

// ✅ البحث عند الكتابة أو الضغط
document.getElementById('searchInput').addEventListener('input', () => {
  const query = normalizeArabic(document.getElementById('searchInput').value);
  displayResults(query);
});

document.getElementById('searchBtn')?.addEventListener('click', () => {
  const query = normalizeArabic(document.getElementById('searchInput').value);
  displayResults(query);
});

document.getElementById('searchInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const query = normalizeArabic(e.target.value);
    displayResults(query);
  }
});

// ✅ عرض النتائج
function displayResults(query) {
  const container = document.getElementById('results');
  container.innerHTML = '';

  let foundAny = false;

  allData.forEach(({ section, books }) => {
    const filtered = books.filter(book => {
      return Object.values(book).some(value =>
        normalizeArabic(String(value)).includes(query)
      );
    });

    if (filtered.length === 0) return;

    foundAny = true;

    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section';

    const sectionTitle = sectionTitles[section - 1] || `قسم ${section}`;
    sectionDiv.innerHTML = `<h2>📚 ${sectionTitle} (${filtered.length})</h2>`;

    filtered.forEach(book => {
      const card = document.createElement('div');
      card.className = 'book-card';

      let html = '';
      for (const key in book) {
        html += `<strong>${key}:</strong> ${book[key]}<br>`;
      }

      card.innerHTML = html;
      sectionDiv.appendChild(card);
    });

    container.appendChild(sectionDiv);
  });

  if (!foundAny) {
    container.innerHTML = `<div class="no-results">🚫 لا توجد نتائج مطابقة.</div>`;
  }
}
