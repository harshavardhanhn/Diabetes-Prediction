import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os

# Load dataset
csv_path = "diabetes.csv"
df = pd.read_csv(csv_path)

# Split into features and target
X = df.drop(['Outcome'], axis=1)
y = df['Outcome']

# Train-test split
x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=0)

# Train Random Forest model
model = RandomForestClassifier()
model.fit(x_train, y_train)

# Calculate accuracy
y_pred = model.predict(x_test)
accuracy = accuracy_score(y_test, y_pred)

# Save model
model_path = "diabetes_model.pkl"
joblib.dump(model, model_path)

# Save the column names for reference
cols_path = "model_columns.pkl"
joblib.dump(list(X.columns), cols_path)

# Save accuracy
accuracy_path = "model_accuracy.pkl"
joblib.dump(accuracy, accuracy_path)

print(f"✅ Model saved at: {model_path}")
print(f"✅ Column names saved at: {cols_path}")
print(f"✅ Accuracy saved: {accuracy:.2%}")