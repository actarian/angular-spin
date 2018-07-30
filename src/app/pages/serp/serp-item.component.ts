
// import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, Input, ViewEncapsulation } from '@angular/core';
// import { ChangeDetectorRef } from '@angular/core';
import { SearchResult, WishlistService } from '../../models';

@Component({
	selector: 'serp-item',
	templateUrl: './serp-item.component.html',
	styleUrls: ['./serp-item.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	exportAs: 'results',
	/*
	animations: [
		trigger('animationState', [
			state('outside', style({
				opacity: 0, transform: 'translateY(0)'
			})),
			state('inside', style({
				opacity: 1, transform: 'translateY(-100%)'
			})),
			transition('void => inside', animate('250ms ease-in-out')),
			transition('inside => void', animate('250ms ease-in-out')),
		])
	]
	*/
})

export class SerpItemComponent implements AfterViewInit {

	@Input()
	state: string;

	@Input()
	item: SearchResult;

	constructor(
		public wishlist: WishlistService
		// private changeDetector: ChangeDetectorRef
	) { }

	ngAfterViewInit() {
		// this.changeDetector.detectChanges();
	}

}
