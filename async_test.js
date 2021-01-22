"use strict";

function randomInteger(min, max) {
    let rand = min + Math.random() * (max - min);
    return Math.floor(rand);
}

function randomIndex(len) {
    return randomInteger(0, len);
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function complexDelay() {
    const w1 = randomIndex(1000);
    await delay(w1);
    const w2 = randomIndex(1000);
    await delay(w2);
    return w1 + w2;
}

async function main() {
    console.time("s");
    const res = await Promise.all([complexDelay(), complexDelay(), complexDelay(), complexDelay(), complexDelay(), complexDelay()]);
    console.timeEnd("s");
    console.log(res);
}

main()
