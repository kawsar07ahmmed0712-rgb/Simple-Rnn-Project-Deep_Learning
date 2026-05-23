import os
import re
import glob
import numpy as np
import tensorflow as tf

from flask import Flask, render_template, request, jsonify
from tensorflow.keras.datasets import imdb
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing import sequence
from tensorflow.keras.preprocessing.text import text_to_word_sequence


app = Flask(__name__)


DEFAULT_MAX_LEN = 500
DEFAULT_MAX_FEATURES = 10000

MODEL_CANDIDATES = [
    "best_simple_rnn_imdb.keras",
    "simple_rnn_imdb.keras",
    "simple_rnn_imdb.h5",
    "updated_simple_rnn_imdb.keras",
    "best_model.keras",
    "model.keras",
    "model.h5",
]


model = None
word_index = None
model_path = None
max_len = DEFAULT_MAX_LEN
max_features = DEFAULT_MAX_FEATURES


def find_model_file():
    for candidate in MODEL_CANDIDATES:
        if os.path.exists(candidate):
            return candidate

    extra_models = glob.glob("*.keras") + glob.glob("*.h5")

    if len(extra_models) > 0:
        return extra_models[0]

    return None


def get_model_max_len(loaded_model):
    try:
        input_shape = loaded_model.input_shape

        if isinstance(input_shape, list):
            input_shape = input_shape[0]

        detected_len = input_shape[1]

        if detected_len is None:
            return DEFAULT_MAX_LEN

        return int(detected_len)

    except Exception:
        return DEFAULT_MAX_LEN


def get_model_vocab_size(loaded_model):
    try:
        for layer in loaded_model.layers:
            if isinstance(layer, tf.keras.layers.Embedding):
                return int(layer.input_dim)

        return DEFAULT_MAX_FEATURES

    except Exception:
        return DEFAULT_MAX_FEATURES


def initialize_app():
    global model, word_index, model_path, max_len, max_features

    print("Loading IMDB word index...")
    word_index = imdb.get_word_index()

    print("Searching for model file...")
    model_path = find_model_file()

    if model_path is None:
        print("WARNING: No model file found.")
        print("The app will run in demo fallback mode.")
        model = None
        return

    print(f"Loading model: {model_path}")
    model = load_model(model_path, compile=False)

    max_len = get_model_max_len(model)
    max_features = get_model_vocab_size(model)

    print("Model loaded successfully.")
    print(f"Model file: {model_path}")
    print(f"Max sequence length: {max_len}")
    print(f"Vocabulary size: {max_features}")


def clean_text(text):
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    return text


def preprocess_text(text):
    """
    IMDB token system:
    0 = padding
    1 = start token
    2 = unknown word
    3 = unused

    Actual IMDB words use index + 3.
    """

    text = clean_text(text)
    tokens = text_to_word_sequence(text)

    encoded_review = [1]

    for word in tokens:
        index = word_index.get(word)

        if index is None:
            encoded_review.append(2)
        else:
            index = index + 3

            if index < max_features:
                encoded_review.append(index)
            else:
                encoded_review.append(2)

    padded_review = sequence.pad_sequences(
        [encoded_review],
        maxlen=max_len,
        padding="pre",
        truncating="pre"
    )

    return padded_review, tokens, encoded_review


def fallback_demo_prediction(text):
    """
    This is only used when no .h5 or .keras model file is found.
    It lets your website UI still work for testing.
    """

    positive_words = [
        "amazing", "excellent", "great", "good", "beautiful", "wonderful",
        "best", "love", "loved", "enjoyed", "brilliant", "perfect",
        "masterpiece", "fantastic", "powerful", "emotional"
    ]

    negative_words = [
        "bad", "boring", "terrible", "awful", "worst", "hate", "hated",
        "poor", "weak", "disappointing", "slow", "waste", "annoying",
        "regret", "confusing", "predictable"
    ]

    lower_text = text.lower()

    positive_count = sum(1 for word in positive_words if word in lower_text)
    negative_count = sum(1 for word in negative_words if word in lower_text)

    score = 0.5 + (positive_count - negative_count) * 0.12
    score = max(0.03, min(0.97, score))

    return score


def predict_review_sentiment(review_text):
    padded_review, tokens, encoded_review = preprocess_text(review_text)

    if model is None:
        score = fallback_demo_prediction(review_text)
        demo_mode = True
    else:
        prediction = model.predict(padded_review, verbose=0)
        score = float(prediction[0][0])
        demo_mode = False

    if score >= 0.5:
        sentiment = "Positive"
        confidence = score
    else:
        sentiment = "Negative"
        confidence = 1 - score

    return {
        "sentiment": sentiment,
        "score": round(score, 6),
        "confidence": round(confidence * 100, 2),
        "word_count": len(tokens),
        "encoded_length": len(encoded_review),
        "max_len": max_len,
        "max_features": max_features,
        "model_file": model_path if model_path else "No model file found",
        "demo_mode": demo_mode
    }


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": model is not None,
        "model_file": model_path,
        "max_len": max_len,
        "max_features": max_features
    })


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        if not data:
            return jsonify({
                "success": False,
                "error": "No JSON data received."
            }), 400

        review = data.get("review", "")

        if review.strip() == "":
            return jsonify({
                "success": False,
                "error": "Please enter a movie review."
            }), 400

        result = predict_review_sentiment(review)

        return jsonify({
            "success": True,
            "result": result
        })

    except Exception as error:
        return jsonify({
            "success": False,
            "error": str(error)
        }), 500


initialize_app()

if __name__ == "__main__":
    app.run(debug=True)