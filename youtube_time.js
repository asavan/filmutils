"use strict";
import fs from "fs";
import readline from "readline";

function looperFs(name) {
    function createFileReader(filename) {
        return readline.createInterface({
            input: fs.createReadStream(filename),
            output: process.stdout,
            terminal: false
        });
    }
    function getArray() {
        return createFileReader(name);
    }
    function getElementString(el) {
        return el;
    }
    return {
        getArray, getElementString
    };
}


function looperDom(el) {
    function getArray() {
        return el.querySelectorAll("ytd-rich-item-renderer");
    }
    function getElementString(line) {
        const el1 = line.querySelector("ytd-thumbnail span.ytd-thumbnail-overlay-time-status-renderer");
        if (!el1) return "";
        return el1.innerText;
        // return line.innerText;
    }
    function nextDay(line) {
        const text = line.querySelectorAll(".inline-metadata-item.style-scope.ytd-video-meta-block")[1];
        // console.log(text);
        if (!text) {
            return false;
        }
        return text.innerText.includes("day");
    }
    return {
        getArray, getElementString, nextDay
    };
}

async function timing(looper) {
    function hmsToSecondsOnly(str) {
        const p = str.split(":");
        let s = 0;
        let m = 1;

        while (p.length > 0) {
            s += m * parseInt(p.pop(), 10);
            m *= 60;
        }

        return s;
    }

    const toHHMMSS = (sec_num) => {
        // const sec_num = parseInt(secs, 10)
        const hours = Math.floor(sec_num / 3600);
        const minutes = Math.floor(sec_num / 60) % 60;
        const seconds = sec_num % 60;

        return [hours, minutes, seconds]
            .map(v => v < 10 ? "0" + v : v)
            .filter((v, i) => v !== "00" || i > 0)
            .join(":");
    };
    let summ = 0;
    let counter = 0;
    for await (const line of looper.getArray()) {
        if (looper.nextDay(line)) {
            console.log(looper.getElementString(line), line.querySelector("#video-title").innerText);
            break;
        }
        const sec = hmsToSecondsOnly(looper.getElementString(line));
        if (sec) {
            summ += sec;
        }
        ++counter;
        
    }
    console.log(toHHMMSS(summ), counter);
}

// eslint-disable-next-line no-unused-vars
function mainDom(index) {
    const zones = document.querySelectorAll("ytd-shelf-renderer");
    const el = (0 <= index && index < zones.length) ? zones[index] : document;
    const looper = looperDom(el);
    return timing(looper);
}

function main() {
    const looper = looperFs(process.argv[2] || "timing.txt");
    return timing(looper);
}

main();
