import { Component, DoCheck } from '@angular/core';
import { takeUntil } from '../../node_modules/rxjs/operators';
import { SlugService } from './core';
import { DisposableComponent } from './core/disposable';

@Component({
	selector: 'app-component',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent extends DisposableComponent implements DoCheck {

	private date = new Date();

	constructor(
		private slugService: SlugService,
	) {
		super();
		this.slugService.register().pipe(
			takeUntil(this.unsubscribe)
		).subscribe();
	}

	ngDoCheck() {
		// called whenever Angular runs change detection
		this.slugService.collect();
	}

}
