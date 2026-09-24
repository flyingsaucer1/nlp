import json
import logging
import threading
import zipfile
from http.server import BaseHTTPRequestHandler
from pathlib import Path

import nltk
from nltk.corpus import stopwords
from nltk.probability import FreqDist
from nltk.stem import WordNetLemmatizer


ARCHIVE = Path(__file__).resolve().parent.parent / "nltk_data.zip"
DATA_ROOT = Path("/tmp/nlp_vocabulary_data")
_data_lock = threading.Lock()
_data_ready = False


def prepare_nltk_data():
    global _data_ready
    if _data_ready:
        return
    with _data_lock:
        if _data_ready:
            return
        destination = DATA_ROOT / "nltk_data"
        if not (destination / "corpora" / "wordnet.zip").is_file():
            with zipfile.ZipFile(ARCHIVE) as bundle:
                bundle.extractall(DATA_ROOT)
        nltk.data.path.insert(0, str(destination))
        _data_ready = True


def analyze_text(text):
    prepare_nltk_data()
    tokens = nltk.word_tokenize(text.lower())
    total_words = sum(token.isalpha() for token in tokens)
    tagged_words = nltk.pos_tag(tokens)
    common_words = set(stopwords.words("english"))
    lemmatizer = WordNetLemmatizer()
    frequencies = FreqDist()

    for word, tag in tagged_words:
        if not word.isalpha():
            continue
        if tag.startswith("NN"):
            base = lemmatizer.lemmatize(word, "n")
        elif tag.startswith("JJ"):
            base = lemmatizer.lemmatize(word, "a")
        elif tag == "VBG":
            base = lemmatizer.lemmatize(word, "v")
        else:
            continue
        if base not in common_words:
            frequencies[base] += 1

    vocabulary = sorted(frequencies)
    return {
        "totalWords": total_words,
        "uniqueWords": len(vocabulary),
        "vocabulary": vocabulary,
        "frequencies": [
            {"word": word, "count": count}
            for word, count in sorted(
                frequencies.items(), key=lambda item: (-item[1], item[0])
            )
        ],
    }


class handler(BaseHTTPRequestHandler):
    def respond(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        self.respond(200, {"status": "ok"})

    def do_POST(self):
        try:
            size = int(self.headers.get("Content-Length", "0"))
            if size < 1 or size > 200_000:
                self.respond(413, {"error": "Text must be under 100,000 characters."})
                return
            payload = json.loads(self.rfile.read(size))
            text = payload.get("text") if isinstance(payload, dict) else None
            if not isinstance(text, str) or not text.strip():
                self.respond(400, {"error": "Enter some text to analyze."})
                return
            if len(text) > 100_000:
                self.respond(413, {"error": "Text must be under 100,000 characters."})
                return
            self.respond(200, analyze_text(text))
        except (ValueError, json.JSONDecodeError):
            self.respond(400, {"error": "Send valid JSON text."})
        except Exception:
            logging.exception("Text analysis failed")
            self.respond(500, {"error": "Analysis failed. Please try again."})
