import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { first, mergeMap } from 'rxjs/operators';
import { DisposableComponent } from '../../core';
import { Cart, CartService, User } from '../../models';

@Component({
	selector: 'checkout-canceled-component',
	templateUrl: './checkout-canceled.component.html',
	styleUrls: ['./checkout-canceled.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class CheckoutCanceledComponent extends DisposableComponent implements AfterViewInit {

	cart: Cart;
	user: User;

	params: any;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private router: Router,
		private route: ActivatedRoute,
		private cartService: CartService,
	) {
		super();
	}

	ngAfterViewInit() {
		this.cart = this.route.snapshot.data['cart'];
		this.user = this.route.snapshot.data['user'];
		if (isPlatformBrowser(this.platformId)) {
			this.route.queryParams.pipe(
				first()
			).subscribe(params => {
				this.params = params;
				if (params && params.token) {
					this.cartService.cancelPaypal(params.token).pipe(
						mergeMap(paypal => this.cartService.cancelCart()),
						first()
					).subscribe(
						success => console.log(success),
						error => console.log(error),
					);
				}
				console.log('CheckoutCanceledComponent', params);
			});
		}
	}

}
