
export interface QuerySignature {
    start: number;
    end: number;
}

export class QueryController<Q extends QuerySignature> {
    renderCallbacks: ((chart: any, query: Q) => void)[] = [];
    
    constructor() {

    }
}
