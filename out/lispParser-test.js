let parser=require('./lispParser')
let fs=require('fs')

let content=fs.readFileSync("D:/mywork/acad二次开发/我写的工具/autolisp/a.lsp",{encoding:'utf-8'})
let ret=parser.parse(content)