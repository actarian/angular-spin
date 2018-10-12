import { Component, ViewEncapsulation } from '@angular/core';
import { first } from 'rxjs/operators';
import { PageComponent } from '../../core/pages';
import { RouteService } from '../../core/routes';
import { LandingService, SearchService } from '../../models';

@Component({
	selector: 'page-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class HomeComponent extends PageComponent {

	// private landings: Page[] = [];

	constructor(
		protected routeService: RouteService,
		private search: SearchService,
		private landingService: LandingService,
	) {
		super(routeService);
		this.routeService.getPageParams().pipe(
			first()
		).subscribe(params => {
			// console.log('HomeComponent.queryParams', params);
			this.search.setParams(params);
		});
		/*
		this.landingService.get().pipe(
			first(),
		).subscribe(landings => this.landings = landings);
		*/
	}

	/*
	getLandingByType(type: number): Observable<Page> {
		return of(this.landings).pipe(
			map(landings => landings.find(x => x.type === type))
		);
	}
	*/

}
