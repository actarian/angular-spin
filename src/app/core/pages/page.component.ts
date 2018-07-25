
import { isPlatformBrowser } from '@angular/common';
import { Component, Input, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DisposableComponent } from '../disposable';
import { RouteService } from '../routes';
import { Page } from './page';



@Component({
	selector: 'app-page',
	template: `<h1>I'm a default view!</h1>`,
})

export class PageComponent extends DisposableComponent {

	@Input() page: Page;
	@Input() params: Observable<Params>;
	// @HostBinding('attr.class') attrClass = 'page';

	constructor(
		protected routeService: RouteService
	) {
		super();
		this.scrollToTop();
		// console.log('platformId', platformId);
		/*
		console.log('PageComponent.create');
		this.routeService.getPageParams().pipe(
			takeUntil(this.unsubscribe),
			distinctUntilChanged()
		).subscribe(queryParams => {
			console.log('queryParams', queryParams);
		});
		*/
	}

	private scrollToTop(): void {
		// scroll to top on page change;
		// dependancy manually activated;
		const platformId: string = RouteService.injector.get(PLATFORM_ID) as string;
		if (isPlatformBrowser(platformId)) {
			const router = RouteService.injector.get(Router);
			router.events.subscribe((e) => {
				if (!(e instanceof NavigationEnd)) {
					return;
				}
				window.scrollTo(0, 0);
			});
		}
	}

	getId(): number {
		return this.routeService.getId() || (this.page ? this.page.id : 0);
	}

	getSlug(): string {
		return this.routeService.getSlug() || (this.page ? this.page.slug : '');
	}

}
