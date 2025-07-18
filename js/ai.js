document.getElementById('sendBtn').addEventListener('click', async () => {
  const input = document.getElementById('userInput').value.trim();
  const output = document.getElementById('aiResponse');

  if (!input) {
    output.textContent = 'Пожалуйста, введите запрос.';
    return;
  }

  output.textContent = 'Генерация ответа...';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: input }],
        temperature: 0.7
      })
    });

    const data = await response.json();
    output.textContent = data.choices[0].message.content;
  } catch (err) {
    output.textContent = 'Ошибка подключения к ИИ.';
    console.error(err);
  }
});
