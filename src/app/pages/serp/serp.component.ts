import { Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { DisposableComponent, RouteService } from '../../core';
import { FilterService, SearchService, SerpViewTypes } from '../../models';

@Component({
	selector: 'serp-component',
	templateUrl: './serp.component.html',
	styleUrls: ['./serp.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class SerpComponent extends DisposableComponent {

	viewTypes: any = SerpViewTypes;
	viewType: SerpViewTypes = SerpViewTypes.List;
	active: ElementRef;

	@Input() useBreadcrumbs: boolean = false;

	constructor(
		protected routeService: RouteService,
		public search: SearchService,
		public filterService: FilterService,
	) {
		super();
	}

}
