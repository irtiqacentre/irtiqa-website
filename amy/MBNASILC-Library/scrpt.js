let books = [];

const sectionFiles = [
  { file: 'librarydata01.json', section: 'تفسير القرآن الكريم' },
  { file: 'librarydata02.json', section: 'أصول التفسير وعلوم القرآن' },
  { file: 'librarydata03.json', section: 'الحديث' },
  { file: 'librarydata04.json', section: 'شروح الحديث' },
  { file: 'librarydata05.json', section: 'مصطلح الحديث' },
  { file: 'librarydata06.json', section: 'العقيدة والأديان والفرق' },
  { file: 'librarydata07.json', section: 'الفقه' },
  { file: 'librarydata08.json', section: 'أصول الفقه' },
  { file: 'librarydata09.json', section: 'الفتاوى' },
  { file: 'librarydata10.json', section: 'السيرة' },
  { file: 'librarydata11.json', section: 'التاريخ' },
  { file: 'librarydata12.json', section: 'التراجم' },
  { file: 'librarydata13.json', section: 'اللغة' },
  { file: 'librarydata14.json', section: 'الدعوة' },
  { file: 'librarydata15.json', section: 'مجموعات' },
  { file: 'librarydata16.json', section: 'متفرقات' },
  { file: 'librarydata17.json', section: 'مطويات' },
  { file: 'librarydata18.json', section: 'مجلات' },
  { file: 'librarydata19.json', section: 'كتب بالأردية' }
];

// تحميل كل الملفات بدون رؤوس
Promise.all(
  sectionFiles.map(({ file, section }) =>
    fetch(`books/${file}`)
      .then(res => res.json())
      .then(data => {
        const sectionBooks = data.map(row => {
          return {
            "الرقم": row[0],
            "اسم الكتاب": row[1],
            "المؤلف": row[2],
            "المحقق": row[3],
            "المجلد": row[4],
            "دار النشر": row[5],
            "الطبعة": row[6],
            "الرقم العام": row[7],
            "القسم": section
          };
        });
        books.push(...sectionBooks);
      })
  )
).catch(err => {
  document.getElementById('results').innerHTML = '❌ فشل تحميل الملفات.';
  console.error(err);
  console.log("📚 الكتب المحملة:", books);
});

function performSearch() {
  const query = document.getElementById('searchInput').value.trim().toLowerCase();
  const resultsBox = document.getElementById('results');
  console.log("🔍 البحث عن:", query);
console.log("🧪 عدد النتائج:", filteredBooks.length);
console.log(filteredBooks);

  if (query === "") {
    resultsBox.innerHTML = "⚠️ الرجاء إدخال كلمة للبحث.";
    return;
  }

const filteredBooks = books.filter(book =>
  JSON.stringify(book).toLowerCase().includes(query)
);

  if (filteredBooks.length === 0) {
    resultsBox.innerHTML = `<div class="no-results">🚫 لا توجد نتائج مطابقة.</div>`;
    return;
  }

  const grouped = {};
  filteredBooks.forEach(book => {
    const section = book["القسم"] || "غير محدد";
    if (!grouped[section]) grouped[section] = [];
    grouped[section].push(book);
  });

  let outputHTML = "";
  for (const section in grouped) {
    outputHTML += `
      <div class="result">
        <div class="title">📚 القسم: ${section}</div>
      </div>
    `;
    grouped[section].forEach(book => {
      outputHTML += `
        <div class="result">
          <div class="title">${book["اسم الكتاب"] || 'بدون عنوان'}</div>
          <div class="details">
            المؤلف: ${book["المؤلف"] || '-'}<br>
            المحقق: ${book["المحقق"] || '-'}<br>
            المجلد: ${book["المجلد"] || '-'}<br>
            دار النشر: ${book["دار النشر"] || '-'}<br>
            الطبعة: ${book["الطبعة"] || '-'}<br>
            الرقم العام: ${book["الرقم العام"] || '-'}<br>
            رقم الفهرسة: ${book["الرقم"] || '-'}
          </div>
        </div>
      `;
    });
  }

  resultsBox.innerHTML = outputHTML;
}

document.getElementById('searchInput').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') performSearch();
});
