import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Feature, FeatureType } from '../../core/models/feature';

@Pipe({
	name: 'hotelFeature'
})

@Injectable({
	providedIn: 'root'
})
export class HotelFeaturePipe implements PipeTransform {
	transform(items: Feature[]): Feature[] {
		return items.filter((x: Feature, i: number) => (
			x.type === FeatureType.Description && i > 0
		)).sort((a: Feature, b: Feature) => a.type - b.type);
	}
}
