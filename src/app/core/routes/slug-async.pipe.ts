import { ChangeDetectorRef, Injectable, OnDestroy, Pipe, PipeTransform } from '@angular/core';
import { CustomAsyncPipe } from './custom-async.pipe';
import { RoutePipe } from './route.pipe';
import { SlugService } from './slug.service';
// import { RouteService } from './route.service';

@Pipe({
	name: 'slugAsync',
	pure: false
})

@Injectable({
	providedIn: 'root'
})
export class SlugAsyncPipe implements OnDestroy, PipeTransform {

	private asyncPipe: CustomAsyncPipe;

	constructor(
		private changeDetector: ChangeDetectorRef,
		private slugService: SlugService,
		private routePipe: RoutePipe,
		// private routeService: RouteService,
	) {
		this.asyncPipe = new CustomAsyncPipe(this.changeDetector);
	}

	transform(key: string): string[] {
		return this.routePipe.transform(this.asyncPipe.transform(this.slugService.addKey(key)));
		// return this.slugService.addKey(key);
		// return this.routeService.toSlug(key);
	}

	ngOnDestroy(): void {
		this.asyncPipe.dispose();
	}

}
