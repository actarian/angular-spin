import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageComponent } from '../../../core/pages';
import { FacebookService, GoogleService } from '../../../core/plugins';
import { RouteService } from '../../../core/routes';
import { UserAuth, UserService } from '../../../models';

@Component({
	selector: 'page-sign',
	templateUrl: './sign.component.html',
	styleUrls: ['./sign.component.scss']
})

export class SignComponent extends PageComponent implements OnInit {

	constructor(
		route: ActivatedRoute,
		private routeService: RouteService,
		private router: Router,
		private facebookService: FacebookService,
		private googleService: GoogleService,
		private userService: UserService
	) {
		super(route);
	}

	ngOnInit() {
		this.facebookService.status()
			.takeUntil(this.unsubscribe)
			.subscribe(x => {
				// console.log('SignComponent.facebookService.status', x);
			});
		this.googleService.auth2Instance()
			.takeUntil(this.unsubscribe)
			.subscribe(x => {
				// console.log('SignComponent.googleService.auth2Instance', x);
			});
	}

	onFacebook(): void {
		this.facebookService.getMe()
			.takeUntil(this.unsubscribe)
			.subscribe(me => {
				this.userService.tryFacebook(me)
					.takeUntil(this.unsubscribe)
					.subscribe(
						user => {
							this.onAuth(user[0]);
						}, error => {
							this.onSignUp({ facebook: me });
						});
			});
	}

	onGoogle(): void {
		this.googleService.getMe()
			.takeUntil(this.unsubscribe)
			.subscribe(me => {
				this.userService.tryGoogle(me)
					.takeUntil(this.unsubscribe)
					.subscribe(
						user => {
							this.onAuth(user[0]);
						}, error => {
							this.onSignUp({ google: me });
						});
			});
	}

	onAuth(user: UserAuth) {
		const segments = this.routeService.toRoute(['/profile']);
		this.router.navigate(segments);
	}

	onSignUp(data: any) {
		const segments = this.routeService.toRoute(['/registrati']);
		segments.push(this.routeService.toParams(data));
		this.router.navigate(segments);
	}

}
