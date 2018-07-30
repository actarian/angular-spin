import { Location } from '@angular/common';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { RouteService } from '../../core';
import { PageComponent } from '../../core/pages';
import { Region, RegionService } from '../../models';

@Component({
	selector: 'page-region-detail',
	templateUrl: './region-detail.component.html',
	styleUrls: ['./region-detail.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})
export class RegionDetailComponent extends PageComponent implements OnInit {

	@Input() region: Region;

	constructor(
		protected routeService: RouteService,
		private location: Location,
		private regionService: RegionService
	) {
		super(routeService);
	}

	ngOnInit() {
		// console.log(`RegionDetailComponent.OnInit ${id} ${this.page}`);
		this.getRegion();
	}

	getRegion(): void {
		this.regionService.getDetailById(this.getId()).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(region => this.region = region);
	}

	save(): void {
		this.regionService.update(this.region).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(() => this.goBack());
	}

	goBack(): void {
		this.location.back();
	}
}
