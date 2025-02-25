
import child_process from "node:child_process";
import path from "node:path";
import fs from "node:fs/promises";
import {promisify} from "node:util";

const execFile = promisify(child_process.execFile);

const prefix = "temp/";
const reverseFromDir = path.join(prefix, "toReverse");
const reverseToDir = path.join(prefix, "reversed");

function addQuotes(name) {
    return "\"" + name + "\"";
}

async function main() {
    const files = await fs.readdir(reverseFromDir);
    for (const file of files) {
        const extension = file.split(".").pop();
        const name = file.split(".")[0];
        const output = path.resolve(reverseToDir, name + "_reversed." + extension);
        const alreadyContainsOutput = await fs.access(output);

        if (alreadyContainsOutput) {
            continue;
        }
        const outputWithQuotes = addQuotes(output);
        const inputfile = addQuotes(path.join(reverseFromDir, file));
        console.log(inputfile);
        if (extension === "mp4") {
            await execFile("ffmpeg", ["-i", inputfile, "-vf", "reverse", "-af", "areverse", outputWithQuotes]);
        } else if (extension === "mp3") {
            await execFile("ffmpeg", ["-i", inputfile, "-af", "areverse", outputWithQuotes]);
        } else {
            console.log("Unsupported ext " + extension);
        }
    }
}

main();
