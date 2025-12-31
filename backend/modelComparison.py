import pandas as pd
import numpy as np
import joblib 
import os
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import HistGradientBoostingRegressor, RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score

#making the directory, if it doesn't exist
if not os.path.exists('TrainedModels'):
    os.makedirs('TrainedModels')
def prepare_data(df):#ensuring each dataset is ready for training the model.
    df = df.copy()
    if 'Retail_Sales' in df.columns:
        df = df.rename(columns={'Retail_Sales': 'Daily_Demand'})
    rename_map = {
        'Retail_Sales_Lag_1': 'Lag_1',
        'Retail_Sales_Lag_7': 'Lag_7',
    }
    df = df.rename(columns=rename_map)
    if 'DayOfMonth' not in df.columns and 'DateTime' in df.columns:
        df['DateTime'] = pd.to_datetime(df['DateTime'])
        df['DayOfMonth'] = df['DateTime'].dt.day
        df['DayOfWeek'] = df['DateTime'].dt.dayofweek
        df['Month'] = df['DateTime'].dt.month
        df['Year'] = df['DateTime'].dt.year
    features = ['DayOfMonth', 'DayOfWeek', 'Month', 'Year', 'Lag_7', 'Lag_1', 'Rolling_Mean_3', 'Rolling_Std_7']
    target = 'Daily_Demand'
    available_cols = [c for c in features + [target] if c in df.columns]
    return df[available_cols].dropna()
def train_and_save(file_path, dataset_name):
    #main training function
    print(f"\n[{dataset_name}] PROCESSING...")
    results = {}
    try:
        raw_df = pd.read_pickle(file_path) #reads the dataset
        df = prepare_data(raw_df) #ensures it's correctly prepared
        #features we'll be using -
        features = ['DayOfMonth', 'DayOfWeek', 'Month', 'Year', 'Lag_7', 'Lag_1', 'Rolling_Mean_3', 'Rolling_Std_7']
        target = 'Daily_Demand'
        if not all(col in df.columns for col in features + [target]):
            print(f" > SKIPPING: Missing columns in {dataset_name}")
            return None
            #if missing any columns, let the developer know.
        #ensuring there is enough data to train the model
        if len(df) < 100:
            print(" > SKIPPING: Not enough data.")
            return None
        #fields we'll be using for prediction are in X
        X = df[features]
        #field we want to predict(Daily_Dsemand)
        y = df[target]

        #splitting the data into 80:20 ration for training and testing
        X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
        models = {#trying 3 types of models on each dataset to findout the most accurate one
            "LinearReg": LinearRegression(),
            "RandomForest": RandomForestRegressor(n_estimators=100, max_depth=15, random_state=42, n_jobs=-1),
            "HistGradBoost": HistGradientBoostingRegressor(max_iter=200, learning_rate=0.1, max_depth=10, random_state=42)
        }
        dataset_id = dataset_name.split(" ")[1] # Extracts "1", "2", "3", "4"
        #function which runs all models for all datasets and saves the trained models in the directory as .pk; files
        for model_name, model in models.items():
            model.fit(X_train, y_train)
            y_pred = model.predict(X_val)
            r2 = r2_score(y_val, y_pred)
            filename = f"TrainedModels/ds{dataset_id}_{model_name}.pkl"
            joblib.dump(model, filename)
            print(f"   > {model_name.ljust(15)} | R2: {r2:.4f}")
            results[model_name] = r2
        return results
    except Exception as e:
        print(f" > CRITICAL FAILURE: {e}")
        return None
print("--- STARTING MULTI-MODEL EXPERIMENT ---")
datasets = [
    ("DataSets/ds1.pkl", "DATASET 1"),
    ("DataSets/ds2.pkl", "DATASET 2"),
    ("DataSets/ds3.pkl", "DATASET 3"),
    ("DataSets/ds4.pkl", "DATASET 4"),
]

#print all the scores of all datasets when training all 3 type of models
final_scoreboard = []
for path, name in datasets:
    res = train_and_save(path, name)
    if res:
        res['Dataset'] = name
        final_scoreboard.append(res)
print("\n" + "="*60)
print(f"{'DATASET':<15} | {'LINEAR':<10} | {'RF':<10} | {'HGB':<10}")
print("="*60)
for entry in final_scoreboard:
    d_name = entry.get('Dataset')
    lin = entry.get('LinearReg', 0)
    rf = entry.get('RandomForest', 0)
    hgb = entry.get('HistGradBoost', 0)
    print(f"{d_name:<15} | {lin:.4f}     | {rf:.4f}     | {hgb:.4f}")
print("="*60)
print("All models have been saved to the '/TrainedModels' folder.")