import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { RouteService } from './route.service';

@Pipe({
	name: 'slug',
	pure: false
})

@Injectable({
	providedIn: 'root'
})
export class SlugPipe implements PipeTransform {

	constructor(
		private routeService: RouteService,
	) { }

	transform(data: any[] | string): string[] {
		return this.routeService.toSlug(data);
	}

}
