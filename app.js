const textInput = document.querySelector('#text-input');
const fileInput = document.querySelector('#file-input');
const fileName = document.querySelector('#file-name');
const characterCount = document.querySelector('#character-count');
const analyzeButton = document.querySelector('#analyze-button');
const clearButton = document.querySelector('#clear-button');
const status = document.querySelector('#status');
const vocabulary = document.querySelector('#vocabulary');
const frequencies = document.querySelector('#frequencies');
const totalWords = document.querySelector('#total-words');
const uniqueWords = document.querySelector('#unique-words');

function updateCount() {
  characterCount.textContent = `${textInput.value.length.toLocaleString()} / 100,000 characters`;
}

function showStatus(message, error = false) {
  status.textContent = message;
  status.classList.toggle('error', error);
}

function resetResults() {
  totalWords.textContent = '—';
  uniqueWords.textContent = '—';
  vocabulary.className = 'vocabulary empty-result';
  vocabulary.textContent = 'Run an analysis to see your words.';
  frequencies.className = 'frequency-list empty-result';
  frequencies.textContent = 'Counts will appear here.';
}

function renderResults(result) {
  totalWords.textContent = result.totalWords.toLocaleString();
  uniqueWords.textContent = result.uniqueWords.toLocaleString();

  vocabulary.className = 'vocabulary';
  vocabulary.replaceChildren();
  for (const word of result.vocabulary) {
    const chip = document.createElement('span');
    chip.className = 'word-chip';
    chip.textContent = word;
    vocabulary.append(chip);
  }
  if (!result.vocabulary.length) {
    vocabulary.className = 'vocabulary empty-result';
    vocabulary.textContent = 'No vocabulary words found in this text.';
  }

  frequencies.className = 'frequency-list';
  frequencies.replaceChildren();
  const topCount = result.frequencies[0]?.count || 1;
  for (const { word, count } of result.frequencies) {
    const row = document.createElement('div');
    row.className = 'frequency-row';
    const label = document.createElement('span');
    label.className = 'frequency-word';
    label.textContent = word;
    const track = document.createElement('div');
    track.className = 'bar-track';
    const bar = document.createElement('div');
    bar.className = 'bar-fill';
    bar.style.width = `${(count / topCount) * 100}%`;
    track.append(bar);
    const number = document.createElement('span');
    number.className = 'frequency-count';
    number.textContent = count;
    row.append(label, track, number);
    frequencies.append(row);
  }
  if (!result.frequencies.length) {
    frequencies.className = 'frequency-list empty-result';
    frequencies.textContent = 'No retained words to count.';
  }
}

async function analyze() {
  const text = textInput.value.trim();
  if (!text) {
    showStatus('Enter some text before analyzing.', true);
    textInput.focus();
    return;
  }
  analyzeButton.disabled = true;
  analyzeButton.firstChild.textContent = 'Analyzing… ';
  showStatus('Analyzing your text…');
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Analysis failed. Please try again.');
    renderResults(result);
    showStatus(`Done. Found ${result.uniqueWords} unique vocabulary words.`);
  } catch (error) {
    showStatus(error.message || 'Analysis failed. Please try again.', true);
  } finally {
    analyzeButton.disabled = false;
    analyzeButton.firstChild.textContent = 'Analyze text ';
  }
}

textInput.addEventListener('input', () => {
  fileName.textContent = 'Typed text';
  updateCount();
});
textInput.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') analyze();
});
fileInput.addEventListener('change', async () => {
  const file = fileInput.files?.[0];
  if (!file) return;
  if (!file.name.toLowerCase().endsWith('.txt')) {
    showStatus('Choose a .txt file.', true);
    return;
  }
  if (file.size > 200_000) {
    showStatus('Choose a file under 200 KB.', true);
    return;
  }
  const content = await file.text();
  if (content.length > 100_000) {
    showStatus('Text must be under 100,000 characters.', true);
    return;
  }
  textInput.value = content;
  fileName.textContent = file.name;
  updateCount();
  resetResults();
  showStatus('File loaded. Ready to analyze.');
});
clearButton.addEventListener('click', () => {
  textInput.value = '';
  fileInput.value = '';
  fileName.textContent = 'No file selected';
  updateCount();
  resetResults();
  showStatus('Text cleared.');
  textInput.focus();
});
analyzeButton.addEventListener('click', analyze);
updateCount();
