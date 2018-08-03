import { Component, ViewEncapsulation } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { PageComponent, PageInit, RouteService } from '../../core';

@Component({
	selector: 'generic-component',
	templateUrl: './generic.component.html',
	styleUrls: ['./generic.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class GenericComponent extends PageComponent implements PageInit {

	constructor(
		protected routeService: RouteService
	) {
		super(routeService);
	}

	PageInit(): void {
		console.log('GenericComponent.PageInit', this.page);
		this.routeService.getPageParams().pipe(
			takeUntil(this.unsubscribe),
			first()
		).subscribe(params => {
			console.log('GenericComponent.params', params);
		});
	}

}
