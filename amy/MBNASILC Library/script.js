// ✅ Arabic Section Titles
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

// ✅ Load all 19 JSON files
const files = Array.from({ length: 19 }, (_, i) =>
  `books/books${(i + 1).toString().padStart(2, '0')}.json`
);

let allData = [];

// ✅ Fetch all JSON data
Promise.all(
  files.map((file, index) =>
    fetch(file)
      .then(res => res.json())
      .then(data => ({ section: index + 1, books: data }))
      .catch(() => ({ section: index + 1, books: [] }))
  )
).then(data => {
  allData = data;
  displayResults('');
});

// ✅ Normalize Arabic for searching
function normalizeArabic(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .normalize("NFD")
    .replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED]/g, '') // remove harakat
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .trim()
    .toLowerCase();
}

// ✅ Event Listeners
document.getElementById('searchInput').addEventListener('input', () => {
  const query = normalizeArabic(document.getElementById('searchInput').value);
  displayResults(query);
});

document.getElementById('searchBtn').addEventListener('click', () => {
  const query = normalizeArabic(document.getElementById('searchInput').value);
  displayResults(query);
});

// ✅ Main display logic
function displayResults(query) {
  const container = document.getElementById('results');
  container.innerHTML = '';

  allData.forEach(({ section, books }) => {
    const filtered = books.filter(book => {
      return Object.values(book).some(value =>
        normalizeArabic(String(value)).includes(query)
      );
    });

    if (filtered.length === 0) return;

    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'section';

    // ✅ Use Arabic title instead of Section 1/2/3...
    const sectionTitle = sectionTitles[section - 1] || `قسم ${section}`;
    sectionDiv.innerHTML = `<h2>${sectionTitle}</h2>`;

    // ✅ Show all book fields
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
}