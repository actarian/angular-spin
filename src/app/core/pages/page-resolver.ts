import { Type } from '@angular/core';
import { Page } from './page';
import { PageComponent } from './page.component';
import { PageConfig } from './page.config';


export class PageResolver {
    public component: Type<PageComponent> = PageComponent;

    constructor(public page: Page, config: PageConfig) {
        // console.log('config', config);
        if (page.component && config) {
            this.component = config.pages[page.component];
        }
        // console.log(page.component, this.component);
    }
}
