const verseEl = document.getElementById('dailyVerse');
let allVerses = [];

function displayVerseOfDay() {
  if (allVerses.length === 0) {
    verseEl.textContent = 'Нет доступных стихов.';
    return;
  }
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth()+1)*100 + today.getDate();
  const index = seed % allVerses.length;
  const selected = allVerses[index];
  verseEl.textContent = `${selected.ref} — ${selected.text}`;
}

fetch('data/bible.json')
  .then(res => res.json())
  .then(data => {
    data.Books.forEach(book => {
      book.Chapters.forEach(chapter => {
        chapter.Verses.forEach(verse => {
          allVerses.push({
            ref: `${book.BookName} ${chapter.ChapterId}:${verse.VerseId}`,
            text: verse.Text
          });
        });
      });
    });
    displayVerseOfDay();
  })
  .catch(err => {
    verseEl.textContent = 'Ошибка загрузки Библии 😢';
    console.error(err);
  });
