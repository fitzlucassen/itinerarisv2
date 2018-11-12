export class StepDetail {
    id: number;
    stepId: number;
    date: string;
    description: string;
    name: string;
    price: number;
    type: string;

    constructor(values: Object = {}) {
        (<any>Object).assign(this, values);
    }
}
