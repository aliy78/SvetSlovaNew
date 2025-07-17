const bookSelect = document.getElementById('bookSelect');
const chaptersContainer = document.getElementById('chaptersContainer');

let bibleData = null;

// Загружаем bible.json
fetch('data/bible.json')
  .then(response => response.json())
  .then(data => {
    bibleData = data;
    populateBooks(data.Books);
  })
  .catch(error => {
    chaptersContainer.innerHTML = '<p style="color:red;">Ошибка загрузки Библии 😢</p>';
    console.error('Ошибка загрузки bible.json:', error);
  });

// Наполняем список книг
function populateBooks(books) {
  bookSelect.innerHTML = '';
  books.forEach((book, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = book.BookName;
    bookSelect.appendChild(option);
  });

  // Отображаем первую книгу по умолчанию
  showChapters(0);
}

// При смене книги
bookSelect.addEventListener('change', () => {
  const index = parseInt(bookSelect.value, 10);
  showChapters(index);
});

// Показываем главы и стихи выбранной книги
function showChapters(bookIndex) {
  const book = bibleData.Books[bookIndex];
  chaptersContainer.innerHTML = `<h2>${book.BookName}</h2>`;

  book.Chapters.forEach(chapter => {
    const chapterDiv = document.createElement('div');
    chapterDiv.className = 'chapter-block';
    chapterDiv.innerHTML = `<h3>Глава ${chapter.ChapterId}</h3>`;

    chapter.Verses.forEach(verse => {
      const verseP = document.createElement('p');
      verseP.textContent = `${chapter.ChapterId}:${verse.VerseId} — ${verse.Text}`;
      chapterDiv.appendChild(verseP);
    });

    chaptersContainer.appendChild(chapterDiv);
  });
}
