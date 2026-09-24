# nlp

A simple Python notebook that finds keywords using TextRank.

## Run

Use Python 3.11 or newer. Open a terminal in this folder and run:

```sh
python -m pip install -r requirements.txt
python -m nltk.downloader punkt_tab averaged_perceptron_tagger_eng wordnet
python -m notebook TextRank.ipynb
```

Run the notebook cells from top to bottom. Change `Text` to use your own paragraph.
Change `keywords_num` to choose how many phrases to show.

## What it does

1. Cleans the text and finds base words.
2. Removes common words.
3. Connects nearby words and scores them.
4. Combines words into phrases and shows the best ones.

## Files

- `TextRank.ipynb`: the code and short explanations.
- `long_stopwords.txt`: common words to skip.
- `requirements.txt`: Python packages.
- `LICENSE`: the original MIT license.

Adapted from Jishnu Ray Chowdhury's [TextRank-Keyword-Extraction](https://github.com/JRC1995/TextRank-Keyword-Extraction). Comments and explanations have been simplified, and a few boundary cases have been fixed.
The original sample paragraph is from “Automatic Keyword Extraction from Individual Documents.” The stopword list was sourced by the original project from ranks.nl.
