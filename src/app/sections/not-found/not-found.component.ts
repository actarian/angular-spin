import { Component, ViewEncapsulation } from '@angular/core';
import { PageComponent, RouteService } from '../../core';
import { SearchService } from '../../models';

@Component({
	selector: 'view-not-found',
	templateUrl: './not-found.component.html',
	styleUrls: ['./not-found.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})
export class NotFoundComponent extends PageComponent {

	constructor(
		protected routeService: RouteService,
		public search: SearchService,
	) {
		super(routeService);
	}

}
