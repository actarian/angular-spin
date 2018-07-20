import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Observable } from '../../../../node_modules/rxjs';
import { RouteService } from '../../core';
import { PageComponent } from '../../core/pages';
import { Hotel, HotelService, SearchService } from '../../models';
import { Booking, BookingAvailability, BookingCalendar, BookingOptions } from '../../models/booking';

@Component({
	selector: 'page-hotel',
	templateUrl: './hotel.component.html',
	styleUrls: ['./hotel.component.scss']
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

	booking: Booking = new Booking();
	calendar: BookingCalendar = new BookingCalendar();
	busy: boolean = false;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private zone: NgZone,
		protected routeService: RouteService,
		public search: SearchService,
		private hotelService: HotelService
	) {
		super(routeService);
		const mainSearch = this.search.model;
		this.booking = new Booking({
			adults: mainSearch.adults,
			childrenCount: mainSearch.childs,
			children: mainSearch.childrens,
			flexibleDate: mainSearch.flexibleDates,
			startDate: mainSearch.startDate || new Date(),
		});
	}

	ngOnInit() {
		this.getHotel();
		if (isPlatformBrowser(this.platformId)) {
			this.setFirstInOut();
		}
	}

	getHotel(): void {
		this.hotelService.get(`/api/hotel/${this.getId()}`).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(hotel => this.hotel = hotel);
	}

	getCheckIn(): Observable<BookingAvailability[]> {
		this.calendar.checkins = null;
		this.booking.checkIn = null;
		this.calendar.checkouts = null;
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

	getCheckOut(checkIn: Date): Observable<BookingAvailability[]> {
		this.booking.checkIn = checkIn;
		this.calendar.checkouts = null;
		this.booking.checkOut = null;
		this.booking.options = null;
		return this.hotelService.getBookingCheckOutById(this.getId(), this.booking.getPayload()).pipe(
			map((checkouts: any[]) => {
				checkouts = checkouts.map(a => new BookingAvailability(a));
				// console.log('HotelService.getCheckOut', checkouts);
				this.calendar.checkouts = checkouts;
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
			const nextDay = new Date(this.booking.checkIn);
			nextDay.setDate(nextDay.getDate() + 1);
			this.booking.checkOut = nextDay;
			this.calendar.checkouts = checkouts;
			this.busy = false;
		});
	}

	setCheckOut(): void {
		// console.log('HotelComponent.setCheckOut', this.booking.checkOut);
		this.busy = true;
		this.getBookingOptions(this.booking.checkOut).subscribe((options: BookingOptions) => {
			this.booking.options = options;
			this.busy = false;
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
				if (checkouts.length === 0) {
					this.busy = false;
					return;
				}
				const nearestCheckOut = checkouts.reduce((a: BookingAvailability, b: BookingAvailability) => {
					return (Math.abs(b.getDate().getTime() - startDate.getTime()) < Math.abs(a.getDate().getTime() - startDate.getTime()) ? b : a);
				}).getDate();
				this.getBookingOptions(nearestCheckOut).subscribe((options: BookingOptions) => {
					this.booking.options = options;
					this.busy = false;
				});
			});
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
