import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Inject, Input, NgZone, PLATFORM_ID } from '@angular/core';
// import * as $fancybox from '@fancyapps/fancybox';
// import * as $ from 'jquery'; // this reload jquery breaking fancybox

@Directive({
	selector: '[fancybox]',
})

export class FancyboxDirective implements AfterViewInit {

	@Input() fancybox: any;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private zone: NgZone,
		private element: ElementRef
	) { }

	ngAfterViewInit() {
		if (isPlatformBrowser(this.platformId)) {
			this.zone.runOutsideAngular(() => {
				$(() => {
					$(this.element.nativeElement).fancybox(this.fancybox);
				});
			});
		}
	}

}
