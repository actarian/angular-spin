import { AfterViewInit, Component, DoCheck } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { GoogleTagManagerPageViewEvent, Label, LabelService, LocalStorageService, SlugService } from './core';
import { DisposableComponent } from './core/disposable';
import { GtmService } from './models';

@Component({
	selector: 'app-component',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent extends DisposableComponent implements DoCheck, AfterViewInit {

	public cookieAccepted: boolean;

	constructor(
		private storageService: LocalStorageService,
		private slugService: SlugService,
		private labelService: LabelService<Label>,
		private gtm: GtmService,
	) {
		super();

		const storage = this.storageService.tryGet();
		this.cookieAccepted = storage.get('cookieAccepted');

		// get slugs from bom
		this.slugService.register().pipe(
			takeUntil(this.unsubscribe)
		).subscribe();

		// get labels from bom
		this.labelService.register().pipe(
			takeUntil(this.unsubscribe)
		).subscribe();
	}

	ngAfterViewInit() {
		// observe gtm service
		this.gtm.observe().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(event => {
			console.log('AppComponent.gtm.observe', event);
		});
	}

	ngDoCheck() {
		// called whenever Angular runs change detection
		// console.log('ngDoCheck');
		this.slugService.collect();
		this.labelService.collect();
	}

	onPageView(e: GoogleTagManagerPageViewEvent) {
		this.gtm.onVirtualPage();
		/*
		const event = {
			event: 'virtualPage',
			// url: url,
		}; // Paolo Zupin <zupin@performancebased.com> (email 03/12/2018)
		e.dataLayer.push(event);
		*/
		/*
		_bcd.Set("wsDebug", 1);
		_bcd.Set("wsPage", doc.CO_ID);
		_bcd.Set("wsCategory", doc.CA_ID);
		_bcd.Set("wsDocType", doc.DocType);
		_bcd.Set("wsTemplate", doc.Data["te_id"]);
		*/
	}

	acceptCookie() {
		const storage = this.storageService.tryGet();
		this.cookieAccepted = true;
		storage.set('cookieAccepted', true);
	}

}
