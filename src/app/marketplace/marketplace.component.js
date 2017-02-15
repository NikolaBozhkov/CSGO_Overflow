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
var item_service_1 = require('./item.service');
var user_service_1 = require('../user/user.service');
var util = require('../util/util');
var MarketplaceComponent = (function () {
    function MarketplaceComponent(itemService, userService, notificationsService) {
        this.itemService = itemService;
        this.userService = userService;
        this.notificationsService = notificationsService;
        this.selectedItems = [];
        this.totalPrice = 0;
        this.checkoutDisabled = false;
    }
    MarketplaceComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.itemService.getItems()
            .then(function (items) { return _this.items = items; });
        if (this.userService.isUserLoggedIn()) {
            this.userService.getUser()
                .then(function (user) { return _this.user = user; });
        }
    };
    MarketplaceComponent.prototype.formatPrice = function (price) {
        return price.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
    };
    MarketplaceComponent.prototype.sortItemsByPrice = function (desc) {
        this.items.sort(util.dynamicSort('price', desc ? -1 : 1));
    };
    MarketplaceComponent.prototype.selectItem = function (item) {
        if (item.selected) {
            item.selected = false;
            var index = this.selectedItems.indexOf(item);
            if (index > -1) {
                this.selectedItems.splice(index, 1);
                this.totalPrice -= item.price;
            }
        }
        else {
            item.selected = true;
            this.selectedItems.push(item);
            this.totalPrice += item.price;
        }
        if ((this.user && this.user.staticCurrency >= this.totalPrice) || (!this.user && this.totalPrice == 0)) {
            this.checkoutDisabled = false;
        }
        else {
            this.checkoutDisabled = true;
        }
    };
    MarketplaceComponent.prototype.checkout = function () {
        // If user if logged in, check the trade url, then check if he has enough currency
        // If user has enough total, but not enough static, alert him
        if (this.user) {
            if (this.user.tradeUrl === '') {
                this.notificationsService.alert('Set Trade URL', 'Your steam trade URL is not set');
            }
            else if (this.user.staticCurrency >= this.totalPrice) {
                if (this.totalPrice > 0) {
                    this.itemService.checkoutItems(this.selectedItems)
                        .then(this.handleCheckoutResponse.bind(this));
                }
            }
            else if (this.user.staticCurrency + this.user.activeCurrency >= this.totalPrice) {
                this.notificationsService.info('Not Enough Static', 'Move your active drops to static');
            }
            else {
                this.notificationsService.error('Not Enough Drops', 'Please select items of less value');
            }
        }
        else {
            this.notificationsService.alert('Log in', 'You must be logged in to purchase items');
        }
    };
    MarketplaceComponent.prototype.handleCheckoutResponse = function (res) {
        if (res.success == 1) {
            this.notificationsService.success('Success', 'Expect trade offer soon');
        }
        else {
            this.notificationsService.error('Error', res.message);
        }
    };
    MarketplaceComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'marketplace',
            templateUrl: 'marketplace.component.html',
            providers: [item_service_1.ItemService]
        }), 
        __metadata('design:paramtypes', [item_service_1.ItemService, user_service_1.UserService, angular2_notifications_1.NotificationsService])
    ], MarketplaceComponent);
    return MarketplaceComponent;
}());
exports.MarketplaceComponent = MarketplaceComponent;
//# sourceMappingURL=marketplace.component.js.map