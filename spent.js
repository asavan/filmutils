const minimist = require('minimist');
function main() {
    const argv = minimist(process.argv.slice(2), {
        alias: {
            a: 'all',
            n: 'nonfood'
        }
    });
    const all = parseInt(argv.all || argv._[0], 10);
    const notFood = parseInt((argv.nonfood || (argv.all ? argv._[0] : argv._[1])), 10);
    // x + notFood = (all+x)*0.3
    // 0.7*x = all*0.3 - notFood
    const x = (all*0.3 - notFood)/0.7
    console.log("Нужно потратить не на еду ", Math.max(Math.ceil(x), 0));
    // notFood = (all+y)*0.3
    const y = notFood/0.3-all
    console.log("Можно потратить на еду ", Math.ceil(y));
    if (y > 0) {
        console.log("Осталось примерно на ", Math.ceil(y/700), "дней");
    }
}

main()
