import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { Router, Event, NavigationEnd } from '@angular/router';

import { NotificationsService } from 'angular2-notifications';
import { UserService } from '../user/user.service';
import { IoService } from '../io/io.service';

import { Cookie } from 'ng2-cookies/ng2-cookies';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { User } from '../user/user.model';
import { icons } from './icons';

import * as util from '../util/util';

declare let ga: Function;

@Component ({
    selector: 'my-app',
    templateUrl: './app.component.html'
})

export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('acceptanceModal') acceptanceModal: ModalComponent;
    public options = {
        timeOut: 5000,
        maxStack: 5,
        icons: {
            alert: icons.invalidAction,
            success: icons.success,
            error: icons.invalidAction,
            info: icons.info
        },
        preventLastDuplicates: 'visible'
    };

    private onlineUsers = 0;
    private util: any;
    private user: User;
    private deleteOldAnimationInterval: any;
    private animatedStaticChanges = [];
    private animatedActiveChanges = [];

    constructor (private userService: UserService, private ioService: IoService, private notificationsService: NotificationsService, private router: Router) {
        // Google analytics setup
        this.router.events.subscribe((event: Event) => {
            if (event instanceof NavigationEnd) {
                ga('send', 'pageview', event.urlAfterRedirects);
            }
        });
    }

    ngOnInit () {
        this.util = util;
        this.userService.userUpdated.subscribe(this.userUpdated.bind(this));
        this.ioService.socket.on('attacked', this.handleAttacked.bind(this));
        this.ioService.socket.on('onlineUsers', onlineUsers => this.onlineUsers = onlineUsers);
        this.ioService.socket.on('userConnected', () => this.onlineUsers += 1);
        this.ioService.socket.on('userDisconnected', () => this.onlineUsers -= 1);

        if (this.isUserLoggedIn()) {
            this.userService.getUser()
                .then(user => this.user = user);
        }

        // Clear dom elements to improve perfermance
        this.deleteOldAnimationInterval = setInterval(() => {
            this.animatedStaticChanges = [];
            this.animatedActiveChanges = [];
        }, 600000);
    }

    ngAfterViewInit() {
        if (!this.isUserLoggedIn()) {
            this.notificationsService.info('Log in', 'Log in through Steam to view full site', { timeOut: 15000 });
        }
    }

    handleAttacked(data) {
        if (data.won) {
            this.notificationsService.success('Successful Defense', 'You won ' + data.amount + ' drops!', {
                icons: { success: icons.wonAttack }
            });
        } else {
            this.notificationsService.error('Failed Defense', 'You lost ' + data.amount + ' drops!', {
                icons: { error: icons.lostAttack }
            });
        }

        if (data.user.level > this.user.level) {
            this.notificationsService.success('Level Up!', 'You have reached level ' + data.user.level + '!', {
                icons: { success: icons.leveledUp }
            });
        }

        this.userService.updateUser(data.user);
    }

    userUpdated(user) {
        var oldStatic = this.user.staticCurrency;
        var oldActive = this.user.activeCurrency;

        if (oldActive != user.activeCurrency) {
            this.createAnimatedChange(this.animatedActiveChanges, this.user.activeCurrency, user.activeCurrency, true);
        }
        if (oldStatic != user.staticCurrency) {
            this.createAnimatedChange(this.animatedStaticChanges, this.user.staticCurrency, user.staticCurrency, false);
        }

        this.user = user;
    }

    createAnimatedChange(collection: any[], oldAmount: number, newAmount: number, active: boolean) {
        let isNegative = newAmount - oldAmount < 0;
        let amountChange = util.formatNumber(newAmount - oldAmount);
        let change = {
            text: isNegative ? amountChange : '+' + amountChange,
            textClass: isNegative ? 'text-danger' : 'text-success'
        }

        collection.push(change);
    }

    isUserLoggedIn() {
        return this.userService.isUserLoggedIn();
    }

    setAcceptanceCookie() {
        Cookie.set('acceptedTerms', 'yes', 360);
    }

    checkAcceptanceCookie() {
        if (!Cookie.get('acceptedTerms')) {
            this.acceptanceModal.open();
        } else {
            window.location.href = 'auth/steam';
        }
    }

    // Unsubscribe to prevent memory leaks, although it's top tier component
    ngOnDestroy() {
        this.userService.userUpdated.unsubscribe();
        clearInterval(this.deleteOldAnimationInterval);
    }
}
