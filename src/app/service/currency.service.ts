import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class CurrencyService {
    apiUrl = 'https://free.currencyconverterapi.com/api/v6/';
    accessToken = '9adfee9e7c28a72e8d6c';

    constructor(private http: Http) { }

    convert(currency: string) {
        const endpoint = 'convert';

        return this.http
            .get(this.apiUrl + endpoint + `?compact=ultra&q=${currency}_EUR&apiKey=${this.accessToken}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getAll() {
        const endpoint = 'currencies';

        return this.http
            .get(this.apiUrl + endpoint + `?apiKey=${this.accessToken}`)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response, index: number) {
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
