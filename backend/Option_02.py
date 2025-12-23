import os
import pandas as pd
import numpy as np
import joblib
from datetime import datetime, timedelta
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "TrainedModels", "production_lr_model.pkl")
def predict_manual_week(start_date,past_7_sales):
    try:
        model=joblib.load(MODEL_PATH)
    except FileNotFoundError:
        return "Error: Model is missing"
    history_sales=list(past_7_sales)
    if len(history_sales)<7:
        return "Error: We need at least 7 days of past data to predict the future demand!"
    current_date=pd.to_datetime(start_date)
    predictions=[]
    print(f"\n Forecasting from {start_date} onwards...\n")
    for i in range(1,8):
        target_date= current_date+ timedelta(days=i)
        #required features for prediction
        feat_lag_1 = history_sales[-1]
        feat_lag_7 = history_sales[-7]
        feat_rolling_mean = np.mean(history_sales[-3:])
        feat_rolling_std = np.std(history_sales[-7:])
        #building the dataframe for the model with required features.
        input_df = pd.DataFrame({
            'DayOfMonth': [target_date.day],
            'DayOfWeek': [target_date.dayofweek],
            'Month': [target_date.month],
            'Year': [target_date.year],
            'Lag_7': [feat_lag_7],
            'Lag_1': [feat_lag_1],
            'Rolling_Mean_3': [feat_rolling_mean],
            'Rolling_Std_7': [feat_rolling_std]
        })
        pred = model.predict(input_df)[0]
        pred = max(0, int(pred)) # No negative sales
        #append newly found values for further prediction
        history_sales.append(pred)
        predictions.append((target_date.strftime("%Y-%m-%d"), pred))
    return predictions