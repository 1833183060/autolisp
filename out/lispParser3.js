class MyString  {
    constructor(value){
        if(typeof value=='undefined'){
           value='';
        }
        this.s=value;
    }
    append(v){
        this.s+=v;
        MyString.lastString=v.toString();
    }
    toString(){
        if(typeof this.s=='undefined')return "";
        return this.s;
    }
}
    /*** Main ***/
    class Node {
        constructor(value) {            
            this.value = value
            if(typeof value=='undefined'){
                this.value=null;
            }
            this.startPos=0;
            this.items=[];
        }
    }
const ListType={
    NORMAL:0,
    QUOTE:1
}
    /* Error Defination */
    class ReferenceError extends Error {
        constructor(message) {
            super('Reference Error: ' + message)
        }
    }

    class ParseError extends Error{
        constructor(message,pos){
            super('parseError:'+message)
            this.pos=pos
        }
    }
    class ParseEnd extends Error{
        constructor(message,pos,data){
            super('parseEnd:'+message)
            this.pos=pos
            if(typeof data=='undefined'){
                this.data=null;
            }else{
                this.data=data
            }   
            parser.curNode=this.data;         
        }
    }
    class Parser{
        constructor(p){
            this.program=p
            this.pos=0;
            this.cursorPos=p.length+99;
            this.curNode=null;
            this.rootNode=new Node();
        }
        ifEnd(){
            this.end=(this.pos>=this.program.length);
            return this.end;
        }
        ifEnd(letter,curNode){
            
            if(letter.charCodeAt()==0){
                if(typeof curNode!='undefined'){
                    throw new ParseEnd('',parser.pos,curNode);
                }else{
                    throw new ParseEnd('',parser.pos,null);
                }
                
            }else if(this.pos>this.cursorPos){
                if(typeof curNode!='undefined'){
                    throw new ParseEnd('',parser.pos,curNode);
                }else{
                    throw new ParseEnd('',parser.pos,null);
                }
            }
            this.end=(letter.charCodeAt()==0);
            return this.end;
        }
    }
    
    let parser={}
    function parseForSignature(program,cursorPos){
        let r;
        try{
        parser=new Parser(program);
        parser.pos=0;
        parser.end=false;
        parser.cursorPos=cursorPos;
        r=parseAny(parser.rootNode);
        
        }catch(ex){
            if(ex instanceof ParseEnd){
                console.log('end')
                if(parser.curNode instanceof Exp){
                    return parser.curNode;
                }
                return null;
                return parser.curNode;
                if(ex.data!=null){
                    return ex.data;
                }
            }
            //showErrorMessage(ex)
            //return r;
        }
        return null;
        //return parser.rootNode;
    }
    function parse(program){
        let r;
        try{
        parser=new Parser(program);
        parser.pos=0;
        parser.end=false;
        
        r=parseAny(parser.rootNode);
        
        }catch(ex){
            if(ex instanceof ParseEnd){
                console.log('end')
            }
            //showErrorMessage(ex)
            //return r;
        }
        return parser.rootNode;
    }
    function getChar(){

    }
    function parseAny(pnode){       
        
        let br=false;
        let letter=parser.program[parser.pos];
        if(parser.ifEnd(letter,pnode)){
            throw new ParseEnd('',parser.pos);
            return null;
        }
        while(br==false){
            shiftEmpty();
            letter=parser.program[parser.pos++];
            if(parser.ifEnd(letter,pnode)){
                //pnode.items.push(node)
                throw new ParseEnd('',parser.pos);
                break;
            }
            switch(letter){
               
                case ';':
                    parseAnno(pnode)
                    //nodes.push(node);
                    
                    break;
                case '(':
                    parseExp(pnode);
                    //nodes.push(node);
                    break;

                case '\'':case '\"': 
                    let letter2=parser.program[parser.pos];
                    if(parser.ifEnd(letter2,pnode)){
                        throw new ParseError('非法的引号',parser.pos-1)
                    }
                    if(letter=='\''&&letter2=='('){
                        node=parseList(pnode,ListType.QUOTE);
                    }else{
                        node=parseStr(pnode,letter);
                    }           
                    
                    //nodes.push(node);
                    break;
                case ')':
                    br=true;
                    parser.pos--;
                    break;
                default:                    
                    parser.pos--;
                    parseAtom(pnode);
                    //nodes.push(node);
                    break;
            }
            if(parser.end){
                throw new ParseEnd('',parser.pos)
            }
            letter=parser.program[parser.pos];
            if(parser.ifEnd(letter,pnode)){
                throw new ParseEnd('',parser.pos)
                break;
            }
            if(letter=='\t'||letter=='\n'||letter=="\r"||letter==' '||letter=='('){
                br=false;
            }else{
                br=true;
                
            }
        }
        //return nodes;
    }
    function shiftEmpty(){
        let startPos=-1;
        //let reg=/\b[a-zA-Z_$@]+[\S]*\b/i
        //let m=reg.exec(parser.program.substring(parser.pos));
        //if(m==null)return null;
        //let r=new FunName(m[0]);
        while(startPos==-1){
            if(parser.program[parser.pos]=='\r'||
            parser.program[parser.pos]=='\t'||
            parser.program[parser.pos]=='\n'||
            parser.program[parser.pos]==' '
            ){
                parser.pos++;
                
            }else{
                startPos=parser.pos;
            }
        }
    }
    function parseSym(pnode,itemName){
        let content='';
        shiftEmpty();
        let letter=parser.program[parser.pos];
        if(parser.ifEnd(letter,pnode)){
            pnode[itemName]=null;
            return null;
        }
        let r=new Sym();
        pnode[itemName]=r;
        r.startPos=parser.pos;
        
        switch(letter){
            case '(':case ')':case '.':case '\'':case '\"':

                return null;
        }
        let illegal=true;
        let br=false;
        while(br==false){
            letter=parser.program[parser.pos++];
            if(parser.ifEnd(letter,r)){
                parser.pos--
                throw new ParseError('缺少闭合的括号',parser.pos);
                break;
            }
            switch(letter){
                case '.':case '\'':case '\"':
                    parser.pos=r.startPos;
                    return null;
                    break;
                case '\r':case '\t':case '\n':case ' ':case ')':
                case ';':case '(':
                    br=true;
                    parser.pos--;
                    break;
                default:
                    if(letter<'0'||letter>'9'){
                        illegal=false;
                        
                    }
                    content+=letter;
                    break;
            }
        }
        if(illegal==true){

            throw new ParseError('符号名不能全是数字',r.startPos);
        }
        r.value=content;
        
        return r;
    }
    function parseAtom(pnode){
        let content='';
        shiftEmpty();
        let r=new Atom();
        r.startPos=parser.pos;
        pnode.items.push(r)
        let br=false;
        while(br==false){
            let letter=parser.program[parser.pos++];
            if(parser.ifEnd(letter,pnode)){
                parser.pos--;
                break;
            }
            switch(letter){
                case '\'':case '\"':
                    throw new ParseError('非法字符-220',parser.pos-1)
                    break;
                case ')':case ';':case '\r':case '\t':case '\n':case ' ':case '(':
                    br=true;
                    parser.pos--;
                    break;
                default:                    
                    content+=letter;
                    break;
            }
        }
        
        r.value=content;
        
        return r;
    }
    function parseFunName(pnode){
        let content='';
        shiftEmpty();
        let r=parseSym(pnode,'funName');

        return r;
    }
    function parseParamDef(pnode){
        let content='';
        
        let letter='';
        let br=false;
        let temp;
        let r=new ParamDef();
        r.startPos=parser.pos;
        pnode.paramDef=r;
        //r.array=[]
        shiftEmpty();
        
        while(br==false){
            letter=parser.program[parser.pos++];
            if(parser.ifEnd(letter)){
                throw new ParseEnd('',parser.pos-1)
                return null;
            }
            switch(letter){
                
                case '(':
                    parseList(r,ListType.NORMAL);
                    
                    return ;
                    break;
                case ';':
                    parseAnno(r);
                    shiftEmpty();
                    break;
                default:
                    throw new ParseError('非法字符-270',parser.pos);
                    break;
            }
            //if(parser.end)break;
        }
        
        return r; 
    }
    function parseExp(pnode){
        let content='';
        
        let letter='';
        let r=new Exp();
        r.startPos=parser.pos;
        pnode.items.push(r);
        //parser.curNode=r;
        parseFunName(r);
        if(parser.end)throw new ParseError('缺少 )',parser.pos-1);
        if(r.funName!=null&&r.funName.value=='defun'){
            parseSym(r,'funNameDef');
            if(r.funNameDef==null){
                throw new ParseError('函数名不能为空',parser.pos)
            }
            parseParamDef(r);
            
        }
        letter=parser.program[parser.pos];
        if(parser.ifEnd(letter,r)){
            throw new ParseError('缺少闭合的括号',parser.pos);
        }
        switch(letter){
            case '\t':case '\r':case '\n':case ' ':case ';':case '(':
                parseAny(r);
                break;
            case ')':
                r.items=[];
                
                break;
            default:
                throw new ParseError('缺少结束括号--321',parser.pos);
                break;
        }
        
        shiftEmpty();
        letter=parser.program[parser.pos++];
        if(letter!=')'){
            throw new ParseError('这里应该有个 )',parser.pos-1);
        }
        if(parser.ifEnd(letter,r)){
            throw new ParseError('不应该运行到这里331',parser.pos-1);
        }
        if(parser.pos>=parser.cursorPos){
            
            throw new ParseEnd('ok',parser.pos,r)
        }
        //parser.curNode=pnode;
        return r; 
    }
    function parseList(pnode,type){
        let content='';     
        
        let r=new List();
        pnode.items.push(r);
        r.type=type;
        r.startPos=parser.pos;
        let letter=parser.program[parser.pos];
        if(parser.ifEnd(letter,r)){
            throw new ParseError('缺少闭合的 )',parser.pos);
        }
        switch(letter){
            
            case ')':
                r.items=[];
                return r;
                break;
            default:
                parseAny(r);
                break;
        }
        
        shiftEmpty();
        letter=parser.program[parser.pos++];
        if(letter!=')'){
            throw new ParseError('这里应该有个 )',parser.pos-1);
        }
        if(parser.ifEnd(letter,r)){
            throw new ParseError('不会执行到这里',parser.pos-1);
        }
        return r; 
    }
    function parseAnno(pnode){
        let content='';
        let br=false;
        let r=new Ann(null);
        pnode.items.push(r);
        r.startPos=parser.pos;
        let singleLine=true;
        let letter=parser.program[parser.pos];
        if(parser.ifEnd(letter,r)){
            //throw new ParseEnd();
            return null;
        }
        if(letter=='|'){
            singleLine=false;
            parser.pos++;
        }
        while(br==false){
            letter=parser.program[parser.pos++];
            if(parser.ifEnd(letter,r)){
                parser.pos--;
                break;
            }
            switch(letter){
                case '\n':case '\r':
                    if(singleLine){
                        br=true; 
                        parser.pos--;                   
                    }else{
                        content+=letter;
                    }
                    break;
                case '|':
                    if(parser.program[parser.pos]==';'&&!singleLine){
                        br=true;
                        parser.pos++;
                    }else{
                        content+=letter;
                    }
                    break;
                default:
                    content+=letter;
                    break;
            }
        }
        r.value=content;
        return r;
    }

    function parseStr(pnode,openLetter){
        let content='';
        
        let closeLetter=openLetter;
        let r=new Str();
        r.startPos=parser.pos;
        pnode.items.push(r);
        let br=false;
        while(br==false){
            let letter=parser.program[parser.pos++];
            if(parser.ifEnd(letter,r)){
                throw new ParseError('字符串缺少结束引号',parser.pos-1)
                break;
            }
            switch(letter){
                case closeLetter:
                    br=true;
                    break;
                case '\\':
                    let letter2=parser.program[parser.pos++]
                    if(parser.ifEnd(letter2,r)){
                        r.value=content;
                        throw new ParseError('非法字符--411',parser.pos-1)
                    }
                    content+=letter+letter2;
                    break;
                default:
                    content+=letter;
                    break;
            }
        }
        r.value=content;
        return r;
    }
    /* Type Defination */
    
    class Atom extends Node {
        constructor(value) {
            super(value)
        }
    }
    class Sym extends Node {
        constructor(value) {
            super(value)
        }
    }
    class NewLine extends Node {
        constructor(value) {
            super(value)
        }
    }
    class Ann extends Node {
        constructor(value) {
            super(value)
        }
    }
    class Literal extends Node {
        constructor(value) {
            super(value)
        }
    }
    class LineAnn extends Node {
        constructor(value) {
            super(value)
        }
    }
    class InlineAnn extends Node {
        constructor(value) {
            super(value)
        }
    }
    class Str extends Node {
        constructor(value) {
            super(value)
        }
    }
    class Exp extends Node {
        constructor(value) {
            super(value)
        }
    }
    class ParamDef extends Node {
        constructor(value) {
            super(value)
        }
    }
    class List extends Node {
        constructor(value) {
            super(value)
            this.items=[];
        }
    }
    class Procedure {
        constructor(parms, body, env) {
            this.parms = parms
            this.body = body
            this.env = env
        }
        execute(args) {
            return eval(this.body, new Env(this.parms, args, this.env))
        }
    }

    /* Environments */
    class Env {
        constructor(parms=[], args=[], outer=null) {
            this.e = new Object()
            this.init(parms, args)
            this.outer = outer
        }
        find(vari) {
            if ((! (vari in this.e)) && (! this.outer)) {
                throw new ReferenceError('variable ' + vari + ' is undefined.')
            }
            return vari in this.e ? this.e : this.outer.find(vari)
        }
        init(keys, values) {
            keys.forEach((key, index) => {
                this.e[key.value] = values[index]
            })
        }
        assign(subEnv) {
            Object.assign(this.e, subEnv)
        }
        add(key, value) {
            this.e[key] = value
        }
    }

    const baseEnv = {
            'abs': Math.abs,
            'max': Math.max,
            'min': Math.min,
            'pi': Math.PI,
            'round': Math.round,
            'floor': Math.floor,
            'ceil': Math.ceil,
            '+': (x, y) => x + y,
            '-': (x, y) => x - y,
            '*': (x, y) => x * y,
            '/': (x, y) => x / y,
            '>': (x, y) => x > y,
            '<': (x, y) => x < y,
            '>=': (x, y) => x >= y,
            '<=': (x, y) => x <= y,
            '=': (x, y) => x == y,
            'car': x => x[0],
            'cdr': x => x.slice(1),
            'cons': (x, y) => [x, ...y],
            'eq?': (x, y) => x === y,
            'equal?': (x, y) => x instanceof Sym ? x.value == y.value : x == y,
            'length': x => x.length,
            'list': function(...e){return e},
            'list?': x => x instanceof Array,
            'not': x => ! x,
            'null?': x => x instanceof Array && x.length == 0,
            'number?': x => x instanceof Number,
            'begin': function(){ return Array.prototype.slice(arguments, 1) },
    }
    const ArrangeMentType={
        LEFTRIGHT:0,
        TOPBOTTOM:1
    }
    // append, apply, equal?, list, map, procedure?, symbol?
    let global_env = new Env()
    global_env.assign(baseEnv)
    let annotation={};
    let string0={};
    let random=0;
    /* Abstraction Syntax Tree */
    function parse_(program) {
        let tokens=tokenize(program)
        let L=[];
        L.childrenCount=0
        while(tokens.length>0){
            let r=read_from_tokens(tokens)
            if(r===undefined||(!(r instanceof Array) &&r.value===undefined))break;
            L.push(r)
            if(typeof r.childrenCount=='undefined'){
                r.childrenCount=1
            }
            L.childrenCount+=r.childrenCount;
        }
        return L;
    }
    function getRandomToken(program){
        let m=parseInt(Math.random()*100000);
        while(program.indexOf(''+m)>=0){
            m=Math.random()*100000;
        }
        return ''+m;
    }

   
    function processAnnotation(program){
        random=getRandomToken(program);
        let i=0;
        let reg=/(\;\|[\s\S]*?\|\;)|(\;.*)/g;
        program=program.replace(reg,(match1,match2,match3, pos, originalText)=>{
            let key="a"+random+"_"+(i++)
            //program=program.replace(reg," "+key+' ')
            annotation[key]=match1;
            return " "+key+' ';
        })
        
        return program;
    }
    function processStr(program){
        
        let i=0;
        let random2=getRandomToken(program)
        program=program.replace(/\\\\/g,"s"+random2+"s");
        random=getRandomToken(program);
        let reg=/((?<!\\)\"[\s\S]*?(?<!\\)\")/g;
        program=program.replace(reg,(match1,match2,match3, pos, originalText)=>{
            let key="s"+random+"_"+(i++)
            //program=program.replace(reg," "+key+' ')
            let origin=match1.replace(new RegExp("s"+random2+"s","g"),'\\\\')
            string0[key]=origin;
            return " "+key+' ';
        })
        program=program.replace(new RegExp("s"+random2+"s","g"),'\\\\')
        return program;
    }
    function tokenize(program) {
        program=processAnnotation(program)
        program=processStr(program)
        program= program.replace(/(\'\(|\()/g, ' $1 ').replace(/\)/g, ' ) ');
        program=program.replace(/[\t ]*\n[\t ]*/g,' \n ')
        program=program.replace(/[\t ]{1,}/g,' ')
        return program.split(' ')
    }
    let TokenState={
        nul:0,
        str:1,
        esc:2,
        leftParentheses:3,
        rightParentheses:4,
        keyword:5,
        quote:6,
        startColon:7,
        startVerticalChar:8,
        endVerticalChar:9,
        endColon:10,
    }
    let ST={};//StateTransfer
    ST[TokenState.nul]={};
    ST[TokenState.nul][';']=TokenState.startColon;
    let regAnn=/^(\;\|[\s\S]*?\|\;)|(\;.*)/g;
    let regStr=/^\"[^"\\]*(?:\\.[^"\\]*)*\"/g;
    let regNewLine=/^[\t ]*\n[\t ]*/g
    let regSpace=/^[*\n]+/g
    function tokenize2(program){//带有更详细信息
        let tokens=[];
        let index=-1;
        let len=program.length;
        let curState=TokenState.nul;
        while(++index<len){
            switch(program[index]){
                case ";":
                    curState=TokenState.startColon;
                    break;
                
            }
        }
    }
    function read_from_tokens(tokens) {//只处理一个列表
        if (tokens.length === 0) {
            throw new Error('unexpected EOF while reading')
        }
        let token = tokens.shift()
        while (token === '') {
            token = tokens.shift()
        }
        if ('(' === token||"'("===token) {
            let L = []
            if('('===token){
                L.type='normal'
            }else{
                L.type='quote'
            }
            L.childrenCount=0
            while (tokens[0] === '') {
                tokens.shift()
            }
            while (tokens[0] !== ')') {
                let r=read_from_tokens(tokens)
                L.push(r)
                if(tokens.length==88){
                    console.log('aa')
                }
                
                if(typeof r.childrenCount=='undefined'){
                    r.childrenCount=1
                    
                }
                if(isNaN(r.childrenCount)){
                    console.log('aa'+r.childrenCount)
                }
                L.childrenCount+=r.childrenCount;
                while (tokens[0] === '') {
                    tokens.shift()
                }
            }
            tokens.shift()
            return L
        } else if (')' === token) {
            return new ParseError('unexpected )')
            ;;throw new Error('unexpected )')
        } else {
            return atom(token)
        }
    }
    function atom(token) {
        let temp = parseInt(token)
        if (isNaN(temp)) { 
            if(typeof annotation[token]!='undefined'){
                if(annotation[token].startsWith(';|')){
                    return new InlineAnn(annotation[token])
                }else {
                    return new LineAnn(annotation[token])
                }
                
            }else if(typeof string0[token]!='undefined'){                
                return new Str(string0[token])
            }else if(token==='\n'){
                return new NewLine('\n');
            }else{
                return new Sym(token)
            }
            
        } else if (token - temp === 0) {
            return new Literal( temp)
        } else {
            return new Literal(token)
        }
    }

    function format(program,formatType){ 
        let resultCode="";
        function reset(){
            MyString.lastString=null;
        }
        function getIndent(indent,arrangement){
            let r='';
            if(formatType==='all'){
                if(arrangement===ArrangeMentType.LEFTRIGHT){
                    if(MyString.lastString==null){
                        
                    }else{
                        r+=' ';
                    }
                    
                }else{
                    if(MyString.lastString==null){
                        
                    }else{
                        r+='\n'
                    }
                    
                    while(indent-->0){
                        r+='\t'
                    }
                }
            }else{
                if(MyString.lastString!=null&&MyString.lastString.endsWith('\n')){
                    //r+='\n'
                    while(indent-->0){
                        r+='\t'
                    }
                }else if(MyString.lastString==null){
                    r+='';
                }else{
                    r+=' '
                }
                
            }
            return r;
        }
        function printList(list,indent,arrangement){
            let result=new MyString();
            //indent=indent+1;
            if(!(list instanceof Array)){
                result.append(print(list,indent,arrangement))
                return result;
            }
            result.append(getIndent(indent,arrangement));
            if(list.length==0){
                result.append('()')
                return result;
            } 
            if(list.type==='normal'){
                result.append('(');
            }else{
                result.append("'(")
            }
            
            let childArrangement=ArrangeMentType.LEFTRIGHT;
            if(list.childrenCount>6){
                childArrangement=ArrangeMentType.TOPBOTTOM;
            }else {
                childArrangement=ArrangeMentType.LEFTRIGHT;
            }
            
            //result+=getIndent(indent,arrangement)
            for(let i=0;i<list.length;i++){
                if(i==0){                    
                    if(list[0] instanceof Array){
                        result.append(printList(list[0],indent+1,childArrangement) )
                    }else{
                        result.append(list[0].value)
                    }
                    
                }else{
                    if(typeof list[0].value!='undefined'){
                        switch(list[0].value){
                            case 'setq':
                                result.append(printSetq(i,list[i],indent+1,childArrangement))
                                break;
                            case 'defun':
                                result.append(printDefun(i,list[i],indent+1,childArrangement))
                                break;
                            default:
                                result.append(printList(list[i],indent+1,childArrangement))
                        }
                        
                    }else{
                        result.append(printList(list[i],indent+1,childArrangement))
                    }                    
                }                
            }
            if(childArrangement==ArrangeMentType.LEFTRIGHT){
                result.append(')');
            }else{
                result.append(getIndent(indent,childArrangement));
                result.append(')');
            }
            
            return result;
        }
        function print(p,indent,arrangement){
            let result=new MyString();
            if(p instanceof Array){
                result.append(printList(p,indent,arrangement))
            }else if(p instanceof LineAnn){
                //result.append(p.value+'\r\n');
                result.append(p.value);
            }else if(p instanceof InlineAnn){
                result.append(" "+p.value);
            }else if(p instanceof NewLine){
                if(formatType=='indent'){
                    result.append(p.value);
                }
                
            }else{

                result.append(getIndent(indent,arrangement)+p.value);
            }
            return result;
        }

        function printSetq(i,p,indent,arrangement){
            let code=new MyString();
            if(i%2==0){
                code.append(printList(p,indent,0))
            }else{
                code.append(printList(p,indent,arrangement))
            }
            return code;
        }

        function printDefun(i,p,indent,arrangement){
            let code=new MyString();
            if(i===1){
                code.append(printList(p,indent,0))
            }else{
                code.append(printList(p,indent,arrangement))
            }
            return code;
        }
        reset();
        let ast=parse(program);
        
        for(let i=0;i<ast.length;i++){
            //resultCode+=printList(ast[i],0,0)+'\r\n'
            resultCode+=printList(ast[i],0,0);
        }
        return resultCode;
    }
    function lint(program){
        let ast=parse(program);
    }
    /* Eval */
    function eval(x, env=global_env) {
        if (x instanceof Sym) {
            return env.find(x.value)[x.value]
        } else if (! (x instanceof Array)) {
            return x
        } else if (x[0].value == 'if') {
            let [sym, test, conseq, alt] = x
            let exp = (eval(test, env) ? conseq : alt)
            return eval(exp, env)
        } else if (x[0].value == 'define') {
            let [vari, exp] = x.slice(1)
            env.add(vari.value, eval(exp, env))
        } else if (x[0].value == 'lambda') {
            let [parms, body] = x.slice(1)
            return new Procedure(parms, body, env)
        } else if (x[0].value == 'quote') {
            let [sym, exp] = x
            return exp
        } else {
            let proc = eval(x[0], env)
            let args = []
            x.slice(1).forEach(function(arg) {
                args.push(eval(arg, env))
            })
            if (proc instanceof Procedure) {
                return proc.execute.call(proc, args)
            }
            return proc.apply(this, args)
        }
    }

   /* process.stdin.setEncoding( 'utf8' );
    process.stdin.on( 'readable', function() {
        var chunk = process.stdin.read();
        if (chunk) {
            try {
                console.log(eval(parse(chunk)))
            } catch(err) {
                console.log(err.message)
            }
        }
        console.log('lispy>')
    } );*/

module.exports={parseForSignature:parseForSignature,parse:parse,ann:annotation,format:format,Exp:Exp,Ann:Ann};
//export {"parse":parse};
