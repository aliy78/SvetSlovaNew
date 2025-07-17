let bibleData;

fetch('data/bible.json')
  .then(res => res.json())
  .then(data => {
    bibleData = data;
    populateBooks();
  })
  .catch(err => console.error('Ошибка загрузки bible.json:', err));

function populateBooks() {
  const bookSelect = document.getElementById('bookSelect');
  bibleData.Books.forEach((book, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = book.BookName;
    bookSelect.appendChild(option);
  });

  bookSelect.addEventListener('change', () => {
    populateChapters(parseInt(bookSelect.value));
  });
}

function populateChapters(bookIndex) {
  const chapterSelect = document.getElementById('chapterSelect');
  chapterSelect.innerHTML = '';

  const chapters = bibleData.Books[bookIndex].Chapters;
  chapters.forEach((chapter, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `Глава ${chapter.ChapterId}`;
    chapterSelect.appendChild(option);
  });

  chapterSelect.addEventListener('change', () => {
    showChapter(bookIndex, parseInt(chapterSelect.value));
  });
}

function showChapter(bookIndex, chapterIndex) {
  const book = bibleData.Books[bookIndex];
  const chapter = book.Chapters[chapterIndex];
  const chapterText = document.getElementById('chapterText');
  const searchResults = document.getElementById('searchResults');

  chapterText.innerHTML = `<h2>${book.BookName} — Глава ${chapter.ChapterId}</h2>`;

  chapter.Verses.forEach(verse => {
    const ref = `${book.BookName} ${chapter.ChapterId}:${verse.VerseId}`;
    const text = `${ref} — ${verse.Text}`;
    const p = document.createElement('p');

    p.innerHTML = `
      ${text}
      <button class="shareUniversal" data-text="${text}">📤 Поделиться</button>
    `;

    chapterText.appendChild(p);
  });

  searchResults.innerHTML = '';
}

// 🔗 Кнопка «Поделиться»
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('shareUniversal')) {
    const text = e.target.dataset.text;
    showShareOptions(text);
  }
});

function showShareOptions(text) {
  const encoded = encodeURIComponent(text);

  const html = `
    <div id="shareOverlay">
      <div class="sharePopup">
        <h3>📤 Поделиться стихом</h3>
        <a href="https://t.me/share/url?url=&text=${encoded}" target="_blank">Telegram</a><br>
        <a href="https://vk.com/share.php?url=&title=${encoded}" target="_blank">VK</a><br>
        <a href="https://wa.me/?text=${encoded}" target="_blank">WhatsApp</a><br>
        <a href="#" onclick="copyText('${text}')">📋 Скопировать</a><br>
        <button onclick="closeShare()">✖ Закрыть</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
}

function closeShare() {
  const overlay = document.getElementById('shareOverlay');
  if (overlay) overlay.remove();
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => {
    alert('Стих скопирован!');
  });
}
