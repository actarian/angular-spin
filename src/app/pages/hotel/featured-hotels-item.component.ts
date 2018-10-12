
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { GtmService, SearchResult, WishlistService } from '../../models';

@Component({
	selector: 'featured-hotels-item',
	templateUrl: './featured-hotels-item.component.html',
	styleUrls: ['./featured-hotels-item.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	exportAs: 'results',
})

export class FeaturedHotelsItemComponent {

	@Input() item: SearchResult;
	@Input() index?: number = 0;

	constructor(
		// private dispatcher: EventDispatcherService,
		public wishlist: WishlistService,
		private gtm: GtmService,
	) { }

	onBeforeNav() {
		this.gtm.onProductClick('suggestion list', this.item, this.index);
		/*
		this.dispatcher.emit({
			type: 'onProductClick',
			data: { type: 'suggestion list', result: this.item, index: this.index, }
		});
		*/
	}

}
