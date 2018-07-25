// import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ComponentFactory, ComponentFactoryResolver, Inject, PLATFORM_ID, ViewChild, ViewContainerRef } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';
import { environment } from '../../../environments/environment';
import { DisposableComponent } from '../disposable';
import { Image, ImageType } from '../models';
import { RouteService } from '../routes';
import { Page } from './page';
import { PageComponent } from './page.component';
import { PageDirective } from './page.directive';
@Component({
	selector: 'page-hoster',
	template: `<ng-template #hostPage>Your View should load here..</ng-template>`,
})

export class PageHosterComponent extends DisposableComponent implements AfterViewInit {
	@ViewChild(PageDirective) hostPage: PageDirective;
	@ViewChild('hostPage', { read: ViewContainerRef }) hostPageRef;

	private factory: ComponentFactory<PageComponent>;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		@Inject(ORIGIN_URL) private originUrl: string,
		private route: ActivatedRoute,
		private componentFactoryResolver: ComponentFactoryResolver,
		private routeService: RouteService,
		private titleService: Title,
		private metaService: Meta
	) {
		super();
		/*
		this.routeService.getPageComponentFactory().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(factory => {
			this.factory = factory;
			this.hostPageRef.clear();
			const componentRef = this.hostPageRef.createComponent(this.factory);
			const instance = componentRef.instance;
			instance.page = this.routeService.page;
			instance.params = this.routeService.params;
			this.addOrUpdateMetaData(this.routeService.page);
			console.log('PageHosterComponent.getPageComponentFactory', this.routeService.page);
		});
		*/
	}

	ngAfterViewInit() {
		this.routeService.params = this.routeService.toData(this.route.snapshot.params);
		this.routeService.queryParams = this.routeService.toData(this.route.snapshot.queryParams);
		const data = this.route.snapshot.data;
		if (data.pageResolver && data.pageResolver.page) {
			this.routeService.page = data.pageResolver.page;
			const factory: ComponentFactory<PageComponent> = this.componentFactoryResolver.resolveComponentFactory(data.pageResolver.component);
			this.factory = factory;
			this.hostPageRef.clear();
			const componentRef = this.hostPageRef.createComponent(this.factory);
			const instance = componentRef.instance;
			instance.page = this.routeService.page;
			instance.params = this.routeService.params;
			this.addOrUpdateMetaData(this.routeService.page);
		} else {
			console.log('PageHosterComponent.data', data);
		}
	}

	addOrUpdateMetaData(page: Page) {
		// if (isPlatformBrowser(this.platformId)) {
		// this code should run in ssr too
		const fbAppId: string = environment['plugins'] && environment['plugins']['facebook'] ? environment.plugins.facebook.appId.toString() : '';
		this.titleService.setTitle(page.title);
		this.addOrUpdateMeta({ property: 'og:title', content: page.title });
		this.addOrUpdateMeta({ property: 'og:image', content: this.getSocialImage(page).url });
		this.addOrUpdateMeta({ property: 'og:image:width', content: '1200' });
		this.addOrUpdateMeta({ property: 'og:image:height', content: '630' });
		this.addOrUpdateMeta({ property: 'fb:app_id', content: fbAppId });
		this.addOrUpdateMeta({ property: 'og:url', content: page.url || this.originUrl });
		const meta = page.meta;
		if (meta) {
			this.addOrUpdateMeta({ name: 'description', content: meta.description || 'Servizio di qualità senza costi aggiuntivi con i convenienti pacchetti viaggio Eurospin. Prenota comodamente online!' });
			this.addOrUpdateMeta({ name: 'keywords', content: meta.keywords || 'viaggi,viaggi eurospin' });
			this.addOrUpdateMeta({ name: 'robots', content: meta.robots || 'index,follow' });
			this.addOrUpdateMeta({ property: 'og:locale', content: meta.locale || 'it_IT' });
			this.addOrUpdateMeta({ property: 'og:type', content: meta.type || 'article' });
			this.addOrUpdateMeta({ property: 'og:author', content: meta.author || 'Eurospin Viaggi' });
		}
		console.log('PageHosterComponent.addOrUpdateMetaData', page.id, page.title, page.url);
		// }
	}

	getSocialImage(page: Page): Image {
		return page.images ? (
			page.images.find(i => i.type === ImageType.Share) ||
			page.images.find(i => i.type === ImageType.Default) ||
			page.images.find(i => i.type === ImageType.Gallery)
		) : { url: 'https://s-static.ak.fbcdn.net/images/devsite/attachment_blank.png' } as Image;
	}

	addOrUpdateMeta(definition: MetaDefinition) {
		const selector = definition.name ? `name="${definition.name}"` : `property="${definition.property}"`;
		if (this.metaService.getTag(selector)) {
			if (definition.content) {
				this.metaService.updateTag(definition, selector);
			} else {
				this.metaService.removeTag(selector);
			}
		} else if (definition.content) {
			this.metaService.addTag(definition);
		}
	}

}
