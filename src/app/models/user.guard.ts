import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { ModalCloseEvent, ModalCompleteEvent, ModalEvent, ModalService } from '../core/ui/modal';
import { AuthComponent } from '../pages/auth/auth.component';
import { UserService } from './user.service';

@Injectable()
export class UserGuard implements CanActivate {

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private router: Router,
		private userService: UserService,
		private modalService: ModalService,
	) { }

	canActivate(e): Observable<boolean> {
		if (isPlatformBrowser(this.platformId)) {
			return this.userService.me().pipe(
				switchMap(user => user ? of(true) : of(false)),
				tap(success => {
					if (!success) {
						this.router.navigate(['/']);
						this.modalService.open({ component: AuthComponent }).subscribe((e: ModalEvent<ModalCompleteEvent | ModalCloseEvent>) => {
							if (e instanceof ModalCompleteEvent) {
								console.log('UserGuard.ModalCompleteEvent', e);
								// this.router.navigate(['/']);
							} else if (e instanceof ModalCloseEvent) {
								console.log('UserGuard.ModalCloseEvent', e);
							}
						});
					}
				})
			);
		}
		return of(true);
	}
}
