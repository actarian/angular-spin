import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { EntityService } from '../core/models';
import { Destination, DestinationTypes } from './destination';

@Injectable({
	providedIn: 'root',
})
export class DestinationService extends EntityService<Destination> {

	private destination: Destination[];


	get collection(): string {
		return '/api/data/destination';
	}

	getName(name: string): Observable<Destination[]> {
		if (!name || !name.trim()) {
			return of([]);
		}
		return this.get(`?name=${name}`);
	}

	getDestination(): Observable<Destination[]> {
		if (this.destination) {
			return of(this.destination);
		} else {
			return this.get().pipe(
				tap(destination => this.destination = destination)
			);
		}
	}

	sortByType(a: Destination, b: Destination): number {
		const types = [DestinationTypes.Promotion, DestinationTypes.Category, DestinationTypes.Country, DestinationTypes.Region, DestinationTypes.Touristic, DestinationTypes.Province, DestinationTypes.Destination, DestinationTypes.Hotel];
		return types.indexOf(a.type) - types.indexOf(b.type);
	}

	sortByName(query: string): Function {
		return (a: Destination, b: Destination) => {
			const nameA = a.name.toLowerCase();
			const nameB = b.name.toLowerCase();
			const pos = nameA.indexOf(query) - nameB.indexOf(query);
			if (pos === 0) {
				return (nameA < nameB ? -1 : (nameA > nameB ? 1 : 0));
			} else {
				return pos;
			}
		};
	}

	autocomplete(query: string): Observable<any[]> {
		if (!query || !query.trim()) {
			return of([]);
		}
		query = query.toLowerCase();
		return this.getDestination().pipe(
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
					.sort((a, b) => {
						const byType = this.sortByType(a, b);
						if (byType === 0) {
							return this.sortByName(query)(a, b);
						}
						return byType;
					});
			})
		);
	}

}
