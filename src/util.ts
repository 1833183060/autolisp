import { TextDocument, Position } from "vscode";
import { decode } from "iconv-lite";
import { readFileSync } from 'fs';
import { CompletionItemKind } from "vscode";

export interface functions {
    type: FunctionType ,
    doc: string,
    parameter?: string[],
    text?: string,
    filename?: string,
    pos?: number[]
}

export const enum FunctionType {
    SystemFunction = 0,
    UserFunction = 1,
    Property = 2,
    Constant = 3
}

export const mappings: { [key: number]: CompletionItemKind } = {
    0: CompletionItemKind.Function,
    1: CompletionItemKind.Method,
    2: CompletionItemKind.Property,
    3: CompletionItemKind.Constant
}


export function isPositionInString(document: TextDocument, position: Position): boolean {
    let lineText = document.lineAt(position.line).text;
    let lineTillCurrentPosition = lineText.substr(0, position.character);

    

    // Count the number of double quotes in the line till current position. Ignore escaped double quotes
    let doubleQuotesCnt = (lineTillCurrentPosition.match(/\"/g) || []).length;
    let escapedDoubleQuotesCnt = (lineTillCurrentPosition.match(/\\\"/g) || []).length;

    doubleQuotesCnt -= escapedDoubleQuotesCnt;
    return doubleQuotesCnt % 2 === 1;
}

export function isPositionPreBraket(document: TextDocument, position: Position): boolean {
    let linetext = document.lineAt(position.line).text;
    let linebraket = linetext.substr(0, position.character - 1);
    // console.log(linebraket);

    return linebraket.endsWith('(');
}


export function isPositionInBrackets(document: TextDocument, position: Position): boolean {
    let indent:number[]= [];
    let zuo = 0;
    for (const item of document.getText().split('\r\n')) {
        indent.push(zuo+=LeftBracket(item));
    }
    if (indent[position.line] !== 0) {
        return true;
    }else{
        let linetext = document.lineAt(position.line).text;
        if (linetext.trim().startsWith(';')) {
            return false;
        }
        let num = linetext.search(/\)(?=[^\)]*?$)/ig);
        if (num === -1) {
            return false;
        }else if (num < position.character){
            return false;
        }else{
            return true;
        }
    }
}






export function readFileSync_encoding(filename: string, encoding: string): string {
    
    let content = readFileSync(filename);
    return decode(content, encoding);
}

export function findPosition(text: string, funcname: string): number[] {
    let lines = text.split('\r\n');
    let result: number[] = [];
    for (let i = 0; i < lines.length; i++) {
        if (!lines[i].startsWith(';')) {
            let column = lines[i].search(funcname);
            if (column !== -1) {
                result.push(...[i, column]);
            }
        }

    }
    return result;
}


export function StringLeftTrim(text: string, character: string): string {
    if (text.startsWith(character)) {

        return StringLeftTrim(text.substr(1), character);
    } else {
        return text;
    }
}


export function LeftBracket(str: string): number {
    let zuo = 0;
    let you = 0;
    let isstr = false;
    for (let i = 0; i < str.length; i++) {
        const item = str.charAt(i);
        let prev: string;
        if (i >= 1) {
            prev = str.charAt(i - 1);
        }
        else {
            prev = ' ';
        }
        if (item === '\"') //如果遇到字符串，设置进入字符串为true
        {
            if (prev == '\\') {
                if (str.charAt(i - 2) === '\\') {
                    isstr = !isstr;
                }
                else {
                    continue;
                }
            }
            else {
                isstr = !isstr;
            }
        }
        if (isstr === true) //如果位于字符串中
        {
            continue;
        }
        else //不位于字符串中
        {
            if (item === ";") //是注释
            {
                break;
            }
            else if (item === "(") {
                zuo++;
            }
            else if (item === ")") {
                you++;
            }
            else {
                continue;
            }
        }

    }
    return zuo - you;
}

export function isMatch(open:string,close:string):boolean{
    switch (open) {
        case '(':
            return close === ')';
        default:
            return false;
    }
}

export function isOpenBracket(char:string):boolean{
    return char === '(';
}

export function isCloseBracket(char:string):boolean{
    return char === ')';
}


