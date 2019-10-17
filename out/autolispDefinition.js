"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const autolispProvider_1 = require("./autolispProvider");
class AutoLispDefinitionProvider extends autolispProvider_1.AutoLispProvider {
    provideDefinition(document, position, token) {
        return new Promise((resolve, reject) => {
            let wordRange = document.getWordRangeAtPosition(position, /\b[^\s\(\)]+\b/ig);
            if (!wordRange) {
                return reject();
            }
            else {
                let currentWord = document.lineAt(position.line).text.slice(wordRange.start.character, wordRange.end.character);
                if (this.context) {
                    if (this.context.hasOwnProperty(currentWord)) {
                        let value = this.context[currentWord];
                        let uri;
                        let pos;
                        if (value === undefined) {
                            return reject();
                        }
                        else {
                            if (value.filename) {
                                uri = vscode.Uri.file(value.filename);
                            }
                            else {
                                return reject();
                            }
                            if (value.pos) {
                                pos = new vscode.Position(value.pos[0], value.pos[1]);
                            }
                            else {
                                return reject();
                            }
                            let definition = new vscode.Location(uri, pos);
                            return resolve(definition);
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
exports.AutoLispDefinitionProvider = AutoLispDefinitionProvider;
//# sourceMappingURL=autolispDefinition.js.map