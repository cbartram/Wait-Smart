var fs = require('fs');
const chalk = require('chalk');
const moment = require('moment');
const parse = require('csv-parse');
const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');



const csvData = [];
fs.createReadStream('../data/2020_02_22.csv')
    .pipe(parse({delimiter: ','}))
    .on('data', function(csvrow) {
        csvData.push([moment(csvrow[0], 'x').format('MM.DD.YYYY HH:mm:ss'), csvrow[1], csvrow[2]]);
    })
    .on('end',function() {

        csvData.map(row => {

        });
        // fs.writeFile('', 'Hello World!', function (err) {
        //     if (err) return console.log(err);
        //     console.log('Hello World > helloworld.txt');
        // });
        console.log(csvData)
    });



/**
 * Loads and trains the data for a linear dataset
 * @returns {Promise<History>}
 */
const train = async () => {
    const data = tf.data.csv('file://../data/2020_02_22.csv', {
        columnConfigs: {
            wait: {
                isLabel: true
            }
        }
    });
    console.log(chalk.green('[INFO] Column Names: ', await data.columnNames()));
    const flattenedDataset = data.map(({ xs, ys }) => {
        // console.log('[INFO] Data: ', { xs: Object.values(xs), ys: Object.values(ys) });
        return { xs: Object.values(xs), ys: Object.values(ys) }
    }).batch(10);

    const numOfFeatures = (await data.columnNames()).length - 1;

    console.log(chalk.green('[INFO] Number of features', numOfFeatures));

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [numOfFeatures] }));
    model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });

    await model.fitDataset(flattenedDataset, {
        epochs: 2,
        callbacks: {
            onEpochEnd: (epoch, log) => console.log(chalk.green(`[INFO] Epoch ${epoch}: loss = ${log.loss}`))
        }
    });

    const prediction = model.predict(tf.tensor2d([moment().add(1, 'days').unix(), 10842],[1,2]));
    console.log(chalk.green('[INFO] Prediction: ', prediction));
};

train().then(model => {
    console.log(chalk.green('[INFO] Done.'));
}).catch(err => {
    console.log(chalk.red('[ERROR] There was an error training and running the model. Error: ', err));
});


