import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { environment } from '../../environments/environment';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';

@Injectable()
export class UserService {
    serviceUrl: string;

    constructor(private http: Http) {
        this.serviceUrl = environment.apiUrl;
    }

    isSignedin(): boolean {
        const c = JSON.parse(localStorage.getItem('current_user'));
        return c !== '' && c != null;
    }

    getCurrentUser(): User {
        const c = localStorage.getItem('current_user');
        return JSON.parse(c);
    }

    getAll(search: string): Observable<Array<User>> {
        return this.http
            .get(this.serviceUrl + '/users/' + btoa(search))
            .map(this.extractData);
    }

    setCurrentUser(user: User) {
        localStorage.setItem('current_user', JSON.stringify(user));
    }

    addInItinerary(userId: number, itineraryId: number): Observable<any> {
        return this.http
            .post(this.serviceUrl + '/users/addInItinerary', {
                userId: userId,
                itineraryId: itineraryId
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    removeFromItinerary(userId: number, itineraryId: number): Observable<any> {
        return this.http
            .delete(this.serviceUrl + '/users/removeFromItinerary/' + userId + '/' + itineraryId)
            .map(this.extractData)
            .catch(this.handleError);
    }

    signup(user: User): Observable<number> {
        return this.http
            .post(this.serviceUrl + '/users', {
                name: btoa(user.name),
                email: btoa(user.email),
                password: btoa(user.password)
            })
            .map(this.extractData)
            .catch(this.handleError);
    }

    signin(emailOrPseudo: string, password: string): Observable<User> {
        return this.http
            .get(this.serviceUrl + '/users/' + btoa(emailOrPseudo) + '/' + btoa(password))
            .map(this.extractData);
    }

    signout(user: User, callback: any): UserService {
        localStorage.setItem('current_user', null);

        callback();

        return this;
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
}
