import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from '../../core/auth';
import { PageComponent } from '../../core/pages';
import { FacebookService, FacebookUser, GoogleService, GoogleUser } from '../../core/plugins';
import { RouteService } from '../../core/routes';
import { User, UserSignUp } from '../../models/user';
import { UserService } from '../../models/user.service';

@Component({
	selector: 'page-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class SignUpComponent extends PageComponent implements OnInit {

	model: UserSignUp = new UserSignUp();
	user: User;
	facebook: FacebookUser;
	google: GoogleUser;
	error: any;
	submitted: boolean = false;

	constructor(
		protected routeService: RouteService,
		private router: Router,
		private authService: AuthService,
		private facebookService: FacebookService,
		private googleService: GoogleService,
		private userService: UserService
	) {
		super(routeService);
	}

	ngOnInit() {
		this.params.pipe(
			takeUntil(this.unsubscribe)
		).subscribe(model => {
			if (model) {
				console.log('SignUpComponent.params', model);
				if (model.facebook) {
					this.facebook = model.facebook as FacebookUser;
					this.model.firstName = this.facebook.first_name;
					this.model.lastName = this.facebook.last_name;
					this.model.email = this.facebook.email;
					this.model.emailConfirm = this.facebook.email;
				}
				if (model.google) {
					this.google = model.google as GoogleUser;
					this.model.firstName = this.google.firstName;
					this.model.lastName = this.google.lastName;
					this.model.email = this.google.email;
					this.model.emailConfirm = this.google.email;
				}
			}
		});
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
}
