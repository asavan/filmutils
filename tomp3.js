const spawnAsync = require('@expo/spawn-async');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: fs.createReadStream('videos.txt'),
    output: process.stdout,
    terminal: false
});

async function processOneLink(link) {
    const trimmedLink = link.trim();
    if (!trimmedLink) {
        return;
    }
    const myURL = new URL(trimmedLink);
    const vParam = myURL.searchParams.get('v');
    let newUrl = trimmedLink.split("?").shift()
    if (vParam) {
        const newSearchParams = new URLSearchParams();
        newSearchParams.append('v', vParam);
        const newUrlUrl = new URL(newUrl);
        newUrlUrl.search = newSearchParams;
        newUrl = newUrlUrl.href;
    }
    console.log(newUrl);
    const resultPromise = spawnAsync('youtube-dl', ['-x', '--audio-format', 'mp3', newUrl], { stdio: 'inherit' });
    await resultPromise;
}

async function main() {
    for await (const line of rl) {
        await processOneLink(line);
    }
}

main()
