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
var TermsOfUseComponent = (function () {
    function TermsOfUseComponent(route, router) {
        this.route = route;
        this.router = router;
        this.generalTermsSelected = false;
        this.cookiePolicySelected = false;
    }
    TermsOfUseComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params
            .map(function (params) { return params['option']; })
            .subscribe(function (option) { return _this.select(option); });
    };
    TermsOfUseComponent.prototype.select = function (option) {
        this.generalTermsSelected = false;
        this.cookiePolicySelected = false;
        switch (option) {
            case 'general-terms':
                this.generalTermsSelected = true;
                break;
            case 'cookie-policy':
                this.cookiePolicySelected = true;
                break;
        }
    };
    TermsOfUseComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'terms-of-use',
            templateUrl: 'terms-of-use.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router])
    ], TermsOfUseComponent);
    return TermsOfUseComponent;
}());
exports.TermsOfUseComponent = TermsOfUseComponent;
//# sourceMappingURL=terms-of-use.component.js.map