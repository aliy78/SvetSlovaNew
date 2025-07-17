const verseBlock = document.getElementById('verseOfDay');
const dateBlock = document.getElementById('verseDate');

function refreshVerseOfDay() {
  verseBlock.textContent = 'Обновление стиха...';
  dateBlock.textContent = '';

  fetch('data/bible.json')
    .then(res => res.json())
    .then(data => {
      const allVerses = [];

      data.Books.forEach(book => {
        book.Chapters.forEach(ch => {
          ch.Verses.forEach(v => {
            allVerses.push({
              ref: `${book.BookName} ${ch.ChapterId}:${v.VerseId}`,
              text: v.Text
            });
          });
        });
      });

      const today = new Date();
      const dayOfYear = getDayOfYear(today);
      const verse = allVerses[dayOfYear % allVerses.length];

      verseBlock.textContent = `${verse.ref} — ${verse.text}`;
      dateBlock.textContent = formatDate(today);
    })
    .catch(err => {
      verseBlock.textContent = 'Ошибка загрузки стиха дня.';
      console.error(err);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  refreshVerseOfDay();
});

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

function formatDate(date) {
  return date.toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}
