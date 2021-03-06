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

    /* Error Defination */
    class ReferenceError extends Error {
        constructor(message) {
            super('Reference Error: ' + message)
        }
    }

    class ParseError{
        constructor(v){
            this.message=v;
        }
    }
    /* Type Defination */
    class Meta {
        constructor(value) {
            this.value = value
        }
    }
    class Sym extends Meta {
        constructor(value) {
            super(value)
            this.strLength=value.length;
        }
    }
    class NewLine extends Meta {
        constructor(value) {
            super(value)
        }
    }
    class Ann extends Meta {
        constructor(value) {
            super(value)
        }
    }
    class Literal extends Meta {
        constructor(value) {
            super(value)
            this.strLength=value.length;
        }
    }
    class LineAnn extends Meta {
        constructor(value) {
            super(value)
            this.strLength=value.length;
        }
    }
    class InlineAnn extends Meta {
        constructor(value) {
            super(value)
            this.strLength=value.length;
        }
    }
    class Str extends Meta {
        constructor(value) {
            super(value)
            this.strLength=value.length;
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
    function parse(program) {
        let tokens=tokenize(program)
        let L=[];
        L.childrenCount=0;//
        L.strLength=0;
        while(tokens.length>0){
            let r=read_from_tokens(tokens)
            if(r===undefined||(!(r instanceof Array) &&r.value===undefined))break;
            L.push(r)
            if(typeof r.childrenCount=='undefined'){
                r.childrenCount=1
            }
            L.childrenCount+=r.childrenCount;

            if(typeof r.strLength=='undefined'){
                r.strLength=1
            }
            L.strLength+=r.strLength;
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
        program=program.replace(/\r\n/g,'\n')
        program=program.replace(/\r/g,'\n')
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
        if(typeof token=='undefined'){//解析结束
            return new Sym('');
        }
        if ('(' === token||"'("===token) {
            let L = []
            if('('===token){
                L.type='normal'
            }else{
                L.type='quote'
            }
            L.childrenCount=0
            L.strLength=1;
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
                if(typeof r.strLength=='undefined'){
                    r.strLength=1                    
                }
                if(isNaN(r.childrenCount)){
                    console.log('aa'+r.childrenCount)
                }
                if(isNaN(r.strLength)){
                    console.log('bb'+r.strLength)
                }
                L.childrenCount+=r.childrenCount;
                L.strLength+=r.strLength+1;
                while (tokens[0] === '') {
                    tokens.shift()
                }
            }
            tokens.shift()
            L.strLength++;//')'
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
            let anno=annotation[token]
            if(typeof anno!='undefined'){
                if(anno.startsWith(';|')){
                    return new InlineAnn(anno)
                }else {
                    return new LineAnn(anno)
                }
                
            }else if(typeof string0[token]!='undefined'){                
                return new Str(string0[token])
            }else if(token==='\n'){
                return new NewLine('\n');
            }else{
                return new Sym(token)
            }
            
        } else if (token - temp === 0) {
            //return new Literal( temp)
            return new Literal(token)
        } else {
            return new Literal(token)
        }
    }

    function format(program,formatType,maxLineLength){ 
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
            if(/*list.childrenCount>6*/list.strLength>maxLineLength){
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
                }else{
                    //result.append(p.value);
                }
                
            }else{

                result.append(getIndent(indent,arrangement)+p.value);
            }
            return result;
        }

        function printSetq(i,p,indent,arrangement){
            let code=new MyString();
            if(i%2==0){
                code.append(printList(p,indent,ArrangeMentType.LEFTRIGHT))
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
            if(formatType=='all'&&!(ast[i] instanceof NewLine)){
                resultCode+='\n';
            }
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

module.exports={parse:parse,ann:annotation,format:format};
//export {"parse":parse};
