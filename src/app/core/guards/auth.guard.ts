import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from '../../models/user.service';
import { RouteService } from '../routes';

@Injectable({
	providedIn: 'root'
})
export class AuthAttribute implements CanActivate {

	constructor(
		private router: Router,
		private routeService: RouteService,
		private userService: UserService
	) { }

	canActivate() {
		if (this.userService.isLoggedIn()) {
			return true;
		} else {
			this.router.navigate(this.routeService.toRoute(['/home']));
			return false;
		}
	}

}
