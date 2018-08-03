import { Component, ViewEncapsulation } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { PageComponent, PageInit, RouteService, Taxonomy, TaxonomyType } from '../../core';
import { GroupType, MainSearch, SearchService } from '../../models';

@Component({
	selector: 'landing-component',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class LandingComponent extends PageComponent implements PageInit {

	constructor(
		protected routeService: RouteService,
		public search: SearchService,
	) {
		super(routeService);
	}

	PageInit(): void {
		const taxonomy: Taxonomy = this.page.taxonomies && this.page.taxonomies.length ? this.page.taxonomies[0] : null;
		this.routeService.getPageParams().pipe(
			takeUntil(this.unsubscribe),
			first()
		).subscribe(params => {
			params.search = params.search || new MainSearch();
			params.search.destination = null;
			if (taxonomy) {
				switch (taxonomy.type) {
					case TaxonomyType.Country:
					case TaxonomyType.Region:
					case TaxonomyType.Destination:
						params.search.destination = taxonomy;
						break;
					case TaxonomyType.Category:
						params.filters = [{ type: GroupType.Tipology, id: taxonomy.id, unique: true }];
						break;
					case TaxonomyType.Promotion:
						// params.filters = [{ type: taxonomy.type, items: [{ id: taxonomy.id }] }];
						params.filters = [{ type: GroupType.Service, id: taxonomy.id, unique: true }];
						break;
					case TaxonomyType.Special:
						console.log('SPECIAL');
						break;
				}
			}
			console.log('LandingComponent.taxonomy', taxonomy);
			// console.log('LandingComponent.queryParams', params);
			this.search.setParams(params);
			this.search.doSearch();
			this.search.connect().pipe(
				takeUntil(this.unsubscribe),
			).subscribe(results => {
				// console.log('SerpComponent.results', results);
			});
		});
	}

}
