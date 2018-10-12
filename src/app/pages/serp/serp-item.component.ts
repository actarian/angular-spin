
// import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, ViewEncapsulation } from '@angular/core';
// import { ChangeDetectorRef } from '@angular/core';
import { GtmService, SearchResult, WishlistService } from '../../models';

@Component({
	selector: 'serp-item',
	templateUrl: './serp-item.component.html',
	styleUrls: ['./serp-item.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	exportAs: 'results',
})

export class SerpItemComponent {

	@Input() item: SearchResult;
	@Input() index?: number = 0;
	@Input() state?: string;

	constructor(
		// private dispatcher: EventDispatcherService,
		public wishlist: WishlistService,
		private gtm: GtmService,
	) { }

	onBeforeNav() {
		this.gtm.onProductClick('Search Result', this.item, this.index);
		/*
		this.dispatcher.emit({
			type: 'onProductClick',
			data: { type: 'Search Result', result: this.item, index: this.index, }
		});
		*/
	}

}
