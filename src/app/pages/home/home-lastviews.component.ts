import { Component, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core';
import { LastViewsService, SearchResult } from '../../models';

@Component({
	selector: 'home-lastviews',
	templateUrl: './home-lastviews.component.html',
	styleUrls: ['./home-lastviews.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class HomeLastViewsComponent extends DisposableComponent {

	items: SearchResult[];
	visibleItems: number = 3;
	busy: boolean = false;

	constructor(
		public lastViews: LastViewsService,
	) {
		super();
		this.busy = true;
		this.lastViews.items().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(items => {
			this.items = items;
			this.busy = false;
		});
	}
}
