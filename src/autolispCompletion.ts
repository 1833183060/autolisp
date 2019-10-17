'use strict';


import * as vscode from 'vscode';
import { AutoLispProvider } from './autolispProvider';
import { mappings, isPositionInBrackets, functions } from "./util";
import { LispParse } from "./lispParse";





export class AutoLispCompletionItemProvider extends AutoLispProvider implements vscode.CompletionItemProvider {

    private funlist: { [funcname: string]: functions };
    constructor(context:{[funcname:string]:functions}) {
        super(context);
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
            if (!isPositionInBrackets(document, position)) {
                return reject('not in ()');
            }

            let suggestions: vscode.CompletionItem[] = [];

        

            if (this.funlist) {
                for (const funcname in this.funlist) {
                    if (this.funlist.hasOwnProperty(funcname)) {
                        const element = this.funlist[funcname];

                        let index = 0;
                        let item = new vscode.CompletionItem(funcname);
                        item.kind = mappings[element.type];
                        item.kind=vscode.CompletionItemKind.Function;
                        if (element.parameter === undefined) {
                            item.insertText = funcname;
                        } else {
                            item.insertText = new vscode.SnippetString(funcname + element.parameter.map(ele => {
                                index++;
                                return ' '.concat('${', `${index}`, ':', ele, '}');
                            }).join(' ').concat('$0'));
                        }

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

            if (this.funlist && this.funlist.hasOwnProperty(item.label)) {
                
                const element = this.funlist[item.label];
               
                let tm = element.doc.match(/(?:;;;desc|;;;说明|;;;函数说明)[\s\S]*?(?=\r\n)/ig)//[0]
                if (tm === null) {
                    item.documentation = element.doc;
                } else {
                    let tmp = tm[0];
                    item.documentation = tmp.substr(tmp.search(':') + 1);
                }
                
            }
            resolve(item);
        });
    }
}

