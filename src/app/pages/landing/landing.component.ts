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
		// console.log('LandingComponent.PageInit');
		const taxonomy: Taxonomy = this.page.taxonomies && this.page.taxonomies.length ? this.page.taxonomies[0] : null;
		this.search.getPageParams().pipe(
			takeUntil(this.unsubscribe),
			first()
		).subscribe(params => {
			// console.log('LandingComponent.queryParams', params);
			params.search = params.search || new MainSearch();
			params.search.destination = null;
			params.filters = params.filters || [];
			if (taxonomy) {
				switch (taxonomy.type) {
					case TaxonomyType.Category:
						params.search.destination = taxonomy;
						params.filters = [{ type: GroupType.Tipology, id: taxonomy.id, unique: true }];
						break;
					case TaxonomyType.Promotion:
						params.search.destination = taxonomy;
						params.filters = [{ type: GroupType.Service, id: taxonomy.id, unique: true }];
						break;
					case TaxonomyType.Country:
					case TaxonomyType.Region:
					case TaxonomyType.Touristic:
					case TaxonomyType.Province:
					case TaxonomyType.Destination:
					case TaxonomyType.Hotel:
						params.search.destination = taxonomy;
						break;
				}
			}
			const tags = params.filters.filter(x => x.type === GroupType.Tipology).map(x => x.id);
			// console.log('LandingComponent.taxonomy', tags);
			this.search.setParams(params);
			this.search.doSearch(tags, true);
			this.search.connect().pipe(
				takeUntil(this.unsubscribe),
			).subscribe(results => {
				// console.log('LandingComponent.results', results);
			});
		});
		/*
		Paolo Zupin (email 30/11/2018)
		SearchType				Search; Filter, Menu
		searchTypology			[Search]   “Regione”; “Paese”; “Struttura”; “Promozione”; “Categoria”; “Località” “Nessuna” ; “Provincia”
								[Filter]   “Regione”; “Paese”; “Promozione”; “Categoria”; “Provincia” “Trattamento” “Stelle”
								[Menu]     “Regione”; “Paese”; “Categoria”
		searchTerm				'Abruzzo' 'Bimbo Gratis' 'Terme & Benessere etc...
		dateFrom				‘01-01-2018’
		travelTime				‘Qualsiasi durata’; ‘1-3 notti’; ‘4-6 notti’; ‘7 notti’; ‘8-13 notti’; ‘14 o più notti’.
		pax						(adulti + bambini)
		chld					Numero bambini
		*/
	}

}
