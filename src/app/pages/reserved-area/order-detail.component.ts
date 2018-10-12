import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core';
import { OrderService, SearchResult } from '../../models';

@Component({
	selector: 'order-detail-component',
	templateUrl: './order-detail.component.html',
	styleUrls: ['./order-detail.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class OrderDetailComponent extends DisposableComponent {

	item: any;
	hotel: SearchResult;

	constructor(
		private route: ActivatedRoute,
		private orderService: OrderService,
	) {
		super();
		const orderYear = this.route.snapshot.params['orderYear'];
		const orderNum = this.route.snapshot.params['orderNum'];
		const orderId = `${orderYear}/${orderNum}`;
		this.orderService.getOrderDetail(orderId).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(item => {
			this.item = item;
			this.hotel = item.serviceDetail;
			console.log('OrderDetailComponent', orderId, this.item);
		});
	}

}
