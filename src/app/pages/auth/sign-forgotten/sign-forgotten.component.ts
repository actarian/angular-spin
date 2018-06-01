import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from '../../../core/pages';
import { User, UserService } from '../../../models';

@Component({
	selector: 'page-sign-forgotten',
	templateUrl: './sign-forgotten.component.html',
	styleUrls: ['./sign-forgotten.component.scss']
})

export class SignForgottenComponent extends PageComponent implements OnInit {

	model: User = new User();
	submitted: boolean = false;
	sent: boolean = false;
	error: any;

	constructor(
		route: ActivatedRoute,
		private userService: UserService
	) {
		super(route);
	}

	ngOnInit() {

	}

	onSubmit(): void {
		this.submitted = true;
		this.userService.signForgotten(this.model)
			.takeUntil(this.unsubscribe)
			.subscribe(
				ok => {
					this.sent = true;
				}, error => {
					this.error = error;
				}
			);
	}
}
