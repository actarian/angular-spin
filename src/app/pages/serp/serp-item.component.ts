
// import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { first } from 'rxjs/operators';
// import { ChangeDetectorRef } from '@angular/core';
import { GtmService, SearchResult, Tag, TagService, TrustPilotMinimumReviews, WishlistService } from '../../models';

@Component({
	selector: 'serp-item',
	templateUrl: './serp-item.component.html',
	styleUrls: ['./serp-item.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	exportAs: 'results',
})

export class SerpItemComponent implements OnInit {

	@Input() item: SearchResult;
	@Input() index?: number = 0;
	@Input() state?: string;
	minimumReviews: number = TrustPilotMinimumReviews;
	tagList: Tag[];

	constructor(
		// private dispatcher: EventDispatcherService,
		public wishlist: WishlistService,
		private tagService: TagService,
		private gtm: GtmService,
	) { }

	ngOnInit() {
		this.tagService.getTagsByIds(this.item.tags).pipe(
			first(),
		).subscribe(tags => {
			this.tagList = tags;
		});
	}

	onBeforeNav() {
		this.gtm.onProductClick('Search Results', this.item, this.index);
		/*
		this.dispatcher.emit({
			type: 'onProductClick',
			data: { type: 'Search Results', result: this.item, index: this.index, }
		});
		*/
	}

}
