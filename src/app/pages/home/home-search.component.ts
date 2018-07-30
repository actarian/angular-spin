import { Component, ViewEncapsulation } from '@angular/core';
import { SearchService } from '../../models';

@Component({
	selector: 'home-search',
	templateUrl: './home-search.component.html',
	styleUrls: ['./home-search.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class HomeSearchComponent {

	constructor(
		public search: SearchService,
	) { }

}
