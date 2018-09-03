import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EntityService } from '../core/models';

export class Nation {
	code: string;
	isoCode: string;
	name: string;
}

@Injectable({
	providedIn: 'root',
})
export class DataService extends EntityService<any> {

	get collection(): string {
		return '/api/data';
	}

	nations(): Observable<Nation[]> {
		return this.get(`/nations`).pipe(
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

}
