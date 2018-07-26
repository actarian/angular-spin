import { Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { RouteService } from '../../core';
import { PageComponent } from '../../core/pages';
import { FilterService, SearchService, SerpViewTypes } from '../../models';

@Component({
	selector: 'page-search',
	templateUrl: './serp.component.html',
	styleUrls: ['./serp.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class SerpComponent extends PageComponent {

	viewTypes: any = SerpViewTypes;
	viewType: SerpViewTypes = SerpViewTypes.List;

	active: ElementRef;

	constructor(
		protected routeService: RouteService,
		public search: SearchService,
		public filterService: FilterService,
	) {
		super(routeService);
		this.routeService.getPageParams().pipe(
			takeUntil(this.unsubscribe),
			first()
		).subscribe(params => {
			// console.log('SerpComponent.queryParams', params);
			this.search.setParams(params);
		});
	}

}
