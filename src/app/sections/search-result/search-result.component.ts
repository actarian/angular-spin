import { Component } from '@angular/core';
import { DisposableComponent } from '../../core/disposable';
import { FilterService, SearchService } from '../../models';

@Component({
	selector: 'section-search-result',
	templateUrl: './search-result.component.html',
	styleUrls: ['./search-result.component.scss'],
	exportAs: 'results'
})

export class SearchResultComponent extends DisposableComponent {

	constructor(
		public search: SearchService,
		public filterService: FilterService
	) {
		super();
	}

}
