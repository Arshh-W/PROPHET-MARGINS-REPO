import pandas as pd
import numpy as np
try: 
    ds2 =pd.read_csv(r'DataSets\data.csv',encoding='latin-1')
except FileNotFoundError:
    print("Error: Make sure the dataset is in the correct directory")
print("Initial data : ")
ds2.info()
#handling missing values 
ds2['CustomerID'] = ds2['CustomerID'].astype(str)
ds2['CustomerID'] = ds2['CustomerID'].replace('nan', 'Guest')
#correct datatype for datetime
ds2['InvoiceDate']= pd.to_datetime(ds2['InvoiceDate'])
print("InvoiceDate column has been converted to datetime.")
#handling missing description values 
ds2['Description'] = ds2['Description'].fillna('No Description')
#removing non positive Quantity
ds2=ds2[ds2['Quantity']>0]
#remove non positive price 
ds2=ds2[ds2['UnitPrice']>0]
#calculate the 'Sales'
ds2['Sales']=ds2['Quantity']* ds2['UnitPrice']
ds2.info()
daily_demand_df= ds2.groupby([ds2['InvoiceDate'].dt.floor('D').rename('DateTime'),'StockCode'])['Quantity'].sum().reset_index()
daily_demand_df.rename(columns={'InvoiceDate':'DateTime','StockCode':'ProductCategory',
                                'Quantity':'Daily_Demand'},inplace=True)
                              #extracts only date
df=daily_demand_df.copy()
df['DayOfMonth']=df['DateTime'].dt.day
df['DayOfWeek']=df['DateTime'].dt.dayofweek
df['DateOfYear']=df['DateTime'].dt.dayofyear
df['Month']=df['DateTime'].dt.month
df['Year']=df['DateTime'].dt.year
df['Quarter']=df['DateTime'].dt.quarter

#is weekend or not column
df['IsWeekend']=df['DayOfWeek'].apply(lambda x:1 if x>=5 else 0)
#sorting
df=df.sort_values(by=['ProductCategory','DateTime']).reset_index(drop=True)
#demand exactly 1 week ago 
df['Lag_7']=df.groupby('ProductCategory')['Daily_Demand'].shift(7)
#demand exactly 1 day ago
df['Lag_1']=df.groupby('ProductCategory')['Daily_Demand'].shift(1)
#Rolling mean window of 3 days.
df['Rolling_Mean_3']=df.groupby('ProductCategory')['Daily_Demand'].transform(
    lambda x: x.shift(1).rolling(window=3,min_periods=1).mean())
# Rolling Standard deviation of 7 days. 
df['Rolling_Std_7']=df.groupby('ProductCategory')['Daily_Demand'].transform(lambda x:x.shift(1).rolling(window=7,min_periods=1).std())

df_clean=df.dropna().copy()
print("Done cleaning the data set!!")
print(f"Original rows: {len(df)}")
print(f"Clean rows ready for training: {len(df_clean)}")
print("\nFinal Cleaned Data Head with Features:")
print(df_clean.head())
df_clean.to_pickle(r"DataSets\ds2.pkl")
df_clean.info()