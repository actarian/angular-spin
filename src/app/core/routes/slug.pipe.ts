import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs';
// import { RouteService } from './route.service';
import { SlugService } from './slug.service';

@Pipe({
	name: 'slug',
	pure: false
})

@Injectable({
	providedIn: 'root'
})
export class SlugPipe implements PipeTransform {

	constructor(
		// private routeService: RouteService,
		private slugService: SlugService
	) { }

	transform(key: string): Observable<string> {
		return this.slugService.addKey(key);
		// return this.async.transform<any>(this.slugService.addKey(key));
		// return this.routeService.toSlug(key);
	}

}
