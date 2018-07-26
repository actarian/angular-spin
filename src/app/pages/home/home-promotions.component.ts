import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Promotion, PromotionService } from '../../models';

@Component({
	selector: 'section-promotions',
	templateUrl: './home-promotions.component.html',
	styleUrls: ['./home-promotions.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class HomePromotionsComponent implements OnInit {

	promotions: Promotion[] = [];

	constructor(
		private promotionService: PromotionService,
	) { }

	ngOnInit() {
		this.getPromotions();
	}

	getPromotions(): void {
		this.promotionService.getList().subscribe(x => this.promotions = x.slice(0, 3));
	}

}
