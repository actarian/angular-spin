import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { PageComponent } from '../../core/pages';
import { RouteService } from '../../core/routes';
import { Region, RegionService } from '../../models';

@Component({
	selector: 'page-regions',
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
		this.regionService.getList().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(regions => this.regions = regions);
	}

	add(name: string): void {
		name = name.trim();
		if (!name) { return; }
		this.regionService.add({ name } as Region).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(region => {
			this.regions.push(region);
		});
	}

	delete(region: Region): void {
		this.regions = this.regions.filter(h => h !== region);
		this.regionService.delete(region).pipe(
			takeUntil(this.unsubscribe)
		).subscribe();
	}

}
