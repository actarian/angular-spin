import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { DisposableComponent } from '../../core/disposable';
import { FacebookService, FacebookUser, GoogleService, GoogleUser } from '../../core/plugins';
import { ModalCompleteEvent, ModalService } from '../../core/ui/modal';
import { UserAuth } from '../../models/user';
import { UserService } from '../../models/user.service';
import { AuthSignInComponent } from './auth-sign-in.component';
import { AuthSignUpComponent } from './auth-sign-up.component';

@Component({
	selector: 'auth-component',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class AuthComponent extends DisposableComponent implements OnInit {

	facebookMe: FacebookUser;
	googleMe: GoogleUser;

	constructor(
		private modalService: ModalService,
		private facebookService: FacebookService,
		private googleService: GoogleService,
		private userService: UserService
	) {
		super();
	}

	ngOnInit() {
		this.facebookService.status().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(x => {
			// console.log('SignComponent.facebookService.status', x);
		});
		this.googleService.auth2Instance().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(x => {
			// console.log('SignComponent.googleService.auth2Instance', x);
		});
	}

	onFacebook(): void {
		this.facebookService.getMe().pipe(
			takeUntil(this.unsubscribe),
			tap(me => this.facebookMe = me),
			switchMap(me => this.userService.tryFacebook(me)),
		).subscribe(user => {
			this.onAuth(user[0]);
		}, error => {
			this.onSignUp({ facebook: this.facebookMe });
		});
	}

	onGoogle(): void {
		this.googleService.getMe().pipe(
			takeUntil(this.unsubscribe),
			tap(me => this.googleMe = me),
			switchMap(me => this.userService.tryGoogle(me)),
		).subscribe(user => {
			this.onAuth(user[0]);
		}, error => {
			this.onSignUp({ google: this.googleMe });
		});
	}

	onAuth(user: UserAuth) {
		this.modalService.complete(null, user);
	}

	onSignIn(): void {
		this.modalService.open({ component: AuthSignInComponent }).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(e => {
			if (e instanceof ModalCompleteEvent) {
				console.log('signed');
			}
		});
	}

	onSignUp(data?: any) {
		this.modalService.open({
			component: AuthSignUpComponent, data: data
		}).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(e => {
			if (e instanceof ModalCompleteEvent) {
				console.log('signed');
			}
		});
	}

}
