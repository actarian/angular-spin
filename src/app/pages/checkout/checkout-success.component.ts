import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { finalize, first, map, mergeMap, tap } from 'rxjs/operators';
import { DisposableComponent } from '../../core';
import { Cart, CartService, OrderService, User } from '../../models';

@Component({
	selector: 'checkout-success-component',
	templateUrl: './checkout-success.component.html',
	styleUrls: ['./checkout-success.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class CheckoutSuccessComponent extends DisposableComponent implements OnInit {

	cart: Cart;
	user: User;
	params: any;
	detail: any;
	error: any;
	busy: boolean;
	bookingFileCode: string;
	trustPilotServiceReviewEnabled: boolean = true;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private router: Router,
		private route: ActivatedRoute,
		private cartService: CartService,
		private orderService: OrderService,
	) {
		super();
	}

	ngOnInit() {
		this.cart = this.route.snapshot.data['cart'];
		this.user = this.route.snapshot.data['user'];
		if (isPlatformBrowser(this.platformId)) {
			this.busy = true;
			this.route.queryParams.pipe(
				tap(params => this.params = params),
				mergeMap(params => {
					if (params) {
						if (params.token) {
							// paypal
							return this.cartService.completePaypal(params.token);
						} else if (params.type) {
							// unicredit
							return this.cartService.completeUnicredit(params.type, params.paymentId, params.result, params.amount, params.advance, params.ad, params.bfid, params.ccode, params.supplier);
						} else {
							// bank transfer
							return of({
								bookingFileCode: params.id
							});
						}
					} else {
						return of(null);
					}
				}),
				mergeMap((data: any) => {
					if (data) {
						this.bookingFileCode = data.bookingFileCode;
						return this.orderService.getOrderDetail(data.bookingFileCode);
					} else {
						return of(null);
					}
				}),
				mergeMap((data: any) => this.cartService.removeFromCart().pipe(
					map(x => data),
				)),
				first(),
				finalize(() => this.busy = false)
			).subscribe(
				detail => {
					console.log('CheckoutSuccessComponent.complete', detail);
					this.detail = detail;
				},
				error => {
					console.log('CheckoutSuccessComponent.error', error);
					this.error = error;
				}
			);
		}
	}

}
