import { Injectable } from '@angular/core';

@Injectable()
export class StorageService {

    constructor() { }

    isStored(key: string, token: string): boolean {
        return localStorage.getItem(key + ':' + token) != null;
    }

    store(key: string, token: string) {
        localStorage.setItem(key + ':' + token, 'true');
    }

    erase(key: string, token: string) {
        localStorage.removeItem(key + ':' + token);
    }
}
