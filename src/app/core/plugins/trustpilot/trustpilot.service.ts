
import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { OnceService } from '../../once';

export class TrustPilotConfig {
	templateId: string = '544a426205dc0a09088833c6';
	businessunitId: string = '58e253ab0000ff00059fc0fe';
	businessunitName: string = 'www.eurospin-viaggi.it';
}

@Injectable({
	providedIn: 'root'
})
export class TrustPilotService {

	public options: TrustPilotConfig;
	private Trustpilot: any;
	private Trustpilot$: Observable<any>;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		@Inject(ORIGIN_URL) private originUrl: string,
		private onceService: OnceService,
	) {
		this.init();
	}

	private init(): void {
		if (!environment['plugins'] && !environment['plugins']['trustPilot']) {
			throw new Error('TrustPilotService.error missing config object in environment.plugins.trustPilot');
		}
		this.options = Object.assign(new TrustPilotConfig(), environment['plugins']['trustPilot'] as TrustPilotConfig);
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	*  call TrustPilotConfig.once() on app component OnInit *
	* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	once(): Observable<any[]> {
		if (isPlatformBrowser(this.platformId)) {
			if (this.Trustpilot) {
				return of(this.Trustpilot);
			} else if (this.Trustpilot$) {
				return this.Trustpilot$;
			} else {
				const src = `https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js`;
				console.log('TrustPilotConfig.once', src);
				this.Trustpilot$ = this.onceService.script(src).pipe(
					map(x => {
						this.Trustpilot = window['Trustpilot'];
						return this.Trustpilot;
					})
				);
				return this.Trustpilot$;
			}
		} else {
			return of(null);
		}
	}

}
