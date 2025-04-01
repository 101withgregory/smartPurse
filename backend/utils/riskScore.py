import numpy as np
import pickle
import random
from flask import Flask, request, jsonify
from sklearn.preprocessing import StandardScaler

app = Flask(__name__)

# Load Pretrained Model
with open('./ml_model/random_forest_model.pkl', 'rb') as file:
    loaded_model = pickle.load(file)

with open('./ml_model/scaler.pkl', 'rb') as f:
    scaler = pickle.load(f)

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        amount = data['amount']

        input_data = np.array([
            amount,
            data['oldbalanceOrg'],
            data['newbalanceOrig'],
            data['oldbalanceDest'],
            data['newbalanceDest'],
            data['time_diff'],
            data['balance_change_ratio'],
            data['amount_vs_median'],
            data['type__CASH_IN'],
            data['type__CASH_OUT'],
            data['type__DEBIT'],
            data['type__PAYMENT'],
            data['type__TRANSFER'],
            data['accountOrig'],
            data['accountDest']
        ]).reshape(1, -1).astype(np.float32)

        input_data = scaler.transform(input_data)
        probability = loaded_model.predict_proba(input_data)[0][1]

        # Restore original risk score logic
        base_score = (probability * 0.5) + (np.log1p(amount) * 0.00005) + (data['balance_change_ratio'] * 0.3)

        # Allow high variations for large transactions
        if amount >= 500000:
            base_score += random.uniform(5, 50)  

        # No clamping, restore original behavior
        risk_score = base_score * 100  

        # Ensure risk score is always an odd number with decimals
        if int(risk_score) % 2 == 0:
            risk_score += random.uniform(1.01, 1.99)  # Adjust to odd number

        return jsonify({"riskScore": round(risk_score, 5)})  # Keep five decimal places

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(port=5001)
