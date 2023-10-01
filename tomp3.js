"use strict";

import fs from "fs";
import spawnAsync from "@expo/spawn-async";
import readline from "readline";
import ncp from "copy-paste";

let counter = 0;
const rl = readline.createInterface({
    input: fs.createReadStream("videos.txt"),
    output: process.stdout,
    terminal: false
});

function processOneLink(link) {
    try {
        const trimmedLink = link.trim();
        if (!trimmedLink) {
            return;
        }

        const myURL = new URL(trimmedLink);
        const vParam = myURL.searchParams.get("v");
        let newUrl = trimmedLink.split("?").shift();
        if (vParam) {
            const newSearchParams = new URLSearchParams();
            newSearchParams.append("v", vParam);
            const newUrlUrl = new URL(newUrl);
            newUrlUrl.search = newSearchParams;
            newUrl = newUrlUrl.href;
        }
        console.log(newUrl);
        return spawnAsync("youtube-dl", ["-x", "--audio-format", "mp3", newUrl], {stdio: "inherit"});
    } catch (e) {
        console.log(e);
    }
}

async function main() {

    for await (const line of rl) {
        await processOneLink(line);
        ++counter;
    }

    // TODO
    if (counter === 0) {
        const line = ncp.paste();
        await processOneLink(line);
    }
}

main();
