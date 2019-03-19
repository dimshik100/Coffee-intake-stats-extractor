const moment = require('moment');

function getNumberOfCupsPerDay(onlyDatesArr) {
    const counts = {};

    for (var i = 0, len = onlyDatesArr.length; i < len; i++) {
        var word = onlyDatesArr[i];

        if (counts[word] === undefined) {
            counts[word] = 1;
        } else {
            counts[word] = counts[word] + 1;
        }
    }

    return counts;
}

function findMostFrequentInArray(arr) {
    const counts = {};
    let compare = 0;
    let mostFrequent;

    for (var i = 0, len = arr.length; i < len; i++) {
        var word = arr[i];

        if (counts[word] === undefined) {
            counts[word] = 1;
        } else {
            counts[word] = counts[word] + 1;
        }
        if (counts[word] > compare) {
            compare = counts[word];
            mostFrequent = arr[i];
        }
    }

    return mostFrequent;
}

module.exports = {
    getShortestTimeBetweenTwoCupsInMs: function (intakeTimesArr) {
        // Assuming intakeTimesArr is sorted
        let shortestTimeInMs = undefined;

        // Ignore time shorter thant 2 minutes.
        const errorLatency = moment.duration(2, 'minutes').asMilliseconds();

        if (intakeTimesArr.length < 2) {
            return 'Not enough data';
        }

        for (let i = 0; i < intakeTimesArr.length; i++) {
            const firstTime = intakeTimesArr[i];

            if (i + 1 < intakeTimesArr.length) {
                const secondTime = intakeTimesArr[i + 1];

                const diff = moment(secondTime).diff(moment(firstTime));

                if (diff < errorLatency) {
                    continue;
                }

                if (!shortestTimeInMs) {
                    shortestTimeInMs = diff
                } else {
                    shortestTimeInMs = Math.min(shortestTimeInMs, diff);
                }
            }
        }

        return shortestTimeInMs;
    },
    getLongestTimeBetweenTwoCupsInMs: function (intakeTimesArr) {
        // Assuming intakeTimesArr is sorted
        let longestTimeInMs = undefined;

        if (intakeTimesArr.length < 2) {
            return 'Not enough data';
        }

        for (let i = 0; i < intakeTimesArr.length; i++) {
            const firstTime = intakeTimesArr[i];

            if (i + 1 < intakeTimesArr.length) {
                const secondTime = intakeTimesArr[i + 1];

                const diff = moment(secondTime).diff(moment(firstTime));
                if (!longestTimeInMs) {
                    longestTimeInMs = diff
                } else {
                    longestTimeInMs = Math.max(longestTimeInMs, diff);
                }
            }
        }

        return longestTimeInMs;
    },
    getMaximalNumberOfCupsInOneDay(intakeTimesArr) {
        if (intakeTimesArr.length === 0) {
            return 'Not enough data';
        }

        const onlyDatesArr = intakeTimesArr.map((stringMoment) => {
            return moment(stringMoment).format('MM-DD-YYYY');
        });

        // const mostFrequentDay = findMostFrequentInArray(onlyDatesArr);
        // const maximalNumberOfCups = onlyDatesArr.filter((stringMoment) => {
        //     return stringMoment === mostFrequentDay;
        // }).length;

        // {'MM-DD-YYY': number}
        const numberOfCupsPerDay = getNumberOfCupsPerDay(onlyDatesArr);

        // find the maximal number of cups per day
        let maximalNumberOfCups = 0;

        for (date in numberOfCupsPerDay) {
            if (numberOfCupsPerDay[date] > maximalNumberOfCups) {
                maximalNumberOfCups = numberOfCupsPerDay[date];
            }
        }

        // find the latest most frequent day
        let latestMostFrequentDay;

        for (date in numberOfCupsPerDay) {
            if (numberOfCupsPerDay[date] === maximalNumberOfCups) {
                if (!latestMostFrequentDay) {
                    latestMostFrequentDay = date;
                } else {
                    if (moment(date).isAfter(latestMostFrequentDay)) {
                        latestMostFrequentDay = date;
                    }
                }
            }
        }


        const returnData = {
            maximalNumberOfCups: maximalNumberOfCups,
            latestMostFrequentDay: latestMostFrequentDay
        }

        return returnData;
    }

}