import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend
import matplotlib.pyplot as plt
import seaborn as sns
import pandas as pd
import numpy as np
import os

def generate_all_plots(user_data, prediction):
    """
    Generate all 7 visualization plots comparing user data with the dataset
    """
    # Load dataset
    df = pd.read_csv("../ml_service/diabetes.csv")
    
    # Create plots directory if it doesn't exist
    os.makedirs("static/plots", exist_ok=True)
    
    # Color for user's point
    color = 'red' if prediction == 1 else 'blue'
    
    # Plot 1: Age vs Pregnancies
    plt.figure(figsize=(10, 6))
    sns.scatterplot(x='Age', y='Pregnancies', data=df, hue='Outcome', palette='Greens')
    plt.scatter(x=user_data['Age'], y=user_data['Pregnancies'], s=150, color=color, edgecolors='black', linewidth=2)
    plt.xticks(np.arange(10, 100, 5))
    plt.yticks(np.arange(0, 20, 2))
    plt.title('Pregnancy count Graph (Others vs Yours)\n0 - Healthy & 1 - Unhealthy')
    plt.tight_layout()
    plt.savefig('static/plots/plot1.png', dpi=100, bbox_inches='tight')
    plt.close()
    
    # Plot 2: Age vs Glucose
    plt.figure(figsize=(10, 6))
    sns.scatterplot(x='Age', y='Glucose', data=df, hue='Outcome', palette='magma')
    plt.scatter(x=user_data['Age'], y=user_data['Glucose'], s=150, color=color, edgecolors='black', linewidth=2)
    plt.xticks(np.arange(10, 100, 5))
    plt.yticks(np.arange(0, 220, 10))
    plt.title('Glucose Value Graph (Others vs Yours)\n0 - Healthy & 1 - Unhealthy')
    plt.tight_layout()
    plt.savefig('static/plots/plot2.png', dpi=100, bbox_inches='tight')
    plt.close()
    
    # Plot 3: Age vs BloodPressure
    plt.figure(figsize=(10, 6))
    sns.scatterplot(x='Age', y='BloodPressure', data=df, hue='Outcome', palette='Reds')
    plt.scatter(x=user_data['Age'], y=user_data['BloodPressure'], s=150, color=color, edgecolors='black', linewidth=2)
    plt.xticks(np.arange(10, 100, 5))
    plt.yticks(np.arange(0, 130, 10))
    plt.title('BloodPressure Value Graph (Others vs Yours)\n0 - Healthy & 1 - Unhealthy')
    plt.tight_layout()
    plt.savefig('static/plots/plot3.png', dpi=100, bbox_inches='tight')
    plt.close()
    
    # Plot 4: Age vs SkinThickness
    plt.figure(figsize=(10, 6))
    sns.scatterplot(x='Age', y='SkinThickness', data=df, hue='Outcome', palette='Blues')
    plt.scatter(x=user_data['Age'], y=user_data['SkinThickness'], s=150, color=color, edgecolors='black', linewidth=2)
    plt.xticks(np.arange(10, 100, 5))
    plt.yticks(np.arange(0, 110, 10))
    plt.title('Skin Thickness Value Graph (Others vs Yours)\n0 - Healthy & 1 - Unhealthy')
    plt.tight_layout()
    plt.savefig('static/plots/plot4.png', dpi=100, bbox_inches='tight')
    plt.close()
    
    # Plot 5: Age vs Insulin
    plt.figure(figsize=(10, 6))
    sns.scatterplot(x='Age', y='Insulin', data=df, hue='Outcome', palette='rocket')
    plt.scatter(x=user_data['Age'], y=user_data['Insulin'], s=150, color=color, edgecolors='black', linewidth=2)
    plt.xticks(np.arange(10, 100, 5))
    plt.yticks(np.arange(0, 900, 50))
    plt.title('Insulin Value Graph (Others vs Yours)\n0 - Healthy & 1 - Unhealthy')
    plt.tight_layout()
    plt.savefig('static/plots/plot5.png', dpi=100, bbox_inches='tight')
    plt.close()
    
    # Plot 6: Age vs BMI
    plt.figure(figsize=(10, 6))
    sns.scatterplot(x='Age', y='BMI', data=df, hue='Outcome', palette='rainbow')
    plt.scatter(x=user_data['Age'], y=user_data['BMI'], s=150, color=color, edgecolors='black', linewidth=2)
    plt.xticks(np.arange(10, 100, 5))
    plt.yticks(np.arange(0, 70, 5))
    plt.title('BMI Value Graph (Others vs Yours)\n0 - Healthy & 1 - Unhealthy')
    plt.tight_layout()
    plt.savefig('static/plots/plot6.png', dpi=100, bbox_inches='tight')
    plt.close()
    
    # Plot 7: Age vs DiabetesPedigreeFunction
    plt.figure(figsize=(10, 6))
    sns.scatterplot(x='Age', y='DiabetesPedigreeFunction', data=df, hue='Outcome', palette='YlOrBr')
    plt.scatter(x=user_data['Age'], y=user_data['DiabetesPedigreeFunction'], s=150, color=color, edgecolors='black', linewidth=2)
    plt.xticks(np.arange(10, 100, 5))
    plt.yticks(np.arange(0, 3, 0.2))
    plt.title('DPF Value Graph (Others vs Yours)\n0 - Healthy & 1 - Unhealthy')
    plt.tight_layout()
    plt.savefig('static/plots/plot7.png', dpi=100, bbox_inches='tight')
    plt.close()