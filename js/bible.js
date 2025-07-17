const bookSelect = document.getElementById('bookSelect');
const chaptersContainer = document.getElementById('chaptersContainer');
let bibleData = null;

fetch('data/bible.json')
  .then(res => res.json())
  .then(data => {
    bibleData = data;
    populateBooks(data.Books);
  })
  .catch(err => {
    chaptersContainer.innerHTML = 'Ошибка загрузки Библии.';
    console.error(err);
  });

function populateBooks(books) {
  bookSelect.innerHTML = '';
  books.forEach((book, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = book.BookName;
    bookSelect.appendChild(option);
  });
  showChapters(0); // показываем главы первой книги
}

bookSelect.addEventListener('change', () => {
  const bookIndex = bookSelect.value;
  showChapters(bookIndex);
});

function showChapters(bookIndex) {
  const book = bibleData.Books[bookIndex];
  chaptersContainer.innerHTML = `<h2>${book.BookName}</h2>`;
  book.Chapters.forEach(chapter => {
    const chapterDiv = document.createElement('div');
    chapterDiv.innerHTML = `<h3>Глава ${chapter.ChapterId}</h3>`;
    chapter.Verses.forEach(verse => {
      const p = document.createElement('p');
      p.textContent = `${chapter.ChapterId}:${verse.VerseId} — ${verse.Text}`;
      chapterDiv.appendChild(p);
    });
    chaptersContainer.appendChild(chapterDiv);
  });
}
