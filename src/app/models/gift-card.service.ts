import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Identity, IdentityService } from '../core/models';
import { GiftCard } from './gift-card';

@Injectable({
	providedIn: 'root',
})
export class GiftCardService extends IdentityService<Identity> {

	get collection(): string {
		return '';
	}

	cards$: BehaviorSubject<GiftCard[]> = new BehaviorSubject([]);

	checkCard(code: string): Observable<GiftCard> {
		return this.post(`/api/giftcard/check/${code}`).pipe(
			switchMap((value: any) => {
				return value ? of(new GiftCard(value)) : of(null);
			}),
		);
	}

	addCard(card: GiftCard): Observable<GiftCard[]> {
		return this.post(`/api/giftcard/add`, card).pipe(
			map(cards => cards.map(card => new GiftCard(card)))
		);
	}

	removeCard(card: GiftCard): Observable<GiftCard[]> {
		return this.post(`/api/giftcard/remove`, card).pipe(
			map(cards => cards.map(card => new GiftCard(card)))
		);
	}

	getCards(): Observable<GiftCard[]> {
		return this.post(`/api/giftcard/cart`).pipe(
			map(cards => cards.map(card => new GiftCard(card)))
		);
	}

	/*
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
	*/

}
