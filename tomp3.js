import child_process from "node:child_process";
import { open } from "node:fs/promises";
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

async function main(filename) {
    let counter = 0;
    const file = await open(filename);
    try {
        for await (const line of file.readLines()) {
            await processOneLink(line);
            ++counter;
        }
    } finally {
        file.close();
    }

    if (counter === 0) {
        const line = await clipboard.read();
        await processOneLink(line);
    }
}

main("videos.txt");
