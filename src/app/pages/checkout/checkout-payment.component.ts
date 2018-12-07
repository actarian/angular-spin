import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { timer } from 'rxjs';
import { finalize, first, map, mergeMap, takeUntil } from 'rxjs/operators';
import { DisposableComponent, Page, PageService, PayPalService } from '../../core';
import { Cart, CartPaymentType, CartService, GiftCard, GiftCardService, GiftCardState, GtmService, Hotel, User } from '../../models';

@Component({
	selector: 'checkout-payment-component',
	templateUrl: './checkout-payment.component.html',
	styleUrls: ['./checkout-payment.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class CheckoutPaymentComponent extends DisposableComponent implements OnInit {

	cart: Cart;
	model: Cart;
	user: User;
	hotel: Hotel;
	page: Page;
	cardState: any = GiftCardState;
	cardError: any;
	modelCard: any = {};
	paymentType: any = CartPaymentType;
	error: string;
	busy: boolean = false;
	busyGiftCard: boolean = false;

	paypalOptions: any = {
		payment: () => {
			return timer(3000).pipe(
				map(() => {
					console.log('PayPal.Clicked');
					return {
						payment: {
							transactions: [{
								amount: {
									total: this.model.paymentDueAmount,
									currency: 'EUR'
								}
							}]
						}
					};
				})
			);
		},
		onAuthorize: (payment, error) => {
			console.log('onAuthorize', payment, error);
		},
	};

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private pageService: PageService,
		private cartService: CartService,
		private giftCardService: GiftCardService,
		private paypalService: PayPalService,
		private gtm: GtmService,
	) {
		super();
	}

	ngOnInit() {
		this.user = this.route.snapshot.data['user'];
		this.cart = this.route.snapshot.data['cart'];
		this.hotel = this.cart.serviceDetail;
		this.model = new Cart(this.cart);
		this.giftCardService.cards$.next(this.cart.giftCards || []);
		this.pageService.getPageById(this.hotel.id).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(page => {
			this.page = page;
		});
		this.giftCardService.cards$.pipe(
			takeUntil(this.unsubscribe)
		).subscribe(cards => this.model.giftCards = cards);
		console.log('CheckoutPaymentComponent');
	}

	hasPaymentType(type: CartPaymentType): boolean {
		return this.model.availablePayments.indexOf(type) !== -1;
	}

	onGiftCardCheck() {
		this.cardError = null;
		this.busyGiftCard = true;
		this.giftCardService.checkCard(this.modelCard.code + this.modelCard.secret).pipe(
			mergeMap(card => this.giftCardService.addCard(card)),
			first(),
			finalize(() => this.busyGiftCard = false),
		).subscribe(
			cards => {
				console.log('added', cards);
				this.giftCardService.cards$.next(cards);
			},
			error => this.cardError = error
		);
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

	onPrevStep(): void {
		this.router.navigate(['../dati_passeggeri'], { relativeTo: this.route });
	}

	onPayment(): void {
		this.error = null;
		this.busy = true;
		this.cartService.reserveCart(this.model).pipe(
			takeUntil(this.unsubscribe),
			// finalize(() => this.busy = false),
		).subscribe(
			cart => {
				console.log('CheckoutPaymentComponent.onPayment.success', cart);
				this.gtm.onReservationClick(cart, cart.serviceDetail);
				if (cart.payment.url) {
					window.location.href = cart.payment.url;
				} else if (this.model.paymentMethod === CartPaymentType.CreditTransfer) {
					// this.router.navigate([`../completato?id=${cart.detail.bookingFileCode}`], { relativeTo: this.route });
					window.location.href = `/cassa/completato?id=${cart.detail.bookingFileCode}`;
				} else {
					this.busy = false;
					this.error = 'Errore sconosciuto';
				}
			},
			error => {
				this.busy = false;
				this.error = error;
				console.log('CheckoutPaymentComponent.onPayment.error', error);
			}
		);
	}

}
