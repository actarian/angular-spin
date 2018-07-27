import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Taxonomy, TaxonomyType } from '../../core/models/taxonomy';

@Pipe({
	name: 'hotelTaxonomy'
})

@Injectable({
	providedIn: 'root'
})
export class HotelTaxonomyPipe implements PipeTransform {
	transform(items: Taxonomy[]): Taxonomy[] {
		return items.filter((x: Taxonomy) => (
			x.type === TaxonomyType.Special ||
			x.type === TaxonomyType.Promotion
		)).sort((a: Taxonomy, b: Taxonomy) => a.type - b.type);
	}
}
