import { Component, ViewEncapsulation } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { PageComponent, PageInit, RouteService } from '../../core';

@Component({
	selector: 'reserved-area-component',
	templateUrl: './reserved-area.component.html',
	styleUrls: ['./reserved-area.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class ReservedAreaComponent extends PageComponent implements PageInit {

	constructor(
		protected routeService: RouteService
	) {
		super(routeService);
	}

	PageInit(): void {
		console.log('ReservedAreaComponent.PageInit', this.page);
		this.routeService.getPageParams().pipe(
			takeUntil(this.unsubscribe),
			first()
		).subscribe(params => {
			console.log('ReservedAreaComponent.params', params);
		});
	}

}
