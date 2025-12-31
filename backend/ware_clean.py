import pandas as pd
import numpy as np
try: 
    ds3 = pd.read_csv(r'DataSets\Warehouse_and_Retail_Sales.csv', encoding='latin-1')
except FileNotFoundError:
    print("Error: Make sure the dataset is in the correct directory")
# Dropping null values
ds3.dropna(inplace=True)
# Combining YEAR and MONTH to a single DATE column
# Create a temporary day column
ds3['DAY'] = 1 
# Combine YEAR, MONTH, DAY into a datetime object
ds3['DATE'] = pd.to_datetime(ds3[['YEAR', 'MONTH', 'DAY']]) 
# Dropping redundant columns
ds3.drop(columns=['YEAR', 'MONTH', 'DAY'], inplace=True)

ds3 = ds3.loc[(ds3['RETAIL SALES'] >= 0) & (ds3['RETAIL TRANSFERS'] >= 0) & (ds3['WAREHOUSE SALES'] >= 0)]
ds3.rename(columns={'ITEM CODE': 'Item_ID', 'ITEM TYPE': 'Item_Type', 'DATE': 'DateTime', 
                    'RETAIL SALES': 'Retail_Sales', 'RETAIL TRANSFERS': 'Retail_Transfers',
                    'WAREHOUSE SALES': 'Warehouse_Sales'}, inplace=True)

# Aggregation (Daily/Monthly Time Series)
ds3_agg = ds3.groupby(['DateTime', 'Item_ID'])[['Retail_Sales', 'Retail_Transfers', 'Warehouse_Sales']].sum().reset_index()

# Sorting data
ds3_agg = ds3_agg.sort_values(by=['Item_ID', 'DateTime']).reset_index(drop=True)

# Time features
ds3_agg['Month'] = ds3_agg['DateTime'].dt.month
ds3_agg['Year'] = ds3_agg['DateTime'].dt.year
ds3['DayOfMonth'] =ds3['DateTime'].dt.day
ds3['DayOfWeek'] = ds3['DateTime'].dt.dayofweek # 0=Monday, 6=Sunday
ds3['DayOfYear'] = ds3['DateTime'].dt.dayofyear
ds3['Month'] = ds3['DateTime'].dt.month
ds3['Year'] = ds3['DateTime'].dt.year
ds3['Quarter'] = ds3['DateTime'].dt.quarter
ds3_agg['Retail_Sales_Lag_7'] = ds3_agg.groupby('Item_ID')['Retail_Sales'].shift(7)
ds3_agg['Retail_Sales_Lag_1'] = ds3_agg.groupby('Item_ID')['Retail_Sales'].shift(1)
# Rolling window features
# Rolling mean of past 3 months' Retail Sales
ds3_agg['Rolling_Mean_3'] = ds3_agg.groupby('Item_ID')['Retail_Sales'].transform(
    lambda x: x.shift(1).rolling(window=3, min_periods=1).mean()
)
ds3_agg['Rolling_Std_7'] = ds3_agg.groupby('Item_ID')['Retail_Sales'].transform(
    lambda x: x.shift(1).rolling(window=7, min_periods=1).std()
)
# Final data cleaning (dropping NaNs from shift/rolling)
df_clean = ds3_agg.dropna().copy()
print("\nFinal cleaned and engineered data:")
df_clean.info()
df_clean.to_pickle(r"DataSets\ds4.pkl")
print(df_clean.shape)