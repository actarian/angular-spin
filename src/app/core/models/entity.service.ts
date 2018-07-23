import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Entity } from './entity';
import { IdentityService } from './identity.service';

@Injectable()
export class EntityService<T extends Entity> extends IdentityService<T> {

	get collection(): string {
		return '/memory/entity';
	}

	getDetailByName(name: string): Observable<T[]> {
		if (!name.trim()) {
			// if not search term, return empty identity array.
			return of([]);
		}
		return this.get(`?name=${name}`).pipe(
			tap(x => this.logger.log(`found identities matching "${name}"`))
		);
	}

}
