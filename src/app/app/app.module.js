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
var http_1 = require('@angular/http');
var forms_1 = require('@angular/forms');
var tooltip_1 = require('ng2-bootstrap/components/tooltip');
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var angular2_notifications_1 = require('angular2-notifications');
var info_module_1 = require('../info/info.module');
var datatable_1 = require('primeng/components/datatable/datatable');
var shared_1 = require('primeng/components/common/shared');
var app_component_1 = require('./app.component');
var account_component_1 = require('../user/account.component');
var dropper_component_1 = require('../dropper/dropper.component');
var marketplace_component_1 = require('../marketplace/marketplace.component');
var game_component_1 = require('../game/game.component');
var statistics_component_1 = require('../statistics/statistics.component');
var chat_component_1 = require('../chat/chat.component');
var rerouter_service_1 = require('../rerouter/rerouter.service');
var app_routes_1 = require('../app.routes');
var user_service_1 = require('../user/user.service');
var io_service_1 = require('../io/io.service');
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                account_component_1.AccountComponent,
                dropper_component_1.DropperComponent,
                marketplace_component_1.MarketplaceComponent,
                game_component_1.GameComponent,
                statistics_component_1.StatisticsComponent,
                chat_component_1.ChatComponent,
                ng2_bs3_modal_1.MODAL_DIRECTIVES
            ],
            imports: [
                app_routes_1.routing,
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                forms_1.FormsModule,
                angular2_notifications_1.SimpleNotificationsModule,
                info_module_1.InfoModule,
                datatable_1.DataTableModule,
                shared_1.SharedModule,
                tooltip_1.TooltipModule
            ],
            bootstrap: [app_component_1.AppComponent],
            providers: [
                user_service_1.UserService,
                io_service_1.IoService,
                rerouter_service_1.RerouterService
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map