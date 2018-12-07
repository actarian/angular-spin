import { Component, ViewEncapsulation } from '@angular/core';
import { PageComponent, PageInit, RouteService } from '../../core';

@Component({
	selector: 'leaflet-detail-component',
	templateUrl: './leaflet-detail.component.html',
	styleUrls: ['./leaflet-detail.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class LeafletDetailComponent extends PageComponent implements PageInit {

	visibleItems: number = 12;
	promotions: any[];

	constructor(
		protected routeService: RouteService,
	) {
		super(routeService);
	}

	PageInit() {
		this.promotions = this.page.related.filter(x => x.type === 0);
		console.log('promotions', this.promotions, this.page);
		/*
		this.leafletService.items().pipe(
			first(),
		).subscribe(leaflets => this.leaflets = leaflets);
		*/
	}

}
