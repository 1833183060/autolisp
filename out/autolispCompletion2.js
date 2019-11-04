'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const autolispProvider_1 = require("./autolispProvider");
const util_1 = require("./util");
const lispParse_1 = require("./lispParse");
class AutoLispCompletionItemProvider extends autolispProvider_1.AutoLispProvider {
    constructor(context, userSnippetObj) {
        super(context);
        this.userSnippetObj = userSnippetObj;
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
            /*if (!isPositionInBrackets(document, position)) {
                return reject('not in ()');
            }*/
            let suggestions = [];
            let funName = util_1.getLastToken(document, position);
            if (this.userSnippetObj) {
                for (const funcname in this.userSnippetObj) {
                    if (funcname.indexOf(funName) >= 0) {
                        const element = this.userSnippetObj[funcname];
                        let item = new vscode.CompletionItem(funcname);
                        item.kind = util_1.mappings[element.type];
                        item.kind = vscode.CompletionItemKind.Function;
                        item.insertText = new vscode.SnippetString(element.body);
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
            if (this.userSnippetObj && this.funlist.hasOwnProperty(item.label)) {
                const element = this.userSnippetObj[item.label];
                let tm = element.description.match(/(?:;;;desc|;;;说明|;;;函数说明)[\s\S]*?(?=\r\n)/ig); //[0]
                if (tm === null) {
                    item.documentation = element.description;
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
//# sourceMappingURL=autolispCompletion2.js.map