"use strict";

import fs from "node:fs/promises";
import mediainfo from "node-mediainfo";
import minimist from"minimist";
import path from "path";

function filterMovie(file) {
    if (!file) {
        return false;
    }
    const ext = file.split(".").pop().toLowerCase();
    const goodExt = ["avi", "mkv", "mp4", "m4v", "flv", "wmv", "mov", "mpg", "m2ts", "vob"];
    return goodExt.includes(ext);
}


async function duration(filepath) {
    try {
        const info = await mediainfo(filepath);
        const d = info.media.track[0].Duration;
        return parseFloat(d);
    } catch (e) {
        console.log("Error in parse", e);
        return 0;
    }
}

async function walk(dir, argv) {
    const stats1 = await fs.stat(dir);
    if (!stats1.isDirectory()) {
        return new Array(dir);
    }
    const excludedDirs = ["node_modules", "scripts", "torrents", "subs", "seen", "go5", "go", "master", "flocal", "temp"];
    if (!argv.maybe) {
        excludedDirs.push("maybe");
    }
    if (argv.y) {
        excludedDirs.push("youtube");
    }
    const files = await fs.readdir(dir);
    const files1 = await Promise.all(files.map(async file => {
        const filePath = path.join(dir, file);
        const stats = await fs.stat(filePath);
        if (stats.isDirectory()) {
            if (excludedDirs.indexOf(file) < 0) {
                return walk(filePath, argv);
            }
        } else if (stats.isFile()) {
            if (filterMovie(filePath)) {
                return filePath;
            }
        }
    }));

    return files1.filter(x => x).reduce((all, folderContents) => all.concat(folderContents), []);
}

process.on("uncaughtException", function (err) {
    console.log("ERROR! " + err);
});

function butify(input) {
    var n = Math.floor(input);
    var day = Math.floor(n / (24 * 3600));

    n = n % (24 * 3600);
    var hour = Math.floor(n / 3600);

    n %= 3600;
    var minutes = Math.floor(n / 60);

    n %= 60;
    var seconds = n;
    var result = "";
    if (day > 0) {
        result += day + " days ";
    }

    if (hour > 0) {
        result += hour + " hours ";
    }

    if (minutes > 0) {
        result += minutes + " minutes ";
    }

    return result + seconds + " seconds ";
}

const filter = (db, keys) => keys.reduce((a, key) => (a[key] = db[key], a), {});


async function main() {
    const argv = minimist(process.argv.slice(2), {
        alias: {
            y: "youtube",
            f: "forsefast",
            w: "forserewrite"
        }
    });
    // console.log(argv);
    const files = await walk(argv._[0] || "./", argv);
    const isFilmsFolders = !(argv._[0]) && !argv.y;
    // console.log(isFilmsFolders);
    let cache = {};
    try {
        const fileInput = await fs.readFile("./scripts/cache.json", "utf8");
        cache = JSON.parse(fileInput);
    } catch (err) {
        console.log(err);
    }
    console.log(files);
    console.log(files.length);

    let hasNewFiles = !!argv.forserewrite;
    const cache_duration = async function (filepath, cache, isForseFast) {
        if (cache[filepath] != null) {
            return cache[filepath];
        }
        if (isForseFast) {
            return 0;
        }
        const d = await duration(filepath);
        hasNewFiles = true;
        cache[filepath] = d;
        return d;
    };

    let duration1 = 0.0;
    for (const item of files) {
        duration1 += await cache_duration(item, cache, argv.f);
    }
    console.log(butify(duration1));
    if (hasNewFiles) {
        if (isFilmsFolders) {
            cache = filter(cache, files);
        }
        await fs.writeFile("./scripts/cache.json", JSON.stringify(cache, null, 4));
    }
}

// eslint-disable-next-line no-unused-vars
async function all_ext() {
    const files = await walk(process.argv[2] || "./");
    const mySet = new Set();
    for (const item of files) {
        mySet.add(item.split(".").pop().toLowerCase());
    }
    for (const item of mySet) console.log(item);
}

// all_ext();
main();
