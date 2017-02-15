import { NgModule }       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import { RouterModule } from '@angular/router';

import { TermsOfUseComponent } from './terms-of-use.component';
import { ContactsComponent } from './contacts.component';
import { FaqComponent } from './faq.component';

@NgModule({
    declarations: [
        TermsOfUseComponent,
        ContactsComponent,
        FaqComponent
    ],
    imports: [
        BrowserModule,
        RouterModule
    ],
    exports: [
        TermsOfUseComponent,
        ContactsComponent,
        FaqComponent
    ]
})

export class InfoModule {}
