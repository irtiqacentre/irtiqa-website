function performSearch() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultsBox = document.getElementById('results');

  if (!query) {
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
      <div class="title">${book["اسم الكتاب"]}</div>
      <div class="details">
        المؤلف: ${book["المؤلف"]}<br>
        الرقم العام: ${book["الرقم العام"]}
      </div>
    </div>
  `).join('');
}
