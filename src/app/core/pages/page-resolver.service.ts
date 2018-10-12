
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Logger } from '../logger';
import { RouteService } from '../routes';
import { PageResolver } from './page-resolver';
import { PageService } from './page.service';
import { Pages } from './pages';

@Injectable({
	providedIn: 'root'
})
export class PageResolverService implements Resolve<PageResolver> {

	constructor(
		private logger: Logger,
		private pageService: PageService,
		private router: Router,
		private config: Pages,
		private routeService: RouteService
	) { }

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageResolver> {
		// console.log('route', route);
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
			map(page => {
				if (page) {
					// console.log('PageResolverService.page', pages[0]);
					return new PageResolver(page, this.config);
				} else {
					// console.log('routeService', this.routeService);
					this.router.navigate(this.routeService.toRoute(['not-found']));
					return null;
				}
			})
		);
	}

	getPageBySlug(slug: string): Observable<PageResolver> {
		return this.pageService.getStatePageBySlug(slug).pipe(
			map(page => {
				if (page) {
					// console.log('PageResolverService.page', pages[0]);
					return new PageResolver(page, this.config);
				} else {
					// console.log('routeService', this.routeService);
					this.router.navigate(this.routeService.toRoute(['not-found']));
					return null;
				}
			})
		);
	}

}
