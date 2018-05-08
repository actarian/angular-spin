import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/takeUntil';
import { PageComponent } from '../../core/pages';
import { RouteService } from '../../core/routes';
import { Region, RegionService } from '../../models';

@Component({
	selector: 'view-regions',
	templateUrl: './regions.component.html',
	styleUrls: ['./regions.component.scss']
})

export class RegionsComponent extends PageComponent implements OnInit {

	regions: Region[];

	constructor(
		route: ActivatedRoute,
		private regionService: RegionService,
		public routeService: RouteService
	) {
		super(route);
	}

	ngOnInit() {
		this.getRegions();
	}

	getRegions(): void {
		this.regionService.getList()
			.takeUntil(this.unsubscribe)
			.subscribe(regions => this.regions = regions);
	}

	add(name: string): void {
		name = name.trim();
		if (!name) { return; }
		this.regionService.add({ name } as Region)
			.takeUntil(this.unsubscribe)
			.subscribe(region => {
				this.regions.push(region);
			});
	}

	delete(region: Region): void {
		this.regions = this.regions.filter(h => h !== region);
		this.regionService.delete(region)
			.takeUntil(this.unsubscribe)
			.subscribe();
	}

}
