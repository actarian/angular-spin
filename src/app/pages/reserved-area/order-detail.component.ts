import { Component, ViewEncapsulation } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { PageComponent, PageInit, RouteService } from '../../core';

@Component({
	selector: 'order-detail-component',
	templateUrl: './order-detail.component.html',
	styleUrls: ['./order-detail.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class OrderDetailComponent extends PageComponent implements PageInit {

	constructor(
		protected routeService: RouteService
	) {
		super(routeService);
	}

	PageInit(): void {
		console.log('OrderDetailComponent.PageInit', this.page);
		this.routeService.getPageParams().pipe(
			takeUntil(this.unsubscribe),
			first()
		).subscribe(params => {
			console.log('OrderDetailComponent.params', params);
		});
	}

}
