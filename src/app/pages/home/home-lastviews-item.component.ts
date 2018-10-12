
import { Component, Input, ViewEncapsulation } from '@angular/core';
import { GtmService, SearchResult, WishlistService } from '../../models';

@Component({
	selector: 'home-lastviews-item',
	templateUrl: './home-lastviews-item.component.html',
	styleUrls: ['./home-lastviews-item.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	exportAs: 'results',
})

export class HomeLastViewsItemComponent {

	@Input() item: SearchResult;
	@Input() index?: number;

	constructor(
		// private dispatcher: EventDispatcherService,
		public wishlist: WishlistService,
		private gtm: GtmService,
	) { }

	onBeforeNav() {
		this.gtm.onProductClick('last views', this.item, this.index);
		/*
		this.dispatcher.emit({
			type: 'onProductClick',
			data: { type: 'last views', result: this.item, index: this.index, }
		});
		*/
	}

}
