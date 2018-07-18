import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { FacebookService, FacebookUser, GoogleService, GoogleUser } from '../../core';
import { AuthService, AuthToken } from '../../core/auth';
import { ControlBase, FormService } from '../../core/forms';
import { PageComponent } from '../../core/pages';
import { RouteService } from '../../core/routes';
import { UserAuth, UserService, UserSignIn } from '../../models';

@Component({
	selector: 'page-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.scss']
})

export class SignInComponent extends PageComponent implements OnInit {

	controls: ControlBase<any>[];
	group: FormGroup;

	model: UserSignIn = new UserSignIn();
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
		private userService: UserService,
		private formService: FormService, // !!!
	) {
		super(routeService);
	}

	ngOnInit() {
		// REACTIVE FORM
		this.controls = this.formService.getControlsFromOptions([{
			key: 'email',
			schema: 'email',
			label: 'signIn.email',
			placeholder: 'signIn.email',
			required: true,
			match: 'emailConfirm',
			reverse: true,
			order: 1
		}, {
			key: 'emailConfirm',
			schema: 'email',
			label: 'signIn.emailConfirm',
			placeholder: 'signIn.emailConfirm',
			required: true,
			match: 'email',
			order: 2,
		}, {
			key: 'password',
			schema: 'password',
			label: 'signIn.password',
			placeholder: 'signIn.password',
			required: true,
			minLength: 6,
			order: 3
		}, {
			key: 'hours',
			schema: 'number',
			label: 'signIn.hours',
			placeholder: 'signIn.hours',
			required: true,
			min: 0,
			max: 24,
			step: 1,
			format: 'H',
			order: 3
		}, {
			key: 'rememberMe',
			schema: 'checkbox',
			label: 'signIn.rememberMe',
			placeholder: 'signIn.rememberMe',
			order: 5
		}]); // !!!
		this.group = this.formService.getGroupFromControls(this.controls); // !!!
		// FACEBOOK & GOOGLE
		this.params.pipe(
			takeUntil(this.unsubscribe)
		).subscribe(params => {
			if (params) {
				console.log('SignInComponent.params', params);
				if (params.facebook) {
					this.facebook = params.facebook as FacebookUser;
					this.model.firstName = this.facebook.first_name;
					this.model.lastName = this.facebook.last_name;
					this.model.email = this.facebook.email;
				}
				if (params.google) {
					this.google = params.google as GoogleUser;
					this.model.firstName = this.google.firstName;
					this.model.lastName = this.google.lastName;
					this.model.email = this.google.email;
				}
			}
		});
	}

	onSubmit(): void {
		this.submitted = true;
		this.userService.tryLogin(this.model).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(
			users => {
				const user = users[0];
				this.onAuth(user);
				console.log('onSubmit.success', user);
			}, error => {
				this.error = error;
				this.submitted = false;
				console.log('onSubmit.error', this.error);
			});
	}

	onSubmit2(): void {
		console.log('SignInComponent.form.value', this.group.value);
		this.submitted = true;
	}

	onAuth(user: UserAuth) {
		const authToken = new AuthToken(user.accessToken);
		this.authService.setToken(authToken);
		const segments = this.routeService.toRoute(['/profile']);
		this.router.navigate(segments);
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
