import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from '../../core/pages';
import { RouteService } from '../../core/routes';
import { Region, RegionService } from '../../models';

@Component({
	selector: 'page-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})

export class HomeComponent extends PageComponent implements OnInit {

	regions: Region[] = [];

	constructor(
		route: ActivatedRoute,
		private regionService: RegionService,
		public routeService: RouteService
	) {
		super(route);
		this.attrClass = 'home';
	}

	ngOnInit() {
		this.getRegions();
	}

	getRegions(): void {
		this.regionService.getList()
			.takeUntil(this.unsubscribe)
			.subscribe(regions => this.regions = regions.slice(1, 5));
	}
}
