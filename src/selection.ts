import { isMatch, isCloseBracket, isOpenBracket } from "./util";
import * as vscode from 'vscode';
export class SearchResult {
    bracket: string;
    offset: number;
    constructor(bracket: string, offset: number) {
        this.bracket = bracket;
        this.offset = offset;
    }
}

export class FindSelection {
    private findBackward(text: string, index: number) {
        let bracketStack: string[] = [];
        let offset = 0;
        let bracket = '';
        for (let i = index; i >= 0; i--) {
            const element = text.charAt(i);
            if (isOpenBracket(element)) {
                if (bracketStack.length === 0) {
                    bracket = element;
                    offset = i;
                    break;
                } else {
                    let top = bracketStack.pop();
                    if (top === undefined || !isMatch(element, top)) {
                        throw 'unmatched bracket pair';
                    }
                }
            } else if (isCloseBracket(element)) {
                bracketStack.push(element);
            }

        }
        return new SearchResult(bracket, offset);
    }

    private findForward(text: string, index: number) {
        let bracketStack: string[] = [];
        let offset = text.length;
        let bracket = '';
        for (let i = index; i < text.length; i++) {
            const element = text.charAt(i);
            if (isCloseBracket(element)) {
                if (bracketStack.length === 0) {
                    bracket = element;
                    offset = i;
                    break;
                } else {
                    let top = bracketStack.pop();
                    if (top === undefined || !isMatch(top, element)) {
                        throw 'unmatched bracket pair';
                    }
                }
            } else if (isOpenBracket(element)) {
                bracketStack.push(element);
            }

        }
        return new SearchResult(bracket, offset);
    }
    private showInfo(msg: string): void {
        vscode.window.showInformationMessage(msg);
    }

    /**
     * selectText
     */
    public selectText(includeBracket: boolean) {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        let offset = editor.document.offsetAt(editor.selection.active);
        let text = editor.document.getText();
        try {
            let backwardResult = this.findBackward(text, offset - 1);
            let forwardResult = this.findForward(text, offset);
            if (!isMatch(backwardResult.bracket, forwardResult.bracket)) {
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

        } catch (error) {
            this.showInfo(error);
        }
    }
}