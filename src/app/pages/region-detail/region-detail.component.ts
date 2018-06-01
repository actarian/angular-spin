import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from '../../core/pages';
import { Region, RegionService } from '../../models';

@Component({
	selector: 'page-region-detail',
	templateUrl: './region-detail.component.html',
	styleUrls: ['./region-detail.component.scss']
})
export class RegionDetailComponent extends PageComponent implements OnInit {

	@Input() region: Region;

	constructor(
		route: ActivatedRoute,
		private location: Location,
		private regionService: RegionService
	) {
		super(route);
	}

	ngOnInit() {
		// console.log(`RegionDetailComponent.OnInit ${id} ${this.page}`);
		this.getRegion();
	}

	getRegion(): void {
		this.regionService.getDetailById(this.getId())
			.takeUntil(this.unsubscribe)
			.subscribe(region => this.region = region);
	}

	save(): void {
		this.regionService.update(this.region)
			.takeUntil(this.unsubscribe)
			.subscribe(() => this.goBack());
	}

	goBack(): void {
		this.location.back();
	}
}
