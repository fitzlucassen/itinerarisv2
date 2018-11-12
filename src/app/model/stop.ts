export class Stop {
    id: number;
    city: string;
    date: string;
    description: string;
    itineraryId: number;
    lat: number;
    lng: number;
    position: number;

    constructor(values: Object = {}) {
        (<any>Object).assign(this, values);
    }
}
