import { Component, ViewEncapsulation, Input } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core';
import { SearchResult, WishlistService } from '../../models';

@Component({
	selector: 'featured-hotels-component',
	templateUrl: './featured-hotels.component.html',
	styleUrls: ['./featured-hotels.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class FeaturedHotelsComponent extends DisposableComponent {

	@Input() items: SearchResult[];
	visibleItems: number = 4;
}
