const verseEl = document.getElementById('dailyVerse');
const speakBtn = document.getElementById('speakVerseBtn');
const themeToggle = document.getElementById('themeToggle');

// Загрузка Библии и выбор стиха дня
fetch('data/bible.json')
  .then(res => res.json())
  .then(data => {
    const allVerses = [];
    data.Books.forEach(book => {
      book.Chapters.forEach(chapter => {
        chapter.Verses.forEach(verse => {
          allVerses.push(`${book.BookName} ${chapter.ChapterId}:${verse.VerseId} — ${verse.Text}`);
        });
      });
    });

    const randomIndex = Math.floor(Math.random() * allVerses.length);
    verseEl.textContent = allVerses[randomIndex];
  })
  .catch(err => {
    verseEl.textContent = 'Не удалось загрузить стих 😢';
    console.error('Ошибка загрузки bible.json:', err);
  });

// Озвучка стиха
if (speakBtn) {
  speakBtn.addEventListener('click', () => {
    const utterance = new SpeechSynthesisUtterance(verseEl.textContent);
    utterance.lang = 'ru-RU';
    speechSynthesis.speak(utterance);
  });
}

// Переключение темы
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    const isDark = document.body.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // Загрузка сохранённой темы
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
  }
}
