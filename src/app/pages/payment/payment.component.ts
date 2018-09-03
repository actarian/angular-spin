import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { ModalCompleteEvent, ModalService, RouteService } from '../../core';
import { PageComponent } from '../../core/pages';
import { Booking, BookingService, User, UserAuth, UserService, UserSignUp } from '../../models';
import { AuthComponent } from '../auth/auth.component';

@Component({
	selector: 'page-payment',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class PaymentComponent extends PageComponent implements OnInit {
	@Input() user: User;
	@Input() step: Number = 1;

	booking: Booking;
	model: UserSignUp = new UserSignUp();
	error: any;
	submitted: boolean = false;

	constructor(
		protected routeService: RouteService,
		private modalService: ModalService,
		public userService: UserService,
		public bookingService: BookingService,
	) {
		super(routeService);
		// this.attrClass = 'payment';
	}

	ngOnInit() {
		this.bookingService.booking$.pipe(
			takeUntil(this.unsubscribe)
		).subscribe(booking => {
			this.booking = booking;
		});
		this.userService.user$.pipe(
			takeUntil(this.unsubscribe)
		).subscribe(user => {
			this.user = user;
			if (user && this.step === 1) {
				this.step = 2;
			}
		});
	}

	onSign(): void {
		this.modalService.open({ component: AuthComponent }).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(e => {
			if (e instanceof ModalCompleteEvent) {
				console.log('PaymentComponent.ModalCompleteEvent');
				this.onAuth(e.data);
			}
		});
	}

	onSignUp(): void {
		this.submitted = true;
		this.userService.signUp(this.model).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(
			user => {
				this.onAuth(user);
			}, error => {
				this.error = error;
				this.submitted = false;
			});
	}

	onAuth(user: UserAuth): void {
		this.user = user;
		this.step = 2;
	}

	save(): void {
		this.userService.update(this.user).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(() => {
			console.log('saved');
		});
	}

	getChecked(list: any[]): any[] {
		return list.filter(x => x.checked);
	}
}
