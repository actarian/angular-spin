import { Type } from '@angular/core';
import { DefaultPage } from './default-page';
import { NotFoundPage } from './not-found-page';
import { Page } from './page';
import { PageNotFoundComponent } from './page-not-found.component';
import { PageComponent } from './page.component';
import { Pages } from './pages';

export class PageResolver {

	public component: Type<PageComponent> = PageComponent;

	constructor(
		public page: Page,
		pages: Pages,
		defaultPage: DefaultPage,
		notFoundPage: NotFoundPage,
	) {
		if (page && pages) {
			this.component = pages[page.component] || (defaultPage as any);
		} else {
			this.component = notFoundPage as any || (PageNotFoundComponent as any);
		}
	}
}
