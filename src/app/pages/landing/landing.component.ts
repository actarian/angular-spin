import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { PageComponent, PageInit, RouteService, Taxonomy, TaxonomyType } from '../../core';
import { GroupType, MainSearch, SearchService } from '../../models';

@Component({
	selector: 'landing-component',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class LandingComponent extends PageComponent implements PageInit, AfterViewInit {

	readmore: boolean;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		protected routeService: RouteService,
		public search: SearchService,
	) {
		super(routeService);
	}

	ngAfterViewInit() {
		this.readMoreDescMobile();
	}

	readMoreDescMobile() {
		if (isPlatformBrowser(this.platformId)) {
			if (window.innerWidth <= 575) {
				const accordion = document.querySelector('.readmore-accordion') as HTMLElement;
				if (accordion.offsetHeight > 120) {
					accordion.classList.add('active');
				}
			}
		}
	}

	PageInit(): void {
		const taxonomy: Taxonomy = this.page.taxonomies && this.page.taxonomies.length ? this.page.taxonomies[0] : null;
		this.routeService.getPageParams().pipe(
			takeUntil(this.unsubscribe),
			first()
		).subscribe(params => {
			params.search = params.search || new MainSearch();
			params.search.destination = null;
			params.filters = params.filters || [];
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
			const tags = params.filters.filter(x => x.type === GroupType.Tipology).map(x => x.id);
			console.log('LandingComponent.taxonomy', tags);
			this.search.setParams(params);
			this.search.doSearch(tags);
			this.search.connect().pipe(
				takeUntil(this.unsubscribe),
			).subscribe(results => {
				// console.log('SerpComponent.results', results);
			});
		});
	}

}
