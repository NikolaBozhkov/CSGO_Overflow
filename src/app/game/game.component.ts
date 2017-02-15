import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { NotificationsService } from 'angular2-notifications';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

import { UserService } from '../user/user.service';
import { GameService } from '../game/game.service';
import { IoService } from '../io/io.service';

import { User } from '../user/user.model';

import * as util from '../util/util';

@Component({
    selector: 'game',
    templateUrl: './game.component.html',
    providers: [GameService]
})

export class GameComponent implements OnInit, OnDestroy {
    @ViewChild('duelInfo') duelInfoModal: ModalComponent;
    private util: any;
    private attackAmount = 0;
    private minAttackAmount = 10;
    private updateUsersInterval: any;
    private loadedUsers = false;
    private viewUsers: User[] = [];
    private users: User[] = [];

    // Users info
    private duelOutcome: string;
    private oldUser: User;
    private user: User;
    private attackedUser: User;

    // Level system
    private gainedExp: number;
    private gainedExpPercent = 0;
    private oldExpPercent = 0;
    private userLevel = 0;

    // Conditions
    private isTransitionDisabled = false;
    private runLevelUp = false;
    private rematchDisabled = false;

    // Sortings
    private activeSort = { property: '', order: 0 };

    // Filters
    private levelFilterGap = 5;
    private levelFilterActive = false;
    private dropsFilterFrom = 0;
    private dropsFilterTo = Number.MAX_VALUE;
    private dropsFilterActive = false;

    constructor(private userService: UserService, private gameService: GameService, private notificationsService: NotificationsService, private ioService: IoService) {}

    ngOnInit() {
        this.util = util;
        if (this.userService.isUserLoggedIn()) {
            this.userService.getUser()
                .then(user => this.user = new User(user));
        }

        this.ioService.socket.on('attacked', (data) => {
            this.user = new User(data.user);
            this.findAndUpdateUser(data.user);
            this.findAndUpdateUser(data.attacker);
        });

        // Every 3 seconds update the users and viewUsers
        this.updateUsersData(this);
        this.updateUsersInterval = setInterval(() => { this.updateUsersData(this) }, 3000);

        // Reset animated gained exp bar
        this.duelInfoModal.onDismiss.subscribe(() => { this.gainedExpPercent = 0 });
    }

    attackUser(user: User) {
        if (!this.isValidAttack(user)) return;

        // Temporary auto adjust, before toggle is implemented
        if (this.attackAmount > user.activeCurrency / 2) {
            this.attackAmount = Math.floor(user.activeCurrency / 2);
            this.notificationsService.info('Amount Adjusted', "Attack amount set to 50%("+ this.attackAmount +") of target's drops");
        }

        // Get user before exp or lvl added
        this.gameService.attackUser(user, this.attackAmount)
            .then((data) => {
                // Remove lvl up styles
                this.runLevelUp = false;

                // Set up modal with duel info
                this.duelOutcome = data.won ? 'won' : 'lost';

                // Init users with custom methods
                this.oldUser = new User(this.user);
                this.user = new User(data.attacker);
                this.attackedUser = data.attacked;

                // Get gained exp and info before attack
                this.gainedExp = data.expGained;
                this.oldExpPercent = this.oldUser.getExperiencePercent();
                this.userLevel = this.oldUser.level;

                // Don't open modal if opened already
                if (!this.duelInfoModal.visible) {
                    this.duelInfoModal.open();
                }

                this.animateLevelView();

                // Update user and attacked user
                this.userService.updateUser(data.attacker);
                this.findAndUpdateUser(data.attacker);
                this.findAndUpdateUser(data.attacked);
            });
    }

    findAndUpdateUser(user: User) {
        var indexView = this.viewUsers.findIndex(target => target.id === user.id);
        var indexSolid = this.users.findIndex(target => target.id === user.id);
        if (indexView !== -1) {
            this.viewUsers[indexView] = user;
        }

        if (indexSolid !== -1) {
            this.users[indexSolid] = user;
        }
    }

    rematch() {
        if (!this.rematchDisabled) {
            // Prepare exp bar for new fight
            this.oldExpPercent = this.user.getExperiencePercent();
            this.gainedExpPercent = 0;
            this.attackUser(this.attackedUser);

            // Disable rematch to prevent overflood of queries
            this.rematchDisabled = true;
            setTimeout(() => { this.rematchDisabled = false }, 75);
        }
    }

    changeAttackAmount(value: number, func: string) {
        if (func === '*') {
            this.attackAmount *= value;
        } else if (func === '/') {
            this.attackAmount /= value;
        } else if (func === '+') {
            this.attackAmount += value;
        } else if (func === '-') {
            this.attackAmount -= value;
        }

        if (this.attackAmount < this.minAttackAmount) {
            this.attackAmount = this.minAttackAmount;
        }
    }

    // Notify user for different errors
    isValidAttack(user: User) {
        this.attackAmount = Math.round(this.attackAmount);
        if (!this.userService.isUserLoggedIn()) {
            this.notificationsService.alert('Log in', 'You must be logged in to attack');
            return false;
        }

        if (this.attackAmount > this.user.activeCurrency) {
            this.notificationsService.alert('Invalid Amount', 'Amount cannot exceed active currency');
            return false;
        }

        // TODO: Add toggle for auto adjust
        // if (this.attackAmount > user.activeCurrency / 2) {
        //     this.notificationsService.alert('Invalid Amount', "Cannot attack for more than 50% of user's drops");
        //     return false;
        // }

        if (this.attackAmount == 0) {
            this.notificationsService.info('Specify Amount', 'Trying to attack for 0 drops');
            return false;
        }

        if (this.attackAmount < 10) {
            this.notificationsService.alert('Invalid amount', "Minumum attack amount is 10 drops");
            return false;
        }

        if (user.activeCurrency < 20) {
            this.notificationsService.alert('Sneaky', "The player must have minimum 20 drops to be attacked");
            return false;
        }

        return true;
    }

    // Sorting methods
    sortUsers(property: string, desc: boolean = false) {
        var order = desc ? -1 : 1;
        if (this.isSortActive(property, order)) {
            this.activeSort.property = ''; // Disable active sort if clicked again on same sort
            return;
        }

        this.activeSort.property = property;
        this.activeSort.order = order;
        this.viewUsers.sort(util.dynamicSort(property, order));
    }

    isSortActive(prop: string, order: number) {
        return this.activeSort.property === prop && this.activeSort.order === order;
    }

    // Filtering methods
    levelFilter(user: User): boolean {
        if (!this.user) return true;
        return this.user.level - this.levelFilterGap <= user.level && user.level <= this.user.level + this.levelFilterGap;
    }

    dropsFilter(user: User): boolean {
        return this.dropsFilterFrom <= user.activeCurrency && user.activeCurrency <= this.dropsFilterTo;
    }

    toggleFilterLevel() {
        this.levelFilterActive = !this.levelFilterActive;
        if (this.userService.isUserLoggedIn()) this.updateViewUsers();
    }

    toggleLevelFilterGap() {
        // Increment the level gap from 5 to 10
        this.levelFilterGap = this.levelFilterGap == 10 ? 5 : this.levelFilterGap + 1;

        if (this.levelFilterActive && this.userService.isUserLoggedIn()) {
            this.updateViewUsers();
        }
    }

    filterDrops() {
        // Check and fix to valid values
        this.dropsFilterFrom = Math.round(this.dropsFilterFrom);
        this.dropsFilterTo = Math.round(this.dropsFilterTo);
        if (this.dropsFilterTo <= this.dropsFilterFrom) {
            this.dropsFilterTo = Number.MAX_VALUE;
        }

        // Check if filter is active
        if (this.dropsFilterFrom > 0 || this.dropsFilterTo !== Number.MAX_VALUE) {
            this.dropsFilterActive = true;
        } else {
            this.dropsFilterActive = false;
        }

        this.updateViewUsers();
    }

    filterAllActive(): User[] {
        // Filter against every active filter
        return this.users.filter((user) => {
            var lvlPassed = this.levelFilterActive ? this.levelFilter(user) : true;
            var dropsPassed = this.dropsFilterActive ? this.dropsFilter(user) : true;

            return lvlPassed && dropsPassed;
        });
    }

    // Update methods
    updateViewUsers() {
        if (!this.levelFilterActive && !this.dropsFilterActive) {
            this.viewUsers = this.users.slice();
        } else {
            this.viewUsers = this.filterAllActive();
        }

        // Apply active sort option(if any) to new data
        if (this.activeSort.property !== '') {
            this.viewUsers.sort(util.dynamicSort(this.activeSort.property, this.activeSort.order));
        }

        this.loadedUsers = true;
    }

    updateUsersData(self: GameComponent) {
        self.userService.getActiveUsers()
            .then((users) => {
                self.users = users;
                self.updateViewUsers();
            });
    }

    // Animation and presentation methods
    animateLevelView() {
        // Duration of bar animation
        var timeoutTime = 600;

        setTimeout(() => {
            // Animate gained exp bar
            if (this.oldUser.level < this.user.level) {
                this.gainedExpPercent = 100 - this.oldUser.getExperiencePercent();

                // After gained exp bar animation, reset exp bar
                setTimeout(() => {
                    this.userLevel = this.user.level;

                    this.disableTransitionForDuration(100); // skip transition for reset
                    this.oldExpPercent = 0;
                    this.gainedExpPercent = 0;

                    this.runLevelUp = true;

                    // Animate new lvl gained exp bar
                    setTimeout(() => {
                        this.gainedExpPercent = this.user.getExperiencePercent();
                    }, 300)

                }, timeoutTime);
            } else {
                this.gainedExpPercent = this.user.getExpAsPercentOfDifference(this.gainedExp);
            }
        }, timeoutTime);
    }

    disableTransitionForDuration(duration: number) {
        this.isTransitionDisabled = true;
        setTimeout(() => {
            this.isTransitionDisabled = false;
        }, duration);
    }

    ngOnDestroy() {
        clearInterval(this.updateUsersInterval);
    }
}
