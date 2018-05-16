import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { EntityService } from '../models';
import { Page } from './page';

@Injectable()
export class PageService extends EntityService<Page> {

	getCollection(): string {
		return 'page';
	}

	getPageBySlug(slug: string): Observable<Page[]> {
		slug = slug.split(';')[0];
		// console.log('PageService.getPageBySlug', slug);
		return this.http.get<Page[]>(`${this.url}/?slug=${slug}`).pipe(
			tap(x => this.log(`found pages matching "${slug}"`)),
			catchError(this.handleError<Page[]>('getPageBySlug', []))
		);
	}

}
