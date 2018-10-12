import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EntityService } from '../core/models';
import { Tag } from './tag';

@Injectable({
	providedIn: 'root',
})
export class TagService extends EntityService<Tag> {

	get collection(): string {
		return '/api/data/tag';
	}

	private tags$: BehaviorSubject<Tag[]>;

	getTags(): Observable<Tag[]> {
		if (this.tags$) {
			return this.tags$;
		} else {
			this.tags$ = new BehaviorSubject<Tag[]>([]);
			return this.get().pipe(
				switchMap(tags => {
					this.tags$.next(tags);
					return this.tags$;
				}),
			);
		}
	}

}
