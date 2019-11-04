'use strict';


import * as vscode from 'vscode';
import { AutoLispProvider } from './autolispProvider';
import { mappings, /*isPositionInBrackets,*/ functions, UserSnippet, getLastToken} from "./util";
import { LispParse } from "./lispParse";

export class AutoLispCompletionItemProvider extends AutoLispProvider implements vscode.CompletionItemProvider {

    private funlist: { [funcname: string]: functions };
    private userSnippetObj:{ [funcname: string]: UserSnippet }
    constructor(context:{[funcname:string]:functions},userSnippetObj:{ [funcname: string]: UserSnippet }) {
        super(context);
        this.userSnippetObj=userSnippetObj;
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            this.funlist = this.context;
        }else{
            editor.document.save();
            this.funlist = Object.assign(this.context, new LispParse().scanfile(editor.document.fileName));
        }
        
    }

    public provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.CompletionList> {
        return new Promise<vscode.CompletionList>((resolve, reject) => {

            let editor = vscode.window.activeTextEditor;
            if (!editor) {
                return reject();
            }
            /*if (!isPositionInBrackets(document, position)) {
                return reject('not in ()');
            }*/

            let suggestions: vscode.CompletionItem[] = [];
        
            let funName=getLastToken(document,position);
            if (this.userSnippetObj) {
                for (const funcname in this.userSnippetObj) {
                    if (funcname.indexOf(funName)>=0) {
                        const element = this.userSnippetObj[funcname];
                        
                        let item = new vscode.CompletionItem(funcname);
                        item.kind = mappings[element.type];
                        item.kind=vscode.CompletionItemKind.Function;
                        
                        item.insertText = new vscode.SnippetString(element.body);                        

                        suggestions.push(item);
                    }
                }
            } else {
                return reject();
            }



            let completionList: vscode.CompletionList = new vscode.CompletionList(suggestions, false);
            resolve(completionList);
        });
    }

    public resolveCompletionItem(item: vscode.CompletionItem, token: vscode.CancellationToken): Thenable<vscode.CompletionItem> {
        return new Promise<vscode.CompletionItem>((resolve, reject) => {

            if (this.userSnippetObj && this.funlist.hasOwnProperty(item.label)) {
                
                const element = this.userSnippetObj[item.label];
               
                let tm = element.description.match(/(?:;;;desc|;;;说明|;;;函数说明)[\s\S]*?(?=\r\n)/ig)//[0]
                if (tm === null) {
                    item.documentation = element.description;
                } else {
                    let tmp = tm[0];
                    item.documentation = tmp.substr(tmp.search(':') + 1);
                }
                
            }
            resolve(item);
        });
    }
}

