import { Injectable, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

@Injectable()
export class IoService {
    socket: any;

    constructor() {
        this.socket = io();
    }
}
