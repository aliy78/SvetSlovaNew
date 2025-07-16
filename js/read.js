let currentBookIndex = 0;
let currentChapter = 1;
let bibleData = null;

const bookTitleEl = document.getElementById('bookTitle');
const versesContainer = document.getElementById('versesContainer');
const prevBtn = document.getElementById('prevChapter');
const nextBtn = document.getElementById('nextChapter');
const speakBtn = document.getElementById('speakAll');
const addToFavBtn = document.getElementById('addToFavorites');
const favList = document.getElementById('favoritesList');
const searchInput = document.getElementById('searchInput');

// Загрузка Библии
fetch('data/bible.json')
  .then(res => res.json())
  .then(data => {
    bibleData = data;
    renderChapter();
    loadFavorites();
  });

// Отображение главы
function renderChapter() {
  const book = bibleData.Books[currentBookIndex];
  const chapter = book.Chapters[currentChapter - 1];

  bookTitleEl.textContent = `📖 ${book.BookName} ${currentChapter}`;
  versesContainer.innerHTML = '';

  chapter.Verses.forEach(verse => {
    const verseEl = document.createElement('p');
    verseEl.textContent = `${verse.VerseId}. ${verse.Text}`;
    verseEl.dataset.verse = `${book.BookName} ${currentChapter}:${verse.VerseId}`;
    verseEl.addEventListener('click', () => addToFavorites(verseEl));
    versesContainer.appendChild(verseEl);
  });

  if (searchInput && searchInput.value.trim() !== '') {
    highlightSearchTerm(searchInput.value.trim());
  }
}

// Переключение главы
prevBtn.onclick = () => {
  if (currentChapter > 1) {
    currentChapter--;
    renderChapter();
  }
};

nextBtn.onclick = () => {
  const totalChapters = bibleData.Books[currentBookIndex].Chapters.length;
  if (currentChapter < totalChapters) {
    currentChapter++;
    renderChapter();
  }
};

// Озвучка всей главы
speakBtn.onclick = () => {
  const chapter = bibleData.Books[currentBookIndex].Chapters[currentChapter - 1];
  const text = chapter.Verses.map(v => v.Text).join('. ');
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'ru-RU';
  speechSynthesis.speak(utterance);
};

// Добавление стиха в избранное
function addToFavorites(el) {
  const ref = el.dataset.verse;
  const text = el.textContent;
  const favs = JSON.parse(localStorage.getItem('favorites')) || [];
  if (!favs.find(v => v.ref === ref)) {
    favs.push({ ref, text });
    localStorage.setItem('favorites', JSON.stringify(favs));
    loadFavorites();
  }
}

// Загрузка избранных
function loadFavorites() {
  favList.innerHTML = '';
  const favs = JSON.parse(localStorage.getItem('favorites')) || [];
  favs.forEach(v => {
    const li = document.createElement('li');
    li.textContent = `${v.ref}: ${v.text}`;
    favList.appendChild(li);
  });
}

// Подсветка найденного слова
function highlightSearchTerm(term) {
  const verses = document.querySelectorAll('#versesContainer p');
  verses.forEach(p => {
    const regex = new RegExp(`(${term})`, 'gi');
    p.innerHTML = p.textContent.replace(regex, '<mark>$1</mark>');
  });
}

// Обработка поиска
if (searchInput) {
  searchInput.addEventListener('input', () => {
    renderChapter();
  });
}
