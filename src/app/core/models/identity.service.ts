import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ApiService } from '../api';
import { Identity } from './identity';

@Injectable({
	providedIn: 'root'
})
export class IdentityService<T extends Identity> extends ApiService<T> {

	constructor(
		protected injector: Injector
	) {
		super(injector);
	}

	get collection(): string {
		return '/api/identity';
	}

	getList(): Observable<T[]> {
		return this.get().pipe(
			tap(x => this.logger.log(`getList`))
		);
	}

	getDetailByIdNo404<Data>(id: number): Observable<T> {
		return this.get(`?id=${id}`).pipe(
			map((identities: T[]) => identities[0]), // returns a {0|1} element array
			tap(x => {
				this.logger.log(`getDetailByIdNo404 ${x ? `found` : `not found`} #${id}`);
			})
		);
	}

	getDetailById(id: number): Observable<T> {
		return this.get(`/${id}`).pipe(
			tap(x => this.logger.log(`getDetailById ${id}`))
		);
	}

	add(identity: T) {
		return this.post(identity);
	}

	update(identity: T) {
		return this.put(identity);
	}

}
