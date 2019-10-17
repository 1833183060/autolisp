'use strict';


import * as vscode from 'vscode';
import { LispFormat } from './lispParse';

export class Formatter {
    public formatDocument(document: vscode.TextDocument, range?: vscode.Range): Thenable<vscode.TextEdit[]> {
        return new Promise((resolve, reject) => {
            let text: string;

            if (range) {
                text = document.getText(range)
            } else {
                text = document.getText();
            }
            if (!text) {
                return reject();
            }
            let format = new LispFormat();
            let formatstringlist = format.lispFormatter(text);


            let textEdits: vscode.TextEdit[] = [];
            if (range) {
                textEdits.push(new vscode.TextEdit(range, formatstringlist))
            } else {
                textEdits.push(new vscode.TextEdit(new vscode.Range(0, 0, document.lineCount, 10000), formatstringlist))
            }



            return resolve(textEdits);


        });
    }
}





export class AutoLispDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {
    private formatter: Formatter;

    constructor() {
        this.formatter = new Formatter();
    }

    public provideDocumentFormattingEdits(document: vscode.TextDocument, options: vscode.FormattingOptions, token: vscode.CancellationToken): Thenable<vscode.TextEdit[]> {
        return document.save().then(() => {
            return this.formatter.formatDocument(document);
        });
    }
}

export class AutoLispDocumentRangeFormattingEditProvider implements vscode.DocumentRangeFormattingEditProvider {
    private formatter: Formatter;

    constructor() {
        this.formatter = new Formatter();
    }

    public provideDocumentRangeFormattingEdits(document: vscode.TextDocument, range: vscode.Range, options: vscode.FormattingOptions, token: vscode.CancellationToken): Thenable<vscode.TextEdit[]> {
        return document.save().then(() => {
            return this.formatter.formatDocument(document, range);
        });
    }
}