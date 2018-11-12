import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { Itinerary } from '../model/Itinerary';
import { ItineraryStep } from '../model/itinerary-step';
import { environment } from '../../environments/environment';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Picture } from '../model/picture';
import { Stop } from '../model/stop';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class ItineraryService {
    serviceUrl: string;

    constructor(private http: Http) {
        this.serviceUrl = environment.apiUrl;
    }

    /********************/
    /* CRUD Itineraries */
    /********************/
    create(itinerary: Itinerary): Observable<number> {
        return this.http
            .post(this.serviceUrl + '/itineraries', {
                name: itinerary.name,
                country: itinerary.country,
                description: itinerary.description,
                userId: itinerary.users[0].id,
                online: itinerary.online ? 1 : 0
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    update(itinerary: Itinerary): Observable<any> {
        return this.http
            .put(this.serviceUrl + '/itineraries/' + itinerary.id, {
                name: itinerary.name,
                country: itinerary.country,
                description: itinerary.description,
                online: itinerary.online ? 1 : 0,
                likes: itinerary.likes
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    delete(id: number): Observable<any> {
        return this.http
            .delete(this.serviceUrl + '/itineraries/' + id, {
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getUserItineraries(user: User): Observable<Array<Itinerary>> {
        return this.http
            .get(this.serviceUrl + '/itineraries/user/' + user.id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getItineraries(): Observable<Array<Itinerary>> {
        return this.http
            .get(this.serviceUrl + '/itineraries')
            .map(this.extractData)
            .catch(this.handleError);
    }

    getItineraryById(id: string): Observable<Itinerary> {
        return this.http
            .get(this.serviceUrl + '/itineraries/' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**************/
    /* CRUD steps */
    /**************/
    createStep(step: ItineraryStep): Observable<any> {
        return this.http
            .post(this.serviceUrl + '/steps', {
                city: step.city,
                date: typeof step.date == 'object' ? this.convertToString(step.date) : step.date.split('T')[0],
                description: step.description,
                itineraryId: step.itineraryId,
                lat: step.lat,
                lng: step.lng,
                type: step.type != null ? step.type : 'DRIVING'
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateSteps(steps: Array<ItineraryStep>): Observable<any> {
        return this.http
            .put(this.serviceUrl + '/steps/', { steps: steps })
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateStep(step: ItineraryStep): Observable<any> {
        return this.http
            .put(this.serviceUrl + '/steps/' + step.id, {
                city: step.city,
                date: typeof step.date == 'object' ? this.convertToString(step.date) : step.date.split('T')[0],
                description: step.description,
                lat: step.lat,
                lng: step.lng,
                type: step.type,
                position: step.position
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteStep(id: number): Observable<any> {
        return this.http
            .delete(this.serviceUrl + '/steps/' + id, {
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getItinerarySteps(itineraryId: number): Observable<Array<ItineraryStep>> {
        return this.http
            .get(this.serviceUrl + '/steps/itinerary/' + itineraryId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getItinerariesSteps(userId: number): Observable<Array<Array<ItineraryStep>>> {
        return this.http
            .get(this.serviceUrl + '/steps/user/' + userId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getStepById(id: string): Observable<ItineraryStep> {
        return this.http
            .get(this.serviceUrl + '/steps/' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    /**************/
    /* CRUD stops */
    /**************/
    getItineraryStops(itineraryId: number): Observable<Array<Stop>> {
        return this.http
            .get(this.serviceUrl + '/stops/itinerary/' + itineraryId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getItinerariesStops(userId: number): Observable<Array<Stop>> {
        return this.http
            .get(this.serviceUrl + '/stops/user/' + userId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getStopById(id: string): Observable<Stop> {
        return this.http
            .get(this.serviceUrl + '/stops/' + id)
            .map(this.extractData)
            .catch(this.handleError);
    }

    createStop(stop: Stop): Observable<any> {
        return this.http
            .post(this.serviceUrl + '/stops', {
                city: stop.city,
                date: typeof stop.date == 'object' ? this.convertToString(stop.date) : stop.date.split('T')[0],
                description: stop.description,
                itineraryId: stop.itineraryId,
                lat: stop.lat,
                lng: stop.lng,
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateStop(stop: Stop): Observable<any> {
        return this.http
            .put(this.serviceUrl + '/stops/' + stop.id, {
                city: stop.city,
                date: typeof stop.date == 'object' ? this.convertToString(stop.date) : stop.date.split('T')[0],
                description: stop.description,
                lat: stop.lat,
                lng: stop.lng,
                position: stop.position
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    updateStops(stops: Array<Stop>): Observable<any> {
        return this.http
            .put(this.serviceUrl + '/stops/', { stops: stops })
            .map(this.extractData)
            .catch(this.handleError);
    }

    deleteStop(id: number): Observable<any> {
        return this.http
            .delete(this.serviceUrl + '/stops/' + id, {
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    /***************/
    /* CRUD images */
    /***************/
    uploadImages(stepId: number, files: any): Promise<any> {
        if (stepId != null) {
            return this.makeFileRequest(this.serviceUrl + '/steps/' + stepId + '/images', [], files);
        }
        else {
            return this.makeFileRequest(this.serviceUrl + '/steps/images', [], files);
        }
    }

    uploadStopImages(stopId: number, files: any): Promise<any> {
        if (stopId != null) {
            return this.makeFileRequest(this.serviceUrl + '/stops/' + stopId + '/images', [], files);
        }
        else {
            return this.makeFileRequest(this.serviceUrl + '/stops/images', [], files);
        }
    }

    updateImages(images: Array<Picture>): Observable<Array<Picture>> {
        return this.http
            .put(this.serviceUrl + '/steps/images', { pictures: images })
            .map(this.extractData)
            .catch(this.handleError);
    }

    getStepPictures(stepId: number): Observable<Array<Picture>> {
        return this.http
            .get(this.serviceUrl + '/steps/' + stepId + '/images')
            .map(this.extractData)
            .catch(this.handleError);
    }

    getStopPictures(stopId: number): Observable<Array<Picture>> {
        return this.http
            .get(this.serviceUrl + '/stops/' + stopId + '/images')
            .map(this.extractData)
            .catch(this.handleError);
    }

    deletePicture(id: number): Observable<any> {
        return this.http
            .delete(this.serviceUrl + '/steps/images/' + id, {
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    /*******************************/
    /* Private utilities functions */
    /*******************************/
    private makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
        return new Promise((resolve, reject) => {
            const formData: any = new FormData();
            const xhr = new XMLHttpRequest();

            for (let i = 0; i < files.length; i++) {
                formData.append('uploads[]', files[i], files[i].name + '.jpg');
            }
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        resolve(JSON.parse(xhr.response));
                    } else {
                        reject(xhr.response);
                    }
                }
            };
            xhr.open('POST', url, true);
            xhr.send(formData);
        });
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
