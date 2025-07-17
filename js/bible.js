// Получаем элементы
const bookSelect = document.getElementById('bookSelect');
const chapterSelect = document.getElementById('chapterSelect');
const chapterText = document.getElementById('chapterText');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const searchResults = document.getElementById('searchResults');

let bibleData = null;

// Загружаем bible.json
fetch('data/bible.json')
  .then(response => response.json())
  .then(data => {
    bibleData = data;
    populateBooks(data.Books);
  })
  .catch(error => {
    chapterText.innerHTML = '<p style="color:red;">Ошибка загрузки Библии 😢</p>';
    console.error(error);
  });

// Создаём список книг
function populateBooks(books) {
  bookSelect.innerHTML = '';
  books.forEach((book, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = book.BookName;
    bookSelect.appendChild(option);
  });
  populateChapters(0);
}

// Обновляем главы при выборе книги
bookSelect.addEventListener('change', () => {
  const bookIndex = parseInt(bookSelect.value);
  populateChapters(bookIndex);
});

// Создаём список глав выбранной книги
function populateChapters(bookIndex) {
  const book = bibleData.Books[bookIndex];
  chapterSelect.innerHTML = '';
  book.Chapters.forEach((chapter, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `Глава ${chapter.ChapterId}`;
    chapterSelect.appendChild(option);
  });
  showChapter(bookIndex, 0);
}

// Обновляем стихи при выборе главы
chapterSelect.addEventListener('change', () => {
  const bookIndex = parseInt(bookSelect.value);
  const chapterIndex = parseInt(chapterSelect.value);
  showChapter(bookIndex, chapterIndex);
});

// Отображаем стихи выбранной главы
function showChapter(bookIndex, chapterIndex) {
  const book = bibleData.Books[bookIndex];
  const chapter = book.Chapters[chapterIndex];
  chapterText.innerHTML = `<h2>${book.BookName} — Глава ${chapter.ChapterId}</h2>`;

  chapter.Verses.forEach(verse => {
    const p = document.createElement('p');
    p.textContent = `${chapter.ChapterId}:${verse.VerseId} — ${verse.Text}`;
    chapterText.appendChild(p);
  });

  searchResults.innerHTML = ''; // очищаем результаты поиска
}

// 🔍 Поиск по всем стихам
searchBtn?.addEventListener('click', () => {
  const query = searchInput.value.trim().toLowerCase();
  searchResults.innerHTML = '';

  if (!query) {
    searchResults.innerHTML = '<p>Введите слово или фразу для поиска.</p>';
    return;
  }

  let results = [];

  bibleData.Books.forEach(book => {
    book.Chapters.forEach(ch => {
      ch.Verses.forEach(v => {
        if (v.Text.toLowerCase().includes(query)) {
          results.push({
            ref: `${book.BookName} ${ch.ChapterId}:${v.VerseId}`,
            text: v.Text
          });
        }
      });
    });
  });

  if (results.length === 0) {
    searchResults.innerHTML = `<p>Ничего не найдено по запросу: <b>${query}</b></p>`;
  } else {
    searchResults.innerHTML = `<h2>Результаты поиска (${results.length}):</h2>`;
    results.forEach(item => {
      const p = document.createElement('p');
      p.textContent = `${item.ref} — ${item.text}`;
      searchResults.appendChild(p);
    });
  }
});
