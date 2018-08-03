import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { RouteService } from '../../core';
import { PageComponent } from '../../core/pages';
import { User, UserService, UserSignUp } from '../../models';

@Component({
	selector: 'page-payment',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class PaymentComponent extends PageComponent implements OnInit {
	@Input() user: User;
	@Input() step: Number = 1;

	model: UserSignUp = new UserSignUp();

	constructor(
		protected routeService: RouteService,
		private userService: UserService
	) {
		super(routeService);
		// this.attrClass = 'payment';
	}

	ngOnInit() {
		this.getUser();
	}

	getUser(): void {
		this.userService.currentUser().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(user => this.user = user);
	}

	save(): void {
		this.userService.update(this.user).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(() => {
			console.log('saved');
		});
	}
}
