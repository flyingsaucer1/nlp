# nlp

A simple Python notebook that cleans text and creates a vocabulary of useful words.

## Run

Use Python 3.11 or newer. Open a terminal in this folder and run:

```sh
python -m pip install -r requirements.txt
python -m nltk.downloader punkt_tab averaged_perceptron_tagger_eng wordnet
python -m notebook TextRank.ipynb
```

Run the notebook cells from top to bottom. Change `Text` to use your own paragraph.
The final cell prints the vocabulary.

## What it does

1. Cleans the text and finds base words.
2. Removes common words.
3. Keeps one copy of each remaining word in a vocabulary list.

## Files

- `TextRank.ipynb`: the code and short explanations.
- `long_stopwords.txt`: common words to skip.
- `requirements.txt`: Python packages.
- `LICENSE`: the original MIT license.

