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
var router_1 = require('@angular/router');
var angular2_notifications_1 = require('angular2-notifications');
var user_service_1 = require('../user/user.service');
var io_service_1 = require('../io/io.service');
var icons_1 = require('./icons');
var util = require('../util/util');
var AppComponent = (function () {
    function AppComponent(userService, ioService, notificationsService, router) {
        this.userService = userService;
        this.ioService = ioService;
        this.notificationsService = notificationsService;
        this.router = router;
        this.options = {
            timeOut: 5000,
            icons: {
                alert: icons_1.icons.invalidAction,
                success: icons_1.icons.success,
                error: icons_1.icons.invalidAction,
                info: icons_1.icons.info
            },
            preventLastDuplicates: 'visible'
        };
        this.animatedStaticChanges = [];
        this.animatedActiveChanges = [];
        // Google analytics setup
        this.router.events.subscribe(function (event) {
            if (event instanceof router_1.NavigationEnd) {
                ga('send', 'pageview', event.urlAfterRedirects);
            }
        });
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.util = util;
        this.userService.userUpdated.subscribe(this.userUpdated.bind(this));
        this.ioService.socket.on('attacked', this.handleAttacked.bind(this));
        if (this.isUserLoggedIn()) {
            this.userService.getUser()
                .then(function (user) { return _this.user = user; });
        }
        // Clear dom elements to improve perfermance
        this.deleteOldAnimationInterval = setInterval(function () {
            _this.animatedStaticChanges = [];
            _this.animatedActiveChanges = [];
        }, 600000);
    };
    AppComponent.prototype.ngAfterViewInit = function () {
        if (!this.isUserLoggedIn()) {
            this.notificationsService.info('Log in', 'Log in through Steam to view full site', { timeOut: 15000 });
        }
    };
    AppComponent.prototype.handleAttacked = function (data) {
        if (data.won) {
            this.notificationsService.success('Successful Defense', 'You won ' + data.amount + ' drops!', {
                icons: { success: icons_1.icons.wonAttack }
            });
        }
        else {
            this.notificationsService.error('Failed Defense', 'You lost ' + data.amount + ' drops!', {
                icons: { error: icons_1.icons.lostAttack }
            });
        }
        if (data.user.level > this.user.level) {
            this.notificationsService.success('Level Up!', 'You have reached level ' + data.user.level + '!', {
                icons: { success: icons_1.icons.leveledUp }
            });
        }
        this.userService.updateUser(data.user);
    };
    AppComponent.prototype.userUpdated = function (user) {
        var oldStatic = this.user.staticCurrency;
        var oldActive = this.user.activeCurrency;
        if (oldActive != user.activeCurrency) {
            this.createAnimatedChange(this.animatedActiveChanges, this.user.activeCurrency, user.activeCurrency, true);
        }
        if (oldStatic != user.staticCurrency) {
            this.createAnimatedChange(this.animatedStaticChanges, this.user.staticCurrency, user.staticCurrency, false);
        }
        this.user = user;
    };
    AppComponent.prototype.createAnimatedChange = function (collection, oldAmount, newAmount, active) {
        var isNegative = newAmount - oldAmount < 0;
        var amountChange = util.formatNumber(newAmount - oldAmount);
        var change = {
            text: isNegative ? amountChange : '+' + amountChange,
            textClass: isNegative ? 'text-danger' : 'text-success'
        };
        collection.push(change);
    };
    AppComponent.prototype.isUserLoggedIn = function () {
        return this.userService.isUserLoggedIn();
    };
    // Unsubscribe to prevent memory leaks, although it's top tier component
    AppComponent.prototype.ngOnDestroy = function () {
        this.userService.userUpdated.unsubscribe();
        clearInterval(this.deleteOldAnimationInterval);
    };
    AppComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-app',
            templateUrl: 'app.component.html'
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService, io_service_1.IoService, angular2_notifications_1.NotificationsService, router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map