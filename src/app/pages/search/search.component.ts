import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { PageComponent } from '../../core/pages';
import { RouteService } from '../../core/routes';
import { MainSearch, SearchService, Tag, TagService } from '../../models';

@Component({
	selector: 'page-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})

export class SearchComponent extends PageComponent implements OnInit {

	active: ElementRef;
	model$: BehaviorSubject<MainSearch> = new BehaviorSubject(new MainSearch());
	filters: Tag[][];

	constructor(
		route: ActivatedRoute,
		private tagService: TagService,
		public routeService: RouteService,
		public search: SearchService
	) {
		super(route);
		this.routeService.params
			.take(1)
			.subscribe(model => {
				// console.log('SearchService.constructor', model);
				this.model$.next(new MainSearch(model as MainSearch));
			});
		this.tagService.get()
			.takeUntil(this.unsubscribe)
			.subscribe((tags: Tag[]) => {
				this.filters = [tags];
			});
	}

	ngOnInit() {
		this.search.onSearchIn(this.model$)
			.takeUntil(this.unsubscribe)
			.subscribe(results => {
				console.log('SearchComponent.onSearchIn', results);
			});
	}

}
