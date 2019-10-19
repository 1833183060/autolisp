'use strict';
const lispParser3=require('./lispParser3')
Object.defineProperty(exports, "__esModule", { value: true });
class SignatureHelpProvider {
    constructor() {
        this.item = {
            id: "workspace_AutoRetreat_Add",
            name: "AutoRetreat_Add",
            filepath: "e:\\coh2_mods\\generic\\scar\\lib\\autoretreat.scar",
            activeParameter:1,
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
                        },
                        {
                            label: "retreatCondition"
                        },
                        {
                            label: "retreatThreshold"
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
        return genItem(t,position)
    }
}

function genItem(program,pos){
    let a=0;
    program+=String.fromCharCode(0);
    let ast=lispParser3.parse(program)
    console.log(ast.value)
}
exports.SignatureHelpProvider = SignatureHelpProvider;
//# sourceMappingURL=signatureHelper.js.map