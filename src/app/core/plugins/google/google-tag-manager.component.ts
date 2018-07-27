import { Component, Inject } from '@angular/core';
import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';
import { filter, takeUntil } from 'rxjs/operators';
import { NavigationEnd, Router } from '../../../../../node_modules/@angular/router';
import { DisposableComponent } from '../../disposable';
import { GoogleTagManagerService } from './google-tag-manager.service';

@Component({
	selector: 'google-tag-manager',
	template: `
	<!-- Google Tag Manager (noscript) -->
		<noscript *ngIf="useIframe && dataLayer">
			<iframe [src]="iframeUrl | safeUrl" height="0" width="0" style="display:none;visibility:hidden"></iframe>
		</noscript>
	<!-- End Google Tag Manager (noscript) -->`,
})

export class GoogleTagManagerComponent extends DisposableComponent {

	useIframe: boolean = true;
	id: string;
	iframeUrl: string;
	dataLayer: any[];

	constructor(
		@Inject(ORIGIN_URL) private originUrl: string,
		private router: Router,
		private googleTagManager: GoogleTagManagerService,
	) {
		super();
		this.router.events.pipe(
			takeUntil(this.unsubscribe),
			filter(e => e instanceof NavigationEnd),
		).subscribe((e: NavigationEnd) => {
			const url = `${this.originUrl}${e.urlAfterRedirects}`;
			// console.log('GoogleTagManagerComponent.NavigationEnd', e.id, e.url, e.urlAfterRedirects, url);
			const event = {
				event: 'PageView',
				url: url,
			};
			if (this.dataLayer) {
				this.dataLayer.push(event);
				// console.log(this.dataLayer);
			} else {
				this.googleTagManager.once().pipe(
					takeUntil(this.unsubscribe)
				).subscribe(dataLayer => {
					// console.log('dataLayer', dataLayer);
					this.id = this.googleTagManager.options.id;
					this.iframeUrl = `https://www.googletagmanager.com/ns.html?id=${this.id}`;
					this.dataLayer = dataLayer;
					this.dataLayer.push(event);
				});
			}
		});
	}

}
