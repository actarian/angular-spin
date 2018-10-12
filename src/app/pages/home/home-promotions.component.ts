import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { DisposableComponent, Page, PageIndex } from '../../core';
import { LandingService } from '../../models';

@Component({
	selector: 'home-promotions',
	templateUrl: './home-promotions.component.html',
	styleUrls: ['./home-promotions.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})
export class HomePromotionsComponent extends DisposableComponent implements OnInit {

	@Input() type: number;
	limit: number = 3;
	item: Page;
	items: PageIndex[]; // type, destination, time

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
