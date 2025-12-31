import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import r2_score
#the cleaned dataset file(4th dataset)
DATA_PATH = "DataSets/ds4.pkl"
SAVE_DIR = "TrainedModels" #folder where all trained models are stored


def prepare_data(df): #prepares the dataframe for the model training
    df = df.copy()
    if 'Retail_Sales' in df.columns: df = df.rename(columns={'Retail_Sales': 'Daily_Demand'})
    #renaming the columns
    rename_map = {'Retail_Sales_Lag_1': 'Lag_1', 'Retail_Sales_Lag_7': 'Lag_7'}
    df = df.rename(columns=rename_map)
    #if some parameters are missing create them during runtime
    if 'DayOfMonth' not in df.columns and 'DateTime' in df.columns:
        df['DateTime'] = pd.to_datetime(df['DateTime'])
        df['DayOfMonth'] = df['DateTime'].dt.day
        df['DayOfWeek'] = df['DateTime'].dt.dayofweek
        df['Month'] = df['DateTime'].dt.month
        df['Year'] = df['DateTime'].dt.year     
    #features, i.e the columns we'll be utilizing
    features = ['DayOfMonth', 'DayOfWeek', 'Month', 'Year', 'Lag_7', 'Lag_1', 'Rolling_Mean_3', 'Rolling_Std_7']
    return df[features + ['Daily_Demand']].dropna()

print(f"--- TRAINING")
print("...")
#read the file
raw_df = pd.read_pickle(DATA_PATH)
df = prepare_data(raw_df)
#X fields used for prediction, all features except Daily_Demand
X = df.drop(columns=['Daily_Demand'])
#Yfield(whil we'll be predicting) 
y = df['Daily_Demand']
#Splitting the dataset into 80% of training, 20% of validation or testing
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print("\n[1] Training Linear Regression...")
#Linear Regression
lr_model = LinearRegression()
lr_model.fit(X_train, y_train)
#r2 score of Lr
lr_score = r2_score(y_test, lr_model.predict(X_test))
print(f"    > Accuracy (R2): {lr_score:.4f}")
#Storing the trained model into a .pkl file
joblib.dump(lr_model, f"{SAVE_DIR}/production_lr_model.pkl")
print("\n[2] tuning Random Forest ...")
param_grid = {#to allocate spectific depth and n_estimators to the grid to resolve crash issue
    'n_estimators': [100, 200],      
    'max_depth': [10, 15, 20],          
}
#random forest
rf = RandomForestRegressor(random_state=42)
grid_search = GridSearchCV(#runs random forest, at specific depths to refine the model by finding different random forests are different depths
    estimator=rf, 
    param_grid=param_grid, 
    cv=3, 
    n_jobs=2, 
    verbose=2, 
    scoring='r2'
)
grid_search.fit(X_train, y_train)
best_rf = grid_search.best_estimator_
rf_score = r2_score(y_test, best_rf.predict(X_test))
print(f"\n    > Best Params Found: {grid_search.best_params_}")
print(f"    > Final Accuracy (R2): {rf_score:.4f}")
#Saving the randomforest with best parameters 
joblib.dump(best_rf, f"{SAVE_DIR}/production_rf_model.pkl")
print("\n" + "="*40)
print("MODELS SAVED. READY FOR FORECASTING.")
print("*"*40)

#Input fields- 

"""
1.) Dataset ->csv-> read, clean, fields ko access krkr required data use krlenge + Graph +API inference
    (error: The Required Fields are: 'Quantity' And 'Date')

2.) Direct simple assumption when certain fields are known: (Lag1, lag7, mean, std)-> assumption + analysis based on mean and std, 

3.)Category wise sales analysis. (Add this to the model.)

4.) Future improvement- ( Price prediction based of big retailers)
5.)???

"""