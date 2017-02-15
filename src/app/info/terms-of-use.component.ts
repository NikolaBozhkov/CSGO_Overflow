import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'terms-of-use',
    templateUrl: './terms-of-use.component.html'
})

export class TermsOfUseComponent {
    generalTermsSelected = false;
    cookiePolicySelected = false;

    constructor(private route: ActivatedRoute, private router: Router) {}

    ngOnInit() {
        this.route.params
            .map(params => params['option'])
            .subscribe(option => this.select(option));
    }

    select(option: string) {
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
    }
}
