'use strict'

import * as fs from 'fs';
import * as path from 'path';
import { readFileSync_encoding, LeftBracket, functions, FunctionType } from "./util";


/**
 * LispParse
 *  // 1.取得doc
            // 2.取得函数名
            // 3.取得形参名

            //file
            // line
            // column
            //doc
 */
export class LispParse {

    public scanfile(filename: string): { [funcname: string]: functions } {
        let tmp = readFileSync_encoding(filename, "gb2312").split('\r\n');
        let result: { [funcname: string]: functions } = {};
        let functmp: functions = {} as functions;
        let funcname!: string;
        let doctmp: string[] = [];
        let texttmp: string[] = [];
        let isdoc: boolean = false;
        let isblock: boolean = false;
        let zuo: number = 0;

        for (let index = 0; index < tmp.length; index++) {
            const element = tmp[index];
            zuo += LeftBracket(element);
            if (zuo === 0) {
                //#region 处理块注释
                //以;|开头，并且位于函数外，表示进入块注释，将块注释标识设为true，进行下一个循环
                if (element.trim().startsWith(';|')) {

                    isblock = !isblock;
                    continue;
                }
                //以|;结尾，并且位于函数外表示离开块注释，将块注释标识设为false，进行下一个循环
                if (isblock && element.trim().endsWith('|;')) {
                    isblock = !isblock;
                    continue;
                }
                //如果位于块注释内，直接下一循环
                if (isblock) {
                    continue;
                }
                //#endregion

                if (!isblock) {
                    //#region 处理函数注释
                    //如果不是块注释内，不是函数内，并且以;开头，那么就是函数注释
                    //函数注释标识设为true，将当前行加入注释临时变量数组内
                    if (element.trim().startsWith(';')) {
                        isdoc = true;
                        doctmp.push(element);
                    } else if (element.trim() === '') { //如果遇到空行，并且上一行为注释，表示注释断掉，清空注释临时变量数组
                        if (isdoc) {

                            doctmp.push(element);
                        } else {
                            //如果上一行不是注释，直接下一个循环
                            continue;
                        }
                        //#endregion
                    } else {
                        //#region 处理函数体最后一行
                        if (element.match(/\(\s*vl-load-com\s*\)/ig) == null) { //不是vl-load-com
                            texttmp.push(element);
                        } else {
                            continue;
                        }

                        if (texttmp[0].trim().match(/^\(\s*setq\s*[\s\S]*?\s/ig) === null) {
                            functmp.type = FunctionType.UserFunction;
                            functmp.doc = doctmp.join('\r\n').trim();
                            functmp.text = texttmp.join('\r\n').trim();
                            functmp.pos = [index - texttmp.length, texttmp[0].search(funcname)];
                            //匹配函数名
                            let funcline = functmp.text.match(/(\(\s*?defun[\s\S]*?(?=\s*?\)|\s*?nil|\s*?\/|\s*?\(\s*?\)))/ig);
                            if (funcline !== null) {
                                let funcn = funcline[0].slice(1); //匹配函数名
                                let index1 = funcn.indexOf('(');
                                if (index1 === -1) {
                                    funcname = funcn.slice(6).trim();
                                    functmp.parameter = []
                                } else {
                                    funcname = funcn.slice(6, index1).trim();
                                    functmp.parameter = funcn.slice(index1 + 1).trim().split(/\s\s*/ig);
                                }
                            }
                            functmp.filename = filename;
                            result[funcname] = functmp;

                            doctmp = [];
                            texttmp = [];
                            functmp = {} as functions;
                        } else {
                            continue;
                        }
                        //#endregion
                    }
                }
            } else {
                //#region 处理函数体
                isdoc = false;
                texttmp.push(element);
            }
            //#endregion
        }
        return result;
    }

    public scanPath(pathdir: string): { [funcname: string]: functions } {
        let dirs = fs.readdirSync(pathdir).filter(element => {
            return path.extname(element).toLowerCase() === ".lsp";
        });
        let result: { [funcname: string]: functions } = {};
        dirs.forEach(ele => {
            result = Object.assign(result, this.scanfile(path.join(pathdir, ele)));
        });
        return result;
    }



    /**
     * lispParse
     */
    public Parse(pathdir: string): { [funcname: string]: functions } {
        return this.scanPath(pathdir);
    }

}

export class SystemParse {
    /**
     * parse
     */
    public parse(): { [funcname: string]: functions } {

        let result: { [funcname: string]: functions } = {};

        let tmp = readFileSync_encoding(path.join(path.dirname(__dirname), path.sep, 'data/data.csv'), "gb2312");
        let tmplist = tmp.split('\r\n');

        for (const item of tmplist) {
            let functmp = {} as functions;
            let itemtmp = item.split(',');
            switch (itemtmp[3]) {
                case '33': //function
                    functmp.doc = itemtmp[2];
                    functmp.type = FunctionType.SystemFunction;
                    let vars = itemtmp[1].slice(1, -1).split(' ');
                    if (vars === null) {
                        functmp.parameter = [];
                    } else {
                        vars.shift();
                        functmp.parameter = vars;
                    }
                    break;
                case '13': //
                    functmp.doc = itemtmp[2];
                    functmp.type = FunctionType.Constant;
                default:
                    break;
            }
            result[itemtmp[0]] = functmp;
        }
        return result;
    }


}

export class LispFormat {

    private parseString(str: string): string {
        return str
            .trim() //Trailing whitespace
            .replace(/([^\(\s':;\t])(\()/g, '$1 $2') //turn '(print(+ 1 1))' to '(print (+ 1 1))'
            .replace(/(\))(\()/g, '$1 $2') //turn  ')(' to ') ('
            .replace(/[\s\t]*(\))/g, '$1') //Remove any space before closing brackets '(print 12   )' ==> '(print 12)'
            .replace(/[\s\t]{2,}/g, ' ') //remove extra whitespace "(print     'this)" ==> "(print 'this)"
            .replace(/(\))[\s\t]*(?=(\)))/g, '$1') //turn ') ) ) ' into '))) '
            .replace(/(\()[\s\t]*(?=(\())/g, '$1') //turn '( ( ( ' into '((( '
            .replace(/^[\s\t]*/g, '') //remove leading whitespace '   print' ==> 'print'
            .replace(/(')[\s\t]+(\()/g, '$1$2') //Remove space between quote and opening bracket, "' (1 2 3)" ==> "'(1 2 3)"
            .replace(/(\))\s*(;.*$)/g, '$1 $2'); //turn ');haha' ==> ') ;hahah'
        // return str;
    }
    private indent(strlst: string[]): number[] {
        let zuo = 0;
        let result: number[] = [];
        for (const element of strlst) {
            let zuotmp = LeftBracket(element);
            zuo += zuotmp; //
            if (zuo === 0 && zuotmp === 0) {
                result.push(0);
            } else if (zuotmp === -1 && !element.startsWith('(')) {
                result.push(zuo - zuotmp - 1);
            } else {
                result.push(zuo - zuotmp);
            }
        }
        return result;
    }

    /**
     * lispFormatter
     */
    public lispFormatter(str: string, pos: number = 0): string {
        let strlst = str.split('\r\n').map((ele) => {
            return this.parseString(ele.trim());
        });
        let indent = this.indent(strlst);
        let i = 0;
        return strlst.map((ele) => {
            let tmp = ' '.repeat(pos + indent[i++] * 2) + ele;
            return tmp
        }).join('\r\n');
    }
}











