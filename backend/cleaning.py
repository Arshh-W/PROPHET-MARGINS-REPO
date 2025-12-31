#Data Cleaning and Aggregation
import pandas as pd
import numpy as np
try: 
    ds = pd.read_csv(r'DataSets\DMart_sample_data.csv')
except FileNotFoundError:
    print("Error: Make sure the dataset is in the correct directory")
print("Initial data : ")
ds.info()
#Let's combile Date and Time columns to be a DateTime object
ds['DateTime']=pd.to_datetime(ds['Date'],format='%d-%m-%Y %H:%M')
#Filtering any transactions which might have non positive quantity due to data entry errors
ds=ds[ds['Quantity']>0].copy()
#aggregating sales data by date and product category
daily_demand_df=ds.groupby(['DateTime','ProductCategory'])['Quantity'].sum().reset_index()
daily_demand_df.rename(columns={'Quantity':'Daily_Demand'},inplace=True)
print("Aggregated Daily Demand Info:")
daily_demand_df.info() 
print("\nAggregated Daily Demand Head:")
print(daily_demand_df.head())
df = daily_demand_df.copy()
df['Date_Only'] = df['DateTime'].dt.floor('D')
#grouping again, by the day  and category to sum the demand across day
daily_demand_df_final= df.groupby(['Date_Only','ProductCategory'])['Daily_Demand'].sum().reset_index()
daily_demand_df_final.rename(columns={'Date_Only': 'DateTime', 'Daily_Demand': 'Daily_Demand'}, inplace=True)
df = daily_demand_df_final.copy()
#ready to use clean dataframe
print("Final Daily Aggregation Head:")
print(df.head())
#is weekend and other day and date related parameters
df['DayOfMonth'] = df['DateTime'].dt.day
df['DayOfWeek'] = df['DateTime'].dt.dayofweek # 0=Monday, 6=Sunday
df['DayOfYear'] = df['DateTime'].dt.dayofyear
df['Month'] = df['DateTime'].dt.month
df['Year'] = df['DateTime'].dt.year
df['Quarter'] = df['DateTime'].dt.quarter
df['Is_Weekend'] = df['DayOfWeek'].apply(lambda x: 1 if x >= 5 else 0)
#sort the data
df=df.sort_values(by=['ProductCategory','DateTime']).reset_index(drop=True)
#demand from exactly 1 week ago 
df['Lag_7'] = df.groupby('ProductCategory')['Daily_Demand'].shift(7)
#demand from previous day 
df['Lag_1'] = df.groupby('ProductCategory')['Daily_Demand'].shift(1)
#rolling window features( to capture recent trends)
#rolling mean of past 3 days
df['Rolling_Mean_3'] = df.groupby('ProductCategory')['Daily_Demand'].transform(lambda x: x.shift(1).rolling(window=3,min_periods=1).mean())
#rolling standard deviation (measuring how much the demand changes)
df['Rolling_Std_7']=df.groupby('ProductCategory')['Daily_Demand'].transform(lambda x: x.shift(1).rolling(window=7,min_periods=1).std())
#handling any missing values
df_clean = df.dropna().copy()
print("Done cleaning the data set!!")
print(f"Original rows: {len(df)}")
print(f"Clean rows ready for training: {len(df_clean)}")
print("\nFinal Cleaned Data Head with Features:")
print(df_clean.head())
df_clean.to_pickle(r"DataSets\ds1.pkl")
df_clean.info()