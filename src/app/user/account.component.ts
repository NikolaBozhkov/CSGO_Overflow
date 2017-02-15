import { Component, OnInit } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';

import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

@Component({
    selector: 'account',
    templateUrl: './account.component.html'
})

export class AccountComponent implements OnInit {
    private user: User;
    private transferAmount = 0;

    constructor(private userService: UserService, private notificationsService: NotificationsService) { }

    ngOnInit() {
        this.userService.getUser()
            .then(user => this.user = new User(user));
    }

    saveTradeUrl(tradeUrl: string) {
        this.userService.putSaveTradeUrl(tradeUrl)
            .then(() => {
                this.notificationsService.success('Success', 'Steam trade URL saved');
                this.user.tradeUrl = tradeUrl;
                this.userService.updateUser(this.user);
            });
    }

    saveTradeUrlFromEnter(event) {
        if (event.keyCode == 13) {
            event.target.blur();
        }
    }

    transferCurrency(toActive: boolean) {
        this.transferAmount = Math.round(this.transferAmount);

        if ((toActive && this.transferAmount <= this.user.staticCurrency  && this.transferAmount > 0)
        || (!toActive && this.transferAmount <= this.user.activeCurrency  && this.transferAmount > 0)) {
            this.userService.putTransferAmount(this.transferAmount, toActive)
                .then((user) => {
                    this.userService.updateUser(user);
                    this.user = new User(user);
                });
        } else if (toActive && this.transferAmount > this.user.staticCurrency) {
            this.notificationsService.alert('Invalid Amount', 'Specified amount cannot exceed static currency');
        } else {
            this.notificationsService.alert('Invalid Amount', 'Specified amount cannot exceed active currency');
        }
    }
}
