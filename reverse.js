const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');

const prefix = 'temp/';
const reverseFromDir = prefix + 'toReverse'
const reverseToDir = prefix + 'reversed'

function addQuotes(name) {
    return "\"" + name + "\"";
}

async function main() {
    const files = await fs.readdir(reverseFromDir);
    for (const file of files) {
        const extension = file.split('.')[1];
        let name = file.split('.')[0];
        let output = reverseToDir + "/" + name + "_reversed." + extension;
        const alreadyContainsOutput = fsSync.existsSync(output);

        if (alreadyContainsOutput) {
            continue;
        }
        output = addQuotes(output);
        const inputfile = "\"" + reverseFromDir + "/" + file + "\"";
        console.log(inputfile);
        if (extension === 'mp4') {
            await exec(`ffmpeg -i ${inputfile} -vf reverse -af areverse ${output}`)
        } else if (extension === 'mp3') {
            await exec(`ffmpeg -i ${inputfile} -af areverse ${output}`)
        }
    }
}

main()
