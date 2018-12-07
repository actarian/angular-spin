import { isPlatformBrowser } from '@angular/common';
import { AfterViewChecked, AfterViewInit, Component, ElementRef, Inject, NgZone, OnInit, PLATFORM_ID, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, first, map, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ModalCloseEvent, ModalCompleteEvent, ModalEvent, ModalService, RouteService } from '../../core';
import { PageComponent } from '../../core/pages';
import { BookingService, Cart, GtmService, Hotel, HotelType, LastViewsService, MainSearch, SearchResult, SearchService, Tag, TagService, TrustPilotMinimumReviews } from '../../models';
import { Booking, BookingAvailability, BookingCalendar, BookingExtraQuote, BookingOptions } from '../../models/booking';
import { CartService } from '../../models/cart.service';
import { FeatureEnum, FeatureType } from '../../models/feature';
import { WishlistService } from '../../models/wishlist.service';
import { DialogComponent } from '../../sections/dialog/dialog.component';
import { LoadingType } from '../../sections/loading/loading.component';
import { HotelMapComponent } from './hotel-map.component';

const FANCYBOX: any = {
	selector: '[data-fancybox="gallery"]',
	loop: true,
	buttons: ['close'],
	thumbs: {
		autoStart: true
	},
	idleTime: 9999,
	btnTpl: {
		close: `<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">
					<svg viewBox="0 0 40 40">
						<use xlink:href="#ico-close"></use>
					</svg>
					<span>Torna all'offerta</span>
				</button>`,
		arrowLeft: `<a data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}" href="javascript:;"></a>`,
		arrowRight: `<a data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}" href="javascript:;"></a>`
	},
};

@Component({
	selector: 'page-hotel',
	templateUrl: './hotel.component.html',
	styleUrls: ['./hotel.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class HotelComponent extends PageComponent implements OnInit, AfterViewInit, AfterViewChecked {

	showTrustPilot: boolean = true;
	showMapBox: boolean = true;
	mapBoxAccessToken: string = environment.plugins.mapbox.accessToken;

	fancyboxOptions: any = FANCYBOX;
	model: MainSearch;
	booking: Booking = new Booking();
	hotel: Hotel;
	tabs: any[];
	calendar: BookingCalendar = new BookingCalendar();
	busy: boolean = false;
	busyBook: boolean = false;
	minimumReviews: number = TrustPilotMinimumReviews;
	loadingTypes: any = LoadingType;
	featureTypes: any = FeatureType;
	hotelTypes: any = HotelType;
	tagList: Tag[];

	@ViewChild('variants') public variants: ElementRef;
	@ViewChild('features') public features: ElementRef;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		protected routeService: RouteService,
		private zone: NgZone,
		private router: Router,
		public search: SearchService,
		public wishlist: WishlistService,
		private tagService: TagService,
		private lastViews: LastViewsService,
		private bookingService: BookingService,
		private cartService: CartService,
		private modalService: ModalService,
		private gtm: GtmService,
	) {
		super(routeService);
		this.search.model$.pipe(
			takeUntil(this.unsubscribe)
		).subscribe(model => {
			this.model = new MainSearch(model);
			this.booking = new Booking({
				adults: model.adults,
				childrenCount: model.childs,
				children: model.childrens,
				flexibleDate: model.flexibleDates,
				startDate: model.startDate || new Date(),
			});
		});
	}

	ngOnInit() {
		this.getHotel();
	}

	ngAfterViewInit() {
		if (isPlatformBrowser(this.platformId)) {
			setTimeout(() => {
				this.setFirstInOut();
			}, 100);
		}
	}

	getHotel(): void {
		this.bookingService.getTopServiceDetailById(this.getId()).pipe(
			first(),
		).subscribe((hotel: Hotel) => {
			this.hotel = hotel;
			const searchResult: SearchResult = SearchResult.newSearchResultFromHotel(hotel);
			this.gtm.onProductDetail(searchResult);
			/*
			this.dispatcher.emit({
				type: 'onProductDetail',
				data: { searchResult: searchResult, }
			});
			*/
			this.lastViews.doAdd(searchResult);
			this.tabs = this.getTabs();
			const ids: (string | number)[] = this.hotel.tagList ? this.hotel.tagList.map(x => x.id) : [];
			this.tagService.getTagsByIds(ids).pipe(
				first(),
			).subscribe(tags => {
				this.tagList = tags;
			});
		});
	}

	ngAfterViewChecked(): void {
		this.zone.runOutsideAngular(() => {
			this.readMore();
			this.dispatchResize();
		});
	}

	getTabs(): any[] {
		const offertTab = {
			title: 'Descrizione',
			features: this.page.getFeatures(FeatureType.Description, [
				FeatureEnum.Structure,
				FeatureEnum.TravelShip,
				FeatureEnum.Rooms,
				FeatureEnum.Accomodation,
				FeatureEnum.Beach,
				FeatureEnum.Sport,
				FeatureEnum.AdditionalText, // temporaneo per schede vecchie
			])
		};
		const serviceTab = {
			title: 'Servizi',
			features: this.page.getFeatures(FeatureType.Description, [
				FeatureEnum.Service,
				FeatureEnum.PetFriendly // temporaneo per schede vecchie
			]),
		};
		const itineraryTab = {
			title: 'Itinerario',
			features: this.page.getFeatures(FeatureType.Description, [
				FeatureEnum.TravelItinerary,
				FeatureEnum.TravelCabin,

				FeatureEnum.TravelDocuments
			]),
		};
		const detailTab = {
			title: 'Dettaglio periodi e prezzi',
			features: this.page.getFeatures(FeatureType.Description, [
				FeatureEnum.Price, // dettaglio periodi e prezzi (tabella prezzi?)
				FeatureEnum.SpecialOffers,
				FeatureEnum.TravelDetail,
				FeatureEnum.TravelService, // servizi a bordo da definire posizione
				FeatureEnum.TravelFligth,
				FeatureEnum.CheckInOutTime, // temporaneo per schede vecchie
				FeatureEnum.BusService,
				FeatureEnum.TravelInfos,
				FeatureEnum.CarInsurance, // assicurazioni vanno mantenute?
				FeatureEnum.CarInsuranceInfo // assicurazioni vanno mantenute?
			]),
			quotes: this.page.getFeatures(FeatureType.Quote, [
				FeatureEnum.Discounts
			])
		};
		const tabs = this.hotel.esType === HotelType.Cruise ? [offertTab, itineraryTab, detailTab] : [offertTab, serviceTab, detailTab];

		// console.log('tabs', tabs);
		return tabs;
		// Structure, Service, Price
		/*
		return []
			.concat(this.page.getFeatures(FeatureType.Description, [FeatureEnum.Structure]))
			.concat(this.page.getFeatures(FeatureType.Description, [FeatureEnum.Service]))
			.concat(this.page.getFeatures(FeatureType.Description, [FeatureEnum.Price]));
		*/
	}

	onTabOpen(event: any) {
		// console.log('HotelComponent.onTabOpen', event);
		const tabType: string = ['Struttura', 'Servizi', 'Partenze'][event.index];
		this.gtm.onTab(tabType);
		/*
		this.dispatcher.emit({
			type: 'onTab',
			data: { tabType: tabType, }
		});
		*/
	}

	getCheckIn(): Observable<BookingAvailability[]> {
		this.calendar.checkins = null;
		this.calendar.checkouts = null;
		this.booking.checkIn = null;
		this.booking.checkOut = null;
		this.booking.options = null;
		return this.bookingService.getBookingCheckInById(this.getId(), this.booking.getPayload()).pipe(
			map((checkins: any[]) => {
				checkins = checkins.map(a => new BookingAvailability(a));
				// console.log('BookingService.getCheckIn', checkins);
				this.calendar.checkins = checkins;
				return checkins;
			})
		);
	}

	doStoreSearch(startDate: Date): void {
		this.model.startDate = startDate;
		this.search.model$.next(this.model);
	}

	getCheckOut(checkIn: Date): Observable<BookingAvailability[]> {
		this.doStoreSearch(checkIn);
		this.calendar.checkouts = null;
		this.booking.checkIn = checkIn;
		this.booking.checkOut = null;
		this.booking.options = null;
		// this.gtm.onCheckIn(this.booking);
		/*
		this.dispatcher.emit({
			type: 'onCheckIn',
			data: { booking: this.booking, }
		});
		*/
		return this.bookingService.getBookingCheckOutById(this.getId(), this.booking.getPayload()).pipe(
			map((checkouts: any[]) => {
				checkouts = checkouts.map(a => new BookingAvailability(a));
				this.calendar.checkouts = checkouts;
				this.calendar.nights = checkouts.filter(a => a.date > checkIn).map(a => this.booking.getNights(checkIn, a.date));
				// console.log('BookingService.getCheckOut', checkouts);
				if (checkouts.length) {
					this.booking.nights = this.calendar.nights[0];
				}
				return checkouts;
			})
		);
	}

	getBookingOptions(checkOut: Date): Observable<BookingOptions> {
		this.booking.checkOut = checkOut;
		this.booking.options = null;
		// this.gtm.onCheckOut(this.booking);
		/*
		this.dispatcher.emit({
			type: 'onCheckOut',
			data: { booking: this.booking, }
		});
		*/
		return this.bookingService.getBookingOptionsById(this.getId(), this.booking.getPayload());
	}

	setCheckIn(): void {
		// console.log('HotelComponent.setCheckIn', this.booking.checkIn);
		this.busy = true;
		this.getCheckOut(this.booking.checkIn).pipe(
			first(),
			// finalize(() => this.busy = false),
		).subscribe((checkouts: BookingAvailability[]) => {
			if (checkouts.length) {
				const nextDay = new Date(this.booking.checkIn);
				nextDay.setDate(nextDay.getDate() + 1);
				this.setNearestCheckOut(nextDay);
			} else {
				this.busy = false;
			}
		});
	}

	setCheckOut(): void {
		// console.log('HotelComponent.setCheckOut', this.booking.checkOut);
		this.busy = true;
		this.getBookingOptions(this.booking.checkOut).pipe(
			first(),
			// finalize(() => this.busy = false),
		).subscribe((options: BookingOptions) => {
			this.booking.options = options;
			this.busy = false;
		});
	}

	setFirstInOut(): void {
		this.busy = true;
		this.getCheckIn().pipe(
			first(),
			// finalize(() => this.busy = false),
		).subscribe((checkins: BookingAvailability[]) => {
			if (checkins.length === 0) {
				this.busy = false;
				return;
			}
			const startDate: Date = this.booking.startDate;
			const nearestCheckIn = checkins.reduce((a: BookingAvailability, b: BookingAvailability) => {
				return (Math.abs(b.getDate().getTime() - startDate.getTime()) < Math.abs(a.getDate().getTime() - startDate.getTime()) ? b : a);
			}).getDate();
			this.getCheckOut(nearestCheckIn).pipe(
				first(),
				// finalize(() => this.busy = false),
			).subscribe((checkouts: BookingAvailability[]) => {
				const nextDay = new Date(nearestCheckIn);
				nextDay.setDate(nextDay.getDate() + 1);
				this.setNearestCheckOut(nextDay);
			});
		});
	}

	setNearestCheckOut(nextDay: Date): void {
		const checkIn = this.booking.checkIn;
		const checkouts = this.calendar.checkouts;
		if (!checkouts || checkouts.length === 0) {
			this.busy = false;
			return;
		}
		const nearestCheckOut = checkouts.reduce((a: BookingAvailability, b: BookingAvailability) => {
			return (Math.abs(b.getDate().getTime() - nextDay.getTime()) < Math.abs(a.getDate().getTime() - nextDay.getTime()) ? b : a);
		}).getDate();
		this.getBookingOptions(nearestCheckOut).pipe(
			first(),
			finalize(() => this.busy = false),
		).subscribe((options: BookingOptions) => {
			this.booking.options = options;
		});
	}

	onBook(e: any): void {
		// console.log('onBook', this.booking, e.target.value);
		this.busyBook = true;
		this.cartService.addToCart(this.getId(), this.booking.getPayloadWithKey(this.hotel.key)).pipe(
			first(),
			finalize(() => this.busyBook = false),
		).subscribe((cart: Cart) => {
			console.log('HotelComponent.onBook', cart);
			this.router.navigate(['/cassa']);
		}, error => {
			console.log('HotelComponent.onBook.error', error);
		});
	}

	onAdultsChanged(): void {
		console.log('HotelComponent.onAdultsChanged', this.model.adults);
		this.booking.adults = this.model.adults;
		this.setFirstInOut();
	}

	onChildsChanged(): void {
		while (this.model.childrens.length < this.model.childs) {
			this.model.childrens.push({ age: 0 });
		}
		console.log('HotelComponent.onChildsChanged', this.model.childrens);
		this.model.childrens.length = Math.min(this.model.childs, this.model.childrens.length);
		this.booking.childrenCount = this.model.childs;
		this.booking.children = this.model.childrens;
		this.setFirstInOut();
	}

	onChildsAgeChanged(): void {
		console.log('HotelComponent.onChildsAgeChanged', this.model.childrens);
		this.setFirstInOut();
	}

	onNightsChanged(nights: string): void {
		console.log('HotelComponent.onNightsChanged', nights, this.booking.nights);
		const checkOut = new Date(this.booking.checkIn.valueOf());
		checkOut.setDate(checkOut.getDate() + +nights); // mantenere il più è una conversione a numeric
		this.booking.checkOut = checkOut;
		this.setCheckOut();
	}

	onOptionsChanged(): void {
		console.log('HotelComponent.onOptionsChanged', this.booking.options);
	}

	onShowMap(): void {
		this.modalService.open({ component: HotelMapComponent, data: this.hotel, className: 'hotel-map' }).pipe(
			takeUntil(this.unsubscribe)
		).subscribe((e: ModalEvent<ModalCompleteEvent | ModalCloseEvent>) => {
			console.log('HotelComponent.onShowMap.complete', e);
			if (e.data) {
				const hotel = e.data as Hotel;
				const segments = this.routeService.toRoute([hotel.slug]);
				this.router.navigate(segments);
			}
			/*
			if (e instanceof ModalCompleteEvent) {
				console.log('ModalCompleteEvent', e);
			} else if (e instanceof ModalCloseEvent) {
				console.log('ModalCloseEvent', e);
			}
			*/
		});
	}

	getExtraQuoteDescription(item: BookingExtraQuote): string {
		let price = 0;
		if (item.detail) {
			if (item.detail.rate) {
				price += this.booking.total / 100 * item.detail.rate;
			}
			if (item.detail.xPaxAmount) {
				price += this.booking.paxTotal * item.detail.xPaxAmount;
			}
		}
		const description = item.description ? `${item.description.split('. ')[0].replace('{0}', price.toFixed(2))}. ` : '';
		return description;
	}

	getExtraQuoteInfo(item: BookingExtraQuote): string {
		const description = item.description ? item.description.split('. ') : [];
		return description.length > 1 ? description[1] : '';
	}

	showExtraQuoteInfo(item: BookingExtraQuote): void {
		console.log('showExtraQuoteInfo', item);
		this.modalService.open({
			component: DialogComponent, data: {
				title: item.detail.acceptTitle,
				description: item.detail.policy,
			}
		}).pipe(
			first()
		).subscribe(e => {
			if (e instanceof ModalCompleteEvent) {
				console.log('signed');
			}
		});
	}

	onChange() {
		console.log('HotelComponent.onChange');
	}

	getCheckoutDate(nights: number): Date {
		let date: Date = new Date(this.booking.checkIn);
		date = new Date(date.setDate(date.getDate() + nights));
		return date;
	}

	scrollToVariants() {
		this.zone.runOutsideAngular(() => {
			this.variants.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
		});
	}

	scrollToFeatures() {
		this.zone.runOutsideAngular(() => {
			this.features.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'start' });
		});
	}

	readMore() {
		if (isPlatformBrowser(this.platformId)) {
			const Accordions = Array.from(document.querySelectorAll('.readmore-wrap'));
			Accordions.forEach(e => {
				const accordion = e.querySelector('.readmore-accordion') as HTMLElement;
				if (accordion.offsetHeight > 48) {
					accordion.classList.add('active');
				}
			});
		}
	}

	dispatchResize() {
		if (isPlatformBrowser(this.platformId)) {
			let event;
			if (typeof window['Event'] === 'function') {
				event = new Event('resize');
			} else {
				event = window.document.createEvent('UIEvents');
				event.initUIEvent('resize', true, false, window, 0);
			}
			window.dispatchEvent(event);
		}
	}

	/*
	readMoreAccordion() {
		if (isPlatformBrowser(this.platformId)) {
			this.zone.runOutsideAngular(() => {
				$(() => {
					const animationSpeed = 200;
					$('.readmore-accordion').each(function (i, e) {
						const $wrapper = $('.readmore-accordion__wrapper', e),
							$sizer = $('.readmore-accordion__sizer', e),
							$button = $('.readmore-accordion__toggler', e),
							initH = 75;
						let endH;
						function activationCheck() {
							if ($sizer.height() < initH) {
								$wrapper.addClass('inactive');
								$button.hide();
							} else {
								endH = $sizer.height();
								setEvents();
							}
						}
						function backToElement() {
							$('html, body').animate({
								scrollTop: $(e).offset().top
							}, 1000);
						}
						function setEvents() {
							$wrapper.height(initH + 'px');
							$button.on('click', function (e) {
								endH = $sizer.height();
								if (!$wrapper.hasClass('open')) {
									$wrapper.animate({ height: endH + 'px' }, animationSpeed, function () {
										$wrapper.addClass('open');
										// backToElement();
										$button.find('span').toggle();
									});
								} else {
									$wrapper.animate({ height: initH + 'px' }, animationSpeed, function () {
										$wrapper.removeClass('open');
										// backToElement();
										$button.find('span').toggle();
									});
								}
								e.preventDefault();
							});
						}
						activationCheck();
					});
				});
			});
		}
	}
	*/

}
