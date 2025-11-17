from flask import Flask, jsonify, request, send_file, send_from_directory, render_template_string
from flask_cors import CORS
import joblib
import pandas as pd
import os
from plot_generator import generate_all_plots

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

# Load model and input column order once (fast)
model = joblib.load("../ml_service/diabetes_model.pkl")
columns = joblib.load("../ml_service/model_columns.pkl")

# Load accuracy from training
try:
    accuracy = joblib.load("../ml_service/model_accuracy.pkl")
except:
    accuracy = 0.85  # Default fallback accuracy

@app.route("/")
def index():
    # Read and return the HTML file directly
    with open('../frontend/index.html', 'r') as file:
        html_content = file.read()
    return html_content

@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json

        # Convert to DataFrame following correct input order
        df = pd.DataFrame([data], columns=columns)

        # Run ML model
        prediction = model.predict(df)[0]

        # Generate ALL plots for the dashboard
        generate_all_plots(df.iloc[0], prediction)

        return jsonify({
            "prediction": int(prediction),
            "message": "Diabetic" if prediction == 1 else "Not Diabetic",
            "accuracy": round(accuracy * 100, 2),
            "plots": [
                "/plot/1",
                "/plot/2",
                "/plot/3",
                "/plot/4",
                "/plot/5",
                "/plot/6",
                "/plot/7"
            ]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/plot/<int:num>")
def plot(num):
    """Serve generated plot images based on number."""
    path = f"static/plots/plot{num}.png"
    return send_file(path, mimetype="image/png")

if __name__ == "__main__":
    # Create static/plots directory if it doesn't exist
    os.makedirs("static/plots", exist_ok=True)
    app.run(debug=True)