import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class MapsService {

    constructor(private http: Http) { }

    getCurrentPosition(): Observable<any> {
        return this.http.post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyDR6MQEKvMFKiYTS0uZZTA-YIKe2yRcfng', {})
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        const body = res.json();
        return body;
    }
    private handleError(error: Response | any) {
        let errMsg: string;
        if (error instanceof Response) {
            const body = error.json() || '';
            const err = body.message || JSON.stringify(body);
            errMsg = `${error.status} - ${err}`;
        } else {
            errMsg = error.message ? error.message : error.toString();
        }

        return Observable.throw(errMsg);
    }
}
