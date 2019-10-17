//作者：落魄山人
//此文件作为参考
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// import winax = require("winax");
const load_1 = require("./load");
const selection_1 = require("./selection");
// import { LeftBracket } from "./util";
// import { LispParse } from "./lispParse";
const lispParse_1 = require("./lispParse");
const autolispMode_1 = require("./autolispMode");
const autolispCompletion_1 = require("./autolispCompletion");
const autolispHover_1 = require("./autolispHover");
const autolispDefinition_1 = require("./autolispDefinition");
const autolispFormat_1 = require("./autolispFormat");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "autolisp" is now active!');
    // console.log(LeftBracket(`"(BF-RemoveMenuItem CASS工具)";移除 CASS工具 菜单`));
    // let excel = winax.ActiveXObject("Excel.Application", { activate: true });
    // let wbk = excel.Workbooks.Add();
    let load = new load_1.Load();
    let selection = new selection_1.FindSelection();
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let libpath = vscode.workspace.getConfiguration('autolisp')['userlibpath'];
    let lisp = new lispParse_1.LispParse();
    let complet = lisp.Parse(libpath);
    let system = new lispParse_1.SystemParse();
    let completions = Object.assign(complet, system.parse());
    console.log('tmp');
    context.subscriptions.push(vscode.commands.registerCommand('autolisp.load', () => { load.run(); }));
    context.subscriptions.push(vscode.commands.registerCommand('autolisp.loadselection', () => { load.runstr(); }));
    context.subscriptions.push(vscode.commands.registerCommand('autolisp.select', () => { selection.selectText(false); }));
    context.subscriptions.push(vscode.commands.registerCommand('autolisp.selectincludebracket', () => { selection.selectText(true); }));
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(autolispMode_1.AUTOLISP_MODE, new autolispCompletion_1.AutoLispCompletionItemProvider(completions), '.', '/'));
    context.subscriptions.push(vscode.languages.registerHoverProvider(autolispMode_1.AUTOLISP_MODE, new autolispHover_1.AutoLispHoverProvider(completions)));
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(autolispMode_1.AUTOLISP_MODE, new autolispDefinition_1.AutoLispDefinitionProvider(completions)));
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(autolispMode_1.AUTOLISP_MODE, new autolispFormat_1.AutoLispDocumentFormattingEditProvider()));
    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider(autolispMode_1.AUTOLISP_MODE, new autolispFormat_1.AutoLispDocumentRangeFormattingEditProvider()));
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension2.js.map