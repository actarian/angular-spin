import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, Inject, Input, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DisposableComponent, RouteService } from '../../core';
import { FilterService, SearchService, SerpViewTypes } from '../../models';

@Component({
	selector: 'serp-component',
	templateUrl: './serp.component.html',
	styleUrls: ['./serp.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class SerpComponent extends DisposableComponent implements OnInit {

	viewTypes: any = SerpViewTypes;
	viewType: SerpViewTypes = SerpViewTypes.List;

	@Input() useBreadcrumbs: boolean = false;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		protected routeService: RouteService,
		private activatedRoute: ActivatedRoute,
		public search: SearchService,
		public filterService: FilterService,
	) {
		super();
	}

	ngOnInit() {
		if (isPlatformBrowser(this.platformId)) {
			if (window.innerWidth > 991 && !(this.viewType === this.viewTypes.List || this.viewType === this.viewTypes.Map)) {
				this.setViewType(this.viewTypes.List);
			}
		}
		this.activatedRoute.queryParams.subscribe(params => {
			const queryParams = this.routeService.parseParams(params);
			this.viewType = queryParams.viewType || this.viewTypes.List;
		});
	}

	setViewType(viewType: SerpViewTypes) {
		if (this.viewType !== viewType) {
			this.viewType = viewType;
			this.search.setViewParams(viewType);
			// console.log('viewType.push', viewType);
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		if (event.target.innerWidth > 991 && !(this.viewType === this.viewTypes.List || this.viewType === this.viewTypes.Map)) {
			this.setViewType(this.viewTypes.List);
		}
	}
}
