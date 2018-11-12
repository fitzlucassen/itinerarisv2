export class User {
    id: number;
    name: string;
    email: string;
    password: string;
    date: string;

    constructor(values: Object = {}) {
        (<any>Object).assign(this, values);
    }
}
