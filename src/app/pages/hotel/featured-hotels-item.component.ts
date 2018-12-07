
import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core';
import { GtmService, SearchResult, Tag, TagService, WishlistService } from '../../models';

@Component({
	selector: 'featured-hotels-item',
	templateUrl: './featured-hotels-item.component.html',
	styleUrls: ['./featured-hotels-item.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	exportAs: 'results',
})

export class FeaturedHotelsItemComponent extends DisposableComponent implements OnInit {
	tagList: Tag[];

	@Input() item: SearchResult;
	@Input() index?: number = 0;

	constructor(
		// private dispatcher: EventDispatcherService,
		public wishlist: WishlistService,
		private gtm: GtmService,
		private tagService: TagService,
	) {
		super();
	}

	ngOnInit() {
		this.tagService.getTagsByIds(this.item.tags).pipe(
			takeUntil(this.unsubscribe),
		).subscribe(tags => {
			this.tagList = tags;
		});
	}

	onBeforeNav() {
		this.gtm.onProductClick('Related Results', this.item, this.index);
		/*
		this.dispatcher.emit({
			type: 'onProductClick',
			data: { type: 'Related Results', result: this.item, index: this.index, }
		});
		*/
	}

}
