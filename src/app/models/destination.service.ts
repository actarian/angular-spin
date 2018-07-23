import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityService } from '../core/models';
import { Destination } from './destination';

@Injectable({
	providedIn: 'root',
})
export class DestinationService extends EntityService<Destination> {

	get collection(): string {
		return '/memory/destination';
	}

	getName(name: string): Observable<Destination[]> {
		if (!name || !name.trim()) {
			return of([]);
		}
		return this.get(`?name=${name}`);
	}

	autocomplete(query: string): Observable<any[]> {
		if (!query || !query.trim()) {
			return of([]);
		}
		query = query.toLowerCase();
		return this.get().pipe(
			map((x: Destination[]) => {
				return x
					.map((x: Destination) => {
						return new Destination(x);
					})
					.filter((x: Destination) => {
						return x.name.toLowerCase().indexOf(query) !== -1 ||
							// x.texts.join(', ').toLowerCase().indexOf(query) !== -1;
							x.abstract.toLowerCase().indexOf(query) !== -1;
					})
					.sort((a, b) => a.type > b.type ? 1 : -1)
					/*
					.sort((a, b) => {
						const nameA = a.name.toLowerCase();
						const nameB = b.name.toLowerCase();
						const pos = nameA.indexOf(query) - nameB.indexOf(query);
						if (pos === 0) {
							return (nameA < nameB ? -1 : (nameA > nameB ? 1 : 0));
						} else {
							return pos;
						}
					})
					*/;
			})
		);
	}

}
