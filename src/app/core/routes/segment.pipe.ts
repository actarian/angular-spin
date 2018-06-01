
import { Location } from '@angular/common';
import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'segment',
})

@Injectable()
export class SegmentPipe implements PipeTransform {

	constructor(
		private location: Location
	) { }

	transform(segments: any[] | string): any[] {
		segments = segments != null ? (Array.isArray(segments) ? segments : segments.split('/')) : [];
		let paths = segments.filter(x => {
			return typeof x === 'string';
		});
		const datas = segments.filter(x => {
			return typeof x !== 'string';
		});
		let path: string = paths.join('/');
		path = this.location.normalize(path);
		if (path.indexOf('/') !== 0) {
			path = `/${path}`;
		}
		paths = path.split('/');
		// console.log('SegmentPipe', paths.length, datas.length);
		return paths.concat(datas);
	}
}
