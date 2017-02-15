"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var angular2_notifications_1 = require('angular2-notifications');
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var user_service_1 = require('../user/user.service');
var game_service_1 = require('../game/game.service');
var user_model_1 = require('../user/user.model');
var util = require('../util/util');
var GameComponent = (function () {
    function GameComponent(userService, gameService, notificationsService) {
        this.userService = userService;
        this.gameService = gameService;
        this.notificationsService = notificationsService;
        this.attackAmount = 0;
        this.minAttackAmount = 10;
        this.loadedUsers = false;
        this.viewUsers = [];
        this.users = [];
        this.gainedExpPercent = 0;
        this.oldExpPercent = 0;
        this.userLevel = 0;
        // Conditions
        this.isTransitionDisabled = false;
        this.runLevelUp = false;
        this.rematchDisabled = false;
        // Sortings
        this.activeSort = { property: '', order: 0 };
        // Filters
        this.levelFilterGap = 5;
        this.levelFilterActive = false;
        this.dropsFilterFrom = 0;
        this.dropsFilterTo = Number.MAX_VALUE;
        this.dropsFilterActive = false;
    }
    GameComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.util = util;
        if (this.userService.isUserLoggedIn()) {
            this.userService.getUser()
                .then(function (user) { return _this.user = user; });
        }
        // Every 15 seconds update the users and viewUsers
        this.updateUsersData(this);
        this.updateUsersInterval = setInterval(function () { _this.updateUsersData(_this); }, 15000);
        // Reset animated gained exp bar
        this.duelInfoModal.onDismiss.subscribe(function () { _this.gainedExpPercent = 0; });
    };
    GameComponent.prototype.attackUser = function (user) {
        var _this = this;
        if (!this.isValidAttack(user))
            return;
        // Temporary auto adjust, before toggle is implemented
        if (this.attackAmount > user.activeCurrency / 2) {
            this.attackAmount = Math.floor(user.activeCurrency / 2);
            this.notificationsService.info('Amount Adjusted', "Attack amount set to 50%(" + this.attackAmount + ") of target's drops");
        }
        // Get user before exp or lvl added
        this.gameService.attackUser(user, this.attackAmount)
            .then(function (data) {
            // Remove lvl up styles
            _this.runLevelUp = false;
            // Set up modal with duel info
            _this.duelOutcome = data.won ? 'won' : 'lost';
            // Init users with custom methods
            _this.user = new user_model_1.User(data.attacker);
            _this.oldUser = new user_model_1.User(data.oldAttacker);
            _this.attackedUser = data.attacked;
            // Get gained exp and info before attack
            _this.gainedExp = data.expGained;
            _this.oldExpPercent = _this.oldUser.getExperiencePercent();
            _this.userLevel = _this.oldUser.level;
            // Don't open modal if opened already
            if (!_this.duelInfoModal.visible) {
                _this.duelInfoModal.open();
            }
            _this.animateLevelView();
            // Update user and attacked user
            _this.userService.updateUser(data.attacker);
            _this.findAndUpdateUser(data.attacker);
            _this.findAndUpdateUser(data.attacked);
        });
    };
    GameComponent.prototype.findAndUpdateUser = function (user) {
        var indexView = this.viewUsers.findIndex(function (target) { return target.id === user.id; });
        var indexSolid = this.users.findIndex(function (target) { return target.id === user.id; });
        if (indexView !== -1) {
            this.viewUsers[indexView] = user;
        }
        if (indexSolid !== -1) {
            this.users[indexSolid] = user;
        }
    };
    GameComponent.prototype.rematch = function () {
        var _this = this;
        if (!this.rematchDisabled) {
            // Prepare exp bar for new fight
            this.oldExpPercent = this.user.getExperiencePercent();
            this.gainedExpPercent = 0;
            this.attackUser(this.attackedUser);
            // Disable rematch to prevent overflood of queries
            this.rematchDisabled = true;
            setTimeout(function () { _this.rematchDisabled = false; }, 75);
        }
    };
    GameComponent.prototype.changeAttackAmount = function (value, func) {
        if (func === '*') {
            this.attackAmount *= value;
        }
        else if (func === '/') {
            this.attackAmount /= value;
        }
        else if (func === '+') {
            this.attackAmount += value;
        }
        else if (func === '-') {
            this.attackAmount -= value;
        }
        if (this.attackAmount < this.minAttackAmount) {
            this.attackAmount = this.minAttackAmount;
        }
    };
    // Notify user for different errors
    GameComponent.prototype.isValidAttack = function (user) {
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
        return true;
    };
    // Sorting methods
    GameComponent.prototype.sortUsers = function (property, desc) {
        if (desc === void 0) { desc = false; }
        var order = desc ? -1 : 1;
        if (this.isSortActive(property, order)) {
            this.activeSort.property = ''; // Disable active sort if clicked again on same sort
            return;
        }
        this.activeSort.property = property;
        this.activeSort.order = order;
        this.viewUsers.sort(util.dynamicSort(property, order));
    };
    GameComponent.prototype.isSortActive = function (prop, order) {
        return this.activeSort.property === prop && this.activeSort.order === order;
    };
    // Filtering methods
    GameComponent.prototype.levelFilter = function (user) {
        if (!this.user)
            return true;
        return this.user.level - this.levelFilterGap <= user.level && user.level <= this.user.level + this.levelFilterGap;
    };
    GameComponent.prototype.dropsFilter = function (user) {
        return this.dropsFilterFrom <= user.activeCurrency && user.activeCurrency <= this.dropsFilterTo;
    };
    GameComponent.prototype.toggleFilterLevel = function () {
        this.levelFilterActive = !this.levelFilterActive;
        if (this.userService.isUserLoggedIn())
            this.updateViewUsers();
    };
    GameComponent.prototype.toggleLevelFilterGap = function () {
        // Increment the level gap from 5 to 10
        this.levelFilterGap = this.levelFilterGap == 10 ? 5 : this.levelFilterGap + 1;
        if (this.levelFilterActive && this.userService.isUserLoggedIn()) {
            this.updateViewUsers();
        }
    };
    GameComponent.prototype.filterDrops = function () {
        // Check and fix to valid values
        this.dropsFilterFrom = Math.round(this.dropsFilterFrom);
        this.dropsFilterTo = Math.round(this.dropsFilterTo);
        if (this.dropsFilterTo <= this.dropsFilterFrom) {
            this.dropsFilterTo = Number.MAX_VALUE;
        }
        // Check if filter is active
        if (this.dropsFilterFrom > 0 || this.dropsFilterTo !== Number.MAX_VALUE) {
            this.dropsFilterActive = true;
        }
        else {
            this.dropsFilterActive = false;
        }
        this.updateViewUsers();
    };
    GameComponent.prototype.filterAllActive = function () {
        var _this = this;
        // Filter against every active filter
        return this.users.filter(function (user) {
            var lvlPassed = _this.levelFilterActive ? _this.levelFilter(user) : true;
            var dropsPassed = _this.dropsFilterActive ? _this.dropsFilter(user) : true;
            return lvlPassed && dropsPassed;
        });
    };
    // Update methods
    GameComponent.prototype.updateViewUsers = function () {
        if (!this.levelFilterActive && !this.dropsFilterActive) {
            this.viewUsers = this.users.slice();
        }
        else {
            this.viewUsers = this.filterAllActive();
        }
        // Apply active sort option(if any) to new data
        if (this.activeSort.property !== '') {
            this.viewUsers.sort(util.dynamicSort(this.activeSort.property, this.activeSort.order));
        }
        this.loadedUsers = true;
    };
    GameComponent.prototype.updateUsersData = function (self) {
        self.userService.getActiveUsers()
            .then(function (users) {
            self.users = users;
            self.updateViewUsers();
        });
    };
    // Animation and presentation methods
    GameComponent.prototype.animateLevelView = function () {
        var _this = this;
        // Duration of bar animation
        var timeoutTime = 600;
        setTimeout(function () {
            // Animate gained exp bar
            if (_this.oldUser.level < _this.user.level) {
                _this.gainedExpPercent = 100 - _this.oldUser.getExperiencePercent();
                // After gained exp bar animation, reset exp bar
                setTimeout(function () {
                    _this.userLevel = _this.user.level;
                    _this.disableTransitionForDuration(100); // skip transition for reset
                    _this.oldExpPercent = 0;
                    _this.gainedExpPercent = 0;
                    _this.runLevelUp = true;
                    // Animate new lvl gained exp bar
                    setTimeout(function () {
                        _this.gainedExpPercent = _this.user.getExperiencePercent();
                    }, 300);
                }, timeoutTime);
            }
            else {
                _this.gainedExpPercent = _this.user.getExpAsPercentOfDifference(_this.gainedExp);
            }
        }, timeoutTime);
    };
    GameComponent.prototype.disableTransitionForDuration = function (duration) {
        var _this = this;
        this.isTransitionDisabled = true;
        setTimeout(function () {
            _this.isTransitionDisabled = false;
        }, duration);
    };
    GameComponent.prototype.ngOnDestroy = function () {
        clearInterval(this.updateUsersInterval);
    };
    __decorate([
        core_1.ViewChild('duelInfo'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], GameComponent.prototype, "duelInfoModal", void 0);
    GameComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'game',
            templateUrl: 'game.component.html',
            providers: [game_service_1.GameService]
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService, game_service_1.GameService, angular2_notifications_1.NotificationsService])
    ], GameComponent);
    return GameComponent;
}());
exports.GameComponent = GameComponent;
//# sourceMappingURL=game.component.js.map