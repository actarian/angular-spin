import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Tag, TagType } from '../../models/tag';

@Pipe({
	name: 'hotelTags'
})

@Injectable()
export class HotelTagsPipe implements PipeTransform {
	transform(items: Tag[]): Tag[] {
		return items.filter((x: Tag) => (
			x.category === TagType.Special ||
			x.category === TagType.Promotion
		)).sort((a: Tag, b: Tag) => a.category - b.category);
	}
}
