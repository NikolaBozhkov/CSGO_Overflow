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
var user_service_1 = require('../user/user.service');
var user_model_1 = require('../user/user.model');
var AccountComponent = (function () {
    function AccountComponent(userService, notificationsService) {
        this.userService = userService;
        this.notificationsService = notificationsService;
        this.transferAmount = 0;
    }
    AccountComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.getUser()
            .then(function (user) { return _this.user = new user_model_1.User(user); });
    };
    AccountComponent.prototype.saveTradeUrl = function (tradeUrl) {
        var _this = this;
        this.userService.putSaveTradeUrl(tradeUrl)
            .then(function () {
            _this.notificationsService.success('Success', 'Steam trade URL saved');
            _this.user.tradeUrl = tradeUrl;
            _this.userService.updateUser(_this.user);
        });
    };
    AccountComponent.prototype.saveTradeUrlFromEnter = function (event) {
        if (event.keyCode == 13) {
            event.target.blur();
        }
    };
    AccountComponent.prototype.transferCurrency = function (toActive) {
        var _this = this;
        this.transferAmount = Math.round(this.transferAmount);
        if ((toActive && this.transferAmount <= this.user.staticCurrency)
            || (!toActive && this.transferAmount <= this.user.activeCurrency)) {
            this.userService.putTransferAmount(this.transferAmount, toActive)
                .then(function (user) {
                _this.userService.updateUser(user);
                _this.user = new user_model_1.User(user);
            });
        }
        else if (toActive && this.transferAmount > this.user.staticCurrency) {
            this.notificationsService.alert('Invalid Amount', 'Specified amount cannot exceed static currency');
        }
        else {
            this.notificationsService.alert('Invalid Amount', 'Specified amount cannot exceed active currency');
        }
    };
    AccountComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'account',
            templateUrl: 'account.component.html'
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService, angular2_notifications_1.NotificationsService])
    ], AccountComponent);
    return AccountComponent;
}());
exports.AccountComponent = AccountComponent;
//# sourceMappingURL=account.component.js.map