import { Component, Input, ViewEncapsulation } from '@angular/core';
import { Page } from '../../core';
import { SearchService } from '../../models';

@Component({
	selector: 'home-search',
	templateUrl: './home-search.component.html',
	styleUrls: ['./home-search.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class HomeSearchComponent {

	@Input() page: Page;

	constructor(
		public search: SearchService,
	) { }

}
