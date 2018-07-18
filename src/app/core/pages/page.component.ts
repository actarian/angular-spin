
import { Component, HostBinding, Input } from '@angular/core';
import { Params } from '@angular/router';
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
	@HostBinding('attr.class') attrClass = 'page';

	constructor(
		protected routeService: RouteService
	) {
		super();
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

	getId(): number {
		return this.routeService.getId() || (this.page ? this.page.id : 0);
	}

	getSlug(): string {
		return this.routeService.getSlug() || (this.page ? this.page.slug : '');
	}

}
