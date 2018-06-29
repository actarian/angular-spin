import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Tag } from '../../models/tag';

@Pipe({
	name: 'hotelTags'
})

@Injectable()
export class HotelTagsPipe implements PipeTransform {
	transform(items: Tag[]): Tag[] {
		return items.filter((x: Tag) => x.category >= 0 && x.category < 2);
	}
}
