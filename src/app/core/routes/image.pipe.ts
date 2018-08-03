import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Image, ImageType } from '../models/image';

@Pipe({
	name: 'image',
	// pure: false
})

@Injectable({
	providedIn: 'root'
})
export class ImagePipe implements PipeTransform {
	transform(images: Image[], type?: string): string {
		type = type || 'Default';
		const imageType: ImageType = ImageType[type] || ImageType.Default;
		let image: Image = null;
		if (images && images.length) {
			image = images.find(i => i.type === imageType);
		}
		return image ? image.url : null;
	}
}
