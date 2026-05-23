# ============================================================
# IMDB Movie Review Sentiment Analysis App
# SimpleRNN Model Deployment with Streamlit
# ============================================================

import os
import re
import glob
import numpy as np
import tensorflow as tf
import streamlit as st

from tensorflow.keras.datasets import imdb
from tensorflow.keras.preprocessing import sequence
from tensorflow.keras.preprocessing.text import text_to_word_sequence
from tensorflow.keras.models import load_model


# ============================================================
# Page Configuration
# ============================================================

st.set_page_config(
    page_title="IMDB Sentiment Analyzer",
    page_icon="🎬",
    layout="wide",
    initial_sidebar_state="expanded"
)


# ============================================================
# Custom CSS for Better UI
# ============================================================

st.markdown(
    """
    <style>
    /* Main background */
    .stApp {
        background: linear-gradient(135deg, #0f172a 0%, #111827 45%, #1e1b4b 100%);
        color: white;
    }

    /* Hide Streamlit default menu */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}

    /* Main title */
    .main-title {
        font-size: 3rem;
        font-weight: 800;
        text-align: center;
        background: linear-gradient(90deg, #facc15, #fb7185, #a78bfa);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        margin-bottom: 0.2rem;
    }

    .subtitle {
        text-align: center;
        font-size: 1.1rem;
        color: #cbd5e1;
        margin-bottom: 2rem;
    }

    /* Card style */
    .glass-card {
        background: rgba(255, 255, 255, 0.08);
        padding: 1.5rem;
        border-radius: 22px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.35);
        backdrop-filter: blur(12px);
        margin-bottom: 1rem;
    }

    .metric-card {
        background: rgba(255, 255, 255, 0.1);
        padding: 1.2rem;
        border-radius: 18px;
        border: 1px solid rgba(255, 255, 255, 0.14);
        text-align: center;
    }

    .positive-card {
        background: linear-gradient(135deg, rgba(34,197,94,0.25), rgba(16,185,129,0.12));
        border: 1px solid rgba(34,197,94,0.45);
        padding: 1.5rem;
        border-radius: 22px;
        box-shadow: 0 10px 35px rgba(34,197,94,0.12);
    }

    .negative-card {
        background: linear-gradient(135deg, rgba(239,68,68,0.25), rgba(244,63,94,0.12));
        border: 1px solid rgba(239,68,68,0.45);
        padding: 1.5rem;
        border-radius: 22px;
        box-shadow: 0 10px 35px rgba(239,68,68,0.12);
    }

    .neutral-card {
        background: linear-gradient(135deg, rgba(250,204,21,0.20), rgba(251,146,60,0.10));
        border: 1px solid rgba(250,204,21,0.45);
        padding: 1.5rem;
        border-radius: 22px;
        box-shadow: 0 10px 35px rgba(250,204,21,0.10);
    }

    .result-title {
        font-size: 2rem;
        font-weight: 800;
        margin-bottom: 0.5rem;
    }

    .small-text {
        color: #cbd5e1;
        font-size: 0.95rem;
    }

    /* Textarea */
    textarea {
        border-radius: 18px !important;
        border: 1px solid rgba(255,255,255,0.25) !important;
    }

    /* Button */
    .stButton > button {
        width: 100%;
        border-radius: 16px;
        border: none;
        padding: 0.8rem 1rem;
        font-weight: 700;
        font-size: 1rem;
        background: linear-gradient(90deg, #facc15, #fb7185, #a78bfa);
        color: #111827;
        transition: 0.3s;
    }

    .stButton > button:hover {
        transform: scale(1.02);
        box-shadow: 0 8px 25px rgba(251, 113, 133, 0.35);
    }

    /* Sidebar */
    section[data-testid="stSidebar"] {
        background: linear-gradient(180deg, #020617, #111827);
    }

    .sidebar-title {
        font-size: 1.4rem;
        font-weight: 800;
        color: #facc15;
        margin-bottom: 0.5rem;
    }

    .example-box {
        background: rgba(255,255,255,0.08);
        padding: 0.9rem;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.12);
        margin-bottom: 0.7rem;
        color: #e5e7eb;
    }
    </style>
    """,
    unsafe_allow_html=True
)


# ============================================================
# Constants
# ============================================================

DEFAULT_MAX_LEN = 500
DEFAULT_MAX_FEATURES = 10000

MODEL_CANDIDATES = [
    "best_simple_rnn_imdb.keras",
    "simple_rnn_imdb.keras",
    "simple_rnn_imdb.h5",
    "updated_simple_rnn_imdb.keras",
    "best_model.keras"
]


# ============================================================
# Load IMDB Word Index
# ============================================================

@st.cache_data(show_spinner=False)
def load_word_index():
    word_index = imdb.get_word_index()
    reverse_word_index = {value + 3: key for key, value in word_index.items()}

    reverse_word_index[0] = "<PAD>"
    reverse_word_index[1] = "<START>"
    reverse_word_index[2] = "<UNK>"
    reverse_word_index[3] = "<UNUSED>"

    return word_index, reverse_word_index


# ============================================================
# Find Model File
# ============================================================

def find_available_models():
    models = []

    for model_name in MODEL_CANDIDATES:
        if os.path.exists(model_name):
            models.append(model_name)

    extra_models = glob.glob("*.h5") + glob.glob("*.keras")

    for model_path in extra_models:
        if model_path not in models:
            models.append(model_path)

    return models


# ============================================================
# Load Model
# ============================================================

@st.cache_resource(show_spinner=False)
def load_sentiment_model(model_path):
    model = load_model(model_path, compile=False)
    return model


# ============================================================
# Get Model Information
# ============================================================

def get_model_max_len(model):
    try:
        input_shape = model.input_shape

        if isinstance(input_shape, list):
            input_shape = input_shape[0]

        max_len = input_shape[1]

        if max_len is None:
            return DEFAULT_MAX_LEN

        return int(max_len)

    except Exception:
        return DEFAULT_MAX_LEN


def get_model_vocab_size(model):
    try:
        for layer in model.layers:
            if isinstance(layer, tf.keras.layers.Embedding):
                return int(layer.input_dim)

        return DEFAULT_MAX_FEATURES

    except Exception:
        return DEFAULT_MAX_FEATURES


# ============================================================
# Text Preprocessing
# ============================================================

def clean_text(text):
    text = text.strip()
    text = re.sub(r"\s+", " ", text)
    return text


def preprocess_text(text, word_index, max_len, max_features):
    """
    IMDB dataset encoding system:
    0 = padding
    1 = start token
    2 = unknown word
    3 = unused

    Actual words start from index + 3.
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


# ============================================================
# Prediction Function
# ============================================================

def predict_sentiment(model, text, word_index, max_len, max_features):
    padded_review, tokens, encoded_review = preprocess_text(
        text=text,
        word_index=word_index,
        max_len=max_len,
        max_features=max_features
    )

    prediction = model.predict(padded_review, verbose=0)

    score = float(prediction[0][0])

    if score >= 0.5:
        sentiment = "Positive"
        confidence = score
    else:
        sentiment = "Negative"
        confidence = 1 - score

    return {
        "sentiment": sentiment,
        "score": score,
        "confidence": confidence,
        "tokens": tokens,
        "encoded_length": len(encoded_review)
    }


# ============================================================
# Sidebar
# ============================================================

with st.sidebar:
    st.markdown('<div class="sidebar-title">🎬 IMDB Sentiment App</div>', unsafe_allow_html=True)

    st.write(
        """
        This app uses a trained **SimpleRNN** model to classify movie reviews
        as **Positive** or **Negative**.
        """
    )

    st.divider()

    available_models = find_available_models()

    if len(available_models) == 0:
        st.error("No model file found.")
        st.info(
            """
            Put one model file in this folder:

            - simple_rnn_imdb.h5
            - simple_rnn_imdb.keras
            - best_simple_rnn_imdb.keras
            """
        )
        st.stop()

    selected_model_path = st.selectbox(
        "Select Model File",
        available_models
    )

    st.success(f"Loaded model file: {selected_model_path}")

    st.divider()

    st.markdown("### Model Notes")
    st.write(
        """
        Recommended model setup:

        - Embedding layer
        - SimpleRNN with `tanh`
        - Dropout
        - Dense hidden layer
        - Sigmoid output
        """
    )

    st.divider()

    st.markdown("### Example Reviews")

    example_positive = (
        "This movie was absolutely wonderful. The acting was brilliant, "
        "the story was emotional, and I enjoyed every moment."
    )

    example_negative = (
        "This movie was boring and disappointing. The story was weak, "
        "the acting was poor, and I regret watching it."
    )

    st.markdown(
        f'<div class="example-box">✅ Positive Example:<br>{example_positive}</div>',
        unsafe_allow_html=True
    )

    st.markdown(
        f'<div class="example-box">❌ Negative Example:<br>{example_negative}</div>',
        unsafe_allow_html=True
    )


# ============================================================
# Load Model and Word Index
# ============================================================

with st.spinner("Loading model and IMDB word index..."):
    model = load_sentiment_model(selected_model_path)
    word_index, reverse_word_index = load_word_index()

max_len = get_model_max_len(model)
max_features = get_model_vocab_size(model)


# ============================================================
# Main UI
# ============================================================

st.markdown('<div class="main-title">🎬 IMDB Movie Review Sentiment Analyzer</div>', unsafe_allow_html=True)
st.markdown(
    '<div class="subtitle">Analyze movie reviews using your trained SimpleRNN deep learning model</div>',
    unsafe_allow_html=True
)

left_col, right_col = st.columns([2, 1], gap="large")


# ============================================================
# Left Column: User Input
# ============================================================

with left_col:
    st.markdown('<div class="glass-card">', unsafe_allow_html=True)

    st.markdown("### ✍️ Enter a Movie Review")

    user_input = st.text_area(
        label="Movie Review",
        placeholder=(
            "Example: This movie was amazing. The acting was great, "
            "the story was beautiful, and the ending was very emotional..."
        ),
        height=220,
        label_visibility="collapsed"
    )

    col_btn1, col_btn2, col_btn3 = st.columns(3)

    with col_btn1:
        use_positive = st.button("Use Positive Example")

    with col_btn2:
        use_negative = st.button("Use Negative Example")

    with col_btn3:
        classify_button = st.button("Classify Review 🚀")

    if use_positive:
        user_input = example_positive
        st.info("Positive example loaded. Press Classify Review 🚀.")

    if use_negative:
        user_input = example_negative
        st.info("Negative example loaded. Press Classify Review 🚀.")

    st.markdown("</div>", unsafe_allow_html=True)


# ============================================================
# Right Column: Model Info
# ============================================================

with right_col:
    st.markdown('<div class="glass-card">', unsafe_allow_html=True)

    st.markdown("### ⚙️ Model Settings")

    st.markdown(
        f"""
        <div class="metric-card">
            <h3>{max_len}</h3>
            <p class="small-text">Max Sequence Length</p>
        </div>
        """,
        unsafe_allow_html=True
    )

    st.markdown("<br>", unsafe_allow_html=True)

    st.markdown(
        f"""
        <div class="metric-card">
            <h3>{max_features}</h3>
            <p class="small-text">Vocabulary Size</p>
        </div>
        """,
        unsafe_allow_html=True
    )

    st.markdown("<br>", unsafe_allow_html=True)

    st.markdown(
        f"""
        <div class="metric-card">
            <h3>{len(model.layers)}</h3>
            <p class="small-text">Model Layers</p>
        </div>
        """,
        unsafe_allow_html=True
    )

    st.markdown("</div>", unsafe_allow_html=True)


# ============================================================
# Prediction Output
# ============================================================

st.markdown("## 📊 Prediction Result")

if classify_button:
    if user_input is None or user_input.strip() == "":
        st.warning("Please enter a movie review first.")

    else:
        with st.spinner("Analyzing sentiment..."):
            result = predict_sentiment(
                model=model,
                text=user_input,
                word_index=word_index,
                max_len=max_len,
                max_features=max_features
            )

        sentiment = result["sentiment"]
        score = result["score"]
        confidence = result["confidence"]
        tokens = result["tokens"]
        encoded_length = result["encoded_length"]

        result_col1, result_col2 = st.columns([1.4, 1], gap="large")

        with result_col1:
            if sentiment == "Positive":
                st.markdown(
                    f"""
                    <div class="positive-card">
                        <div class="result-title">✅ Positive Review</div>
                        <p>This review is predicted as <b>Positive</b>.</p>
                        <p class="small-text">
                            The model thinks this review has a positive sentiment.
                        </p>
                    </div>
                    """,
                    unsafe_allow_html=True
                )
            else:
                st.markdown(
                    f"""
                    <div class="negative-card">
                        <div class="result-title">❌ Negative Review</div>
                        <p>This review is predicted as <b>Negative</b>.</p>
                        <p class="small-text">
                            The model thinks this review has a negative sentiment.
                        </p>
                    </div>
                    """,
                    unsafe_allow_html=True
                )

        with result_col2:
            st.markdown('<div class="glass-card">', unsafe_allow_html=True)

            st.markdown("### Confidence")
            st.progress(int(confidence * 100))
            st.metric("Confidence", f"{confidence * 100:.2f}%")

            st.metric("Positive Score", f"{score:.4f}")

            if score >= 0.5:
                st.caption("Score closer to 1 means stronger positive sentiment.")
            else:
                st.caption("Score closer to 0 means stronger negative sentiment.")

            st.markdown("</div>", unsafe_allow_html=True)

        st.markdown("### 🧠 Text Analysis")

        analysis_col1, analysis_col2, analysis_col3 = st.columns(3)

        with analysis_col1:
            st.metric("Words Detected", len(tokens))

        with analysis_col2:
            st.metric("Encoded Tokens", encoded_length)

        with analysis_col3:
            st.metric("Model Input Length", max_len)

        with st.expander("View Processed Tokens"):
            st.write(tokens)

        with st.expander("View Raw Prediction Details"):
            st.json(
                {
                    "sentiment": sentiment,
                    "positive_probability": round(score, 6),
                    "confidence": round(confidence, 6),
                    "words_detected": len(tokens),
                    "encoded_length_before_padding": encoded_length,
                    "model_input_length": max_len,
                    "model_file": selected_model_path
                }
            )

else:
    st.markdown(
        """
        <div class="neutral-card">
            <div class="result-title">💡 Waiting for Review</div>
            <p>Enter a movie review above and click <b>Classify Review 🚀</b>.</p>
            <p class="small-text">
                The model will output Positive or Negative sentiment with confidence score.
            </p>
        </div>
        """,
        unsafe_allow_html=True
    )


# ============================================================
# Footer
# ============================================================

st.markdown("---")
st.markdown(
    """
    <p style="text-align:center; color:#94a3b8;">
        Built with TensorFlow, Keras, SimpleRNN, and Streamlit
    </p>
    """,
    unsafe_allow_html=True
)