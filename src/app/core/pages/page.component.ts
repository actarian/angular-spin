
import { Component, HostBinding, Input } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs';
import { DisposableComponent } from '../disposable';
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
		protected route: ActivatedRoute
	) {
		super();
		// this.titleService.setTitle();
		// console.log('CreatePageComponent');
	}

	getId(): number {
		return +this.route.snapshot.paramMap.get('id') || (this.page ? this.page.id : 0);
	}

}
