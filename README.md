# nlp

A simple Python notebook that cleans text and creates a vocabulary of useful words.

## Run

Use Python 3.11 or newer. Open a terminal in this folder and run:

```sh
python -m pip install -r requirements.txt
python -m nltk.downloader punkt_tab averaged_perceptron_tagger_eng wordnet stopwords
python -m notebook TextRank.ipynb
```

Run the notebook cells from top to bottom. Change `Text` to use your own paragraph.
The final cell prints the vocabulary.

## What it does

1. Cleans the text and finds base words.
2. Removes common words using NLTK's English stopwords.
3. Keeps one copy of each remaining word in a vocabulary list.

## Files

- `TextRank.ipynb`: the code and short explanations.
- `requirements.txt`: Python packages.
- `LICENSE`: the original MIT license.

Adapted from Jishnu Ray Chowdhury's [TextRank-Keyword-Extraction](https://github.com/JRC1995/TextRank-Keyword-Extraction). This version stops after vocabulary creation and uses shorter explanations.
The original sample paragraph is from “Automatic Keyword Extraction from Individual Documents.”
