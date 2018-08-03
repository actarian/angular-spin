import { Component, ElementRef, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		protected routeService: RouteService,
		public search: SearchService,
		public filterService: FilterService,
	) {
		super();
		// Router.resetConfig() cannot be used here because child route config in lazy module cannot be seen by using Router.
		/*
		this.activatedRoute.routeConfig.children = [
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
			{ path: 'list', component: SerpListComponent },
			{ path: 'map', component: SerpMapComponent },
		];
		*/
		/*
		const segments: UrlSegment[] = this.activatedRoute.snapshot.url;
		if (segments.length && !segments.find(s => s.path === 'list')) {
			segments.push(new UrlSegment('list', {}));
			this.router.navigate(segments);
			console.log('router.navigate');
		}
		*/
		/*
		this.routeService.getPageParams().pipe(
			takeUntil(this.unsubscribe),
			first()
		).subscribe(params => {
			console.log('SerpComponent.queryParams', params);
			this.search.setParams(params);
			this.search.doSearch();
			this.search.connect().pipe(
				takeUntil(this.unsubscribe),
			).subscribe(results => {
				// console.log('SerpComponent.results', results);
			});
		});
		*/
	}

}
