'use strict';

import * as vscode from 'vscode';
import { execFileSync } from 'child_process';
import * as path from 'path';
import * as os from "os";
import * as fs from "fs";

export class Load {

    private _outChannel: vscode.OutputChannel;
    private _terminal: vscode.Terminal;
    

    /**
     *
     */
    constructor() {
        this._outChannel = vscode.window.createOutputChannel('AutoLisp');
        this._terminal = vscode.window.createTerminal();
        // this._process = '';
    }



    private LoadSelection(editor: vscode.TextEditor) {
        this._outChannel.clear();
        this._outChannel.show(true);
        // let start = editor.selection;
        let str = editor.document.getText(editor.selection);
        let filepath = path.join(os.tmpdir(), "tmp.lsp");
        fs.writeFileSync(filepath, str);
        // let commandout: string = 'selection';
        this._outChannel.appendLine(`[Running] 加载选定代码`);
        // let runcommand:string = `autolisp.bat "${editor.document.fileName}"`;

        execFileSync(path.join(path.dirname(__dirname), 'load/autolisp.bat'), [filepath]);

        this._outChannel.appendLine(`[Done] 加载选定代码`);

        fs.unlinkSync(filepath);
    }



    private LoadFile(editor: vscode.TextEditor) {
        this._outChannel.clear();
        this._outChannel.show(true);
        let commandout: string = `Load ${editor.document.fileName}`;
        this._outChannel.appendLine(`[Running] ${commandout}`);
        // let runcommand:string = `autolisp.bat "${editor.document.fileName}"`;

        execFileSync(path.join(path.dirname(__dirname),'load/autolisp.bat'), [editor.document.fileName]);

        this._outChannel.appendLine(`[Done] ${commandout}`);

    }

    public onDidCloseTerminal(): void {
        this._terminal.dispose();
    }

    /**
     * run
     */
    public run() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            return editor.document.save().then(() => {
                this.LoadFile(editor);
            });
        } else {
            return;
        }
    }
    /**
     * runstr
     */
    public runstr() {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            this.LoadSelection(editor);
        } else {
            return;
        }

    }
}