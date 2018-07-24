import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// import { tap } from 'rxjs/operators';
import { EntityService } from '../models';
import { Page } from './page';

@Injectable()
export class PageService extends EntityService<Page> {

	get collection(): string {
		return '//eurospin-viaggi2.wslabs.it/api/page'; // return '/memory/page';
	}

	getPageBySlug(slug: string): Observable<Page> {
		slug = slug.split(';')[0];
		// console.log('PageService.getPageBySlug', slug);
		return this.get(`/slug/${slug}`)/*.pipe(
			tap(x => this.logger.log(`found pages matching "${slug}"`))
			// tap(x => console.log('PageService.getPageBySlug', x, slug))
		)*/;
	}

	/*
	getPageBySlug(slug: string): Observable<Page[]> {
		slug = slug.split(';')[0];
		console.log('PageService.getPageBySlug', slug);
		return this.get(`/slug/${slug}`).pipe(
			// tap(x => this.logger.log(`found pages matching "${slug}"`))
			tap(x => console.log('PageService.getPageBySlug', x, slug))
		);
	}
	*/

}
