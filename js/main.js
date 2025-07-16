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
let allVerses = [];

function updateDailyDate() {
  if (!dailyDate) return;
  const today = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  dailyDate.textContent = `Сегодня — ${today.toLocaleDateString('ru-RU', options)}`;
}

function displayRandomVerse() {
  if (allVerses.length === 0) {
   
