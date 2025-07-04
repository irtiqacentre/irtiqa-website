const files = Array.from({ length: 19 }, (_, i) =>
  `books/books${(i + 1).toString().padStart(2, '0')}.json`
);

let allData = [];

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

function normalizeArabic(str) {
  if (!str || typeof str !== 'string') return '';
  return str
    .normalize("NFD")
    .replace(/[\u064B-\u065F\u0610-\u061A\u06D6-\u06ED]/g, '') // remove harakat
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .trim()
    .toLowerCase();
}

document.getElementById('searchInput').addEventListener('input', () => {
  const query = normalizeArabic(document.getElementById('searchInput').value);
  displayResults(query);
});

document.getElementById('searchBtn').addEventListener('click', () => {
  const query = normalizeArabic(document.getElementById('searchInput').value);
  displayResults(query);
});

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
    sectionDiv.innerHTML = `<h2>Section ${section}</h2>`;

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