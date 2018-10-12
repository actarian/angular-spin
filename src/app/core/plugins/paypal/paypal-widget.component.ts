import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';
import { takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../disposable';
import { PayPalConfig, PayPalService } from './paypal.service';

@Component({
	selector: 'paypal-widget-component',
	template: `<div id="#paypal-widget-button"></div>`,
})

export class PayPalWidgetComponent extends DisposableComponent implements AfterViewInit {

	@Input() paypalOptions: PayPalConfig;
	loaded: boolean;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		@Inject(ORIGIN_URL) private originUrl: string,
		private paypalService: PayPalService,
	) {
		super();
	}

	ngAfterViewInit() {
		if (isPlatformBrowser(this.platformId)) {
			this.paypalService.render(this.paypalOptions, '#paypal-widget-button').pipe(
				takeUntil(this.unsubscribe)
			).subscribe(paypal => console.log('PayPalWidgetComponent.rendered', paypal));
		}
	}

}
