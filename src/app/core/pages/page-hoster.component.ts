// import { isPlatformBrowser } from '@angular/common';
import { Component, ComponentFactory, Inject, PLATFORM_ID, ViewChild, ViewContainerRef } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { DisposableComponent } from '../disposable';
import { RouteService } from '../routes';
import { Page } from './page';
import { PageComponent } from './page.component';
import { PageDirective } from './page.directive';

@Component({
	selector: 'page-hoster',
	template: `<ng-template #hostPage>Your View should load here..</ng-template>`,
})

export class PageHosterComponent extends DisposableComponent {
	@ViewChild(PageDirective) hostPage: PageDirective;
	@ViewChild('hostPage', { read: ViewContainerRef }) hostPageRef;

	private factory: ComponentFactory<PageComponent>;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		@Inject(ORIGIN_URL) private originUrl: string,
		private routeService: RouteService,
		private titleService: Title,
		private metaService: Meta
	) {
		super();
		this.routeService.getPageComponentFactory().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(factory => {
			this.factory = factory;
			this.hostPageRef.clear();
			const componentRef = this.hostPageRef.createComponent(this.factory);
			const instance = componentRef.instance;
			instance.page = this.routeService.page;
			instance.params = this.routeService.params;
			this.updatePageData(this.routeService.page);
		});
	}

	updatePageData(page: Page) {
		// if (isPlatformBrowser(this.platformId)) {
		// this code should run in ssr too
		const fbAppId: string = environment['plugins'] && environment['plugins']['facebook'] ? environment.plugins.facebook.appId.toString() : '';
		this.titleService.setTitle(page.title);
		this.addOrUpdateMeta({ name: 'description', content: 'Servizio di qualità senza costi aggiuntivi con i convenienti pacchetti viaggio Eurospin. Prenota comodamente online!' });
		this.addOrUpdateMeta({ name: 'keywords', content: 'viaggi,viaggi eurospin' });
		this.addOrUpdateMeta({ name: 'robots', content: 'index,follow' });
		this.addOrUpdateMeta({ property: 'fb:app_id', content: fbAppId });
		this.addOrUpdateMeta({ property: 'og:image', content: 'https://s-static.ak.fbcdn.net/images/devsite/attachment_blank.png' });
		this.addOrUpdateMeta({ property: 'og:locale', content: 'it_IT' });
		this.addOrUpdateMeta({ property: 'og:title', content: page.title });
		this.addOrUpdateMeta({ property: 'og:type', content: 'article' });
		this.addOrUpdateMeta({ property: 'og:url', content: this.originUrl });
		// }
	}

	addOrUpdateMeta(definition: MetaDefinition) {
		const selector = definition.name ? `name="${definition.name}"` : `property="${definition.property}"`;
		if (this.metaService.getTag(selector)) {
			this.metaService.updateTag(definition, selector);
		} else {
			this.metaService.addTag(definition);
		}
	}

}
