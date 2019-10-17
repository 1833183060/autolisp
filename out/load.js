'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const child_process_1 = require("child_process");
const path = require("path");
const os = require("os");
const fs = require("fs");
class Load {
    /**
     *
     */
    constructor() {
        this._outChannel = vscode.window.createOutputChannel('AutoLisp');
        this._terminal = vscode.window.createTerminal();
        // this._process = '';
    }
    LoadSelection(editor) {
        this._outChannel.clear();
        this._outChannel.show(true);
        // let start = editor.selection;
        let str = editor.document.getText(editor.selection);
        let filepath = path.join(os.tmpdir(), "tmp.lsp");
        fs.writeFileSync(filepath, str);
        // let commandout: string = 'selection';
        this._outChannel.appendLine(`[Running] 加载选定代码`);
        // let runcommand:string = `autolisp.bat "${editor.document.fileName}"`;
        child_process_1.execFileSync(path.join(path.dirname(__dirname), 'load/autolisp.bat'), [filepath]);
        this._outChannel.appendLine(`[Done] 加载选定代码`);
        fs.unlinkSync(filepath);
    }
    LoadFile(editor) {
        this._outChannel.clear();
        this._outChannel.show(true);
        let commandout = `Load ${editor.document.fileName}`;
        this._outChannel.appendLine(`[Running] ${commandout}`);
        // let runcommand:string = `autolisp.bat "${editor.document.fileName}"`;
        child_process_1.execFileSync(path.join(path.dirname(__dirname), 'load/autolisp.bat'), [editor.document.fileName]);
        this._outChannel.appendLine(`[Done] ${commandout}`);
    }
    onDidCloseTerminal() {
        this._terminal.dispose();
    }
    /**
     * run
     */
    run() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            return editor.document.save().then(() => {
                this.LoadFile(editor);
            });
        }
        else {
            return;
        }
    }
    /**
     * runstr
     */
    runstr() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            this.LoadSelection(editor);
        }
        else {
            return;
        }
    }
}
exports.Load = Load;
//# sourceMappingURL=load.js.map