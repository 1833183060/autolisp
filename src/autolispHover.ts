'use strict';

import * as vscode from 'vscode';
import { AutoLispProvider } from './autolispProvider';

// export class AutoLispHoverProvider extends AutoLispProvider implements vscode.HoverProvider {

//     provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Hover> {
//         return new Promise<vscode.Hover>((resolve, reject) => {
//             let wordRange = document.getWordRangeAtPosition(position);
//             if (wordRange === undefined) {
//                return resolve(new vscode.Hover('Docstring not found'));
//             } else {
//                 let currentWord: string;
//                 currentWord = document.lineAt(position.line).text.slice(wordRange.start.character, wordRange.end.character);
//                 //let ns = this.getNamespace(document.getText());
//                 //let libpath = vscode.workspace.getConfiguration('autolisp')['userlibpath'];
//                 let hover: vscode.Hover;

//                 if (this.context) {
//                     this.context.forEach(element => { //funcs
//                         element.funcs.forEach(element => { //func
//                             if (currentWord === element.funcname) {
//                                 hover = new vscode.Hover(element.doc);
//                                 return resolve(hover);

//                             }
//                         });
//                     });

//                 } else {
//                    return reject();
//                 }
//             }
//         }
//         );
//     }
// }


export class AutoLispHoverProvider extends AutoLispProvider implements vscode.HoverProvider {

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Hover> {
        return new Promise<vscode.Hover>((resolve, reject) => {

            let wordRange = document.getWordRangeAtPosition(position, /\b[^\s\(\)]+\b/ig);
            // let wordRange = document.getWordRangeAtPosition(position, /\([\s\S]+\)/img);
            if (wordRange === undefined) {
                return resolve(new vscode.Hover('Docstring not found'));
            } else {
                let currentWord: string;
                currentWord = document.lineAt(position.line).text.slice(wordRange.start.character, wordRange.end.character);
                let hover: vscode.Hover;
                if (this.context) {
                    if (this.context.hasOwnProperty(currentWord)) {
                        let value = this.context[currentWord];
                        if (value === undefined) {
                            return reject();
                        } else {
                            hover = new vscode.Hover(value.doc.replace(/^;;;/img,"").replace(/\r\n/img, '\r\n\r\n'));
                            return resolve(hover);
                        }
                    } else {
                        return reject();
                    }
                } else {
                    return reject();
                }
            }
        });
    }
}