import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core/disposable';
import { FacebookService, FacebookUser, GoogleService, GoogleUser } from '../../core/plugins';
import { ModalCompleteEvent, ModalData, ModalService } from '../../core/ui/modal';
import { User, UserSignUp } from '../../models/user';
import { UserService } from '../../models/user.service';
import { AuthSignInComponent } from './auth-sign-in.component';

@Component({
	selector: 'auth-sign-up-component',
	templateUrl: './auth-sign-up.component.html',
	styleUrls: ['./auth-sign-up.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class AuthSignUpComponent extends DisposableComponent implements OnInit {

	model: UserSignUp = new UserSignUp();
	user: User;
	facebook: FacebookUser;
	google: GoogleUser;
	error: any;
	submitted: boolean = false;

	constructor(
		private modalService: ModalService,
		private modalData: ModalData,
		private facebookService: FacebookService,
		private googleService: GoogleService,
		private userService: UserService
	) {
		super();
	}

	ngOnInit() {
		const data: any = this.modalData;
		if (data) {
			console.log('AuthSignUpComponent.data', data);
			if (data.facebook) {
				this.facebook = data.facebook as FacebookUser;
				this.model.firstName = this.facebook.first_name;
				this.model.lastName = this.facebook.last_name;
				this.model.email = this.facebook.email;
				this.model.emailConfirm = this.facebook.email;
			}
			if (data.google) {
				this.google = data.google as GoogleUser;
				this.model.firstName = this.google.firstName;
				this.model.lastName = this.google.lastName;
				this.model.email = this.google.email;
				this.model.emailConfirm = this.google.email;
			}
		}
	}

	onSubmit(): void {
		this.submitted = true;
		this.userService.signUp(this.model).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(
			user => {
				this.user = user;
			}, error => {
				this.error = error;
				this.submitted = false;
			});
	}

	onFacebookLogout(): void {
		this.facebookService.logout().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(x => {
			console.log('SignUpComponent.onFacebookLogout', x);
			this.facebook = null;
		});
	}

	onGoogleLogout(): void {
		this.googleService.logout().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(x => {
			console.log('SignUpComponent.onGoogleLogout', x);
			this.google = null;
		});
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
}
