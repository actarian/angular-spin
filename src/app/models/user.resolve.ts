import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { User } from './user';
import { UserService } from './user.service';

@Injectable()
export class UserResolve implements Resolve<User> {

	constructor(
		private userService: UserService
	) { }

	resolve(route: ActivatedRouteSnapshot) {
		return this.userService.current();
	}

}
