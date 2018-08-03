import { Injectable } from '@angular/core';
import { makeStateKey } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EntityService } from '../models';
import { Page } from './page';

@Injectable({
	providedIn: 'root'
})
export class PageService extends EntityService<Page> {

	get collection(): string {
		return '/api/page'; // return '/page';
	}

	getStatePageBySlug(slug: string): Observable<Page> {
		// slug = slug.split(';')[0];
		slug = slug.split('?')[0];
		if (slug.indexOf('/') === 0) {
			slug = slug.substr(1);
		}
		const key = `PAGE_${slug.replace('/', '_')}`;
		const STATE_KEY = makeStateKey<Page>(key);
		const state = this.state.hasKey(STATE_KEY);
		if (state) {
			// const observable = of(this.state.get<Page>(STATE_KEY, null));
			// this.state.remove(STATE_KEY); // using as cache!
			return of(this.state.get<Page>(STATE_KEY, null));
		} else {
			return this.get(`/slug/${slug}`).pipe(
				tap(page => this.state.set(STATE_KEY, page))
			);
		}
	}

	getPageById(id: number): Observable<Page> {
		return this.get(`/${id}`);
	}

	getPageBySlug(slug: string): Observable<Page> {
		slug = slug.split(';')[0];
		// console.log('PageService.getPageBySlug', slug);
		return this.get(`/slug/${slug}`)/*.pipe(
			tap(x => this.logger.log(`found pages matching "${slug}"`))
			// tap(x => console.log('PageService.getPageBySlug', x, slug))
		)*/;
	}

}
