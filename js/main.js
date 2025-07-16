const verseEl = document.getElementById('dailyVerse');
const speakBtn = document.getElementById('speakVerseBtn');
const stopBtn = document.getElementById('stopSpeechBtn');
const themeToggle = document.getElementById('themeToggle');
const refreshBtn = document.getElementById('refreshVerseBtn');
const dateEl = document.getElementById('currentDate');
let allVerses = [];

function displayRandomVerse() {
  if (allVerses.length === 0) return;
  const randomIndex = Math.floor(Math.random() * allVerses.length);
  const selected = allVerses[randomIndex];
  verseEl.textContent = `${selected.ref} — ${selected.text}`;
}

// Загрузка Библии
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
    displayRandomVerse();
  })
  .catch(err => {
    verseEl.textContent = 'Не удалось загрузить стих 😢';
    console.error('Ошибка загрузки bible.json:', err);
  });

// Озвучка
if (speakBtn) {
  speakBtn.addEventListener('click', () => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(verseEl.textContent);
    utterance.lang = 'ru-RU';
    speechSynthesis.speak(utterance);
  });
}

// Остановка озвучки
if (stopBtn) {
  stopBtn.addEventListener('click', () => {
    speechSynthesis.cancel();
  });
}

// Обновление стиха
if (refreshBtn) {
  refreshBtn.addEventListener('click', () => {
    speechSynthesis.cancel();
    displayRandomVerse();
  });
}

// Переключение темы
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
}

// Заставка + текущая дата
window.addEventListener('load', () => {
  const splash = document.getElementById('splashScreen');
  if (splash) {
    setTimeout(() => {
      splash.style.display = 'none';
    }, 2500);
  }

  // Отображение даты
  if (dateEl) {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = today.toLocaleDateString('ru-RU', options);
  }
});



