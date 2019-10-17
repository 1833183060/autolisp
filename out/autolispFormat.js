'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const lispParse_1 = require("./lispParse");
class Formatter {
    formatDocument(document, range) {
        return new Promise((resolve, reject) => {
            let text;
            if (range) {
                text = document.getText(range);
            }
            else {
                text = document.getText();
            }
            if (!text) {
                return reject();
            }
            let format = new lispParse_1.LispFormat();
            let formatstringlist = format.lispFormatter(text);
            let textEdits = [];
            if (range) {
                textEdits.push(new vscode.TextEdit(range, formatstringlist));
            }
            else {
                textEdits.push(new vscode.TextEdit(new vscode.Range(0, 0, document.lineCount, 10000), formatstringlist));
            }
            return resolve(textEdits);
        });
    }
}
exports.Formatter = Formatter;
class AutoLispDocumentFormattingEditProvider {
    constructor() {
        this.formatter = new Formatter();
    }
    provideDocumentFormattingEdits(document, options, token) {
        return document.save().then(() => {
            return this.formatter.formatDocument(document);
        });
    }
}
exports.AutoLispDocumentFormattingEditProvider = AutoLispDocumentFormattingEditProvider;
class AutoLispDocumentRangeFormattingEditProvider {
    constructor() {
        this.formatter = new Formatter();
    }
    provideDocumentRangeFormattingEdits(document, range, options, token) {
        return document.save().then(() => {
            return this.formatter.formatDocument(document, range);
        });
    }
}
exports.AutoLispDocumentRangeFormattingEditProvider = AutoLispDocumentRangeFormattingEditProvider;
//# sourceMappingURL=autolispFormat.js.map