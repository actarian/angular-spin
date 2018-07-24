import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Feature, FeatureType } from '../../core/models/feature';

@Pipe({
	name: 'hotelFeature'
})

@Injectable()
export class HotelFeaturePipe implements PipeTransform {
	transform(items: Feature[]): Feature[] {
		return items.filter((x: Feature) => (
			x.type === FeatureType.Description
		)).sort((a: Feature, b: Feature) => a.type - b.type);
	}
}
