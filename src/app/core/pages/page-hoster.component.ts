import { Component, ComponentFactory, ComponentFactoryResolver, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DisposableComponent } from '../disposable';
import { RouteService } from '../routes';
import { PageComponent } from './page.component';
import { PageDirective } from './page.directive';


@Component({
	selector: 'page-hoster',
	template: `<ng-template #hostPage>Your View should load here..</ng-template>`,
})

export class PageHosterComponent extends DisposableComponent implements OnInit {
	@ViewChild(PageDirective) hostPage: PageDirective;
	@ViewChild('hostPage', { read: ViewContainerRef }) hostPageRef;

	private factory: ComponentFactory<PageComponent>;

	constructor(
		private route: ActivatedRoute,
		private routeService: RouteService,
		private componentFactoryResolver: ComponentFactoryResolver
	) {
		super();
		this.routeService.getPageComponentFactory()
			.takeUntil(this.unsubscribe)
			.subscribe(factory => {
				// console.log('PageHosterComponent', factory);
				this.factory = factory;
				this.hostPageRef.clear();
				const componentRef = this.hostPageRef.createComponent(this.factory);
				const instance = componentRef.instance;
				instance.page = this.routeService.page;
				instance.params = this.routeService.params;
			});
	}

	ngOnInit() {
		// this.resolvePage();
	}

	resolvePage() {
		/*
		this.route.data.subscribe((data: { pageResolver: PageResolver }) => {
			const pageResolver = data.pageResolver;
			const componentFactory = this.componentFactoryResolver.resolveComponentFactory(pageResolver.component);
			this.hostPageRef.clear();
			const componentRef = this.hostPageRef.createComponent(componentFactory);
			const instance = componentRef.instance;
			instance.page = pageResolver.page;
			instance.params = this.route.params.concatMap(x => {
				return of(this.routeService.toData(x));
			});
		});
		*/
	}
}
