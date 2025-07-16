const verseEl = document.getElementById('dailyVerse');
const speakBtn = document.getElementById('speakVerseBtn');
const refreshBtn = document.getElementById('refreshVerseBtn');
const shareBtn = document.getElementById('shareVerseBtn');
const themeToggle = document.getElementById('themeToggle');
const dateEl = document.getElementById('currentDate');
const dailyDate = document.getElementById('dailyDate');
let allVerses = [];

function updateDailyDate() {
  if (!dailyDate) return;
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  dailyDate.textContent = `Сегодня — ${today.toLocaleDateString('ru-RU', options)}`;
}

function displayRandomVerse() {
  if (allVerses.length === 0) {
    verseEl.textContent = 'Нет доступных стихов.';
    return;
  }
  const randomIndex = Math.floor(Math.random() * allVerses.length);
  const selected = allVerses[randomIndex];
  verseEl.textContent = `${selected.ref} — ${selected.text}`;
}

// Загрузка полной Библии
fetch('data/bible.json')
  .then(res => res.json())
  .then(data => {
    if (!data.Books) throw new Error('Нет поля Books');

    data.Books.forEach(book => {
      if (!book.Chapters) return;
      book.Chapters.forEach(chapter => {
        if (!chapter.Verses) return;
        chapter.Verses.forEach(verse => {
          allVerses.push({
            ref: `${book.BookName} ${chapter.ChapterId}:${verse.VerseId}`,
            text: verse.Text
          });
        });
      });
    });

    displayRandomVerse();
  })
  .catch(err => {
    verseEl.textContent = 'Не удалось загрузить стих 😢';
    console.error('Ошибка загрузки bible.json:', err);
  });

// Озвучка стиха
if (speakBtn) {
  speakBtn.addEventListener('click', () => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(verseEl.textContent);
    utterance.lang = 'ru-RU';
    speechSynthesis.speak(utterance);
  });
}

// Обновить стих
if (refreshBtn) {
  refreshBtn.addEventListener('click', () => {
    speechSynthesis.cancel();
    displayRandomVerse();
    updateDailyDate();
  });
}

// Поделиться
if (shareBtn) {
  shareBtn.addEventListener('click', () => {
    const verseText = verseEl.textContent;
    const encoded = encodeURIComponent(verseText);
    const choice = prompt('Отправить через:\n1 — WhatsApp\n2 — Telegram');
    if (choice === '1') {
      window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    } else if (choice === '2') {
      window.open(`https://t.me/share/url?url=&text=${encoded}`, '_blank');
    } else {
      alert('Отправка отменена.');
    }
  });
}

// Смена темы
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
}

// Заставка + дата
window.addEvent
