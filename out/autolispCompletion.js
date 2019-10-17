'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const autolispProvider_1 = require("./autolispProvider");
const util_1 = require("./util");
const lispParse_1 = require("./lispParse");
class AutoLispCompletionItemProvider extends autolispProvider_1.AutoLispProvider {
    constructor(context) {
        super(context);
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this.funlist = this.context;
        }
        else {
            editor.document.save();
            this.funlist = Object.assign(this.context, new lispParse_1.LispParse().scanfile(editor.document.fileName));
        }
    }
    provideCompletionItems(document, position, token) {
        return new Promise((resolve, reject) => {
            let editor = vscode.window.activeTextEditor;
            if (!editor) {
                return reject();
            }
            if (!util_1.isPositionInBrackets(document, position)) {
                return reject('not in ()');
            }
            let suggestions = [];
            if (this.funlist) {
                for (const funcname in this.funlist) {
                    if (this.funlist.hasOwnProperty(funcname)) {
                        const element = this.funlist[funcname];
                        let index = 0;
                        let item = new vscode.CompletionItem(funcname);
                        item.kind = util_1.mappings[element.type];
                        item.kind = vscode.CompletionItemKind.Function;
                        if (element.parameter === undefined) {
                            item.insertText = funcname;
                        }
                        else {
                            item.insertText = new vscode.SnippetString(funcname + element.parameter.map(ele => {
                                index++;
                                return ' '.concat('${', `${index}`, ':', ele, '}');
                            }).join(' ').concat('$0'));
                        }
                        suggestions.push(item);
                    }
                }
            }
            else {
                return reject();
            }
            let completionList = new vscode.CompletionList(suggestions, false);
            resolve(completionList);
        });
    }
    resolveCompletionItem(item, token) {
        return new Promise((resolve, reject) => {
            if (this.funlist && this.funlist.hasOwnProperty(item.label)) {
                const element = this.funlist[item.label];
                let tm = element.doc.match(/(?:;;;desc|;;;说明|;;;函数说明)[\s\S]*?(?=\r\n)/ig); //[0]
                if (tm === null) {
                    item.documentation = element.doc;
                }
                else {
                    let tmp = tm[0];
                    item.documentation = tmp.substr(tmp.search(':') + 1);
                }
            }
            resolve(item);
        });
    }
}
exports.AutoLispCompletionItemProvider = AutoLispCompletionItemProvider;
//# sourceMappingURL=autolispCompletion.js.map