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
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var dropper_service_1 = require('./dropper.service');
var user_service_1 = require('../user/user.service');
var io_service_1 = require('../io/io.service');
var angular2_notifications_1 = require('angular2-notifications');
var user_model_1 = require('../user/user.model');
var DropperComponent = (function () {
    function DropperComponent(elementRef, dropperService, userSerivce, notificationsService, ioService) {
        this.elementRef = elementRef;
        this.dropperService = dropperService;
        this.userSerivce = userSerivce;
        this.notificationsService = notificationsService;
        this.ioService = ioService;
    }
    DropperComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.userSerivce.isUserLoggedIn()) {
            this.userSerivce.getUser()
                .then(function (user) { return _this._user = user; });
        }
        this.popUnderModal.onDismiss.subscribe(function () { return _this.getDropsPopUnder(); });
    };
    DropperComponent.prototype.loadPopUnder = function (url) {
        var _this = this;
        var scr = document.createElement('script');
        scr.type = 'text/javascript';
        scr.src = url;
        this.elementRef.nativeElement.appendChild(scr);
        var loaded = false;
        setTimeout(function () { if (!loaded)
            _this.disableAdBlockModal.open(); }, 500);
        scr.onload = function () {
            loaded = true;
            _this.disableAdBlockModal.close();
            _this.popUnderModal.open();
            if (_this._user) {
                _this.ioService.socket.emit('adLoaded', _this._user.id);
            }
        };
    };
    DropperComponent.prototype.getDropsPopUnder = function () {
        var _this = this;
        if (this._user) {
            this.dropperService.getDropsPopUnder()
                .then(function (res) {
                if (res.success == 1) {
                    _this._user.staticCurrency += res.drops;
                    _this.userSerivce.updateUser(new user_model_1.User(_this._user));
                }
                else {
                    _this.notificationsService.error('Error', res.message || 'Failed to add drops!');
                }
            });
        }
    };
    __decorate([
        core_1.ViewChild('popUnderModal'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], DropperComponent.prototype, "popUnderModal", void 0);
    __decorate([
        core_1.ViewChild('disableAdBlock'), 
        __metadata('design:type', ng2_bs3_modal_1.ModalComponent)
    ], DropperComponent.prototype, "disableAdBlockModal", void 0);
    DropperComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'dropper',
            templateUrl: 'dropper.component.html',
            providers: [dropper_service_1.DropperService]
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, dropper_service_1.DropperService, user_service_1.UserService, angular2_notifications_1.NotificationsService, io_service_1.IoService])
    ], DropperComponent);
    return DropperComponent;
}());
exports.DropperComponent = DropperComponent;
//# sourceMappingURL=dropper.component.js.map