import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DisposableComponent } from '../../core';
import { GtmService, SearchResult } from '../../models';

@Component({
	selector: 'featured-hotels-component',
	templateUrl: './featured-hotels.component.html',
	styleUrls: ['./featured-hotels.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class FeaturedHotelsComponent extends DisposableComponent implements OnInit {

	@Input() items: SearchResult[];
	visibleItems: number = 4;

	constructor(
		private gtm: GtmService,
	) {
		super();
	}

	ngOnInit() {
		if (this.items.length) {
			this.gtm.onImpressions(this.items, 'Related Results');
		}
	}

}
