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
var platform_browser_1 = require('@angular/platform-browser');
var router_1 = require('@angular/router');
var terms_of_use_component_1 = require('./terms-of-use.component');
var contacts_component_1 = require('./contacts.component');
var faq_component_1 = require('./faq.component');
var InfoModule = (function () {
    function InfoModule() {
    }
    InfoModule = __decorate([
        core_1.NgModule({
            declarations: [
                terms_of_use_component_1.TermsOfUseComponent,
                contacts_component_1.ContactsComponent,
                faq_component_1.FaqComponent
            ],
            imports: [
                platform_browser_1.BrowserModule,
                router_1.RouterModule
            ],
            exports: [
                terms_of_use_component_1.TermsOfUseComponent,
                contacts_component_1.ContactsComponent,
                faq_component_1.FaqComponent
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], InfoModule);
    return InfoModule;
}());
exports.InfoModule = InfoModule;
//# sourceMappingURL=info.module.js.map