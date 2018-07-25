import { Component, OnInit } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { PageComponent } from '../../core/pages';
import { RouteService } from '../../core/routes';
import { Region, RegionService, SearchService } from '../../models';

@Component({
	selector: 'page-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})

export class HomeComponent extends PageComponent implements OnInit {

	regions: Region[] = [];

	constructor(
		protected routeService: RouteService,
		private search: SearchService,
		private regionService: RegionService,
	) {
		super(routeService);
		this.routeService.getPageParams().pipe(
			takeUntil(this.unsubscribe),
			first()
		).subscribe(params => {
			// console.log('HomeComponent.queryParams', params);
			this.search.setParams(params);
		});
		// this.attrClass = 'home';
	}

	ngOnInit() {
		this.getRegions();
	}

	getRegions(): void {
		this.regionService.getList().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(regions => this.regions = regions.slice(1, 5));
	}
}
