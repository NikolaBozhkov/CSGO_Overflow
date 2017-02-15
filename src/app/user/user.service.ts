import { Injectable, EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { User } from '../user/user.model';

import 'rxjs/add/operator/toPromise';
import * as util from '../util/util';

@Injectable()
export class UserService {
    jsonHeaders = new Headers({
        'Content-Type': 'application/json'
    });

    private _user: User = null;
    private _returnCachedUser = false;
    userUpdated = new EventEmitter();

    constructor(private http: Http) { }

    isUserLoggedIn() {
        return !!Cookie.get('loggedIn');
    }

    logout() {
        this.sendPutRequest(util.baseUrl + '/putLogout', {})
            .then(res => { window.location.href = '#' });
    }

    getUsers(): Promise<User[]> {
        return this.http.get(util.baseUrl + '/getUsers')
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    getActiveUsers(): Promise<User[]> {
        return this.http.get(util.baseUrl + '/getActiveUsers')
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    getUser(): Promise<User> {
        if (this._returnCachedUser && this._user) {
            return new Promise((resolve, reject) => {
                resolve(this._user);
            });
        } else {
            var promise = this.http.get(util.baseUrl + '/getUser')
                              .toPromise()
                              .then(response => response.json())
                              .catch(this.handleError);

            this._returnCachedUser = true;
            setTimeout(() => { this._returnCachedUser = false }, 120 * 60000);
            promise.then(user => this._user = user);
            return promise;
        }
    }

    putSaveTradeUrl(tradeUrl: string): Promise<any> {
        return this.sendPutRequest(util.baseUrl + '/saveTradeUrl', { tradeUrl: tradeUrl });
    }

    putTransferAmount(amount: number, toActive: boolean) {
        var url = toActive ? '/transferToActive' : '/transferToStatic';
        return this.sendPutRequest(util.baseUrl + url, { amount: amount });
    }

    sendPutRequest(url, data): Promise<any> {
        return this.http.put(url, JSON.stringify(data), {headers: this.jsonHeaders})
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    updateUser(user) {
        this.userUpdated.emit(user);
        this._user = user;
    }

    // testPostback() {
    //     return this.http.get(util.baseUrl + '/adscend/1/test/1/76561198061679866/10000/77.85.56.196/38b1aeb60de8d52c2f39515e65a64d48')
    //             .toPromise()
    //             .then(response => response.json())
    //             .catch(this.handleError);
    // }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
