import { Component, OnInit } from '@angular/core';
import { Promotion, PromotionService } from '../../models';

@Component({
	selector: 'section-promotions',
	templateUrl: './promotions.component.html',
	styleUrls: ['./promotions.component.scss']
})

export class PromotionsComponent implements OnInit {

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
