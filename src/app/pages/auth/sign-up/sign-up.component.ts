import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { FacebookService, FacebookUser, GoogleService, GoogleUser } from '../../../core';
import { AuthService } from '../../../core/auth';
import { PageComponent } from '../../../core/pages';
import { RouteService } from '../../../core/routes';
import { User, UserService, UserSignUp } from '../../../models';

@Component({
	selector: 'page-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.scss']
})

export class SignUpComponent extends PageComponent implements OnInit {

	model: UserSignUp = new UserSignUp();
	user: User;
	facebook: FacebookUser;
	google: GoogleUser;
	error: any;
	submitted: boolean = false;

	constructor(
		route: ActivatedRoute,
		private routeService: RouteService,
		private router: Router,
		private authService: AuthService,
		private facebookService: FacebookService,
		private googleService: GoogleService,
		private userService: UserService
	) {
		super(route);
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
		this.userService.add(this.model).pipe(
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
