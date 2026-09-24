# nlp

A small NLTK project for finding useful vocabulary in text. You can use the one-page website or run the notebook yourself.

## Website

Paste text or upload a `.txt` file, then click **Analyze text**. The page shows the total word count, a sorted vocabulary, and each retained word's frequency. The text is processed by the Python API and is not stored by this project.

To deploy your own copy, import this repository into Vercel with the **Other** framework preset. The `api/analyze.py` function uses the NLTK data bundled in `nltk_data.zip`, so no download step is needed on Vercel.

## Notebook

Use Python 3.11 or newer. In this folder, run:

```sh
python -m pip install -r requirements.txt
python -m pip install notebook
python -m nltk.downloader punkt_tab averaged_perceptron_tagger_eng wordnet stopwords
python -m notebook nlp.ipynb
```

Run the cells from top to bottom. Change `text` to try another paragraph. To read a text file instead, put a `.txt` file in this folder and set `text_file` to its name, such as `"article.txt"`.

The result shows the total number of alphabetic words, the number of unique vocabulary words, the sorted vocabulary, and how often each retained base word appears. It keeps nouns, adjectives, and `-ing` words after removing NLTK's English stopwords.
