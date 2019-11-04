"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iconv_lite_1 = require("iconv-lite");
const fs_1 = require("fs");
const vscode_1 = require("vscode");
exports.mappings = {
    0: vscode_1.CompletionItemKind.Function,
    1: vscode_1.CompletionItemKind.Method,
    2: vscode_1.CompletionItemKind.Property,
    3: vscode_1.CompletionItemKind.Constant
};
function isPositionInString(document, position) {
    let lineText = document.lineAt(position.line).text;
    let lineTillCurrentPosition = lineText.substr(0, position.character);
    // Count the number of double quotes in the line till current position. Ignore escaped double quotes
    let doubleQuotesCnt = (lineTillCurrentPosition.match(/\"/g) || []).length;
    let escapedDoubleQuotesCnt = (lineTillCurrentPosition.match(/\\\"/g) || []).length;
    doubleQuotesCnt -= escapedDoubleQuotesCnt;
    return doubleQuotesCnt % 2 === 1;
}
exports.isPositionInString = isPositionInString;
function isPositionPreBraket(document, position) {
    let linetext = document.lineAt(position.line).text;
    let linebraket = linetext.substr(0, position.character - 1);
    // console.log(linebraket);
    return linebraket.endsWith('(');
}
exports.isPositionPreBraket = isPositionPreBraket;
function isPositionInBrackets(document, position) {
    let indent = [];
    let zuo = 0;
    for (const item of document.getText().split('\r\n')) {
        indent.push(zuo += LeftBracket(item));
    }
    if (indent[position.line] !== 0) {
        return true;
    }
    else {
        let linetext = document.lineAt(position.line).text;
        if (linetext.trim().startsWith(';')) {
            return false;
        }
        let num = linetext.search(/\)(?=[^\)]*?$)/ig);
        if (num === -1) {
            return false;
        }
        else if (num < position.character) {
            return false;
        }
        else {
            return true;
        }
    }
}
exports.isPositionInBrackets = isPositionInBrackets;
function isPositionInBrackets2(document, position) {
    let indent = [];
    let zuo = 0;
    for (const item of document.getText().split('\r\n')) {
        indent.push(zuo += LeftBracket(item));
    }
    if (indent[position.line] !== 0) {
        return true;
    }
    else {
        let linetext = document.lineAt(position.line).text;
        if (linetext.trim().startsWith(';')) {
            return false;
        }
        let num = linetext.search(/\)(?=[^\)]*?$)/ig);
        if (num === -1) {
            return false;
        }
        else if (num < position.character) {
            return false;
        }
        else {
            return true;
        }
    }
}
exports.isPositionInBrackets2 = isPositionInBrackets2;
function getLastToken(document, position) {
    let linetext = document.lineAt(position.line).text;
    linetext = linetext.substring(0, position.character);
    //linetext=linetext.split("").reverse().join("");
    if (linetext.trim().startsWith(';')) {
        return "";
    }
    let reg = /[\s\(\)]*(\S*?)[\(\)\s\"\;]*$/ig;
    let m = reg.exec(linetext);
    if (m == null || m.length < 2)
        return "";
    return m[1];
}
exports.getLastToken = getLastToken;
function readFileSync_encoding(filename, encoding) {
    let content = fs_1.readFileSync(filename);
    return iconv_lite_1.decode(content, encoding);
}
exports.readFileSync_encoding = readFileSync_encoding;
function findPosition(text, funcname) {
    let lines = text.split('\r\n');
    let result = [];
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
exports.findPosition = findPosition;
function StringLeftTrim(text, character) {
    if (text.startsWith(character)) {
        return StringLeftTrim(text.substr(1), character);
    }
    else {
        return text;
    }
}
exports.StringLeftTrim = StringLeftTrim;
function LeftBracket(str) {
    let zuo = 0;
    let you = 0;
    let isstr = false;
    for (let i = 0; i < str.length; i++) {
        const item = str.charAt(i);
        let prev;
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
exports.LeftBracket = LeftBracket;
function isMatch(open, close) {
    switch (open) {
        case '(':
            return close === ')';
        default:
            return false;
    }
}
exports.isMatch = isMatch;
function isOpenBracket(char) {
    return char === '(';
}
exports.isOpenBracket = isOpenBracket;
function isCloseBracket(char) {
    return char === ')';
}
exports.isCloseBracket = isCloseBracket;
//# sourceMappingURL=util.js.map