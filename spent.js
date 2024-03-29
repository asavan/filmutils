"use strict";

import minimist from"minimist";

function declOfNum(number, titles) {
    const cases = [2, 0, 1, 1, 1, 2];
    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
}

function declDays(number) {
    return declOfNum(number, ["день", "дня", "дней"]);
}

function printResult(all, notFood) {
    // x + notFood = (all+x)*0.3
    // 0.7*x = all*0.3 - notFood
    const x = (all * 0.5 - notFood) / 0.5;
    const need = Math.ceil(x);
    if (need > 0) {
        console.log("Нужно потратить не на еду ", need);
    }
    // notFood = (all+y)*0.3
    const y = notFood / 0.5 - all;
    if (y > 0) {
        const dayAverage = 700;
        const days = Math.floor(y * 2 / dayAverage) / 2;
        console.log("Можно потратить на еду", Math.floor(y));
        console.log("Осталось примерно на", days, declDays(Math.floor(days)));
    }
}

function main() {
    const argv = minimist(process.argv.slice(2), {
        alias: {
            a: "all",
            n: "nonfood"
        }
    });
    const all = parseInt(argv.all || argv._[0], 10);
    const notFood = parseInt((argv.nonfood || (argv.all ? argv._[0] : argv._[1])), 10);
    printResult(all, notFood);
}

main();
