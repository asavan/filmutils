"use strict";
const fs = require('fs');
const readline = require('readline');

let counter = 0;
const rl = readline.createInterface({
    input: fs.createReadStream('timing.txt'),
    output: process.stdout,
    terminal: false
});

function parseTimeLine(line) {
    const a = line.split(':'); // split it at the colons
    if (a.length < 2) {
        return 0;
    }
    if (a.length === 2) {
        return (+a[0]) * 60 + (+a[1]);
    }

// minutes are worth 60 seconds. Hours are worth 60 minutes.
    return (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
}

function hmsToSecondsOnly(str) {
    var p = str.split(':'),
        s = 0, m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10) || 0;
        m *= 60;
    }

    return s;
}

function secToString(SECONDS) {
    const date = new Date(null);
    date.setSeconds(SECONDS); // specify value for SECONDS here
    return  date.toISOString().substr(11, 8);
}

async function main() {

    let summ = 0;
    for await (const line of rl) {
        summ += hmsToSecondsOnly(line);
        ++counter;
    }
    console.log(secToString(summ));
}

main()
