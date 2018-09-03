import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { ModalCloseEvent, ModalCompleteEvent, ModalEvent, ModalService } from '../core/ui/modal';
import { AuthComponent } from '../pages/auth/auth.component';
import { UserService } from './user.service';

@Injectable()
export class UserGuard implements CanActivate {

	constructor(
		private router: Router,
		private userService: UserService,
		private modalService: ModalService,
	) { }

	canActivate(e): boolean {
		console.log('UserGuard.CanActivate', e);
		if (!this.userService.isLoggedIn()) {
			this.router.navigate(['/']);
			this.modalService.open({ component: AuthComponent }).subscribe((e: ModalEvent<ModalCompleteEvent | ModalCloseEvent>) => {
				if (e instanceof ModalCompleteEvent) {
					console.log('UserGuard.ModalCompleteEvent', e);
					// this.router.navigate(['/']);
				} else if (e instanceof ModalCloseEvent) {
					console.log('UserGuard.ModalCloseEvent', e);
				}
			});
			return false;
		}
		return true;
	}
}
