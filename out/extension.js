'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs=require("fs")
const path=require('path')
const parser=require('./lispParser.js')
//import {parse} from "./lispParser"
const snippetObj=require('../snippets/autolisp.json')

function provideHover(document, position, token) {
	const fileName	= document.fileName;
	const workDir	 = path.dirname(fileName);
	const word		= document.getText(document.getWordRangeAtPosition(position));
	
return new vscode.Hover("[bbb](https://www.baidu.com)aa"+word)
	if (/\/package\.json$/.test(fileName)) {
		console.log('进入provideHover方法');
		const json = document.getText();
		if (new RegExp(`"(dependencies|devDependencies)":\\s*?\\{[\\s\\S]*?${word.replace(/\//g, '\\/')}[\\s\\S]*?\\}`, 'gm').test(json)) {
			let destPath = `${workDir}/node_modules/${word.replace(/"/g, '')}/package.json`;
			if (fs.existsSync(destPath)) {
				const content = require(destPath);
				console.log('hover已生效');
				// hover内容支持markdown语法
				return new vscode.Hover(`* **名称**：${content.name}\n* **版本**：${content.version}\n* **许可协议**：${content.license}`);
			}
		}
	}
}
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "autolisp" is now active!');
	
	vscode.languages.setLanguageConfiguration('autolisp', {wordPattern: /[a-z0-9A-Z\-\+\<\>\=\*\/\$\@\#]+/});
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });
	context.subscriptions.push(disposable);
	let format = vscode.commands.registerCommand('autolisp.format', () => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
		let content=fs.readFileSync("D:/mywork/acad二次开发/我写的工具/autolisp/a.lsp",{encoding:'utf-8'})
		let ret=parser.parse(content)
    });
	context.subscriptions.push(format);
	let format2 = vscode.commands.registerTextEditorCommand('autolisp.format2', (textEditor,edit,args) => {
        // The code you place here will be executed every time your command is executed
        // Display a message box to the user
		vscode.window.showInformationMessage('Hello World!');
		try {
			let sel=textEditor.selection;
		
			let range=new vscode.Range(sel.start,sel.end)	
		
			let program=textEditor.document.getText(range)
			if(program===''){
				program=textEditor.document.getText();
				let ret=parser.format(program);
				const end = new vscode.Position(textEditor.document.lineCount + 1, 0);
	
				edit.replace(new vscode.Range(new vscode.Position(0, 0), end), ret);
				
			}else{
				let ret=parser.format(program);
				edit.replace(range,ret);
			}
			
		} catch (error) {
			console(error)
		}
    });
    context.subscriptions.push(format2);

	let dis2= vscode.languages.registerHoverProvider({language:"autolisp"},{provideHover})
	context.subscriptions.push(dis2)
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map