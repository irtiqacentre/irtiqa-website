const jsonFiles = Array.from({ length: 19 }, (_, i) =>
  `https://irtiqacentre.in/amy/MBNASILC-Library/books/librarydata${String(i + 1).padStart(2, '0')}.json`
);

const categories = [
  "قسم تفسير القرآن الكريم", "قسم أصول التفسير وعلوم القرآن", "قسم الحديث",
  "قسم شروح الحديث", "قسم مصطلح الحديث", "قسم العقيدة والأديان والفرق", "قسم الفقه",
  "قسم أصول الفقه", "قسم الفتاوى", "قسم السيرة", "قسم التاريخ", "قسم التراجم",
  "قسم اللغة", "قسم الدعوة", "قسم المجموعات", "قسم المتفرقات", "قسم المطويات",
  "قسم المجلات", "قسم الكتب بالأردية"
];

document.getElementById("search-input").addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    performSearch();
  }
});

async function performSearch() {
  const query = document.getElementById("search-input").value.trim();
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = ""; // Clear previous results

  if (!query) {
    resultsContainer.innerHTML = "🔎 أدخل كلمة للبحث أعلاه.";
    return;
  }

  let totalResults = 0;

  for (let i = 0; i < jsonFiles.length; i++) {
    try {
      const response = await fetch(jsonFiles[i]);
      const data = await response.json();

      const matched = data.filter(book =>
        book[1]?.includes(query) || book[2]?.includes(query)
      );

      if (matched.length > 0) {
        const section = document.createElement("div");
        section.classList.add("result");

        section.innerHTML = `
          <div class="title">${categories[i]}</div>
          <div class="details">
            ${matched.map(book => `
              <h1 class="BookName">📘 ${book[1]}</h1><br>
              <h2 class="OtherDetails">المؤلف:</h2> ${book[2] || "غير معروف"}<br>
              <h2 class="OtherDetails">المحقق:</h2> ${book[3] || "—"}<br>
              <h2 class="OtherDetails">المجلد:</h2> ${book[4] || "—"}<br>
              <h2 class="OtherDetails">دار النشر:</h2> ${book[5] || "—"}<br>
              <h2 class="OtherDetails">الطبعة:</h2> ${book[6] || "—"}<br>
              <h2 class="OtherDetails">الرقم العام:</h2> ${book[7] || "—"}<br><br>
            `).join("")}
          </div>
        `;
        resultsContainer.appendChild(section);
        totalResults += matched.length;
      }
    } catch (error) {
      console.error(`خطأ في تحميل الملفات ${jsonFiles[i]}:`, error);
    }
  }

  if (totalResults === 0) {
    resultsContainer.innerHTML = `<div class="no-results">لا توجد نتائج لـ "${query}"</div>`;
  }
}

const spinner = document.getElementById("loading-spinner");

async function performSearch() {
  const query = document.getElementById("search-input").value.trim();
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";
  spinner.style.display = "block"; // Show spinner

  if (!query) {
    spinner.style.display = "none";
    resultsContainer.innerHTML = `<div class="msg">🔎 أدخل كلمة للبحث أعلاه.</div>`;
    return;
  }

  let totalResults = 0;

  for (let i = 0; i < jsonFiles.length; i++) {
    try {
      const response = await fetch(jsonFiles[i]);
      const data = await response.json();

      const matched = data.filter(book =>
        book[1]?.includes(query) || book[2]?.includes(query)
      );

      if (matched.length > 0) {
        const section = document.createElement("div");
        section.classList.add("result");

        section.innerHTML = `
          <div class="title">${categories[i]}</div>
          <div class="details">
            ${matched.map(book => `
              <div class="card">
                <span class="BookName">${book[1]}</span><br>
                <span class="SideTitle">المؤلف:</span><span class="OtherDetail">${book[2] || "غير معروف"}</span><br>
                <span class="SideTitle">المحقق:</span><span class="OtherDetail">${book[3] || "غير معروف"}</span><br>
                <span class="SideTitle">المجلد:</span><span class="OtherDetail">${book[4] || "غير معروف"}</span><br>
                <span class="SideTitle">دار النشر:</span><span class="OtherDetail">${book[5] || "غير معروف"}</span><br>
                <span class="SideTitle">الطبعة:</span><span class="OtherDetail">${book[6] || "غير معروف"}</span><br>
                <span class="SideTitle">الرقم العام:</span><span class="OtherDetail">${book[7] || "غير معروف"}</span><br>
              </div>
            `).join("")}
          </div>
        `;
        resultsContainer.appendChild(section);
        totalResults += matched.length;
      }
    } catch (error) {
      console.error(`خطأ في تحميل الملفات ${jsonFiles[i]}:`, error);
    }
  }

  spinner.style.display = "none"; // Hide spinner

  if (totalResults === 0) {
    resultsContainer.innerHTML = `<div class="no-results">لا توجد نتائج لـ (${query})</div>`;
  }
}