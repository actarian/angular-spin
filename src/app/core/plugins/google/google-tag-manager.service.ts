
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { OnceService } from '../../once';

export class GoogleTagManagerConfig {
	id: string;
}

@Injectable({
	providedIn: 'root'
})
export class GoogleTagManagerService {

	public options: GoogleTagManagerConfig;

	private dataLayer: any[];
	private dataLayer$: Observable<any[]>;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		@Inject(ORIGIN_URL) private originUrl: string,
		private onceService: OnceService,
		private router: Router,
	) {
		this.init();
	}

	private init(): void {
		if (!environment['plugins'] && !environment['plugins']['googleTagManager']) {
			throw new Error('GoogleTagManagerService.error missing config object in environment.plugins.googleTagManager');
		}
		this.options = Object.assign(new GoogleTagManagerConfig(), environment['plugins']['googleTagManager'] as GoogleTagManagerConfig);
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	*  call GoogleTagManagerConfig.once() on app component OnInit *
	* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	once(): Observable<any[]> {
		if (isPlatformBrowser(this.platformId)) {
			if (this.dataLayer) {
				return of(this.dataLayer);
			} else if (this.dataLayer$) {
				return this.dataLayer$;
			} else {
				window['dataLayer'] = window['dataLayer'] || [];
				const id = this.options.id;
				const src = `https://www.googletagmanager.com/gtm.js?id=${id}`;
				const dataLayer = window['dataLayer'];
				dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
				console.log('GoogleTagManagerConfig.once', src, dataLayer);
				this.dataLayer$ = this.onceService.script(src).pipe(
					map(x => {
						// console.log('dataLayer', dataLayer, x);
						this.dataLayer = dataLayer;
						return dataLayer;
					})
				);
				return this.dataLayer$;
			}
		} else {
			return of(null);
		}
	}

}

/*
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TS2H6VG');</script>
<!-- End Google Tag Manager -->
*/

/*
<!-- after <body> -->
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-TS2H6VG"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
*/

/*
window.dataLayer = window.dataLayer || [];
 window.dataLayer.push({
 'event': 'Pageview',
 'url': 'https://www.example.com/something/contact-us'
 });
*/


