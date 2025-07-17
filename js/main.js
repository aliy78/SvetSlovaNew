const verseEl = document.getElementById('dailyVerse');
const dailyDate = document.getElementById('dailyDate');
const speakBtn = document.getElementById('speakVerseBtn');
const refreshBtn = document.getElementById('refreshVerseBtn');
const shareBtn = document.getElementById('shareVerseBtn');
const themeToggle = document.getElementById('themeToggle');

let allVerses = [];

function updateDailyDate() {
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  dailyDate.textContent = `Сегодня — ${today.toLocaleDateString('ru-RU', options)}`;
}

function displayVerseOfDay() {
  if (allVerses.length === 0) {
    verseEl.textContent = 'Нет доступных стихов.';
    return;
  }

  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  const index = seed % allVerses.length;
  const selected = allVerses[index];

  verseEl.textContent = `${selected.ref} — ${selected.text}`;
}

fetch('data/bible.json')
  .then(response => response.json())
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
    updateDailyDate();
  })
  .catch(error => {
    verseEl.textContent = 'Ошибка загрузки стиха.';
    console.error('Ошибка загрузки Bible.json:', error);
  });

refreshBtn?.addEventListener('click', () => {
  displayVerseOfDay();
  updateDailyDate();
});

speakBtn?.addEventListener('click', () => {
  const utterance = new SpeechSynthesisUtterance(verseEl.textContent);
  utterance.lang = 'ru-RU';
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
});

shareBtn?.addEventListener('click', () => {
  const verseText = verseEl.textContent;
  const encoded = encodeURIComponent(verseText);
  window.open(`https://t.me/share/url?url=&text=${encoded}`, '_blank');
});

themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
