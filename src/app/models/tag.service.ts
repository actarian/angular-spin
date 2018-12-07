import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
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

	getTagsByIds(ids: (string | number)[]): Observable<Tag[]> {
		// const ids: (string | number)[] = this.hotel.tagList ? this.hotel.tagList.map(x => x.id) : [];
		return this.getTags().pipe(
			map((tags: Tag[]) => {
				return tags ? tags.filter(x => ids.indexOf(x.id) !== -1) : null;
			})
		);
	}

	getTagIconById(id: number): Observable<string> {
		return this.getTags().pipe(
			map((tags: Tag[]) => {
				const tag = tags.find(t => t.id === id);
				return tag ? tag.icon : null;
			}
			));
	}
}
