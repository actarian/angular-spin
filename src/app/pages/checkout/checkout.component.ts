import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';
import { filter, finalize, first, switchMap, takeUntil } from 'rxjs/operators';
import { DisposableComponent, PageService } from '../../core';
import { Cart, CartServiceItem, GiftCard, GiftCardService, GtmService, Hotel } from '../../models';

@Component({
	selector: 'checkout-component',
	templateUrl: './checkout.component.html',
	styleUrls: ['./checkout.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class CheckoutComponent extends DisposableComponent implements OnInit {

	step: number = 0;
	cart: Cart;
	hotel: Hotel;
	service: CartServiceItem;
	cards: GiftCard[];
	busyGiftCard: boolean;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private pageService: PageService,
		private giftCardService: GiftCardService,
		private gtm: GtmService,
	) {
		super();
		this.pageService.getPageBySlug('/cassa').pipe(
			first()
		).subscribe(page => {
			console.log('CheckoutComponent', page);
			this.pageService.addOrUpdateMetaData(page);
		});
		this.router.events.pipe(
			takeUntil(this.unsubscribe),
			filter(event => event instanceof NavigationEnd),
			switchMap((event: NavigationEnd) => of(event.url.split('/'))),
		).subscribe(segments => {
			const segment = segments.pop();
			const childRoutes = ['i_tuoi_dati', 'dati_passeggeri', 'pagamento', 'completato', 'annullato'];
			if (childRoutes.indexOf(segment) !== -1) {
				this.step = Math.min(childRoutes.indexOf(segment), 3);
			}
			// console.log('CheckoutComponent.segments', segments, segment, this.step);
		});
	}

	ngOnInit() {
		this.cart = this.route.snapshot.data['cart'];
		this.hotel = this.cart ? this.cart.serviceDetail : null;
		this.service = this.cart ? this.cart.services[0] : null;
		this.giftCardService.cards$.pipe(
			takeUntil(this.unsubscribe)
		).subscribe(cards => this.cards = cards);
		this.gtm.onCartView(this.cart, this.hotel);
	}

	getChecked(list: any[]): any[] {
		return list ? list.filter(x => x.checked) : [];
	}

	onGiftCardRemove(card: GiftCard) {
		this.busyGiftCard = true;
		this.giftCardService.removeCard(card).pipe(
			first(),
			finalize(() => this.busyGiftCard = false),
		).subscribe(
			cards => {
				console.log('CheckoutComponent.onGiftCardRemove.success', cards);
				this.giftCardService.cards$.next(cards);
			},
			error => console.log('CheckoutComponent.onGiftCardRemove.error', error)
		);
	}

}
