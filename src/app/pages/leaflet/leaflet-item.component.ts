
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Page } from '../../core';
import { BookingService, GtmService, WishlistService } from '../../models';

@Component({
	selector: 'leaflet-item',
	templateUrl: './leaflet-item.component.html',
	styleUrls: ['./leaflet-item.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	exportAs: 'results',
})

export class LeafletItemComponent implements OnInit {

	@Input() item: Page;
	@Input() index?: number = 0;
	@Input() state?: string;

	constructor(
		private bookingService: BookingService,
		public wishlist: WishlistService,
		private gtm: GtmService,
	) { }

	ngOnInit() {
		/*
		this.bookingService.getTopServiceDetailById(this.page.id).pipe(
			first(),
		).subscribe((hotel: Hotel) => {
			this.item = hotel;
		});
		*/
	}

	onBeforeNav() {
		// this.gtm.onProductClick('Promotion', this.item, this.index);
		/*
		this.dispatcher.emit({
			type: 'onProductClick',
			data: { type: 'Promotion', result: this.item, index: this.index, }
		});
		*/
	}

}
