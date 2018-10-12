
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { WishlistService } from '../../models';

@Component({
	selector: 'order-history-item',
	templateUrl: './order-history-item.component.html',
	styleUrls: ['./order-history-item.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	exportAs: 'results',
})

export class OrderHistoryItemComponent {

	@Input() state: string;
	@Input() item: any;

	constructor(
		public wishlist: WishlistService
	) { }

}
