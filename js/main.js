const verseEl = document.getElementById('dailyVerse');
const speakBtn = document.getElementById('speakVerseBtn');
const refreshBtn = document.getElementById('refreshVerseBtn');
const shareBtn = document.getElementById('shareVerseBtn');
const themeToggle = document.getElementById('themeToggle');
const dateEl = document.getElementById('currentDate');
const dailyDate = document.getElementById('dailyDate');
const askAI = document.getElementById('askAI');
const userQuestion = document.getElementById('userQuestion');
const aiResponse = document.getElementById('aiResponse');
const aiInput = document.getElementById('aiInput');
const aiSendBtn = document.getElementById('aiSendBtn');
const aiChatResponse = document.getElementById('aiChatResponse');

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
    updateDailyDate();
  })
  .catch(err => {
    verseEl.textContent = 'Не удалось загрузить стих 😢';
    console.error('Ошибка загрузки bible.json:', err);
  });

if (
