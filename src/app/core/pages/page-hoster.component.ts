// import { isPlatformBrowser } from '@angular/common';
import { AfterContentInit, Component, ComponentFactory, ComponentFactoryResolver, Inject, PLATFORM_ID, ViewChild, ViewContainerRef } from '@angular/core';
import { Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
// import { ResolveEnd } from '@angular/router';
import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';
// import { filter, map } from '../../../../node_modules/rxjs/operators';
import { environment } from '../../../environments/environment';
import { DisposableComponent } from '../disposable';
import { Image, ImageType } from '../models';
import { RouteService } from '../routes';
import { Page } from './page';
import { PageComponent } from './page.component';

@Component({
	selector: 'page-hoster-component',
	template: '', // `<ng-template #hostPage>Your View should load here..</ng-template>`,
})

export class PageHosterComponent extends DisposableComponent implements AfterContentInit {
	@ViewChild('hostPage', { read: ViewContainerRef }) hostPageRef;

	private factory: ComponentFactory<PageComponent>;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		@Inject(ORIGIN_URL) private originUrl: string,
		@Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef,
		private router: Router,
		private route: ActivatedRoute,
		private componentFactoryResolver: ComponentFactoryResolver,
		private routeService: RouteService,
		private titleService: Title,
		private metaService: Meta
	) {
		super();
		this.router.routeReuseStrategy.shouldReuseRoute = () => {
			return false;
		};
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
		this.setSnapshot(this.route.snapshot);
	}

	ngAfterContentInit() {
		// this.setSnapshot(this.route.snapshot);
		/*
		this.router.events.pipe(
			filter(event => event instanceof ResolveEnd),
			map(() => this.route),
			// distinctUntilChanged(),
			// map(route => route)
		).subscribe(route => {
			if (route && route.snapshot) {
				this.setSnapshot(route.snapshot);
			}
		});
		*/
	}

	setSnapshot(snapshot: ActivatedRouteSnapshot): void {
		this.routeService.params = this.routeService.toData(snapshot.params);
		this.routeService.queryParams = this.routeService.toData(snapshot.queryParams);
		const data = snapshot.data;
		if (data.pageResolver && data.pageResolver.page) {
			// console.log('PageHosterComponent.pageResolver', data.pageResolver.page.title);
			this.routeService.page = data.pageResolver.page;
			const factory: ComponentFactory<PageComponent> = this.componentFactoryResolver.resolveComponentFactory(data.pageResolver.component);
			this.factory = factory;
			/*
			this.hostPageRef.clear();
			const componentRef = this.hostPageRef.createComponent(this.factory);
			*/
			this.viewContainerRef.clear();
			const componentRef = this.viewContainerRef.createComponent(this.factory);
			const instance = componentRef.instance;
			instance.page = this.routeService.page;
			instance.params = this.routeService.params;
			this.addOrUpdateMetaData(this.routeService.page);
		} else {
			console.log('PageHosterComponent.data', data);
		}
	}

	addOrUpdateMetaData(page: Page) {
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
