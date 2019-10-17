//作者：落魄山人
//此文件作为参考

'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// import winax = require("winax");

import { Load } from './load';
import { FindSelection } from "./selection";
// import { LeftBracket } from "./util";
// import { LispParse } from "./lispParse";
import { LispParse, SystemParse } from "./lispParse";
import { AUTOLISP_MODE } from "./autolispMode";
import { AutoLispCompletionItemProvider } from "./autolispCompletion";
import { AutoLispHoverProvider } from "./autolispHover";
import { AutoLispDefinitionProvider } from './autolispDefinition';
import { AutoLispDocumentFormattingEditProvider, AutoLispDocumentRangeFormattingEditProvider } from "./autolispFormat";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "autolisp" is now active!');
    // console.log(LeftBracket(`"(BF-RemoveMenuItem CASS工具)";移除 CASS工具 菜单`));

    // let excel = winax.ActiveXObject("Excel.Application", { activate: true });
    // let wbk = excel.Workbooks.Add();
    let load = new Load();
    let selection = new FindSelection();
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json

    let libpath = vscode.workspace.getConfiguration('autolisp')['userlibpath'];
    let lisp = new LispParse();
    let complet = lisp.Parse(libpath);

    let system = new SystemParse();
    let completions = Object.assign(complet, system.parse());

    console.log('tmp');

    context.subscriptions.push(vscode.commands.registerCommand('autolisp.load', () => { load.run(); }));
    context.subscriptions.push(vscode.commands.registerCommand('autolisp.loadselection', () => { load.runstr(); }));

    context.subscriptions.push(vscode.commands.registerCommand('autolisp.select', () => { selection.selectText(false); }));
    context.subscriptions.push(vscode.commands.registerCommand('autolisp.selectincludebracket', () => { selection.selectText(true); }));

    context.subscriptions.push(vscode.languages.registerCompletionItemProvider(AUTOLISP_MODE, new AutoLispCompletionItemProvider(completions), '.', '/'));
    context.subscriptions.push(vscode.languages.registerHoverProvider(AUTOLISP_MODE, new AutoLispHoverProvider(completions)));
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(AUTOLISP_MODE, new AutoLispDefinitionProvider(completions)));
    context.subscriptions.push(vscode.languages.registerDocumentFormattingEditProvider(AUTOLISP_MODE, new AutoLispDocumentFormattingEditProvider()));
    context.subscriptions.push(vscode.languages.registerDocumentRangeFormattingEditProvider(AUTOLISP_MODE, new AutoLispDocumentRangeFormattingEditProvider()));

}





// this method is called when your extension is deactivated
export function deactivate() {
}

