import { isPlatformBrowser } from '@angular/common';
import { Directive, PLATFORM_ID, Inject, ElementRef, Input, AfterViewInit } from '@angular/core';
// import * as $ from 'jquery';

@Directive({
	selector: '[fancybox]',
})

export class FancyboxDirective implements AfterViewInit {

	@Input() fancybox: any;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private el: ElementRef
	) { }

	ngAfterViewInit() {

		if (isPlatformBrowser(this.platformId)) {
			const $ = window['$'];
			// this.el.nativeElement
			$().fancybox(this.fancybox);

		}



	}

}


