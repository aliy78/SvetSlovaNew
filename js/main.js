const verseEl = document.getElementById('dailyVerse');
const dailyDate = document.getElementById('dailyDate');
const speakBtn = document.getElementById('speakVerseBtn');
const refreshBtn = document.getElementById('refreshVerseBtn');
const aiInput = document.getElementById('aiInput');
const aiSendBtn = document.getElementById('aiSendBtn');
const aiChatResponse = document.getElementById('aiChatResponse');
const themeToggle = document.getElementById('themeToggle');
const dateEl = document.getElementById('currentDate');

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
    updateDailyDate();
  })
  .catch(err => {
    verseEl.textContent = 'Ошибка загрузки стиха.';
    console.error(err);
  });

// Озвучка стиха
speakBtn?.addEventListener('click', () => {
  const utterance = new SpeechSynthesisUtterance(verseEl.textContent);
  utterance.lang = 'ru-RU';
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
});

// Обновление стиха (можно оставить кнопку, но стих будет тот же весь день)
refreshBtn?.addEventListener('click', () => {
  displayVerseOfDay();
  updateDailyDate();
  speechSynthesis.cancel();
});

// Ответы AI
aiSendBtn?.addEventListener('click', () => {
  const q = aiInput.value.toLowerCase();
  let a = '🙏 Я размышляю над этим...';

  if (q.includes('спасение')) {
    a = 'Спасение — это дар Бога, доступный каждому, кто верит с открытым сердцем.';
  } else if (q.includes('любовь')) {
    a = 'Любовь Божья безмерна. Она покрывает всё и ведёт к жизни.';
  } else if (q.includes('псалом')) {
    a = '«Господь — пастырь мой; я ни в чём не буду нуждаться» — Псалтирь 22:1';
  }

  aiChatResponse.textContent = a;
});

// Тема
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});
if (localStorage.getItem('theme') === 'dark') {
 
