//已被lispParser2.lsp代替 （niaoge 2019-08-23）
//

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
        }
    }
    class LineAnn extends Meta {
        constructor(value) {
            super(value)
        }
    }
    class InlineAnn extends Meta {
        constructor(value) {
            super(value)
        }
    }
    class Str extends Meta {
        constructor(value) {
            super(value)
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
        function getIndent(indent,arrangement){
            let r='';
            if(formatType==='all'){
                if(arrangement===0){
                    r+=' ';
                }else{
                    r+='\n'
                    while(indent-->0){
                        r+='\t'
                    }
                }
            }else{
                if(typeof MyString.lastString!='undefined'&&MyString.lastString.endsWith('\n')){
                    //r+='\n'
                    while(indent-->0){
                        r+='\t'
                    }
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
            
            let childArrangement=0;
            if(list.childrenCount>6){
                childArrangement=1;
            }else {
                childArrangement=0;
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
            if(childArrangement==0){
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

module.exports={parse:parse,ann:annotation,format:format};
//export {"parse":parse};
