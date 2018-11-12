import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../service/user.service';

@Injectable()
export class NoAuthGuard implements CanActivate {
    constructor(private userService: UserService, private router: Router) {
    }

    canActivate() {
        if (!this.userService.isSignedin()) {
            return true;
        }
        else {
            this.router.navigate(['compte/tableau-de-bord.html']);
            return false;
        }
    }
}
