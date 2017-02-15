import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Cookie } from 'ng2-cookies/ng2-cookies';

import { UserService } from '../user/user.service';

@Component({
    selector: 'faq',
    templateUrl: './faq.component.html'
})

export class FaqComponent {
    constructor(private route: ActivatedRoute, private router: Router, private userService: UserService) {
        let refId = this.route.snapshot.params['refId'];
        if (refId) {
            Cookie.set('refId', refId);
            this.router.navigate(['/faq']);
        }
    }
}
