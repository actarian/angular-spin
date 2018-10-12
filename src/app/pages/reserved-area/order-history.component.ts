import { Component, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DisposableComponent, RouteService } from '../../core';
import { Order, OrderService } from '../../models';

@Component({
	selector: 'order-history-component',
	templateUrl: './order-history.component.html',
	styleUrls: ['./order-history.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class OrderHistoryComponent extends DisposableComponent {

	items: Order[];
	visibleItems: number = 20;
	busy: boolean = false;

	constructor(
		protected routeService: RouteService,
		private orderService: OrderService,
	) {
		super();
		this.busy = true;
		this.orderService.getOrders().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(items => {
			this.items = items;
			this.busy = false;
			console.log('OrderHistoryComponent', this.items);
		});
	}

}
