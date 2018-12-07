
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouteService } from '../routes';
import { DefaultPage } from './default-page';
import { NotFoundPage } from './not-found-page';
import { Page } from './page';
import { PageResolver } from './page-resolver';
import { PageService } from './page.service';
import { Pages } from './pages';

@Injectable({
	providedIn: 'root'
})
export class PageResolverService implements Resolve<PageResolver> {

	public events$: BehaviorSubject<PageResolver> = new BehaviorSubject<PageResolver>(null);

	constructor(
		private pageService: PageService,
		private router: Router,
		private pages: Pages,
		private defaultPage: DefaultPage,
		private notFoundPage: NotFoundPage,
		private routeService: RouteService,
		// @Optional() @Inject(RESPONSE) private response: Response,
	) { }

	pageToPageResolver(page: Page): PageResolver {
		let pageResolver;
		if (page) {
			pageResolver = new PageResolver(page, this.pages, this.defaultPage, this.notFoundPage);
		} else {
			pageResolver = new PageResolver(null, null, this.defaultPage, this.notFoundPage);
			// this.router.navigate(this.routeService.toRoute(['not-found']));
		}
		this.events$.next(pageResolver);
		return pageResolver;
	}

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageResolver> {
		if (route.params && route.params.id) {
			return this.getPageById(route.params.id);
		} else {
			const paths = route.url.filter(x => {
				return x.path;
			}).map(x => {
				return x.path;
			});
			const slug = this.routeService.toSlug(paths).join('/');
			return this.getPageBySlug(slug);
		}
	}

	getPageById(id: number | string): Observable<PageResolver> {
		return this.pageService.getPageById(id).pipe(
			map(page => this.pageToPageResolver(page))
		);
	}

	getPageBySlug(slug: string): Observable<PageResolver> {
		return this.pageService.getStatePageBySlug(slug).pipe(
			map(page => this.pageToPageResolver(page))
		);
	}

}
