import { createReadStream } from 'node:fs';
import * as readline from 'node:readline/promises';

import clipboard from 'clipboardy';
import { promisify } from 'node:util';
import child_process from 'node:child_process';

const execFile = promisify(child_process.execFile);


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
        return execFile("yt-dlp", ["-x", "--audio-format", "mp3", newUrl], {stdio: "inherit"});
    } catch (e) {
        console.log(e);
    }
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

    // TODO
    if (counter === 0) {
        const line = await clipboard.read();
        await processOneLink(line);
    }
}

main();
