
const fs = require("fs");
const path = require("path");

const relPath = process.argv[2] || ".";
const absolutePath = path.resolve(relPath);	
	
var manageFile = function(filepath, stats, level, file) {
	if (level > 0) {
		
		var newName = path.join(absolutePath, file);
		console.log(file);
		console.log(filepath);
		console.log(newName);
		
		fs.renameSync(filepath, newName);
	}
}	

function walk(dir, callback, level) {
	fs.readdir(dir, function(err, files) {
		if (err) throw err;
		files.forEach(function(file) {
			var filepath = path.join(dir, file);
			fs.stat(filepath, function(err,stats) {
				if (stats.isDirectory()) {
					walk(filepath, callback, level+1);
				} else if (stats.isFile()) {
					callback(filepath, stats, level, file);
				}
			});
		});
	});
}
console.log(absolutePath);
walk(absolutePath, manageFile, 0);
