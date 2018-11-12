import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { environment } from '../../environments/environment';
import { StepDetail } from '../model/step-detail';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class ItineraryDetailService {
    serviceUrl: string;

    constructor(private http: Http) {
        this.serviceUrl = environment.apiUrl;
    }

    /********************/
    /* CRUD Itineraries */
    /********************/
    createStepDetail(stepDetail: StepDetail): Observable<number> {
        return this.http
            .post(this.serviceUrl + '/steps/details', {
                name: stepDetail.name,
                price: stepDetail.price,
                description: stepDetail.description,
                stepId: stepDetail.stepId,
                type: stepDetail.type
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateStepDetail(stepDetail: StepDetail): Observable<number> {
        return this.http
            .put(this.serviceUrl + '/steps/details/' + stepDetail.id, {
                name: stepDetail.name,
                price: stepDetail.price,
                description: stepDetail.description,
                type: stepDetail.type
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getStepDetails(id: string): Observable<Array<StepDetail>> {
        return this.http
            .get(this.serviceUrl + '/steps/details/step/' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    removeStepDetail(id: number): Observable<any> {
        return this.http
            .delete(this.serviceUrl + '/steps/details/' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        const body = res.json();
        return body.result;
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
    private convertToString(d: Date): string {
        return d.getFullYear() + '-' + this.completeNumberWithZero(d.getMonth() + 1) + '-' + this.completeNumberWithZero(d.getDate());
    }
    private completeNumberWithZero(number: number): string {
        if ((number + '').length == 1) {
            return '0' + number + '';
        }
        else {
            return '' + number;
        }
    }
}
