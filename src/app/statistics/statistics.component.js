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
var user_service_1 = require('../user/user.service');
var user_model_1 = require('../user/user.model');
var util = require('../util/util');
var StatisticsComponent = (function () {
    function StatisticsComponent(userService) {
        this.userService = userService;
    }
    StatisticsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.getUser()
            .then(function (user) { return _this.user = new user_model_1.User(user); });
        this.util = util;
    };
    StatisticsComponent.prototype.getWins = function () {
        return this.user.wins / (this.user.wins + this.user.losses);
    };
    StatisticsComponent.prototype.getWon = function () {
        return this.user.wonAmount / (this.user.wonAmount + this.user.lostAmount);
    };
    StatisticsComponent.prototype.getLosses = function () {
        return this.user.losses / (this.user.wins + this.user.losses);
    };
    StatisticsComponent.prototype.getLost = function () {
        return this.user.lostAmount / (this.user.wonAmount + this.user.lostAmount);
    };
    StatisticsComponent.prototype.formatPercent = function (percent) {
        percent *= 100;
        return percent.toFixed(2);
    };
    StatisticsComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'statistics',
            templateUrl: 'statistics.component.html',
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService])
    ], StatisticsComponent);
    return StatisticsComponent;
}());
exports.StatisticsComponent = StatisticsComponent;
//# sourceMappingURL=statistics.component.js.map