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
const posTags = document.querySelector('#pos-tags');
const entities = document.querySelector('#entities');

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
  vocabulary.textContent = '—';
  frequencies.className = 'frequency-list empty-result';
  frequencies.textContent = '—';
  posTags.className = 'tag-list empty-result';
  posTags.textContent = '—';
  entities.className = 'entity-list empty-result';
  entities.textContent = '—';
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
  posTags.className = 'tag-list';
  posTags.replaceChildren();
  for (const { tag, count } of result.posTags) {
    const chip = document.createElement('span');
    chip.className = 'tag-chip';
    chip.textContent = `${tag} · ${count}`;
    posTags.append(chip);
  }
  if (!result.posTags.length) {
    posTags.className = 'tag-list empty-result';
    posTags.textContent = 'No tags found.';
  }
  entities.className = 'entity-list';
  entities.replaceChildren();
  for (const { text, label } of result.entities) {
    const row = document.createElement('div');
    row.className = 'entity-row';
    const name = document.createElement('strong');
    name.textContent = text;
    const kind = document.createElement('span');
    kind.textContent = label;
    row.append(name, kind);
    entities.append(row);
  }
  if (!result.entities.length) {
    entities.className = 'entity-list empty-result';
    entities.textContent = 'No named entities found.';
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
  analyzeButton.textContent = 'Analyzing…';
  showStatus('');
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.error || 'Analysis failed. Please try again.');
    renderResults(result);
    showStatus('Analysis complete.');
  } catch (error) {
    showStatus(error.message || 'Analysis failed. Please try again.', true);
  } finally {
    analyzeButton.disabled = false;
    analyzeButton.textContent = 'Analyze';
  }
}

textInput.addEventListener('input', () => {
  fileName.textContent = '';
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
  showStatus('');
});
clearButton.addEventListener('click', () => {
  textInput.value = '';
  fileInput.value = '';
  fileName.textContent = '';
  updateCount();
  resetResults();
  showStatus('');
  textInput.focus();
});
analyzeButton.addEventListener('click', analyze);
updateCount();
