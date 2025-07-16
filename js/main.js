// Элементы страницы
const verseEl = document.getElementById('dailyVerse');
const speakBtn = document.getElementById('speakVerseBtn');
const stopBtn = document.getElementById('stopSpeechBtn');
const themeToggle = document.getElementById('themeToggle');

// Загрузка Библии и выбор стиха дня
fetch('data/bible.json')
  .then(res => res.json())
  .then(data => {
    const allVerses = [];

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

    if (allVerses.length === 0) {
      verseEl.textContent = 'Библия загружена, но стихи отсутствуют 😢';
      return;
    }

    const randomIndex = Math.floor(Math.random() * allVerses.length);
    const selected = allVerses[randomIndex];
    verseEl.textContent = `${selected.ref} — ${selected.text}`;
  })
  .catch(err => {
    verseEl.textContent = 'Не удалось загрузить стих 😢';
    console.error('Ошибка загрузки bible.json:', err);
  });

// 🔊 Озвучка стиха
if (speakBtn) {
  speakBtn.addEventListener('click', () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel(); // остановим текущую речь
    }

    const utterance = new SpeechSynthesisUtterance(verseEl.textContent);
    utterance.lang = 'ru-RU';
    speechSynthesis.speak(utterance);
  });
}

// ⏹️ Остановка озвучки
if (stopBtn) {
  stopBtn.addEventListener('click', () => {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
  });
}

// 🌙 Переключение темы
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Загрузка сохранённой темы при запуске
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
}

