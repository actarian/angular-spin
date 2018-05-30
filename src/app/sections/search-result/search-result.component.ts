import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DisposableComponent } from '../../core/disposable';
import { Option } from '../../core/models';
import { FilterService, Group, SearchResult } from '../../models';

@Component({
	selector: 'section-search-result',
	templateUrl: './search-result.component.html',
	styleUrls: ['./search-result.component.scss'],
	exportAs: 'results'
})

export class SearchResultComponent extends DisposableComponent implements OnInit {

	resultsFiltered$: Observable<SearchResult[]>;

	// @Input()
	// public item: SearchResult;

	constructor(
		public filterService: FilterService
	) {
		super();
	}

	ngOnInit() {
		this.resultsFiltered$ = this.filterService.resultsFiltered;
	}

	onFilterSet(groups: Group<Option>[]) {
		// console.log('SearchResultComponent.onFilterSet', groups);
		this.filterService.setGroups();
	}

}
