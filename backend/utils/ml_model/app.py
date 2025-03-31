from flask import Flask, request, jsonify
import joblib
import numpy as np
import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Load the model and scaler
model = joblib.load('random_forest_model.pkl')
scaler = joblib.load('scaler.pkl')

# Load secrets from environment variables
JWT_SECRET = os.getenv("JWT_SECRET")
MONGO_URI = os.getenv("MONGO_URI")
DATABASE_PASSWORD = os.getenv("DATABASE_PASSWORD")
API_KEY = os.getenv("API_KEY")
FLASK_API_URL = os.getenv("FLASK_API_URL")
PORT = int(os.getenv("PORT", 5000))

# Connect to MongoDB securely
client = MongoClient(MONGO_URI)
db = client.get_database()

@app.route('/')
def home():
    return "Model API is up and running!"

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        features = np.array(data['features']).reshape(1, -1)
        scaled_features = scaler.transform(features)
        prediction = model.predict(scaled_features)
        return jsonify({'prediction': prediction.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=PORT)
