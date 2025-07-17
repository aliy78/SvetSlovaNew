const bookSelect = document.getElementById('bookSelect');
const chapterSelect = document.getElementById('chapterSelect');
const chapterText = document.getElementById('chapterText');

let bibleData = null;

fetch('data/bible.json')
  .then(res => res.json())
  .then(data => {
    bibleData = data;
    populateBooks(data.Books);
  })
  .catch(err => {
    chapterText.innerHTML = '<p style="color:red;">Ошибка загрузки Библии.</p>';
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

  populateChapters(0); // первая книга
}

bookSelect.addEventListener('change', () => {
  populateChapters(bookSelect.value);
});

function populateChapters(bookIndex) {
  const book = bibleData.Books[bookIndex];
  chapterSelect.innerHTML = '';

  book.Chapters.forEach((ch, i) => {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `Глава ${ch.ChapterId}`;
    chapterSelect.appendChild(option);
  });

  showChapter(bookIndex, 0); // первая глава
}

chapterSelect.addEventListener('change', () => {
  const bookIndex = bookSelect.value;
  const chapterIndex = chapterSelect.value;
  showChapter(bookIndex, chapterIndex);
});

function showChapter(bookIndex, chapterIndex) {
  const book = bibleData.Books[bookIndex];
  const chapter = book.Chapters[chapterIndex];
  chapterText.innerHTML = `<h2>${book.BookName} — Глава ${chapter.ChapterId}</h2>`;

  chapter.Verses.forEach(verse => {
    const p = document.createElement('p');
    p.textContent = `${chapter.ChapterId}:${verse.VerseId} — ${verse.Text}`;
    chapterText.appendChild(p);
  });
}
