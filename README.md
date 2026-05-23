# IMDB Sentiment Analysis with Simple RNN

This is an end-to-end deep learning project for **IMDB movie review sentiment analysis**.

The project uses a trained **Simple RNN** model to classify movie reviews as either **Positive** or **Negative**.

The project has two main parts:

1. **Backend**: Flask API with TensorFlow/Keras model
2. **Frontend**: React + Tailwind CSS web application

---

## Project Overview

In this project, an IMDB sentiment classification model was trained using a Simple RNN architecture.  
The trained model was then connected to a Flask backend API and a React frontend web application.

Users can enter a movie review in the web app, and the system predicts whether the review is positive or negative.

---

## Features

- IMDB movie review sentiment classification
- Text preprocessing
- Sequence padding
- Word embedding layer
- Simple RNN model
- Sigmoid output for binary classification
- Flask API backend
- React frontend
- Tailwind CSS modern UI
- Real-time prediction
- Confidence score display
- Positive and negative result cards

---

## Technologies Used

### Machine Learning and Backend

- Python
- TensorFlow
- Keras
- NumPy
- Flask
- Flask-CORS

### Frontend

- React
- Vite
- Tailwind CSS
- JavaScript
- Lucide React Icons

### Tools

- Jupyter Notebook
- VS Code
- Git
- GitHub

---

## Project Structure

```text
Simple-Rnn-Project-Deep_Learning/
│
├── backend/
│   ├── app.py
│   ├── best_simple_rnn_imdb.keras
│   └── requirements.txt
│
├── frontend/
│   ├── image/
│   │   └── brain.png
│   │
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## How to Clone and Run the Project

Follow these steps to run the project on your local computer.

---

## Step 1: Clone the GitHub Repository

Open terminal or command prompt and run:

```bash
git clone https://github.com/kawsar07ahmmed0712-rgb/Simple-Rnn-Project-Deep_Learning.git
```

Then go inside the project folder:

```bash
cd Simple-Rnn-Project-Deep_Learning
```

---

## Step 2: Open the Project in VS Code

Run:

```bash
code .
```

Or open VS Code manually and open the project folder.

---

## Step 3: Setup the Backend

Go to the backend folder:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate the virtual environment.

For Windows:

```bash
venv\Scripts\activate
```

For Mac/Linux:

```bash
source venv/bin/activate
```

Install backend dependencies:

```bash
pip install -r requirements.txt
```

---

## Step 4: Check the Model File

Make sure the trained model file is inside the `backend` folder.

The model file should be:

```text
best_simple_rnn_imdb.keras
```

Correct location:

```text
backend/best_simple_rnn_imdb.keras
```

The Flask backend automatically searches for the model file inside the backend folder.

---

## Step 5: Run the Flask Backend

Inside the `backend` folder, run:

```bash
python app.py
```

If everything works correctly, the backend will run on:

```text
http://127.0.0.1:5000
```

To check if the backend is working, open this URL in your browser:

```text
http://127.0.0.1:5000/health
```

If the model is loaded correctly, you should see something like this:

```json
{
  "status": "ok",
  "model_loaded": true,
  "model_file": "best_simple_rnn_imdb.keras"
}
```

Keep the backend terminal running.

---

## Step 6: Setup the Frontend

Open a new terminal.

Go to the frontend folder:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

---

## Step 7: Run the React Frontend

Inside the `frontend` folder, run:

```bash
npm run dev
```

The frontend will run on:

```text
http://127.0.0.1:5173
```

Open this link in your browser.

---

## Step 8: Use the Web App

After opening the web app:

1. Write or paste a movie review
2. Click the **Analyze Review** button
3. The frontend sends the review to the Flask backend
4. The backend preprocesses the text
5. The Simple RNN model predicts the sentiment
6. The frontend displays the result

The web app shows:

- Positive or Negative sentiment
- Prediction score
- Confidence score
- Review length

---

## Example Positive Review

```text
This movie was amazing. The story was emotional, the acting was brilliant, and the ending was very satisfying. I really enjoyed watching it.
```

---

## Example Negative Review

```text
This movie was boring and disappointing. The story was weak, the acting was poor, and the ending felt meaningless. I would not watch it again.
```

---

## API Endpoints

### Home Route

```http
GET /
```

This route checks whether the API is running.

---

### Health Check Route

```http
GET /health
```

This route checks whether the backend and model are working.

---

### Prediction Route

```http
POST /predict
```

Request body example:

```json
{
  "review": "This movie was amazing and emotional."
}
```

Response example:

```json
{
  "success": true,
  "result": {
    "sentiment": "Positive",
    "score": 0.8945,
    "confidence": 89.45,
    "word_count": 8
  }
}
```

---

## Model Workflow

The model development process includes:

1. Importing required libraries
2. Loading the IMDB dataset
3. Preprocessing text reviews
4. Converting text into sequences
5. Applying padding
6. Building the Simple RNN model
7. Training the model
8. Evaluating model performance
9. Saving the trained model
10. Using the model for prediction

---

## Web App Workflow

The web application workflow includes:

1. User enters a movie review in the React frontend
2. React sends the review to the Flask API
3. Flask receives the review
4. The backend preprocesses the text
5. The trained Simple RNN model predicts the sentiment
6. Flask sends the result back as JSON
7. React displays the final result in the UI

---

## Common Problems and Solutions

### Model Not Found

If the app shows:

```text
No model file was found
```

Make sure the model file is inside the backend folder:

```text
backend/best_simple_rnn_imdb.keras
```

Then restart the backend:

```bash
python app.py
```

---

### Frontend Cannot Connect to Backend

Make sure the backend is running first:

```bash
cd backend
python app.py
```

Then run the frontend in another terminal:

```bash
cd frontend
npm run dev
```

---

### Tailwind CSS Error

If Tailwind CSS shows a PostCSS plugin error, install the required package:

```bash
npm install -D @tailwindcss/postcss
```

Make sure `postcss.config.js` contains:

```js
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

Also make sure the top of `src/index.css` contains:

```css
@import "tailwindcss";
```

---

### Port Already in Use

If Flask port `5000` is already running, stop the previous server using:

```text
CTRL + C
```

Then run again:

```bash
python app.py
```

If Vite port `5173` is busy, Vite may automatically open another port.

---

## Final Output

After completing all steps, the project will open as a modern web application where users can enter a movie review and get real-time sentiment prediction.

The final system connects:

- A trained Simple RNN model
- A Flask backend API
- A React frontend
- A Tailwind CSS user interface

---

## Project Summary

This project demonstrates a complete deep learning deployment workflow.

It starts from training a Simple RNN model on IMDB movie review data and ends with a working web application that can classify user-written reviews in real time.

The project shows practical experience in:

- Deep learning
- Natural language processing
- Model saving and loading
- API development
- Frontend development
- Full-stack machine learning deployment

---

## Author

Developed as an end-to-end deep learning project for IMDB movie review sentiment analysis.