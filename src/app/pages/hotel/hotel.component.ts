import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, NgZone, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { ModalCloseEvent, ModalCompleteEvent, ModalEvent, ModalService, RouteService } from '../../core';
import { PageComponent } from '../../core/pages';
import { Hotel, HotelService, MainSearch, SearchService } from '../../models';
import { Booking, BookingAvailability, BookingCalendar, BookingOptions } from '../../models/booking';
import { WishlistService } from '../../models/wishlist.service';
import { HotelMapComponent } from './hotel-map.component';

@Component({
	selector: 'page-hotel',
	templateUrl: './hotel.component.html',
	styleUrls: ['./hotel.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class HotelComponent extends PageComponent implements OnInit, AfterViewInit {

	public fancyboxOptions: any = {
		selector: '[data-fancybox="gallery"]',
		loop: true,
		buttons: ['close'],
		thumbs: {
			autoStart: true
		},
		btnTpl: {
			close: `<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">
						<svg viewBox="0 0 40 40">
							<use xlink:href="#ico-close"></use>
						</svg>
					</button>`,
			arrowLeft: `<a data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}" href="javascript:;"></a>`,
			arrowRight: `<a data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}" href="javascript:;"></a>`
		},
	};

	@Input() hotel: Hotel;

	model: MainSearch;
	booking: Booking = new Booking();
	calendar: BookingCalendar = new BookingCalendar();
	busy: boolean = false;
	readmore: boolean = false;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private zone: NgZone,
		protected routeService: RouteService,
		private router: Router,
		public search: SearchService,
		public wishlist: WishlistService,
		private hotelService: HotelService,
		private modalService: ModalService,
	) {
		super(routeService);
		this.search.model$.subscribe(model => {
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
		if (isPlatformBrowser(this.platformId)) {
			this.setFirstInOut();
		}
	}

	getHotel(): void {
		this.hotelService.getTopServiceDetailsById(this.getId()).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(hotel => this.hotel = hotel);
	}

	getCheckIn(): Observable<BookingAvailability[]> {
		this.calendar.checkins = null;
		this.calendar.checkouts = null;
		this.booking.checkIn = null;
		this.booking.checkOut = null;
		this.booking.options = null;
		return this.hotelService.getBookingCheckInById(this.getId(), this.booking.getPayload()).pipe(
			map((checkins: any[]) => {
				checkins = checkins.map(a => new BookingAvailability(a));
				// console.log('HotelService.getCheckIn', checkins);
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
		return this.hotelService.getBookingCheckOutById(this.getId(), this.booking.getPayload()).pipe(
			map((checkouts: any[]) => {
				checkouts = checkouts.map(a => new BookingAvailability(a));
				this.calendar.checkouts = checkouts;
				this.calendar.nights = checkouts.filter(a => a.date > checkIn).map(a => this.booking.getNights(checkIn, a.date));
				// console.log('HotelService.getCheckOut', checkouts);
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
		return this.hotelService.getBookingOptionsById(this.getId(), this.booking.getPayload());
	}

	setCheckIn(): void {
		// console.log('HotelComponent.setCheckIn', this.booking.checkIn);
		this.busy = true;
		this.getCheckOut(this.booking.checkIn).subscribe((checkouts: BookingAvailability[]) => {
			this.busy = false;
			if (checkouts.length) {
				const nextDay = new Date(this.booking.checkIn);
				nextDay.setDate(nextDay.getDate() + 1);
				this.setNearestCheckOut(nextDay);
			}
		});
	}

	setCheckOut(): void {
		// console.log('HotelComponent.setCheckOut', this.booking.checkOut);
		this.busy = true;
		this.getBookingOptions(this.booking.checkOut).subscribe((options: BookingOptions) => {
			this.busy = false;
			this.booking.options = options;
		});
	}

	setFirstInOut(): void {
		this.busy = true;
		this.getCheckIn().subscribe((checkins: BookingAvailability[]) => {
			if (checkins.length === 0) {
				this.busy = false;
				return;
			}
			const startDate: Date = this.booking.startDate;
			const nearestCheckIn = checkins.reduce((a: BookingAvailability, b: BookingAvailability) => {
				return (Math.abs(b.getDate().getTime() - startDate.getTime()) < Math.abs(a.getDate().getTime() - startDate.getTime()) ? b : a);
			}).getDate();
			this.getCheckOut(nearestCheckIn).subscribe((checkouts: BookingAvailability[]) => {
				this.busy = false;
				const nextDay = new Date(nearestCheckIn);
				nextDay.setDate(nextDay.getDate() + 1);
				this.setNearestCheckOut(nextDay);
			});
		});
	}

	setNearestCheckOut(nextDay: Date): void {
		this.busy = true;
		const checkIn = this.booking.checkIn;
		const checkouts = this.calendar.checkouts;
		if (!checkouts || checkouts.length === 0) {
			this.busy = false;
			return;
		}
		const nearestCheckOut = checkouts.reduce((a: BookingAvailability, b: BookingAvailability) => {
			return (Math.abs(b.getDate().getTime() - nextDay.getTime()) < Math.abs(a.getDate().getTime() - nextDay.getTime()) ? b : a);
		}).getDate();
		this.getBookingOptions(nearestCheckOut).subscribe((options: BookingOptions) => {
			this.booking.options = options;
			this.busy = false;
		});
	}

	onAdultsChanged(): void {
		this.booking.adults = this.model.adults;
		this.setFirstInOut();
	}

	onChildsChanged(): void {
		while (this.model.childrens.length < this.model.childs) {
			this.model.childrens.push({ age: 0 });
		}
		this.model.childrens.length = Math.min(this.model.childs, this.model.childrens.length);
		this.booking.childrenCount = this.model.childs;
		this.booking.children = this.model.childrens;
		this.setFirstInOut();
	}

	onNightsChanged(nights: string): void {
		console.log('onNightsChanged', nights, this.booking.nights);
		const checkOut = new Date(this.booking.checkIn.valueOf());
		checkOut.setDate(checkOut.getDate() + +nights); // mantenere il più è una conversione a numeric
		this.booking.checkOut = checkOut;
		this.setCheckOut();
	}

	onShowMap(): void {
		this.modalService.open({ component: HotelMapComponent, data: this.hotel, className: 'hotel-map' }).pipe(
			takeUntil(this.unsubscribe)
		).subscribe((e: ModalEvent<ModalCompleteEvent | ModalCloseEvent>) => {
			console.log('onShowMap.complete', e);
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

	ngAfterViewInit() {
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

}
