'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const autolispProvider_1 = require("./autolispProvider");
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
class AutoLispHoverProvider extends autolispProvider_1.AutoLispProvider {
    provideHover(document, position, token) {
        return new Promise((resolve, reject) => {
            let wordRange = document.getWordRangeAtPosition(position, /\b[^\s\(\)]+\b/ig);
            // let wordRange = document.getWordRangeAtPosition(position, /\([\s\S]+\)/img);
            if (wordRange === undefined) {
                return resolve(new vscode.Hover('Docstring not found'));
            }
            else {
                let currentWord;
                currentWord = document.lineAt(position.line).text.slice(wordRange.start.character, wordRange.end.character);
                let hover;
                if (this.context) {
                    if (this.context.hasOwnProperty(currentWord)) {
                        let value = this.context[currentWord];
                        if (value === undefined) {
                            return reject();
                        }
                        else {
                            hover = new vscode.Hover(value.doc.replace(/^;;;/img, "").replace(/\r\n/img, '\r\n\r\n'));
                            return resolve(hover);
                        }
                    }
                    else {
                        return reject();
                    }
                }
                else {
                    return reject();
                }
            }
        });
    }
}
exports.AutoLispHoverProvider = AutoLispHoverProvider;
//# sourceMappingURL=autolispHover.js.map