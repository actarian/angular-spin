import { Component, ViewEncapsulation } from '@angular/core';
import { DisposableComponent } from '../../core/disposable';
import { FilterService, SearchService } from '../../models';

@Component({
	selector: 'section-serp-list',
	templateUrl: './serp-list.component.html',
	styleUrls: ['./serp-list.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	exportAs: 'results'
})

export class SerpListComponent extends DisposableComponent {

	constructor(
		public search: SearchService,
		public filterService: FilterService
	) {
		super();
	}

}
