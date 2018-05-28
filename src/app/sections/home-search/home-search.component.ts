import { Component } from '@angular/core';
import { SearchService } from '../../models';

@Component({
	selector: 'home-search',
	templateUrl: './home-search.component.html',
	styleUrls: ['./home-search.component.scss']
})

export class HomeSearchComponent {

	constructor(
		public search: SearchService,
	) { }

}
