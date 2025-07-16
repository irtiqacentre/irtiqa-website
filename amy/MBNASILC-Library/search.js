// Mapping of JSON files and their Arabic sections
const fileMappings = [
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata01.json', section: 'قسم تفسير القرآن الكريم' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata02.json', section: 'قسم أصول التفسير وعلوم القرآن' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata03.json', section: 'قسم الحديث' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata04.json', section: 'قسم شروح الحديث' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata05.json', section: 'قسم مصطلح الحديث' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata06.json', section: 'قسم العقيدة والأديان والفرق' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata07.json', section: 'قسم الفقه' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata08.json', section: 'قسم أصول الفقه' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata09.json', section: 'قسم الفتاوى' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata10.json', section: 'قسم السيرة' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata11.json', section: 'قسم التاريخ' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata12.json', section: 'قسم التراجم' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata13.json', section: 'قسم اللغة' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata14.json', section: 'قسم الدعوة' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata15.json', section: 'قسم مجموعات' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata16.json', section: 'قسم متفرقات' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata17.json', section: 'قسم مطويات' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata18.json', section: 'قسم مجلات' },
  { url: 'https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata19.json', section: 'قسم كتب بالأردية' }
];

// Attach Enter key support via JavaScript only
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
      performSearch(); // Trigger the same function used by the search-icon
    }
  });
});

// Main search function used by both click & Enter
async function performSearch() {
  const searchInput = document.getElementById("search-input");
  const query = searchInput.value.trim().toLowerCase();
  const resultsContainer = document.getElementById("results");

  resultsContainer.innerHTML = "<p>جارٍ التحميل...</p>";

  if (!query) {
    resultsContainer.innerHTML = "<p>من فضلك أدخل كلمة البحث.</p>";
    return;
  }

  const fetchPromises = fileMappings.map(async ({ url, section }) => {
    try {
      const res = await fetch(url);
      const data = await res.json();

      // ✅ تعديل هنا: التعامل مع بيانات على شكل [ [..], [..] ]
      const matched = data.filter(item =>
        item.some(field =>
          typeof field === 'string' &&
          field.toLowerCase().includes(query)
        )
      );

      if (matched.length > 0) {
        return { section, matched };
      }
    } catch (error) {
      console.error("خطأ في تحميل: " + url, error);
    }
    return null;
  });

  const allResults = await Promise.all(fetchPromises);
  const finalResults = allResults.filter(x => x !== null);

  if (finalResults.length === 0) {
    resultsContainer.innerHTML = "<p>لا توجد نتائج.</p>";
    return;
  }

  resultsContainer.innerHTML = "";

  finalResults.forEach(({ section, matched }) => {
    const sectionDiv = document.createElement("div");
    sectionDiv.classList.add("result-section");

    const title = document.createElement("h3");
    title.textContent = section;
    sectionDiv.appendChild(title);

    matched.forEach(item => {
      const itemDiv = document.createElement("div");
      itemDiv.classList.add("result-item");

      itemDiv.innerHTML = `
        <p><strong>📘 ${item[1] || "بدون عنوان"}</strong></p>
        ${item[2] ? `<p>✍️ المؤلف: ${item[2]}</p>` : ""}
        ${item[3] ? `<p>🔍 المحقق: ${item[3]}</p>` : ""}
        ${item[4] ? `<p>📚 المجلد: ${item[4]}</p>` : ""}
        ${item[5] ? `<p>🏢 دار النشر: ${item[5]}</p>` : ""}
        ${item[6] ? `<p>🖨️ الطبعة: ${item[6]}</p>` : ""}
        ${item[7] ? `<p>📑 الرقم العام: ${item[7]}</p>` : ""}
        <hr/>
      `;
      sectionDiv.appendChild(itemDiv);
    });

    resultsContainer.appendChild(sectionDiv);
  });
}
