'use strict';

import {SignatureHelpProvider as ISignatureHelpProvider, SignatureHelp, SignatureInformation, TextDocument, Position, CancellationToken} from 'vscode';

export default class SignatureHelpProvider implements ISignatureHelpProvider
{
    protected item = <SignatureHelp> 
    {
        id: "workspace_AutoRetreat_Add",
        name: "AutoRetreat_Add",
        filepath: "e:\\coh2_mods\\generic\\scar\\lib\\autoretreat.scar",
        activeParameter: 0,
        activeSignature: 0,
        signatures: <SignatureInformation[]>
        [
            {
                label: "AutoRetreat_Add(squad, retreatLocation, retreatCondition, retreatThreshold, autoDelete, autoDeleteDistance, encounter, callback, removeAfterRetreat)",
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
                    },
                    {
                        label: "autoDelete"
                    },
                    {
                        label: "autoDeleteDistance"
                    },
                    {
                        label: "encounter"
                    },
                    {
                        label: "callback"
                    },
                    {
                        label: "removeAfterRetreat"
                    }
                ]
            }
        ],
        parameterCount: 9,
        lastParameterIsList: false
    };

    constructor()
    {

    }

    public provideSignatureHelp(document: TextDocument, position: Position, token: CancellationToken): SignatureHelp
    {
        return this.item;
    }
}