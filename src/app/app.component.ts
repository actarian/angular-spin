import { Component } from '@angular/core';
import { DisposableComponent } from './core/disposable';
import { Logger } from './core/logger';

@Component({
	selector: 'app-component',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent extends DisposableComponent {

	constructor(
		private logger: Logger,
	) {
		super();
	}

}
