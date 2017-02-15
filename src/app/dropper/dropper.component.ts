import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { DropperService } from './dropper.service';
import { UserService } from '../user/user.service';
import { IoService } from '../io/io.service';
import { NotificationsService } from 'angular2-notifications';

import { User } from '../user/user.model';

@Component({
    selector: 'dropper',
    templateUrl: './dropper.component.html',
    providers: [DropperService]
})

export class DropperComponent implements OnInit {
    @ViewChild('popUnderModal') popUnderModal: ModalComponent;
    @ViewChild('disableAdBlock') disableAdBlockModal: ModalComponent;
    user: User;
    mobile = window.mobilecheck();
    adBlock = false;

    constructor(private elementRef: ElementRef, private dropperService: DropperService,
        private userSerivce: UserService, private notificationsService: NotificationsService, private ioService: IoService) {}

    ngOnInit() {
        if (this.userSerivce.isUserLoggedIn()) {
            this.userSerivce.getUser()
                .then(user => this.user = user);
        }

        //this.popUnderModal.onDismiss.subscribe(() => this.getDropsPopUnder());
    }

    loadPopUnder(url: string) {
        // this.userSerivce.testPostback()
        //     .then(res => console.log(res));
        // let scr = document.createElement('script');
        // scr.type = 'text/javascript';
        // scr.src = url;
        // this.elementRef.nativeElement.appendChild(scr);
        //
        // scr.onload = () => {
        //     this.popUnderModal.open();
        //     if (this.user) {
        //         this.ioService.socket.emit('adLoaded', this.user.id);
        //     }
        // }
        //
        // scr.onerror = () => {
        //     this.disableAdBlockModal.open();
        // }
    }

    getDropsPopUnder() {
        if (this.user && !this.mobile) {
            this.dropperService.getDropsPopUnder()
                .then(res => {
                    if (res.success == 1) {
                        this.user.staticCurrency += res.drops;
                        this.userSerivce.updateUser(new User(this.user));
                    } else {
                        this.notificationsService.error('Error', res.message || 'Failed to add drops!');
                    }
                });
        }
    }
}
