const categoryMap = {
  'MJ- 1/': 'تفسير القرآن الكريم',
  'MJ- 2/': 'أصول التفسير وعلوم القرآن',
  'MJ- 3/': 'الحديث',
  'MJ- 4/': 'شروح الحديث',
  'MJ- 5/': 'مصطلح الحديث',
  'MJ- 6/': 'العقيدة والأديان والفرق',
  'MJ- 7/': 'الفقه',
  'MJ- 8/': 'أصول الفقه',
  'MJ- 9/': 'الفتاوى',
  'MJ- 10/': 'السيرة',
  'MJ- 11/': 'التاريخ',
  'MJ- 12/': 'التراجم',
  'MJ- 13/': 'اللغة',
  'MJ- 14/': 'الدعوة',
  'MJ- 15/': 'مجموعات',
  'MJ- 16/': 'متفرقات',
  'MJ- 17/': 'مطويات',
  'MJ- 18/': 'مجلات',
  'MJ- 19/': 'كتب بالأردية'
};

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

  const filtered = books.filter(book =>
    (book.title && book.title.toLowerCase().includes(query)) ||
    (book.author && book.author.toLowerCase().includes(query)) ||
    (book.code && book.code.toLowerCase().includes(query))
  );

  if (filtered.length === 0) {
    resultsBox.innerHTML = `<div class="no-results">🚫 لا توجد نتائج مطابقة.</div>`;
    return;
  }

  // إنشاء مجموعات حسب التصنيف
  const grouped = {};

  filtered.forEach(book => {
    let category = 'غير مصنفة';

    for (const prefix in categoryMap) {
      if (book.code && book.code.startsWith(prefix)) {
        category = categoryMap[prefix];
        break;
      }
    }

    if (!grouped[category]) grouped[category] = [];
    grouped[category].push(book);
  });

  // ترتيب التصنيفات حسب الترتيب الأصلي
  const sortedCategories = Object.entries(categoryMap)
    .map(([prefix, name]) => name)
    .filter(name => grouped[name]); // فقط المعروضة

  let html = '';

  sortedCategories.forEach(category => {
    html += `<h3 style="margin-bottom: 15px; color: #0d47a1;">${category}</h3>`;
    grouped[category].forEach(book => {
      html += `
        <div class="result">
          <div class="title">${book.title || 'بدون عنوان'}</div>
          <div class="details">
            المؤلف: ${book.author || '-'}<br>
            المحقق: ${book.translator || '-'}<br>
            المجلد: ${book.volume || '-'}<br>
            الناشر: ${book.publisher || '-'}<br>
            الطبعة: ${book.year || '-'}<br>
            الرقم العام: ${book.code || '-'}
          </div>
        </div>
      `;
    });
  });

  resultsBox.innerHTML = html;
}

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
