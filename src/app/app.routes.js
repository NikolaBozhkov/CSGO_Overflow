"use strict";
var router_1 = require('@angular/router');
var rerouter_service_1 = require('./rerouter/rerouter.service');
var account_component_1 = require('./user/account.component');
var dropper_component_1 = require('./dropper/dropper.component');
var marketplace_component_1 = require('./marketplace/marketplace.component');
var game_component_1 = require('./game/game.component');
var statistics_component_1 = require('./statistics/statistics.component');
var terms_of_use_component_1 = require('./info/terms-of-use.component');
var contacts_component_1 = require('./info/contacts.component');
var faq_component_1 = require('./info/faq.component');
var routes = [
    {
        path: 'account',
        canActivate: [rerouter_service_1.RerouterService],
        component: account_component_1.AccountComponent
    },
    {
        path: 'advertisements',
        component: dropper_component_1.DropperComponent
    },
    {
        path: 'marketplace',
        component: marketplace_component_1.MarketplaceComponent
    },
    {
        path: 'game',
        component: game_component_1.GameComponent
    },
    {
        path: 'statistics',
        canActivate: [rerouter_service_1.RerouterService],
        component: statistics_component_1.StatisticsComponent
    },
    {
        path: 'faq',
        component: faq_component_1.FaqComponent,
    },
    {
        path: 'terms/:option',
        pathMatch: 'full',
        component: terms_of_use_component_1.TermsOfUseComponent
    },
    {
        path: 'contacts',
        component: contacts_component_1.ContactsComponent
    },
    {
        path: '',
        pathMatch: 'full',
        canActivate: [rerouter_service_1.RerouterService],
        component: game_component_1.GameComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];
exports.routing = router_1.RouterModule.forRoot(routes);
//# sourceMappingURL=app.routes.js.map