import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EventDispatcherService, EventEntity } from '../core/models/event-dispatcher.service';
import { GoogleTagManagerService } from '../core/plugins';
import { Booking } from './booking';
import { Cart } from './cart';
import { Hotel } from './hotel';
import { MainSearch, SearchResult } from './search';
import { User } from './user';

@Injectable({
	providedIn: 'root',
})
export class GtmService {

	constructor(
		private datePipe: DatePipe,
		private dispatcher: EventDispatcherService,
		private gtm: GoogleTagManagerService,
	) { }

	observe(): Observable<EventEntity> {
		return this.dispatcher.observe().pipe(
			tap((event: EventEntity) => {
				console.log('GtmService', event);
			})
		);
	}

	// BomContextData RenderGTMScript
	/*
	onPageView(url: string): void {
		this.gtm.push({
			event: event
		});
	}
	*/

	// app.js	event
	// newsletterService.subscribe -> gtm.event('newsletterSubscription');
	// userService.signup -> gtm.event('websiteSignup');
	onEvent(event: string): void {
		this.gtm.push({
			event: event
		});
	}

	// app.js	userID
	onUser(user: User): void {
		this.gtm.push({
			userID: user.recordCode || ''
		});
	}

	// app.js	search
	// gtm.search('Search', 'Destinazione', $tag.Name);
	// gtm.search('Search', 'Categoria', $tag.Name);
	// gtm.search('Filter', 'Categoria', newValue.filter.Rating);
	// gtm.search('Filter', 'Trattamento', newValue.filter.Accomodation);
	// gtm.search('Filter', 'Tipologia', tag.Name);
	// gtm.search('Filter', 'Destinazione', tag.Name);
	// gtm.search('Filter', 'Servizio', tag.Name);
	// gtm.search('Search', 'Periodo', Name);
	onSearch(type, typology, term): void {
		this.gtm.push({
			event: 'search',
			searchType: type,
			searchTypology: typology,
			searchTerm: term,
		});
	}

	// app.js	impressions
	onImpressions(results: SearchResult[]): void {
		const position_shift = 1 + 0; // (($scope.query.page - 1) * $scope.pager.items_x_page);
		const impressions = results.map((item: SearchResult, i: number) => {
			return {
				name: item.frontEndName,
				id: item.id,
				variant: item.type,
				uniprice: item.price,
				type: item.accomodation,
				stars: this.ratingToGtm(item.rating),
				region: item.destinationRegion,
				place: item.destinationDescription,
				nation: item.destinationNation,
				category: item.category,
				list: 'Search Results',
				position: i + position_shift,
			};
		});
		this.gtm.push({
			'event': 'productImpression',
			'impressions': impressions,
		});
	}

	// app.js	searchTime
	// gtm.searchTime($scope.filter);
	onSearchTime(search: MainSearch): void {
		this.gtm.push({
			event: 'searchTime',
			searchType: 'Filter',
			searchTypology: 'Periodo',
			dateFrom: this.datePipe.transform(search.startDate, 'dd-MM-yyyy'),
			dateTo: search.duration, // !!! this.datePipe.transform(search.duration, 'dd-MM-yyyy'),
			pax: search.adults + search.childrens.length,
			chld: search.childrens.length,
		});
	}

	// app.js	clickProduct
	// searchresult -> click
	onProductClick(type: string, result: SearchResult, index: number): void {
		// !!! type = 'Search Result' || 'suggestion list'; // nuovo! 'last views'
		this.gtm.push({
			event: 'productClick',
			actionField: {
				list: type,
			},
			products: [{
				name: result.frontEndName,
				id: result.id,
				variant: result.type,
				uniprice: result.price,
				type: result.accomodation,
				stars: this.ratingToGtm(result.rating),
				region: result.destinationRegion,
				place: result.destinationDescription,
				nation: result.destinationNation,
				category: result.category,
				position: index + 1
			}],
		});
	}

	// BomContextData.cs	RenderGTMScript
	// -> in componente

	// DocumentHelper.cshtml	TrackGTM_productDetail
	onProductDetail(result: SearchResult): void {
		this.gtm.push({
			event: 'productDetail',
			product: this.resultToGtm(result),
		});
	}

	// app.js	tab
	// gtm.tab('Struttura');
	// gtm.tab('Partenze');
	// gtm.tab('Mappa');
	onTab(tabType: string): void {
		this.gtm.push({
			event: 'tabClick',
			tab: tabType,
		});
	}

	// app.js	checkIn
	// hotel -> checkIn
	onCheckIn(booking: Booking): void {
		this.gtm.push({
			event: 'checkIn',
			dateFrom: this.datePipe.transform(booking.checkIn),
		});
	}

	// app.js	checkOut
	// hotel -> checkOut
	onCheckOut(booking: Booking): void {
		this.gtm.push({
			event: 'checkOut',
			dateFrom: this.datePipe.transform(booking.checkOut),
			nights: booking.daysTotal,
		});
	}

	// app.js	reservationClick
	// api.booking.reserve -> reservationClick
	onReservationClick(cart: Cart, hotel: Hotel): void {
		this.gtm.push({
			event: 'reservation',
			detail: [{
				dateFrom: this.datePipe.transform(cart.checkIn),
				dateTo: this.datePipe.transform(cart.checkOut),
				pax: cart.paxNumber,
				chd: cart.passengers.filter(x => x.categoryCode === 'CH').length.toString(),
				price: cart.detail.totalAmountDetail.totalAmountAfterDiscount.toFixed(2)
			}],
			product: [{
				name: hotel.frontEndName,
				id: hotel.id,
				variant: hotel.esType,
				uniprice: hotel.price,
				type: hotel.accomodation,
				stars: this.ratingToGtm(hotel.rating),
				region: hotel.destinationRegion,
				place: hotel.destinationDescription,
				nation: hotel.destinationNation,
				category: hotel.category
			}],
			promo: [{
				id: '',
				name: '',
				creative: '',
				position: ''
			}],
			transaction: [{
				id: cart.code,
				revenue: cart.detail.totalAmountDetail.totalAmountAfterDiscount.toFixed(2),
				tax: '',
				modpag: this.paymentToGtm(cart),
				giftCard: this.giftCardToGtm(cart),
			}],
		});
	}

	// DocumentHelper.cshtml	TrackGTM_cartView
	onCartView(cart: Cart, hotel: Hotel): void {
		this.gtm.push({
			event: 'cartView',
			product: this.hotelToGtm(hotel),
			detail: this.cartToGtm(cart),
		});
	}

	// DocumentHelper.cshtml	TrackGTM_reservation
	/* commented -> @*@if (Request.QueryString["media"] != "pdf")
    {
        @DocumentHelper.TrackGTM_reservation("reservation", dettagliPacchetto, detail, totaleGift, payment);
	}*@*/
	__onReservation(): void {
		this.gtm.push({ 'event': 'TrackGTM_reservation' });
		/*
		// ajax url: "/ws/wsECommerce.asmx/GTM_reservation"
		dataLayer.push({
			'event': '@eventTrack',
			'transaction': [{
				'id':'@pratica',
				'revenue': '@booking.detail.totalAmountDetail.TotalAmountAfterDiscount',
				'tax': '',
				'modpag': '@payment',
				'giftCard':'@(totaleGift > 0 ? "Y" : "N")'
			}],
			'promo': [{
				'id':'',
				'name': '',
				'creative': '',
				'position': ''

			}],
			'product': @GTM_product(tsd),
			'detail': [{
				'dateFrom': '@booking.StartDate.ToString("dd-MM-yyyy")',
				'dateTo': '@booking.EndDate.ToString("dd-MM-yyyy")',
				'pax': '@booking.PaxNumber',
				'chd': '@booking.PassengerList.Count(_ => _.CategoryCode == "CH")',
				'price': '@booking.detail.totalAmountDetail.TotalAmountAfterDiscount'
			}],
		});
		*/
	}

	// wsForm.js	sendActionsToGTM
	onFormSent(model: any): void {
		this.gtm.push({ 'event': 'TrackGTM_reservation' });
	}

	// condizioni-polizza-assicurativa.cshtml	condizioni-polizza-assicurativa.cshtml
	onInsurance(): void {
		this.gtm.push({ 'event': 'TrackGTM_reservation' });
	}

	// private conversions

	private resultToGtm(item: SearchResult): any {
		return {
			name: item.frontEndName,
			id: item.id,
			variant: item.type,
			uniprice: item.price,
			type: item.accomodation,
			stars: this.ratingToGtm(item.rating),
			region: item.destinationRegion,
			place: item.destinationDescription,
			nation: item.destinationNation,
			category: item.category,
		};
	}

	private hotelToGtm(item: Hotel): any {
		return {
			name: item.frontEndName,
			id: item.id,
			variant: item.esType,
			uniprice: item.price,
			type: item.accomodation,
			stars: this.ratingToGtm(item.rating),
			region: item.destinationRegion,
			place: item.destinationDescription,
			nation: item.destinationNation,
			category: item.category,
		};
	}

	private cartToGtm(item: Cart) {
		return {
			dateFrom: this.datePipe.transform(item.checkIn, 'dd-MM-yyyy'),
			dateTo: this.datePipe.transform(item.checkOut, 'dd-MM-yyyy'),
			pax: item.service.adults + item.service.children.length,
			chd: item.service.children.length,
			price: item.detail.totalAmountDetail.totalAmountAfterDiscount,
		};
	}

	private ratingToGtm(item: string): string {
		let rating = 0;
		if (item) {
			rating = item.length;
			if (item.toLowerCase().indexOf('s') > 0) {
				rating -= 0.5;
			}
		}
		return rating.toFixed(1);
	}

	private topDestinationToGtm(hotel: Hotel): string {
		if (hotel.tags) {
			let tags = hotel.tags.filter(x => x.category === 2 || x.name === '');
			if (tags.length && tags[0].name.trim()) {
				return tags[0].name;
			} else {
				tags = hotel.tags.filter(x => x.category === 3 || x.name === '');
				return tags.length ? tags[0].name : '';
			}
		}
		return '';
	}

	private paymentToGtm(cart: Cart): string {
		let payment = '';
		switch (cart.paymentMethod) {
			case 1:
				payment = 'CON';
				break;
			case 2:
				payment = 'BON';
				break;
			case 3:
				payment = 'PP';
				break;
			case 4:
				payment = 'CC';
				break;
			case 5:
				payment = 'MyBank';
				break;
		}
		return payment;
	}

	private giftCardToGtm(cart: Cart): string {
		return cart.giftCards.length > 0 ? 'Y' : 'N';
	}

}
