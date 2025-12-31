import pandas as pd
import numpy as np
import joblib
import warnings
from datetime import datetime, timedelta
warnings.filterwarnings('ignore')
MODEL_PATH = "TrainedModels/production_rf_model.pkl"
def predict_next_day(current_date, sales_today, sales_last_week, rolling_mean, rolling_std):
    """
    This function is the 'Brain' of the future website.
    It takes raw numbers and returns the prediction.
    """
    try:
        model = joblib.load(MODEL_PATH) #loads the trained model we're using production_rf_model
    except FileNotFoundError:
        return "ERROR: Model file not found. Have you trained it yet?"
    target_date = pd.to_datetime(current_date) + timedelta(days=1)
    input_data = {
        'DayOfMonth': [target_date.day],
        'DayOfWeek': [target_date.dayofweek],
        'Month': [target_date.month],
        'Year': [target_date.year],
        'Lag_7': [sales_last_week],
        'Lag_1': [sales_today],
        'Rolling_Mean_3': [rolling_mean],
        'Rolling_Std_7': [rolling_std]
    }
    #Prediction using the dataframe
    df = pd.DataFrame(input_data)
    prediction = model.predict(df)[0]
    #returning the prediction
    return int(prediction)
if __name__ == "__main__":
    #temperory testing interface( Ye gemini ne likha h isse aage ka sabh, kuch samajhne layak nhi h, just for testing model with input)
    print("\n" + "="*40)
    print("PROPHET MARGINS: DEMAND FORECASTER")
    print("="*40)
    now = datetime.now().strftime("%Y-%m-%d")
    print(f" > Date: {now} (Predicting for Tomorrow)")
    try:
        print("\n--- ENTER SALES DATA ---")
        s_today = float(input(" > Sales TODAY (Lag_1): "))
        s_week = float(input(" > Sales SAME DAY LAST WEEK (Lag_7): "))
        print("\n--- ENTER TREND DATA ---")
        print("(If unknown, just estimate based on recent days)")
        r_mean = float(input(" > Avg Sales Last 3 Days (Rolling Mean): "))
        r_std = float(input(" > Volatility/StdDev (Enter 0 if stable): "))
        result = predict_next_day(now, s_today, s_week, r_mean, r_std)
        print("\n" + "-"*30)
        print(f" 🔮 FORECAST FOR TOMORROW: {result} UNITS")
        print("-"*30)
    except ValueError:
        print("\n! Error: Please enter valid numbers only.")