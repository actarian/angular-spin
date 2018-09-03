import { Component, ViewEncapsulation } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { PageComponent, PageInit, RouteService } from '../../core';

@Component({
	selector: 'order-history-component',
	templateUrl: './order-history.component.html',
	styleUrls: ['./order-history.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class OrderHistoryComponent extends PageComponent implements PageInit {

	constructor(
		protected routeService: RouteService
	) {
		super(routeService);
	}

	PageInit(): void {
		console.log('OrderHistoryComponent.PageInit', this.page);
		this.routeService.getPageParams().pipe(
			takeUntil(this.unsubscribe),
			first()
		).subscribe(params => {
			console.log('OrderHistoryComponent.params', params);
		});
	}

}
