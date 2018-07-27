import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Image, ImageType } from '../../core/models/image';

@Pipe({
	name: 'hotelGallery'
})

@Injectable({
	providedIn: 'root'
})
export class HotelGalleryPipe implements PipeTransform {
	transform(items: Image[]): Image[] {
		return items.filter((x: Image) => (
			x.type === ImageType.Gallery
		)).sort((a: Image, b: Image) => a.type - b.type);
	}
}
