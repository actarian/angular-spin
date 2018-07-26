import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { PageComponent } from '../../core/pages';
import { FacebookService, FacebookUser, GoogleService, GoogleUser } from '../../core/plugins';
import { RouteService } from '../../core/routes';
import { UserAuth, UserService } from '../../models';

@Component({
	selector: 'page-sign',
	templateUrl: './sign.component.html',
	styleUrls: ['./sign.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class SignComponent extends PageComponent implements OnInit {

	facebookMe: FacebookUser;
	googleMe: GoogleUser;

	constructor(
		protected routeService: RouteService,
		private router: Router,
		private facebookService: FacebookService,
		private googleService: GoogleService,
		private userService: UserService
	) {
		super(routeService);
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
		const segments = this.routeService.toRoute(['/profile']);
		this.router.navigate(segments);
	}

	onSignUp(data?: any) {
		const segments = this.routeService.toRoute(['/registrati']);
		segments.push(this.routeService.toParams(data));
		this.router.navigate(segments);
	}

}
