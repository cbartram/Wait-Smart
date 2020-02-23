from __future__ import absolute_import, division, print_function, unicode_literals
import tensorflow as tf

import matplotlib as mpl
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd

mpl.rcParams['figure.figsize'] = (8, 6)
mpl.rcParams['axes.grid'] = False

TRAIN_SPLIT = 900 # Use 80% of the data for training and 20% for validation
BATCH_SIZE = 256
BUFFER_SIZE = 10000
EVALUATION_INTERVAL = 200
EPOCHS = 10
PAST_HISTORY = 20
FUTURE_TARGET = 0


'''
The function below returns the above described windows of time for the model to train on. The parameter history_size 
is the size of the past window of information. The target_size is how far in the future does the model need to learn to predict.
The target_size is the label that needs to be predicted.
:param dataset The dataset 
:param start_index
:param end_index
:param history_size The parameter history_size is the size of the past window of information.
:param target_size  The target_size is how far in the future does the model need to learn to predict. The target_size is the label that needs to be predicted.
'''
def univariate_data(dataset, start_index, end_index, history_size, target_size):
    data = []
    labels = []

    start_index = start_index + history_size
    if end_index is None:
        end_index = len(dataset) - target_size

    for i in range(start_index, end_index):
        indices = range(i - history_size, i)
        # Reshape data from (history_size,) to (history_size, 1)
        data.append(np.reshape(dataset[indices], (history_size, 1)))
        labels.append(dataset[i + target_size])
    return np.array(data), np.array(labels)


def create_time_steps(length):
    return list(range(-length, 0))

'''
 The information given to the network is given in blue, and it must predict the value at the red cross.
 :param plot_data
 :param delta
 :param title String the title of the plot
'''
def show_plot(plot_data, delta, title):
    labels = ['Historic Wait Times', 'Actual Future Wait Time', 'Model Prediction']
    marker = ['.-', 'rx', 'go']
    time_steps = create_time_steps(plot_data[0].shape[0])
    if delta:
        future = delta
    else:
        future = 0

    plt.title(title)
    for i, x in enumerate(plot_data):
        if i:
            plt.plot(future, plot_data[i], marker[i], markersize=10,
                     label=labels[i])
        else:
            plt.plot(time_steps, plot_data[i].flatten(), marker[i], label=labels[i])
    plt.legend()
    plt.xlim([time_steps[0], (future+5)*2])
    plt.xlabel('Time-Step')
    return plt

'''
By taking a simple average of the historical records. This is the baseline by which
we compare the RNN against. The result of this value determines how well our neural network
performs.
'''
def baseline(history):
    return np.mean(history)

tf.random.set_seed(13)

df = pd.read_csv('../data/waitsmart_ride_wait_times.csv')
df = df.groupby('ride')
df = df.get_group(10135)

uni_data = df['wait']
uni_data.index = df['timestamp']
uni_data.head()

uni_data = uni_data.values
uni_data = (uni_data - uni_data[:TRAIN_SPLIT].mean()) / uni_data[:TRAIN_SPLIT].std()

x_train_uni, y_train_uni = univariate_data(uni_data, 0, TRAIN_SPLIT, PAST_HISTORY, FUTURE_TARGET)
x_val_uni, y_val_uni = univariate_data(uni_data, TRAIN_SPLIT, None, PAST_HISTORY, FUTURE_TARGET)

print ('Single window of past history')
print (x_train_uni[0])
print ('\n Target wait time to predict')
print (y_train_uni[0])

show_plot([x_train_uni[0], y_train_uni[0], baseline(x_train_uni[0])], 0, 'Baseline Prediction Example')
plt.show()

train_univariate = tf.data.Dataset.from_tensor_slices((x_train_uni, y_train_uni))
train_univariate = train_univariate.cache().shuffle(BUFFER_SIZE).batch(BATCH_SIZE).repeat()

val_univariate = tf.data.Dataset.from_tensor_slices((x_val_uni, y_val_uni))
val_univariate = val_univariate.batch(BATCH_SIZE).repeat()

simple_lstm_model = tf.keras.models.Sequential([
    tf.keras.layers.LSTM(8, input_shape=x_train_uni.shape[-2:]),
    tf.keras.layers.Dense(1)
])

simple_lstm_model.compile(optimizer='adam', loss='mae')

for x, y in val_univariate.take(1):
    print("Sample Prediction: ")
    print(simple_lstm_model.predict(x).shape)


simple_lstm_model.fit(train_univariate, epochs=EPOCHS, steps_per_epoch=EVALUATION_INTERVAL, validation_data=val_univariate, validation_steps=50)

for x, y in val_univariate.take(3):
    plot = show_plot([x[0].numpy(), y[0].numpy(), simple_lstm_model.predict(x)[0]], 0, 'Simple LSTM model')
    plot.show()