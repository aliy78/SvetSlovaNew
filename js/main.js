const verseEl = document.getElementById('dailyVerse');
const speakBtn = document.getElementById('speakVerseBtn');
const stopBtn = document.getElementById('stopSpeechBtn');
const themeToggle = document.getElementById('themeToggle');
const refreshBtn = document.getElementById('refreshVerseBtn');
const shareBtn = document.getElementById('shareVerseBtn');
const dateEl = document.getElementById('currentDate');
let allVerses = [];

function displayRandomVerse() {
  if (allVerses.length === 0) return;
  const randomIndex = Math.floor(Math.random() * allVerses.length);
  const selected = allVerses[randomIndex];
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
    displayRandomVerse();
  })
  .catch(err => {
    verseEl.textContent = 'Не удалось загрузить стих 😢';
    console.error('Ошибка загрузки bible.json:', err);
  });

if (speakBtn) {
  speakBtn.addEventListener('click', () => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(verseEl.textContent);
    utterance.lang = 'ru-RU';
    speechSynthesis.speak(utterance);
  });
}

if (stopBtn) {
  stopBtn.addEventListener('click', () => {
    speechSynthesis.cancel();
  });
}

if (refreshBtn) {
  refreshBtn.addEventListener('click', () => {
    speechSynthesis.cancel();
    displayRandomVerse();
  });
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  });

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }
}

window.addEventListener('load', () => {
  const splash = document.getElementById('splashScreen');
  if (splash) {
    setTimeout(() => {
      splash.style.display = 'none';
    }, 2500);
  }

  if (dateEl) {
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateEl.textContent = today.toLocaleDateString('ru-RU', options);
  }
});

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
      alert('
