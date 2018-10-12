import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Page } from '../core';
import { EntityService } from '../core/models';

@Injectable({
	providedIn: 'root',
})
export class LandingService extends EntityService<Page> {

	// cached call
	private landings$: BehaviorSubject<Page[]>;

	get collection(): string {
		return ''; // /api/page/data/landing
	}

	getLandings(): Observable<Page[]> {
		if (this.landings$) {
			return this.landings$;
		} else {
			this.landings$ = new BehaviorSubject<Page[]>([]);
			return this.get(`/api/page/data/landing`).pipe(
				map(landings => landings.map(page => new Page(page))),
				tap(landings => this.landings$.next(landings)),
				switchMap(landing => this.landings$)
			);
		}
	}

}
