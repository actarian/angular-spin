import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { Option } from '../../core/models';
import { PageComponent } from '../../core/pages';
import { RouteService } from '../../core/routes';
import { FilterService, Group, MainSearch, SearchResult, SearchService, Tag, TagService } from '../../models';

@Component({
	selector: 'page-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})

export class SearchComponent extends PageComponent implements OnInit {

	active: ElementRef;
	model$: BehaviorSubject<MainSearch> = new BehaviorSubject(new MainSearch());
	filters: Tag[][];

	resultsFiltered$: Observable<SearchResult[]>;

	constructor(
		route: ActivatedRoute,
		private tagService: TagService,
		public routeService: RouteService,
		public search: SearchService,
		public filterService: FilterService
	) {
		super(route);
		/*
		this.routeService.params
			.take(1)
			.subscribe(model => {
				console.log('SearchComponent.constructor.model', model);
				this.model$.next(new MainSearch(model as MainSearch));
				this.search.onSearchIn(this.model$)
					.takeUntil(this.unsubscribe)
					.subscribe(results => {
						console.log('SearchComponent.constructor.model', results);
					});
			});
			*/
	}

	ngOnInit() {
		this.resultsFiltered$ = this.filterService.resultsFiltered;
	}

	onFilterSet(groups: Group<Option>[]) {
		// console.log('SearchComponent.onFilterSet', groups);
		this.filterService.setGroups();
	}

}
