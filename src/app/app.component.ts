import { Component, DoCheck } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { SlugService, LocalStorageService } from './core';
import { DisposableComponent } from './core/disposable';

@Component({
	selector: 'app-component',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent extends DisposableComponent implements DoCheck {

	private date = new Date();
	public cookieAccepted: boolean;

	constructor(
		private slugService: SlugService,
		private storageService: LocalStorageService
	) {
		super();

		const storage = this.storageService.tryGet();
		this.cookieAccepted = storage.get('cookieAccepted');

		this.slugService.register().pipe(
			takeUntil(this.unsubscribe)
		).subscribe();
	}

	ngDoCheck() {
		// called whenever Angular runs change detection
		this.slugService.collect();
	}

	acceptCookie() {
		const storage = this.storageService.tryGet();
		this.cookieAccepted = true;
		storage.set('cookieAccepted', true);
	}

}
