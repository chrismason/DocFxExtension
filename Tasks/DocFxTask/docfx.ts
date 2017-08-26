import tl = require("vsts-task-lib/task");
import tr = require("vsts-task-lib/toolrunner");
import path = require("path");
import fs = require("fs");

const tools = "./tools";
let toolsPath = path.join(__dirname, tools);
let nugetPath = path.join(toolsPath, "nuget.exe");
let docFxLocation: string = "";
const docFxPackage = "docfx.console";
const docFxExe = "docfx.exe";

function main() {
    tl.debug("Start DocFx Task");
    try {
        docFxLocation = tl.which("docfx");
        if (!docFxLocation) {
            install();
            docFxLocation = getNugetInstallLocation();
        }
        buildDocFx();
    } catch (ex) {
        tl.debug("Error running task.");
        tl.setResult(tl.TaskResult.Failed, ex.message);
        return;
    }

    tl.setResult(tl.TaskResult.Succeeded, "Task Complete");
}

function install() {
    tl.debug("Installing docfx.console package");
    tl.debug("Changing to " + toolsPath);
    tl.pushd(toolsPath);
    let nuget = tl.tool(nugetPath);
    nuget.arg("install");
    nuget.arg(docFxPackage);
    let nugetConfigPath = tl.getInput("nugetConfigPath", false);
    if (nugetConfigPath && nugetConfigPath.length > 0) {
        nuget.arg("-configFile");
        nuget.arg(nugetConfigPath);
    }
    handleExecResult(nuget.execSync(), "nuget");
    tl.debug("Restoring directory");
    tl.popd();
    tl.debug("Installed docfx package");
}

function getNugetInstallLocation(): string {
    tl.debug("Getting installed location from NuGet");
    let location = "";

    tl.debug("Finding matching folders");
    let folders = fs.readdirSync(toolsPath).filter(file => {
        return file.toLowerCase().indexOf(docFxPackage) >= 0 && fs.statSync(path.join(toolsPath, file)).isDirectory();
    });
    if (folders && folders.length > 0) {
        tl.debug("Folder found, using " + folders[0]);
        location = path.join(toolsPath, folders[0], tools, docFxExe);
    }

    tl.debug("Found DocFx location at: " + location);
    return location;
}

function buildDocFx() {
    tl.debug("Getting build parameters");
    let solutionPath = tl.getInput("solution", true);
    if (solutionPath && !solutionPath.endsWith(".json")) {
        solutionPath += "\\docfx.json";
    }
    let useTemplate = tl.getBoolInput("useTemplate", false);
    let templatePath = tl.getPathInput("templatePath", false);
    let docfx = tl.tool(docFxLocation);
    let docFxOptions = tl.getInput("docfxOptions", false);
    docfx.arg(solutionPath);
    docfx.argIf(useTemplate, "-t");
    docfx.argIf(useTemplate, templatePath);
    let options: string[] = new Array();
    if (docFxOptions && docFxOptions.trim().length > 0) {
        options = docFxOptions.split(" ");
    }
    options.forEach(o => {
        docfx.argIf(o, o);
    });
    tl.debug("Building DocFx project");
    return handleExecResult(docfx.execSync(), solutionPath);
}

function handleExecResult(execResult: tr.IExecSyncResult, command: string) {
    if (execResult.code !== tl.TaskResult.Succeeded) {
        tl.debug("execResult: " + JSON.stringify(execResult));
        let message = "Unable to run command: " + command +
            "\ncode: " + execResult.code +
            "\nstdout: " + execResult.stdout +
            "\nstderr: " + execResult.stderr +
            "\nerror: " + execResult.error;
        throw new DocFxError(message);
    }
}

class DocFxError extends Error {
}

main();