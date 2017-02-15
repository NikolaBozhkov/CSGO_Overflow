import { Injectable, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { User } from '../user/user.model';

import 'rxjs/add/operator/toPromise';
import * as util from '../util/util';

@Injectable()
export class GameService {

    constructor(private http: Http) { }

    attackUser(user: User, amount: number) {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        let url = `${util.baseUrl}/attack/${user.id}`;

        let data = {
            amount: amount
        };

        return this.http.put(url, JSON.stringify(data), {headers: headers})
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
