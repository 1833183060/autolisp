import * as vscode from 'vscode';
import { AutoLispProvider } from "./autolispProvider";


export class AutoLispDefinitionProvider extends AutoLispProvider implements vscode.DefinitionProvider {

    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Definition> {
        return new Promise((resolve, reject) => {
            let wordRange = document.getWordRangeAtPosition(position, /\b[^\s\(\)]+\b/ig);
            if (!wordRange) {
                return reject();
            } else {
                let currentWord: string = document.lineAt(position.line).text.slice(wordRange.start.character, wordRange.end.character);
                if (this.context) {
                    if (this.context.hasOwnProperty(currentWord)) {
                        let value = this.context[currentWord];
                        let uri: vscode.Uri;
                        let pos: vscode.Position;
                        if (value === undefined) {
                            return reject();
                        } else {
                            if (value.filename) {
                                uri = vscode.Uri.file(value.filename);
                            } else {
                                return reject();
                            }
                            if (value.pos) {
                                pos = new vscode.Position(value.pos[0], value.pos[1]);
                            } else {
                                return reject();
                            }
                            let definition = new vscode.Location(uri, pos);
                            return resolve(definition);
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