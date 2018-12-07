import { Inject, Injectable, Injector } from '@angular/core';
import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { LocalStorageService, StorageService } from '../core';
import { Identity, IdentityService } from '../core/models';
import { Cart } from './cart';
import { GiftCardService } from './gift-card.service';

@Injectable({
	providedIn: 'root',
})
export class CartService extends IdentityService<Identity> {

	get collection(): string {
		return '';
	}

	public storage: StorageService;
	public cart$: BehaviorSubject<Cart> = new BehaviorSubject<Cart>(null);

	set cart(cart: Cart) {
		/*
		if (cart) {
			this.storage.set('cart', cart);
		} else {
			this.storage.delete('cart');
		}
		*/
		this.cart$.next(cart);
	}

	constructor(
		@Inject(ORIGIN_URL) private originUrl: string,
		protected injector: Injector,
		private storageService: LocalStorageService,
		private giftCardService: GiftCardService,
	) {
		super(injector);
		this.storage = this.storageService.tryGet();
		const stored = this.storage.get('cart');
		if (stored) {
			this.cart$.next(new Cart(stored));
		}
		// console.log('CartService.originUrl', this.originUrl);
	}

	observe(): Observable<Cart> {
		const cart: Cart = this.cart$.getValue();
		if (cart) {
			return this.cart$;
		} else {
			return this.getCart().pipe(
				switchMap(cart => this.cart$)
			);
		}
	}

	public current(): Observable<Cart> {
		const cart: Cart = this.cart$.getValue();
		if (cart) {
			return of(cart);
		} else {
			return this.getCart();
		}
	}

	getCart(): Observable<Cart> {
		return this.get(`/api/booking/cart`).pipe(
			switchMap((value: any) => {
				return value ? of(new Cart(value)) : of(null);
			}),
			tap(cart => this.cart = cart)
		);
	}

	addToCart(id: number | string, payload: any): Observable<Cart> {
		return this.post(`/api/booking/book/${id}`, payload).pipe(
			// map((x: any) => this.toCamelCase(x)),
			map((x: any) => new Cart(x)), // mapping to BookingOptions
			tap(cart => {
				this.cart = cart;
				this.giftCardService.cards$.next([]);
			})
			// tap(x => console.log('BookingService.addToCart', id, x)),
		);
	}

	removeFromCart(): Observable<any> {
		return this.delete(`/api/booking/cart`).pipe(
			tap(response => {
				this.cart = null;
			})
		);
	}

	updateCart(payload: Cart): Observable<Cart> {
		return this.put(`/api/booking/cart`, payload).pipe(
			map((x: any) => new Cart(x)),
		);
	}

	/*
	quoteCart: function (code:string, payload: Cart) {
		return this.post(`/api/booking/quote/${code}`, payload).pipe(
			tap((x: any) => console.log(x)),
		);
	},
	*/

	reserveCart(payload: Cart) {
		/*
		return timer(3000).pipe(
			switchMap(() => {
				return of(null);
			}),
			tap(cart => {
				this.giftCardService.cards$.next([]);
				// this.removeFromCart();
			}),
		);
		*/
		payload.notifyUrl = {
			onSuccess: `${this.originUrl}/cassa/completato`,
			onFailure: `${this.originUrl}/cassa/annullato`,
		};
		return this.post(`/api/booking/reserve`, payload).pipe(
			/*
			mergeMap(data => {
				if (payload.paymentMethod === CartPaymentType.CreditTransfer) {
					return of(data);
				}
				return of(data);
			}),
			*/
			tap((x: any) => console.log('CartService.reserveCart', x)),
		);
	}

	completePaypal(token: string) {
		return this.post(`/api/payment/paypal/${token}`).pipe(
			tap((x: any) => console.log(x)),
		);
	}

	completeUnicredit(type: string, paymentId: string, result: string, amount: number, advance: number, ad: string, bfid: string, ccode: string, supplier: string) {
		return this.get(`/api/payment/unicredit?type=${type}&paymentId=${paymentId}&result=${result}&amount=${amount}&advance=${advance}&ad=${ad}&bfid=${bfid}&ccode=${ccode}&supplier=${supplier}`).pipe(
			tap((x: any) => console.log(x)),
		);
	}

	cancelPaypal(token: string) {
		return this.delete(`/api/payment/paypal/${token}`).pipe(
			tap((x: any) => console.log(x)),
		);
	}

	cancelCart() {
		return this.delete(`/api/booking/cart`).pipe(
			tap((x: any) => console.log(x)),
		);
	}

	getCoupon(): Observable<any[]> {
		return this.get(`'/api/booking/coupon`).pipe(
			tap((x: any) => console.log(x)),
		);
	}

	setCoupon(code: string): Observable<any[]> {
		return this.post(`'/api/booking/coupon`, `"${code}"`).pipe(
			tap((x: any) => console.log(x)),
		);
	}

}
