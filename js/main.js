const verseEl = document.getElementById('dailyVerse');
const speakBtn = document.getElementById('speakVerseBtn');
const stopBtn = document.getElementById('stopSpeechBtn');
const themeToggle = document.getElementById('themeToggle');

// Загрузка стиха дня
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

    const rand = Math.floor(Math.random() * allVerses.length);
    const selected = allVerses[rand];
    verseEl.textContent = `${selected.ref} — ${selected.text}`;
  })
  .catch(err => {
    verseEl.textContent = 'Не удалось загрузить стих 😢';
    console.error(err);
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

// Тема
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
}

// Заставка
window.addEventListener('load', () => {
  const splash = document.getElementById('splashScreen');
  if (splash) {
    setTimeout(() => {
      splash.style.display = 'none';
    }, 2500);
  }
});

