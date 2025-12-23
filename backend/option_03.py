import pandas as pd
import joblib
from datetime import timedelta
import os
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "TrainedModels", "production_lr_model.pkl")#wrna mac me issue de rha tha, so used os to resolve
def forecast_next_30_days(dataset_path, col_map=None):
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
        #changing the field names according to dict(from names that user entered)
    rename_dict = {}
    if col_map.get('date') in df.columns:
        rename_dict[col_map['date']] = 'DateTime'
    if col_map.get('demand') in df.columns:
        rename_dict[col_map['demand']] = 'Daily_Demand'
    if col_map.get('category') in df.columns:
        rename_dict[col_map['category']] = 'ProductCategory'
        
    df = df.rename(columns=rename_dict)
    required_cols = ['DateTime', 'Daily_Demand', 'ProductCategory']
    if not all(col in df.columns for col in required_cols):
        return f"Error: Dataset missing required columns. Found: {df.columns.tolist()}"

    # Ensure Date is actually datetime objects isme pahle bhot gadbad aa rhi thi
    df['DateTime'] = pd.to_datetime(df['DateTime'])
    all_forecasts = []
    # 5. FORECAST LOOP
    for cat in df['ProductCategory'].unique():
        cat_df = df[df['ProductCategory'] == cat].sort_values('DateTime')
        if len(cat_df) < 7:
            continue
        current_window = cat_df['Daily_Demand'].tail(7).tolist()[::-1]
        last_date = cat_df['DateTime'].max()
        for i in range(1, 31):
            forecast_date = last_date + timedelta(days=i)
            
            # Derived Rolling stats based on current_window
            rolling_mean_3 = sum(current_window[:3]) / 3
            rolling_std_7 = pd.Series(current_window).std()
            if pd.isna(rolling_std_7): 
                rolling_std_7 = 0
            #features we'll be using for prediction
            input_dict = {
                'Year': forecast_date.year,
                'Month': forecast_date.month,
                'DayOfMonth': forecast_date.day,
                'DayOfWeek': forecast_date.weekday(),
                'Rolling_Mean_3': rolling_mean_3,
                'Rolling_Std_7': rolling_std_7
            }
            for j in range(1, 8):
                input_dict[f'Lag_{j}'] = current_window[j-1]
            X_input = pd.DataFrame([input_dict])
            if hasattr(model, 'feature_names_in_'):
                X_input = X_input[model.feature_names_in_]
            pred = model.predict(X_input)[0]
            all_forecasts.append({
                'DateTime': forecast_date,
                'ProductCategory': cat,
                'Forecasted_Demand': pred
            })
            current_window.insert(0, pred)
            current_window.pop()
    return pd.DataFrame(all_forecasts)