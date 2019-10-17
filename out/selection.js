"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("./util");
const vscode = require("vscode");
class SearchResult {
    constructor(bracket, offset) {
        this.bracket = bracket;
        this.offset = offset;
    }
}
exports.SearchResult = SearchResult;
class FindSelection {
    findBackward(text, index) {
        let bracketStack = [];
        let offset = 0;
        let bracket = '';
        for (let i = index; i >= 0; i--) {
            const element = text.charAt(i);
            if (util_1.isOpenBracket(element)) {
                if (bracketStack.length === 0) {
                    bracket = element;
                    offset = i;
                    break;
                }
                else {
                    let top = bracketStack.pop();
                    if (top === undefined || !util_1.isMatch(element, top)) {
                        throw 'unmatched bracket pair';
                    }
                }
            }
            else if (util_1.isCloseBracket(element)) {
                bracketStack.push(element);
            }
        }
        return new SearchResult(bracket, offset);
    }
    findForward(text, index) {
        let bracketStack = [];
        let offset = text.length;
        let bracket = '';
        for (let i = index; i < text.length; i++) {
            const element = text.charAt(i);
            if (util_1.isCloseBracket(element)) {
                if (bracketStack.length === 0) {
                    bracket = element;
                    offset = i;
                    break;
                }
                else {
                    let top = bracketStack.pop();
                    if (top === undefined || !util_1.isMatch(top, element)) {
                        throw 'unmatched bracket pair';
                    }
                }
            }
            else if (util_1.isOpenBracket(element)) {
                bracketStack.push(element);
            }
        }
        return new SearchResult(bracket, offset);
    }
    showInfo(msg) {
        vscode.window.showInformationMessage(msg);
    }
    /**
     * selectText
     */
    selectText(includeBracket) {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let offset = editor.document.offsetAt(editor.selection.active);
        let text = editor.document.getText();
        try {
            let backwardResult = this.findBackward(text, offset - 1);
            let forwardResult = this.findForward(text, offset);
            if (!util_1.isMatch(backwardResult.bracket, forwardResult.bracket)) {
                this.showInfo('unmatched bracket pair');
                return;
            }
            let selectionStart = backwardResult.offset < text.length ? backwardResult.offset + 1 : backwardResult.offset;
            let selectionEnd = forwardResult.offset;
            if (includeBracket) {
                selectionStart -= 1;
                selectionEnd += 1;
            }
            editor.selection = new vscode.Selection(editor.document.positionAt(selectionStart), editor.document.positionAt(selectionEnd));
        }
        catch (error) {
            this.showInfo(error);
        }
    }
}
exports.FindSelection = FindSelection;
//# sourceMappingURL=selection.js.map