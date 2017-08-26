var path = require("path");
var fs = require("fs");
var process = require("process");
var execSync = require("child_process").execSync;

function installTaskDependencies() {
    var rootPath = process.cwd();
    var buildTasksDir = path.join(rootPath, "./Tasks");
    var tasks = fs.readdirSync(buildTasksDir).filter(function (file) {
        return file.toLowerCase().indexOf("task") >= 0 && fs.statSync(path.join(buildTasksDir, file)).isDirectory();
    });
    tasks.forEach(function (task) {
        console.log("Processing task " + task);
        process.chdir(path.join(buildTasksDir, task));
        console.log("Installing npm dependencies for task(" + task + ")...");
        execSync("npm install", function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
        });
    });

    process.chdir(rootPath);
}
installTaskDependencies();