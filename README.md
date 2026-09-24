# nlp

A small Python notebook that creates a vocabulary from a paragraph.

## Run

Use Python 3.11 or newer. In this folder, run:

```sh
python -m pip install -r requirements.txt
python -m nltk.downloader punkt_tab averaged_perceptron_tagger_eng wordnet stopwords
python -m notebook nlp.ipynb
```

Run the cells from top to bottom. Change `text` to try another paragraph. The final cell prints a sorted list of unique nouns, adjectives, and `-ing` words after removing NLTK's English stopwords.
