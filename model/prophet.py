import pandas as pd
from fbprophet.plot import plot_plotly
import plotly.offline as py
from fbprophet import Prophet

df = pd.read_csv('../data/2020_03_09.csv')
print(df.head())

df = df[(df.id == 10842)]
print("DF after filtering")
print(df.head())

df = df.filter(['ds', 'y'])
print("DF after dropping Id col")
print(df.head())

df['ds'] = pd.to_datetime(df['ds'], unit='ms')
print("Converted Timestamps")

print(df.head())

m = Prophet()
m.fit(df)

future = m.make_future_dataframe(periods=5)
print(future.tail())

print("Forcast:")
forecast = m.predict(future)
print(forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail())

fig = m.plot(forecast)
fig.show()

fig2 = m.plot_components(forecast)


# fig = plot_plotly(m, forecast)  # This returns a plotly Figure
# fig.show()