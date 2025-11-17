import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib

def train_model():
    df = pd.read_csv("diabetes.csv")
    x = df.drop(['Outcome'], axis=1)
    y = df['Outcome']
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=0)

    rf = RandomForestClassifier()
    rf.fit(x_train, y_train)

    acc = rf.score(x_test, y_test)
    print(f"Model trained successfully! Accuracy: {acc*100:.2f}%")

    # Save model and columns
    joblib.dump(rf, "diabetes_model.pkl")
    joblib.dump(list(x.columns), "model_columns.pkl")

def predict(data_dict):
    import numpy as np
    model = joblib.load("diabetes_model.pkl")
    cols = joblib.load("model_columns.pkl")

    data = pd.DataFrame([data_dict], columns=cols)
    prediction = model.predict(data)
    return int(prediction[0])