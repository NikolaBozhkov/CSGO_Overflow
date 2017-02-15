import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../user/user.service';

@Injectable()
export class RerouterService implements CanActivate {
    constructor(private userService: UserService, private router: Router) {}

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        // If the user is not logged in, but accessing restricted areas reroute to FAQ page
        if (((this.router.url === '/account' || this.router.url === '/statistics') && !this.userService.isUserLoggedIn())
            || (this.router.url === '/' && !this.userService.isUserLoggedIn())) {
            this.router.navigateByUrl('/faq');
            return false;
        }

        if (this.router.url === '/') {
            this.router.navigateByUrl('/game');
            return false;
        }

        return true;
    }
}
