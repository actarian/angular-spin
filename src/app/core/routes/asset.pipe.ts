import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SegmentPipe } from './segment.pipe';

@Pipe({
	name: 'asset',
	// pure: false
})

@Injectable()
export class AssetPipe implements PipeTransform {

	constructor(
		private segment: SegmentPipe
	) { }

	transform(data: any[] | string): string {
		if (typeof data === 'string' && data.indexOf('http') === 0) {
			return data;
		} else {
			const segments = this.segment.transform(data);
			segments.unshift(environment.assets);
			return segments.join('/');
		}
	}

}
