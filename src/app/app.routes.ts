import { Routes, RouterModule } from '@angular/router';

import { RerouterService } from './rerouter/rerouter.service';

import { AccountComponent } from './user/account.component';
import { DropperComponent } from './dropper/dropper.component';
import { MarketplaceComponent } from './marketplace/marketplace.component';
import { GameComponent } from './game/game.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { TermsOfUseComponent } from './info/terms-of-use.component';
import { ContactsComponent } from './info/contacts.component';
import { FaqComponent } from './info/faq.component';
import { ReworkComponent } from './rework/rework.component';

const routes: Routes = [
    // {
    //     path: 'account',
    //     canActivate: [RerouterService],
    //     component: AccountComponent
    // },
    // {
    //     path: 'advertisements',
    //     component: DropperComponent
    // },
    // {
    //     path: 'marketplace',
    //     component: MarketplaceComponent
    // },
    // {
    //     path: 'game',
    //     component: GameComponent
    // },
    // {
    //     path: 'statistics',
    //     canActivate: [RerouterService],
    //     component: StatisticsComponent
    // },
    // {
    //     path: 'faq',
    //     component: FaqComponent,
    // },
    // {
    //     path: 'faq/:refId',
    //     component: FaqComponent,
    // },
    // {
    //     path: 'terms/:option',
    //     pathMatch: 'full',
    //     component: TermsOfUseComponent
    // },
    // {
    //     path: 'contacts',
    //     component: ContactsComponent
    // },
    // {
    //     path: ':refId',
    //     redirectTo: 'faq/:refId'
    // },
    {
        path: '',
        pathMatch: 'full',
        // canActivate: [RerouterService],
        // component: GameComponent
        component: ReworkComponent
    },
    {
        path: '**',
        redirectTo: ''
    }
];

export const routing = RouterModule.forRoot(routes);
