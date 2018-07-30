import { Type } from '@angular/core';
import { Page } from './page';
import { PageComponent } from './page.component';
import { Pages } from './pages';

export class PageResolver {
	public component: Type<PageComponent> = PageComponent;

	constructor(public page: Page, config: Pages) {
		// console.log('page', page, 'config', config);
		if (page.component && config) {
			this.component = config[page.component];
		}
		// console.log(page.component, this.component);
	}
}
