import { Injectable, OnInit } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Item } from './item.model';

import 'rxjs/add/operator/toPromise';

import * as util from '../util/util';

@Injectable()
export class ItemService {
    constructor(private http: Http) { }

    getItems(): Promise<Item[]> {
        return this.http.get(util.baseUrl + '/getItems')
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    checkoutItems(items: Item[]) {
        let headers = new Headers({
            'Content-Type': 'application/json'
        });

        let data = {
            items: items
        };

        return this.http.put(util.baseUrl + '/checkout', data, { headers: headers })
                   .toPromise()
                   .then(response => response.json())
                   .catch(this.handleError);
    }

    private handleError(error: any) {
        console.error('An error occurred', error);
        return Promise.reject(error.message || error);
    }
}
