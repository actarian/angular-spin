import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { SearchResult } from '../../models';

@Component({
	selector: 'serp-item',
	templateUrl: './serp-item.component.html',
	styleUrls: ['./serp-item.component.scss'],
	exportAs: 'results'
})

export class SerpItemComponent implements AfterViewInit {

	@Input()
	item: SearchResult;

	@Input()
	appear: boolean;

	appeared: boolean;

	constructor(
		private changeDetector: ChangeDetectorRef
	) { }

	ngAfterViewInit() {
		this.appeared = true;
		this.changeDetector.detectChanges();
	}

}
