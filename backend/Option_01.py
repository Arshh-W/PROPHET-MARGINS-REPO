import pandas as pd
import numpy as np
import joblib
from datetime import datetime, timedelta
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "TrainedModels", "production_lr_model.pkl")
def forecast_next_30_days(dataset_path, product_category, col_map=None):
    try: 
        model = joblib.load(MODEL_PATH)
    except FileNotFoundError:
        return f"Error: The Model was not found at {MODEL_PATH}"
    try:
        if dataset_path.endswith('.csv'):
            df = pd.read_csv(dataset_path)
        else:
            df = pd.read_pickle(dataset_path)
    except Exception as e:
        return f"Error loading file: {str(e)}"
    if col_map is None:
        col_map = {
            'date': 'DateTime', 
            'demand': 'Daily_Demand', 
            'category': 'ProductCategory'
        }

    rename_dict = {}
    if col_map.get('date') in df.columns:
        rename_dict[col_map['date']] = 'DateTime'
    if col_map.get('demand') in df.columns:
        rename_dict[col_map['demand']] = 'Daily_Demand'
    if col_map.get('category') in df.columns:
        rename_dict[col_map['category']] = 'ProductCategory'
        
    df = df.rename(columns=rename_dict)
    required_cols = ['DateTime', 'Daily_Demand', 'ProductCategory']
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        return f"Error: Dataset missing required columns. Missing: {missing}"

    # Ensure Date is actually datetime objects
    df['DateTime'] = pd.to_datetime(df['DateTime'])
    if product_category not in df['ProductCategory'].unique():
        # Try finding a close match or return error
        return f"Error: Category '{product_category}' not found in dataset."

    df = df[df['ProductCategory'] == product_category].copy()

    if df.empty:
        return "Error: No data found for this category after filtering."
    df = df.sort_values('DateTime')
    if len(df) < 7:
        return "Error: Not enough historical data (need at least 7 days)."
    history = df.tail(10).copy()
    # List to store future predictions
    future_forecast = []
    last_date = history['DateTime'].iloc[-1]
    # 6. RECURSIVE FORECASTING LOOP
    for i in range(1, 31):
        next_date = last_date + timedelta(days=i)
        # Extract features from current history
        sales_last_7_days = history['Daily_Demand'].tail(7).values
        sales_last_3_days = history['Daily_Demand'].tail(3).values
        #other stats
        feat_day = next_date.day
        feat_weekday = next_date.weekday() 
        feat_month = next_date.month
        feat_year = next_date.year
        feat_lag_1 = float(history['Daily_Demand'].iloc[-1]) 
        feat_lag_7 = float(history['Daily_Demand'].iloc[-7]) 
        feat_rolling_mean = np.mean(sales_last_3_days)
        feat_rolling_std = np.std(sales_last_7_days)
        if np.isnan(feat_rolling_std): feat_rolling_std = 0
        # features for prediction
        input_data = pd.DataFrame({
            'Year': [feat_year],
            'Month': [feat_month],
            'DayOfMonth': [feat_day],
            'DayOfWeek': [feat_weekday],
            'Rolling_Mean_3': [feat_rolling_mean],
            'Rolling_Std_7': [feat_rolling_std],
            'Lag_1': [feat_lag_1],
            'Lag_2': [history['Daily_Demand'].iloc[-2]], 
            'Lag_3': [history['Daily_Demand'].iloc[-3]],
            'Lag_4': [history['Daily_Demand'].iloc[-4]],
            'Lag_5': [history['Daily_Demand'].iloc[-5]],
            'Lag_6': [history['Daily_Demand'].iloc[-6]],
            'Lag_7': [feat_lag_7]
        })
        
        # Ensure correct column order for model
        if hasattr(model, 'feature_names_in_'):
            input_data = input_data[model.feature_names_in_]

        # Predict
        predicted_demand = model.predict(input_data)[0]
        predicted_demand = max(0, int(predicted_demand)) 
        #update history to aid further predictionn
        new_row = pd.DataFrame({
            'DateTime': [next_date],
            'Daily_Demand': [predicted_demand],
            'ProductCategory': [product_category]
        })
        history = pd.concat([history, new_row], ignore_index=True)
        future_forecast.append({
            'Date': next_date.strftime("%Y-%m-%d"),
            'Demand': predicted_demand 
        })
    return future_forecast