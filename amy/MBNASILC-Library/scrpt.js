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

      // التصنيف حسب الرقم العام
      const code = obj["الرقم العام"] || '';
      if (code.startsWith("MJ- 1/")) obj["التصنيف"] = "تفسير القرآن الكريم";
      else if (code.startsWith("MJ- 2/")) obj["التصنيف"] = "أصول التفسير وعلوم القرآن";
      else if (code.startsWith("MJ- 3/")) obj["التصنيف"] = "الحديث";
      else if (code.startsWith("MJ- 4/")) obj["التصنيف"] = "شروح الحديث";
      else if (code.startsWith("MJ- 5/")) obj["التصنيف"] = "مصطلح الحديث";
      else if (code.startsWith("MJ- 6/")) obj["التصنيف"] = "العقيدة والأديان والفرق";
      else if (code.startsWith("MJ- 7/")) obj["التصنيف"] = "الفقه";
      else if (code.startsWith("MJ- 8/")) obj["التصنيف"] = "أصول الفقه";
      else if (code.startsWith("MJ- 9/")) obj["التصنيف"] = "الفتاوى";
      else if (code.startsWith("MJ- 10/")) obj["التصنيف"] = "السيرة";
      else if (code.startsWith("MJ- 11/")) obj["التصنيف"] = "التاريخ";
      else if (code.startsWith("MJ- 12/")) obj["التصنيف"] = "التراجم";
      else if (code.startsWith("MJ- 13/")) obj["التصنيف"] = "اللغة";
      else if (code.startsWith("MJ- 14/")) obj["التصنيف"] = "الدعوة";
      else if (code.startsWith("MJ- 15/")) obj["التصنيف"] = "مجموعات";
      else if (code.startsWith("MJ- 16/")) obj["التصنيف"] = "متفرقات";
      else if (code.startsWith("MJ- 17/")) obj["التصنيف"] = "مطويات";
      else if (code.startsWith("MJ- 18/")) obj["التصنيف"] = "مجلات";
      else if (code.startsWith("MJ- 19/")) obj["التصنيف"] = "كتب بالأردية";
      else obj["التصنيف"] = "غير مصنفة";

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

  const grouped = {};
  results.forEach(book => {
    const cat = book["التصنيف"] || "غير مصنفة";
    if (!grouped[cat]) grouped[cat] = [];
    grouped[cat].push(book);
  });

  const order = [
    "تفسير القرآن الكريم", "أصول التفسير وعلوم القرآن", "الحديث", "شروح الحديث", "مصطلح الحديث",
    "العقيدة والأديان والفرق", "الفقه", "أصول الفقه", "الفتاوى", "السيرة", "التاريخ",
    "التراجم", "اللغة", "الدعوة", "مجموعات", "متفرقات", "مطويات", "مجلات", "كتب بالأردية", "غير مصنفة"
  ];

  let html = '';
  for (const category of order) {
    if (!grouped[category]) continue;
    html += `<h3>${category}</h3>`;
    grouped[category].forEach(book => {
      html += `
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
      `;
    });
  }

  resultsBox.innerHTML = html;
}
  const results = books.filter(book =>
    (book["اسم الكتاب"] && book["اسم الكتاب"].toLowerCase().includes(query)) ||
    (book["المؤلف"] && book["المؤلف"].toLowerCase().includes(query)) ||
    (book["الرقم العام"] && book["الرقم العام"].toLowerCase().includes(query))
  );

  if (results.length === 0) {
    resultsBox.innerHTML = `<div class="no-results">🚫 لا توجد نتائج مطابقة.</div>`;
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
