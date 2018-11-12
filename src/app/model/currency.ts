export class Currency {
    code: string;
    description: string;

    constructor(values: Object = {}) {
        (<any>Object).assign(this, values);
    }
}
