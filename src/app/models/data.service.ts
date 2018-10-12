import { Injectable } from '@angular/core';
import { combineLatest, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Entity, EntityService } from '../core/models';

export class Nation {
	code: string;
	isoCode: string;
	name: string;
}

export class County {
	id: string;
	value: string;
}

@Injectable({
	providedIn: 'root',
})
export class DataService extends EntityService<any> {

	get collection(): string {
		return '/api/data';
	}

	nations(): Observable<Nation[]> {
		return this.get(`/nation`).pipe(
			map(nations => nations.sort((a: Nation, b: Nation) => {
				const aa: string = a.name.toLowerCase();
				const bb: string = b.name.toLowerCase();
				if (aa < bb) {
					return -1;
				}
				if (aa > bb) {
					return 1;
				}
				return 0;
			}))
		);
	}

	counties(): Observable<County[]> {
		return this.get(`/province`).pipe(
			map(nations => nations.sort((a: County, b: County) => {
				const aa: string = a.value.toLowerCase();
				const bb: string = b.value.toLowerCase();
				if (aa < bb) {
					return -1;
				}
				if (aa > bb) {
					return 1;
				}
				return 0;
			}))
		);
	}

	support(): Observable<County[]> {
		return this.get(`/support`);
	}

	nationsAndCounties() {
		return combineLatest(
			this.nations(),
			this.counties()
		).pipe(
			switchMap((data: any[]) => {
				return of({
					nations: data[0],
					counties: data[1],
				});
			})
		);
	}

	typesNationsAndCounties(): Observable<any> {
		return this.get(`/structure`).pipe(
			map(result => {
				return {
					types: result.type,
					nations: this.sortEntity(result.country),
					counties: this.sortEntity(result.province),
				};
			})
		);
	}

	private sortEntity(array: Entity[]): Entity[] {
		return array.sort((a: Entity, b: Entity) => {
			const aa: string = a.name.toLowerCase();
			const bb: string = b.name.toLowerCase();
			if (aa < bb) {
				return -1;
			}
			if (aa > bb) {
				return 1;
			}
			return 0;
		});
	}

}
