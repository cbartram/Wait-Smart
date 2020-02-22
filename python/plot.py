import matplotlib.pyplot as plt
import numpy as np
import csv

x = []
y = []

with open('../data/2020_02_22.csv','r') as csvfile:
    plots = csv.reader(csvfile, delimiter=',')
    for row in plots:
        print('Row: ' + row)
        x.append(row[0])
        y.append(row[1])

plt.plot(x,y, label='Loaded from file!')
plt.xlabel('x')
plt.ylabel('y')
plt.title('Interesting Graph\nCheck it out')
plt.legend()
plt.show()