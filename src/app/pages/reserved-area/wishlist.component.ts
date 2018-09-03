import { Component, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core';
import { SearchResult, WishlistService } from '../../models';

@Component({
	selector: 'wishlist-component',
	templateUrl: './wishlist.component.html',
	styleUrls: ['./wishlist.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class WishlistComponent extends DisposableComponent {

	items: SearchResult[];
	visibleItems: number = 20;
	busy: boolean = false;

	constructor(
		public wishlist: WishlistService,
	) {
		super();
		this.busy = true;
		this.wishlist.items().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(items => {
			this.items = items;
			this.busy = false;
		});
	}

}
