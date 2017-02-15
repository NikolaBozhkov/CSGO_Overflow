import { Component, OnInit } from '@angular/core';

import { UserService } from '../user/user.service';
import { User } from '../user/user.model';

import * as util from '../util/util';

@Component({
    selector: 'statistics',
    templateUrl: './statistics.component.html',
})

export class StatisticsComponent implements OnInit {
    private user: User;
    private util: any;
    constructor(private userService: UserService) {}

    ngOnInit() {
        this.userService.getUser()
            .then(user => this.user = new User(user));
        this.util = util;
    }

    getWins() {
        if (this.user.wins == 0) return 0;
        return this.user.wins / (this.user.wins + this.user.losses);
    }

    getWon() {
        if (this.user.wonAmount == 0) return 0;
        return this.user.wonAmount / (this.user.wonAmount + this.user.lostAmount);
    }

    getLosses() {
        if (this.user.losses == 0) return 0;
        return this.user.losses / (this.user.wins + this.user.losses);
    }

    getLost() {
        if (this.user.lostAmount == 0) return 0;
        return this.user.lostAmount / (this.user.wonAmount + this.user.lostAmount);
    }

    getReferralCurrency() {
        if (this.user.referralCurrency == 0) return 0;
        return this.user.referrals * 1000 / this.user.referralCurrency;
    }

    formatPercent(percent: number) {
        percent *= 100;
        return percent.toFixed(2);
    }
}
