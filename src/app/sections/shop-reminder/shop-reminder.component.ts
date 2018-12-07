import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { combineLatest, Observable, of } from 'rxjs';
import { filter, first, switchMap, takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core/disposable';
import { Cart, CartService } from '../../models';

@Component({
	selector: 'section-shop-reminder',
	templateUrl: './shop-reminder.component.html',
	styleUrls: ['./shop-reminder.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class ShopReminderComponent extends DisposableComponent implements OnInit {

	cart: Cart;
	visible: boolean = false;

	constructor(
		protected router: Router,
		private route: ActivatedRoute,
		private cartService: CartService,
	) {
		super();
	}

	ngOnInit() {
		this.detectVisibility().pipe(
			takeUntil(this.unsubscribe),
		).subscribe(visible => this.visible = visible);
	}

	detectVisibility(): Observable<boolean> {
		return combineLatest(
			this.cartService.cart$,
			this.router.events.pipe(
				filter(event => event instanceof NavigationEnd),
				switchMap((event: NavigationEnd) => of(event.url.split('/'))),
			),
		).pipe(
			switchMap((data: any[]) => {
				const cart: Cart = data[0];
				const segments: string[] = data[1];
				this.cart = cart;
				const visible = this.cart && segments.indexOf('cassa') === -1;
				// console.log('ShopReminderComponent.detectVisibility', cart, segments, visible);
				return of(visible);
			}),
		);
	}

	removeFromCart(): void {
		this.cartService.removeFromCart().pipe(
			first(),
		).subscribe(results => {
			// none
		});
	}

}
