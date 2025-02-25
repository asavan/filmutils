import child_process from "node:child_process";
import {createReadStream} from "node:fs";
import * as readline from "node:readline/promises";
import {promisify} from "node:util";

import clipboard from "clipboardy";

const execFile = promisify(child_process.execFile);

function processOneLink(link) {
    const trimmedLink = link.trim();
    if (!trimmedLink) {
        return;
    }

    const myURL = new URL(trimmedLink);
    const vParam = myURL.searchParams.get("v");
    if (vParam) {
        myURL.search = new URLSearchParams({"v": vParam}).toString();
    } else {
        myURL.search = "";
    }
    const newUrl = myURL.href;
    console.log(newUrl);
    return execFile("yt-dlp", ["-x", "--audio-format", "mp3", newUrl]);
}

async function main() {

    let counter = 0;

    const rl = readline.createInterface({
        input: createReadStream("videos.txt"),
        output: process.stdout,
        terminal: false
    });

    for await (const line of rl) {
        await processOneLink(line);
        ++counter;
    }

    if (counter === 0) {
        const line = await clipboard.read();
        await processOneLink(line);
    }
}

main();
