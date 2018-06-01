import { Component } from '@angular/core';
import { Logger } from './core/logger';

@Component({
	selector: 'app-component',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})

export class AppComponent {

	constructor(
		private logger: Logger
	) { }

}
