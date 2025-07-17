const verseEl = document.getElementById('dailyVerse');
const dailyDate = document.getElementById('dailyDate');
const refreshBtn = document.getElementById('refreshVerseBtn');
const speakBtn = document.getElementById('speakVerseBtn');
const shareBtn = document.getElementById('shareVerseBtn');
const themeToggle = document.getElementById('themeToggle');

let allVerses = [];

function updateDateDisplay() {
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  dailyDate.textContent = `Сегодня — ${today.toLocaleDateString('ru-RU', options)}`;
}

function displayVerseOfDay() {
  if (allVerses.length === 0) {
    verseEl.textContent = 'Нет доступных стихов.';
    return;
  }
  const dateKey = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) hash += dateKey.charCodeAt(i);
  const index = hash % allVerses.length;
  const selected = allVerses[index];
  verseEl.textContent = `${selected.ref} — ${selected.text}`;
}

fetch('data/bible.json')
  .then(res => res.json())
  .then(data => {
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
    displayVerseOfDay();
    updateDateDisplay();
  })
  .catch(err => {
    verseEl.textContent = 'Ошибка загрузки стиха.';
    console.error(err);
  });

speakBtn?.addEventListener('click', () => {
  const utterance = new SpeechSynthesisUtterance(verseEl.textContent);
  utterance.lang = 'ru-RU';
  speechSynthesis.speak(utterance);
});

refreshBtn?.addEventListener('click', () => {
  displayVerseOfDay();
  updateDateDisplay();
});

shareBtn?.addEventListener('click', () => {
  const text = verseEl.textContent;
  const url = `https://t.me/share/url?url=&text=${encodeURIComponent(text)}`;
  window.open(url, '_blank');
});

themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
