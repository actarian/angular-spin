import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { RouteService } from '../../core';
import { PageComponent } from '../../core/pages';
import { User, UserService } from '../../models';

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
		protected routeService: RouteService,
		private userService: UserService
	) {
		super(routeService);
	}

	ngOnInit() {

	}

	onSubmit(): void {
		this.submitted = true;
		this.userService.signForgotten(this.model).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(
			ok => {
				this.sent = true;
			}, error => {
				this.error = error;
			}
		);
	}
}
