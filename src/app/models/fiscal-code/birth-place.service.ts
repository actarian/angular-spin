import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Entity, EntityService } from '../../core';
import { BirthPlace } from './birth-place';

@Injectable({
	providedIn: 'root',
})
export class BirthPlaceService extends EntityService<any> {

	get collection(): string {
		return '';
	}

	private cached: BirthPlace[];

	static toEntity(item: BirthPlace): Entity {
		return {
			id: item.code,
			name: item.name.toLowerCase().replace(/\b\w/g, (t) => t.toUpperCase()),
		};
	}

	all(): Observable<BirthPlace[]> {
		if (this.cached) {
			return of(this.cached);
		} else {
			return this.get(`/api/birthPlace`).pipe(
				tap(x => this.cached = x)
			);
		}
	}

	toEntities(): Observable<Entity[]> {
		return this.all().pipe(
			map(b => b.map(x => BirthPlaceService.toEntity(x))),
		);
	}

	byName(name: string): Observable<BirthPlace[]> {
		name = BirthPlace.normalizeString(name);
		return this.get(`/api/birthPlace/${name}`);
	}

	byNameAndProvince(name: string, province: string): Observable<BirthPlace[]> {
		name = BirthPlace.normalizeString(name);
		return this.post(`/api/birthPlace/ByNameAndProvince/`, { name, province });
	}

	byCode(code: string): Observable<BirthPlace[]> {
		return this.post(`/api/birthPlace/ByCode/${code}`);
	}

	findByName(name: string): Observable<BirthPlace> {
		return this.byName(name).pipe(
			map(m => m.find(x => x.name.toUpperCase() === name.toUpperCase()))
		);
	}

	findByNameAndProvince(name: string, province: string): Observable<BirthPlace> {
		return this.byNameAndProvince(name, province).pipe(
			map(m => m.find(x => x.name.toUpperCase() === name.toUpperCase() && x.province.toUpperCase() === province.toUpperCase()))
		);
	}

	findByCode(code: string): Observable<BirthPlace> {
		return this.byCode(code).pipe(
			map(m => m.find(x => x.code === code))
		);
	}

	entitiesByName(name: string): Observable<Entity[]> {
		return this.byName(name).pipe(
			map(b => b.map(x => BirthPlaceService.toEntity(x))),
		);
	}

	entitiesByNameAndProvince(name: string, province: string): Observable<Entity[]> {
		return this.byNameAndProvince(name, province).pipe(
			map(b => b.map(x => BirthPlaceService.toEntity(x))),
		);
	}

	entitiesByCode(code: string): Observable<Entity[]> {
		return this.byCode(code).pipe(
			map(b => b.map(x => BirthPlaceService.toEntity(x))),
		);
	}

}
