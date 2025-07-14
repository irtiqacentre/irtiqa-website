let books = [];

fetch("https://irtiqacentre.in/amy/MBNASILC-Library/library01.json")
  .then(response => response.json())
  .then(data => {
    const headers = data[0];
    books = data.slice(1).map(row => {
      let obj = {};
      headers.forEach((key, i) => {
        obj[key] = row[i];
      });
      return obj;
    });
  })
  .catch(err => {
    document.getElementById('results').innerHTML = '❌ فشل تحميل البيانات.';
    console.error(err);
  });

function performSearch() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultsBox = document.getElementById('results');

  if (query === "") {
    resultsBox.innerHTML = "⚠️ الرجاء إدخال كلمة للبحث.";
    return;
  }

  const results = books.filter(book =>
    (book["اسم الكتاب"] && book["اسم الكتاب"].toLowerCase().includes(query)) ||
    (book["المؤلف"] && book["المؤلف"].toLowerCase().includes(query)) ||
    (book["الرقم العام"] && book["الرقم العام"].toLowerCase().includes(query))
  );

  if (results.length === 0) {
    resultsBox.innerHTML = `<div class="no-results">🚫 لا توجد نتائج مطابقة.</div>`;
    return;
  }

  resultsBox.innerHTML = results.map(book => `
    <div class="result">
      <div class="title">${book["اسم الكتاب"] || 'بدون عنوان'}</div>
      <div class="details">
        المؤلف: ${book["المؤلف"] || '-'}<br>
        المحقق: ${book["المحقق"] || '-'}<br>
        عدد المجلدات: ${book["عدد المجلدات"] || '-'}<br>
        دار النشر: ${book["دار النشر"] || '-'}<br>
        الطبعة: ${book["الطبعة"] || '-'}<br>
        الرقم العام: ${book["الرقم العام"] || '-'}
      </div>
    </div>
  `).join('');
}

document.getElementById('searchInput').addEventListener('keydown', function(e) {
  if (e.key === 'Enter') performSearch();
});
