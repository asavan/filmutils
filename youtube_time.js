"use strict";
const fs = require('fs');
const readline = require('readline');

function createFileReader(filename) {
    return readline.createInterface({
        input: fs.createReadStream(filename),
        output: process.stdout,
        terminal: false
    });
}

function hmsToSecondsOnly(str) {
    const p = str.split(':');
    let s = 0;
    let m = 1;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }

    return s;
}

const secToString = (sec) => new Date(sec*1000).toISOString();

async function main() {
    let summ = 0;
    let counter = 0;
    const rl = createFileReader(process.argv[2] || 'timing.txt');
    for await (const line of rl) {
        const sec = hmsToSecondsOnly(line);
        if (sec) {
           summ += sec;
        }
        ++counter;
    }
    console.log(secToString(summ));
}

main()
