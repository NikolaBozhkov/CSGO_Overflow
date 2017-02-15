import { NgModule }       from '@angular/core';
import { BrowserModule  } from '@angular/platform-browser';
import { HttpModule }     from '@angular/http';
import { FormsModule  }   from '@angular/forms';

import { TooltipModule } from 'ng2-bootstrap/components/tooltip';
import { MODAL_DIRECTIVES } from 'ng2-bs3-modal/ng2-bs3-modal';

import { SimpleNotificationsModule } from 'angular2-notifications';
import { InfoModule } from '../info/info.module';

import { DataTableModule } from 'primeng/components/datatable/datatable';
import { SharedModule } from 'primeng/components/common/shared';

import { AppComponent }   from './app.component';
import { AccountComponent } from '../user/account.component';
import { DropperComponent } from '../dropper/dropper.component';
import { MarketplaceComponent } from '../marketplace/marketplace.component';
import { GameComponent } from '../game/game.component';
import { StatisticsComponent } from '../statistics/statistics.component';
import { ChatComponent } from '../chat/chat.component';

import { RerouterService } from '../rerouter/rerouter.service';
import { routing } from '../app.routes';

import { UserService } from '../user/user.service';
import { IoService } from '../io/io.service';

@NgModule({
    declarations: [
        AppComponent,
        AccountComponent,
        DropperComponent,
        MarketplaceComponent,
        GameComponent,
        StatisticsComponent,
        ChatComponent,
        MODAL_DIRECTIVES
    ],
    imports: [
        routing,
        BrowserModule,
        HttpModule,
        FormsModule,
        SimpleNotificationsModule,
        InfoModule,
        DataTableModule,
        SharedModule,
        TooltipModule
    ],
    bootstrap: [AppComponent],
    providers: [
        IoService,
        UserService,
        RerouterService
    ]
})

export class AppModule {}
