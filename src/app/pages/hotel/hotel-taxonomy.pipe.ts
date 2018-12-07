import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Taxonomy, TaxonomyId, TaxonomyType } from '../../core/models/taxonomy';

const taxonomyIdArray: any[] = [
	TaxonomyId.News,
	// TaxonomyId.LastSecond,
	// TaxonomyId.LastMinute,
	// TaxonomyId.EarlyBooking,
	TaxonomyId.Pets,
	TaxonomyId.FreeChild,
	TaxonomyId.IncludedFlight,
	TaxonomyId.IncludedFerry,
	TaxonomyId.BeachService,
	TaxonomyId.CardClub,
	TaxonomyId.Skipass,
	TaxonomyId.Wellness,
	TaxonomyId.Pool,
	TaxonomyId.MiniClub,
	TaxonomyId.Animation,
	TaxonomyId.NewYearsEveDinner,
	TaxonomyId.ChristmasDinner,
	TaxonomyId.ChristmasLunch,
	TaxonomyId.EasterLunch,
	TaxonomyId.Voucher,
	TaxonomyId.FreePets
];

@Pipe({
	name: 'hotelTaxonomy'
})

@Injectable({
	providedIn: 'root'
})

export class HotelTaxonomyPipe implements PipeTransform {
	transform(items: Taxonomy[]): Taxonomy[] {
		return items.filter((x: Taxonomy) => (
			x.type === TaxonomyType.Plus ||
			taxonomyIdArray.indexOf(x.id) !== -1
		)).sort((a: Taxonomy, b: Taxonomy) => a.type - b.type);
	}
}
