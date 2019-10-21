'use strict';
const lispParser3=require('./lispParser3')
Object.defineProperty(exports, "__esModule", { value: true });
class SignatureHelpProvider {
    constructor(snippetObj) {
        this.snippetObj=snippetObj;
        this.item = {
            id: "workspace_AutoRetreat_Add",
            name: "AutoRetreat_Add",
            filepath: "e:\\coh2_mods\\generic\\scar\\lib\\autoretreat.scar",
            activeParameter:2,
            activeSignature: 0,
            signatures: [
                {
                    label: "(AutoRetreat_Add squad retreatLocation retreatCondition retreatThreshold)",
                    documentation: "File: e:\\coh2_mods\\generic\\scar\\lib\\autoretreat.scar, line 82",
                    parameters: [
                        {
                            label: "squad"
                        },
                        {
                            label: "retreatLocation"
                        }
                    ]
                }
            ],
            parameterCount: 4,
            lastParameterIsList: false
        };
    }
    provideSignatureHelp(document, position, token) {
        //return this.item;
        let t=document.getText();
        let offset=document.offsetAt(position)
        return this.genItem(t,offset)
    }
    genItem(program,offset){
        let a=0;
        program+=String.fromCharCode(0);
        let ast=lispParser3.parseForSignature(program,offset)
        if(ast==null)return null;
        if(!(ast instanceof lispParser3.Exp))return null;
        try{
            this.item.signatures=[];
            if(ast.funName.value==null||ast.funName.value.length==0||ast.funName.value=='defun'){
                return null;
            }
            let funObj=this.snippetObj[ast.funName.value];
            let funBody=funObj.body;
            let params=funBody.replace('(','').replace(')','').split(' ');
            let signature={label:funBody,documentation:funObj.description}
            this.item.signatures.push(signature)
            signature.parameters=[];
            if(params!=null){
                for(let i=1;i<params.length;i++){
                    if(params[i].length>0){
                        signature.parameters.push({label:params[i]})
                    }
                }
            }
            let activeP=0;
            for(let ii=0;ii<ast.items.length;ii++){
                if(!(ast.items[ii] instanceof lispParser3.Ann)){
                    activeP++;
                    
                }
            }
            this.item.activeParameter=activeP;
            return this.item;
        }catch(ex){

        }
        console.log(ast.value)
        //return this.item
    }
}


exports.SignatureHelpProvider = SignatureHelpProvider;
//# sourceMappingURL=signatureHelper.js.map