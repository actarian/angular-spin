import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Page } from '../../core';
import { Feature } from '../../core/models/feature';
import { FeatureType } from '../../models';

export class Plus {
	type: FeatureType;
	title: string;
	icon: string;
	features: Feature[];
}

@Component({
	selector: 'hotel-plus',
	templateUrl: './hotel-plus.component.html',
	styleUrls: ['./hotel-plus.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class HotelPlusComponent implements OnInit {

	@Input() page: Page;
	public items: Plus[] = [];

	constructor(
	) { }

	ngOnInit() {
		this.items = this.getHotelPlus();
	}

	getHotelPlus(): Plus[] {
		const plusTypes: FeatureType[] = [
			FeatureType.GenericServices,
			FeatureType.WelcomeServices,
			FeatureType.Restaurants,
			FeatureType.Activities,
			FeatureType.Accessibility,
			FeatureType.Beach,
			FeatureType.Wellness,
			FeatureType.Accomodation,
			FeatureType.Discount
		];
		const icons = {};
		icons[FeatureType.GenericServices] = '#ico-fav';
		icons[FeatureType.WelcomeServices] = '#ico-fav';
		icons[FeatureType.Restaurants] = '#ico-fav';
		icons[FeatureType.Activities] = '#ico-fav';
		icons[FeatureType.Accessibility] = '#ico-fav';
		icons[FeatureType.Beach] = '#ico-fav';
		icons[FeatureType.Wellness] = '#ico-fav';
		icons[FeatureType.Accomodation] = '#ico-fav';
		icons[FeatureType.Discount] = '#ico-fav';
		const titles = {};
		titles[FeatureType.GenericServices] = 'Servizi generali';
		titles[FeatureType.WelcomeServices] = 'Servizi di accoglienza';
		titles[FeatureType.Restaurants] = 'Servizi di ristorazione';
		titles[FeatureType.Activities] = 'Attività';
		titles[FeatureType.Accessibility] = 'Accessibilità per disabili';
		titles[FeatureType.Beach] = 'Servizi di spiaggia';
		titles[FeatureType.Wellness] = 'Piscina & Servizi benessere';
		titles[FeatureType.Accomodation] = 'Sistemazione';
		titles[FeatureType.Discount] = 'Promozioni e sconti';
		const plus = plusTypes.map(x => {
			return {
				type: x,
				title: titles[x],
				icon: icons[x],
				features: this.page.getFeaturesByTypes([x])
			};
		});
		return plus.filter(x => x.features.length > 0);
	}
}
