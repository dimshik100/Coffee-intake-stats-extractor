# Coffee intake stats extractor

This script will extract statistics from your exported Samsung Health `com.samsung.health.caffeine_intake.csv` file to a short readable `JSON` files, which can also be used by the web app [Am I drinking coffee right now](https://github.com/dimshik100/Am-i-drinking-coffee-right-now)


## Installation

1. run `npm install`

## Usage

1. Place your exported CSV caffeine intake file into `csv` directory.
2. Copy and paste the file name (with the .csv extension) to `.env` file.
3. Run `npm start` or `node index.js`.
4. Your output files will be located in `output` directory.