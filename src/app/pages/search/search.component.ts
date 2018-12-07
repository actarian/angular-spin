import { Component, ViewEncapsulation } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { PageComponent, RouteService } from '../../core';
import { SearchService } from '../../models';

@Component({
	selector: 'search-component',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class SearchComponent extends PageComponent {

	constructor(
		protected routeService: RouteService,
		public search: SearchService,
	) {
		super(routeService);
		this.search.getPageParams().pipe(
			takeUntil(this.unsubscribe),
			first()
		).subscribe(params => {
			// console.log('SearchComponent.queryParams', params);
			this.search.setParams(params);
			this.search.doSearch();
			this.search.connect().pipe(
				takeUntil(this.unsubscribe),
			).subscribe(results => {
				// console.log('SearchComponent.results', results);
			});
		});
	}

}
