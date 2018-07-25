import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { Document } from './document';
import { EntityService } from './entity.service';

@Injectable()
export class DocumentService<T extends Document> extends EntityService<T> {

	get collection(): string {
		return '/api/document';
	}

	getDetailBySlug(slug: string): Observable<T> {
		if (!slug.trim()) {
			// if not search term, return empty identity array.
			return of();
		}
		return this.get(`?slug=${slug}`).pipe(
			tap(x => this.logger.log(`found identities matching "${slug}"`)),
			switchMap(x => x[0])
		);
	}

}
