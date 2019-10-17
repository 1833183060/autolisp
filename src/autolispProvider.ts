'use strinct';


// import { Parsefile } from "./lispParse";

// export class AutoLispProvider {

//     public context: Parsefile[];

//     /**
//      * @param context Extention context
//      */
//     constructor(context : Parsefile[]) {
//         this.context = context;
//     }

   
// }

import { functions } from "./util";

export class AutoLispProvider {
    public context: {[funcname:string]:functions};
    constructor(context: {[funcname:string]:functions}) {
        this.context = context;
    }
}
