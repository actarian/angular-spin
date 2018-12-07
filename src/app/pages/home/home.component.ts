import { Component, ViewEncapsulation } from '@angular/core';
import { first } from 'rxjs/operators';
import { PageComponent } from '../../core/pages';
import { RouteService } from '../../core/routes';
import { SearchService } from '../../models';

@Component({
	selector: 'page-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class HomeComponent extends PageComponent {

	constructor(
		protected routeService: RouteService,
		private search: SearchService,
	) {
		super(routeService);
		this.search.getPageParams().pipe(
			first()
		).subscribe(params => {
			this.search.setParams(params);
		});
	}

}
