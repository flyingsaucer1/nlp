# nlp

A small Python notebook that counts useful words and creates a vocabulary.

## Run

Use Python 3.11 or newer. In this folder, run:

```sh
python -m pip install -r requirements.txt
python -m nltk.downloader punkt_tab averaged_perceptron_tagger_eng wordnet stopwords
python -m notebook nlp.ipynb
```

Run the cells from top to bottom. Change `text` to try another paragraph. To read a text file instead, put a `.txt` file in this folder and set `text_file` to its name, such as `"article.txt"`.

The result shows the total number of alphabetic words, the number of unique vocabulary words, the sorted vocabulary, and how often each retained base word appears. It keeps nouns, adjectives, and `-ing` words after removing NLTK's English stopwords.
