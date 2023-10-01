"use strict";
import fs from "fs";
import path from "path";

// node copy_subs.js folder jpg
const relPath = process.argv[2] || ".";
const filterExt = process.argv[3] || "srt";
const absolutePath = path.resolve(relPath);

const manageFile = function (filepath, stats, level, file) {
    if (level > 0) {
        const extension = file.split(".").pop();
        if (filterExt && extension.toUpperCase() !== filterExt.toUpperCase()) {
            return;
        }
        const newName = path.join(absolutePath, file);
        console.log(file);
        console.log(filepath);
        console.log(newName);
        fs.renameSync(filepath, newName);
    }
};

function walk(dir, callback, level) {
    fs.readdir(dir, function (err, files) {
        if (err) throw err;
        files.forEach(function (file) {
            const filepath = path.join(dir, file);
            fs.stat(filepath, function (err, stats) {
                if (stats.isDirectory()) {
                    walk(filepath, callback, level + 1);
                } else if (stats.isFile()) {
                    callback(filepath, stats, level, file);
                }
            });
        });
    });
}

console.log(absolutePath);
walk(absolutePath, manageFile, 0);
