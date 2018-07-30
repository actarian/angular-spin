
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

	/*
	public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<PageResolver> {
		const paths = route.url.filter(x => {
			return x.path;
		}).map(x => {
			return x.path;
		});
		const slug = this.routeService.toSlug(paths).join('/');
		// console.log('PageResolverService.resolve', slug);
		return new Promise((resolve, reject) => {
			this.pageService.getPageBySlug(slug).pipe(
				map(page => page ? new PageResolver(page, this.config) : null)
			).subscribe(page => {
				if (page) {
					resolve(page);
				} else {
					this.router.navigate(this.routeService.toRoute(['not-found']));
					resolve(null);
				}
			});
		});
	}
	*/

	resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<PageResolver> {
		const paths = route.url.filter(x => {
			return x.path;
		}).map(x => {
			return x.path;
		});
		const slug = this.routeService.toSlug(paths).join('/');
		// console.log('PageResolverService.resolve', slug);
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
		/*
		return this.pageService.getPageBySlug(slug).pipe(
			take(1),
			map(pages => {
				if (pages && pages.length) {
					// console.log('PageResolverService.page', pages[0]);
					return new PageResolver(pages[0], this.config);
				} else {
					// console.log('routeService', this.routeService);
					this.router.navigate(this.routeService.toRoute(['not-found']));
					return null;
				}
			}), );
		*/
	}

}
