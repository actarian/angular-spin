import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { first } from 'rxjs/operators';
import { PageComponent, RouteService } from '../../core';
import { LeafletService } from './leaflet.service';

@Component({
	selector: 'leaflet-component',
	templateUrl: './leaflet.component.html',
	styleUrls: ['./leaflet.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class LeafletComponent extends PageComponent implements OnInit {

	leaflets: any[];

	constructor(
		protected routeService: RouteService,
		protected leafletService: LeafletService
	) {
		super(routeService);
	}

	ngOnInit() {
		this.leafletService.items().pipe(
			first(),
		).subscribe(leaflets => this.leaflets = leaflets);
	}

}
