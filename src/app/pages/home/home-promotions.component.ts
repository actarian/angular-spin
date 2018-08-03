import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageIndex } from '../../core';
import { LandingService, Promotion, PromotionService } from '../../models';

@Component({
	selector: 'section-promotions',
	templateUrl: './home-promotions.component.html',
	styleUrls: ['./home-promotions.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class HomePromotionsComponent implements OnInit {

	@Input() type: number;
	items$: Observable<PageIndex[]>; // type, destination, time

	promotions: Promotion[] = [];

	constructor(
		private landingService: LandingService,
		private promotionService: PromotionService,
	) { }

	ngOnInit() {
		this.items$ = this.landingService.get().pipe(
			map(x => x.filter((p: PageIndex) => p.type === this.type))
		);
		// this.getPromotions();
	}

	getPromotions(): void {
		this.promotionService.getList().subscribe(x => this.promotions = x.slice(0, 3));
	}

}
