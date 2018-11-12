export class ItineraryStep {
    id: number;
    city: string;
    date: string;
    description: string;
    itineraryId: number;
    lat: number;
    lng: number;
    type: string;
    position: number;

    constructor(values: Object = {}) {
        (<any>Object).assign(this, values);
    }
}
