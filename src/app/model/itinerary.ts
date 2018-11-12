import { User } from './user';

export class Itinerary {
    id: number;
    name: string;
    country: string;
    description: string;
    users: Array<User>;
    nbStep: number;
    stepLat: number;
    stepLng: number;
    online: boolean;
    likes: number;

    constructor(values: Object = {}) {
        this.users = new Array<User>();
        (<any>Object).assign(this, values);
    }
}
