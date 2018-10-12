import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { DisposableComponent, Page, PageIndex } from '../../core';
import { Category, LandingService } from '../../models';

@Component({
	selector: 'home-categories',
	templateUrl: './home-categories.component.html',
	styleUrls: ['./home-categories.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})
export class HomeCategoriesComponent extends DisposableComponent implements OnInit {

	@Input() type: number;
	limit: number = 6;
	item: Page;
	items: PageIndex[]; // type, destination, time

	categories: Category[] = [];

	constructor(
		private landingService: LandingService,
	) {
		super();
	}

	ngOnInit() {
		this.landingService.getLandings().pipe(
			takeUntil(this.unsubscribe),
			map(x => x.find((p: Page) => p.type === this.type)),
		).subscribe(item => {
			this.item = item;
			this.items = item ? item.related : [];
		});
	}

}
