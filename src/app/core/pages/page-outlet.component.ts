import { Component, ComponentFactory, ComponentFactoryResolver, Inject, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';
import { DisposableComponent } from '../disposable';
import { RouteService } from '../routes';
import { PageComponent } from './page.component';
import { PageService } from './page.service';

@Component({
	selector: 'page-outlet',
	template: '',
})

export class PageOutletComponent extends DisposableComponent {

	private factory: ComponentFactory<PageComponent>;

	constructor(
		@Inject(ORIGIN_URL) private originUrl: string,
		@Inject(ViewContainerRef) private viewContainerRef: ViewContainerRef,
		private router: Router,
		private route: ActivatedRoute,
		private componentFactoryResolver: ComponentFactoryResolver,
		private routeService: RouteService,
		private pageService: PageService,
	) {
		super();
		// this make PageOutlet change for different routes;
		this.router.routeReuseStrategy.shouldReuseRoute = () => {
			return false;
		};
		this.setSnapshot(this.route.snapshot);
	}

	setSnapshot(snapshot: ActivatedRouteSnapshot): void {
		this.routeService.params = this.routeService.toData(snapshot.params);
		this.routeService.queryParams = this.routeService.toData(snapshot.queryParams);
		const data = snapshot.data;
		if (data.pageResolver && data.pageResolver.page) {
			// console.log('PageOutletComponent.pageResolver', data.pageResolver.page.title);
			this.routeService.page = data.pageResolver.page;
			const factory: ComponentFactory<PageComponent> = this.componentFactoryResolver.resolveComponentFactory(data.pageResolver.component);
			this.factory = factory;
			this.viewContainerRef.clear();
			const componentRef = this.viewContainerRef.createComponent(this.factory);
			const instance = componentRef.instance;
			instance.page = this.routeService.page;
			instance.params = this.routeService.params;
			if (typeof instance['PageInit'] === 'function') {
				instance['PageInit']();
			}
			const config = this.router.config.slice();
			const slug = data.pageResolver.page.slug;
			config.push({
				path: slug.indexOf('/') === 0 ? slug.substr(1) : slug, component: data.pageResolver.component,
			});
			this.router.resetConfig(config);
			this.pageService.addOrUpdateMetaData(this.routeService.page);
		} else {
			console.log('PageOutletComponent.data', data);
		}
	}

}
