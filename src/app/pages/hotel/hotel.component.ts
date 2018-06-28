import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit, PLATFORM_ID, Inject, ElementRef, Input, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from '../../core/pages';
import { RouteService } from '../../core/routes';
import { Region, RegionService } from '../../models';
import { SwiperModule } from 'ngx-swiper-wrapper';

@Component({
	selector: 'page-hotel',
	templateUrl: './hotel.component.html',
	styleUrls: ['./hotel.component.scss']
})

export class HotelComponent extends PageComponent implements OnInit, AfterViewInit {

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private el: ElementRef,
		route: ActivatedRoute
	) { super(route); }


	public fancyboxOptions: any = {
		selector: '[data-fancybox="gallery"]',
		loop: true,
		buttons: ['close'],
		thumbs: {
			autoStart: true
		},
		btnTpl: {
			close:
				'<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">' +
				'<svg viewBox="0 0 40 40">' +
				'<use xlink:href="#ico-close"></use>' +
				'</svg>' +
				'</button>',
			arrowLeft:
				'<a data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}" href="javascript:;"></a>',
			arrowRight:
				'<a data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}" href="javascript:;"></a>'
		},
	};

	ngOnInit() {
	}

	ngAfterViewInit() {
		if (isPlatformBrowser(this.platformId)) {
			const $ = window['$'];

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
					$button.on('click', function (ev) {
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

						ev.preventDefault();
					});
				}

				activationCheck();


			});
		}
	}

}
