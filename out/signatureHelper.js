'use strict';
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
        return this.item;
    }
}
exports.SignatureHelpProvider = SignatureHelpProvider;
//# sourceMappingURL=signatureHelper.js.map