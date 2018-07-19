import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
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

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private zone: NgZone,
		protected routeService: RouteService,
		public search: SearchService,
		private hotelService: HotelService
	) {
		super(routeService);
	}

	ngOnInit() {
		this.getHotel();
		if (isPlatformBrowser(this.platformId)) {
			this.getFirstInOut();
		}
	}

	getHotel(): void {
		console.log(`HotelComponent.getHotel ${this.getId()}`);
		this.hotelService.get(`/api/hotel/${this.getId()}`).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(hotel => this.hotel = hotel);
		/*
		this.hotelService.getTopServiceDetailsById(this.getId()).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(hotel => this.hotel = hotel);
		*/
	}

	getFirstInOut(): void {
		this.hotelService.getBookingCheckInById(this.getId(), this.booking)
			.subscribe((checkins: any[]) => {
				if (checkins.length === 0) {
					return;
				}
				const startDate: Date = new Date(); // goal startDate
				checkins = checkins.map(a => new BookingAvailability(a));
				const nearestCheckIn = checkins.reduce((a: BookingAvailability, b: BookingAvailability) => {
					return (Math.abs(b.getDate().getTime() - startDate.getTime()) < Math.abs(a.getDate().getTime() - startDate.getTime()) ? b : a);
				}).date;
				this.calendar.checkins = checkins;
				this.booking.checkIn = nearestCheckIn;
				// console.log('HotelService.getFirstInOut.getBookingCheckInById', this.calendar);
				this.hotelService.getBookingCheckOutById(this.getId(), this.booking)
					.subscribe((checkouts: any[]) => {
						if (checkouts.length === 0) {
							return;
						}
						checkouts = checkouts.map(a => new BookingAvailability(a));
						const nearestCheckOut = checkouts.reduce((a: BookingAvailability, b: BookingAvailability) => {
							return (Math.abs(b.getDate().getTime() - startDate.getTime()) < Math.abs(a.getDate().getTime() - startDate.getTime()) ? b : a);
						}).date;
						this.booking.checkOut = nearestCheckOut;
						this.calendar.checkouts = checkouts;
						// console.log('HotelService.getCheckOut.getBookingCheckOutById', this.calendar);
						this.hotelService.getBookingOptionsById(this.getId(), this.booking)
							.subscribe((options: BookingOptions) => {
								this.booking.options = options;
								// console.log('HotelService.getCheckOut.getBookingOptionsById', this.options);
							});
					});
			});
	}

	getCheckIn(): void {
		this.hotelService.getBookingCheckInById(this.getId(), this.booking)
			.subscribe((checkins: any[]) => {
				console.log('HotelService.getCheckIn', checkins);
			});
	}

	getCheckOut(): void {
		this.hotelService.getBookingCheckOutById(this.getId(), this.booking)
			.subscribe((checkouts: any[]) => {
				console.log('HotelService.getCheckOut', checkouts);
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
