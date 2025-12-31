import numpy as np
import pandas as pd
try: 
    df = pd.read_csv(r'DataSets/new_retail_data.csv')
except FileNotFoundError:
    print("Error: Make sure the dataset is in the correct directory")
df.info()
df = df[['Date', 'Total_Purchases', 'Amount', 'Total_Amount', 'Product_Category']]
df=df.dropna()
#df=df[['Customer_ID','Date','Total_Purchases','Amount','Total_Amount','Product_Category']]
df['Date']=pd.to_datetime(df['Date'])
df.rename(columns={'Amount':'Unit_Price','Total_Purchases':'Daily_Demand','Date':'DateTime'},inplace=True)

df=df.loc[(df['Daily_Demand']>=0) & (df['Unit_Price']>=0) & (df['Total_Amount']>=0)]
daily_demand_df=df.groupby(['DateTime','Product_Category'])['Daily_Demand'].sum().reset_index()
daily_demand_df.rename(columns={'Daily_Demand':'Daily_Demand'},inplace=True)
df['Date_Only'] = df['DateTime'].dt.floor('D')
daily_demand_df_final= df.groupby(['Date_Only','Product_Category'])['Daily_Demand'].sum().reset_index()
daily_demand_df_final.rename(columns={'Date_Only': 'DateTime', 'Daily_Demand': 'Daily_Demand'}, inplace=True)
df = daily_demand_df_final.copy()
df['DayOfMonth'] = df['DateTime'].dt.day
df['DayOfWeek'] = df['DateTime'].dt.dayofweek # 0=Monday, 6=Sunday
df['DayOfYear'] = df['DateTime'].dt.dayofyear
df['Month'] = df['DateTime'].dt.month
df['Year'] = df['DateTime'].dt.year
df['Quarter'] = df['DateTime'].dt.quarter

df['Is_Weekend'] = df['DayOfWeek'].apply(lambda x: 1 if x >= 5 else 0)

#sort the data
df=df.sort_values(by=['Product_Category','DateTime']).reset_index(drop=True)
#demand from exactly 1 week ago 
df['Lag_7'] = df.groupby('Product_Category')['Daily_Demand'].shift(7)
#demand from previous day 
df['Lag_1'] = df.groupby('Product_Category')['Daily_Demand'].shift(1)


#rolling window features( to capture recent trends)

#rolling mean of past 3 days
df['Rolling_Mean_3'] = df.groupby('Product_Category')['Daily_Demand'].transform(lambda x: x.shift(1).rolling(window=3,min_periods=1).mean())
#rolling standard deviation (measuring how much the demand changes)
df['Rolling_Std_7']=df.groupby('Product_Category')['Daily_Demand'].transform(lambda x: x.shift(1).rolling(window=7,min_periods=1).std())

#handling any missing values
df_clean = df.dropna().copy()
df_clean.to_pickle(r"DataSets\ds3.pkl")
df_clean.info()
print(df_clean.shape)
#print(df.shape)
#print(df.dtypes)
#print(df.head(1))'''