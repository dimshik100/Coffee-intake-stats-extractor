const fs = require('fs');
const path = require('path');
const getDirName = require('path').dirname;
const csvjson = require('csvjson');
const mkdirp = require('mkdirp');
const moment = require('moment');
const utils = require('./utils');
const dotenv = require('dotenv').config();

const options = {
    delimiter: ',', // optional 
    quote: '"' // optional 
};

const csvUrl = 'csv/' + process.env.CAFFEINE_INTAKE_CSV;

let data;


try {
    data = fs.readFileSync(path.join(__dirname, csvUrl), { encoding: 'utf8' });
} catch (err) {
    // Here you get the error when the file was not found,
    // but you also get any other error
    if (err.code === 'ENOENT') {
        console.log('File not found!');
    }

    throw err;
}


// saves json file with all the output
function saveFile(output, fileName) {
    const dir = 'output/';

    fileName = dir + fileName + '_' + new Date(Date.now()).toJSON() + ".json";

    const fs = require('fs');
    const content = JSON.stringify(output, null, '\t');


    mkdirp(getDirName(fileName), function (err) {
        if (err) {
            console.log(err);
            return cb(err);
        }

        fs.writeFile(fileName, content, 'utf8', function (err) {
            if (err) {
                return console.log(err);
            }

            console.log(fileName + " was saved!");
        });

    });


}

const rawData = csvjson.toArray(data, options);

const coffeeIntakeData = {
    totalCups: 0,
    intakeTimes: []
};

const createTimeIndex = rawData[1].indexOf('create_time');

for (let i = 2; i < rawData.length; i++) {
    coffeeIntakeData.intakeTimes.push(rawData[i][createTimeIndex]);
}

coffeeIntakeData.totalCups = coffeeIntakeData.intakeTimes.length;


if (process.env.GENERATE_FULL_DATA === '1') {
    saveFile(coffeeIntakeData, "coffeeFullData");
}


function createDataByTime(times) {

    let hours = [];
    // init hours array
    for (let i = 0; i < 24; i++) {
        let from = i;
        if (from == 23) {
            to = 0;
        } else {
            to = from + 1;
        }

        hours.push({
            from: from,
            to: to,
            times: []
        });


    }

    // update with intake times
    for (time of times) {
        if (!time) {
            continue;
        }
        time = time.split(" ")[1];
        let hour = time.split(":")[0];
        hours[parseInt(hour)].times.push(time);
    }

    // console.log(hours);
    return hours;
}

let hours = createDataByTime(coffeeIntakeData.intakeTimes);

if (process.env.GENERATE_INTAKE_BY_HOURS === '1') {

    saveFile(hours, "coffeeIntakeByHours");
}

function createHashedData(hours) {
    let data = {
        totalCups: coffeeIntakeData.totalCups,
        firstRecordedCoffeeCup: coffeeIntakeData.intakeTimes[0],
        latestRecordedCoffeeCup: coffeeIntakeData.intakeTimes[coffeeIntakeData.intakeTimes.length - 1],
        shortestTimeBetweenTwoCupsInMs: utils.getShortestTimeBetweenTwoCupsInMs(coffeeIntakeData.intakeTimes),
        longestTimeBetweenTwoCupsInMs: utils.getLongestTimeBetweenTwoCupsInMs(coffeeIntakeData.intakeTimes), // Longest period without coffee
        maximalNumberOfCupsInOneDay: utils.getMaximalNumberOfCupsInOneDay(coffeeIntakeData.intakeTimes),
        probabilityArr: [],
    }

    for (time of hours) {
        let times = time.times.length;

        data.probabilityArr.push({
            hour: time.from,
            cups: times,
            probability: times / data.totalCups * 100
        });
    }


    return data;
}

let hashedData = createHashedData(hours);

if (process.env.GENERATE_HASHED_TIMES === '1') {
    saveFile(hashedData, "hashedTimes");
}




