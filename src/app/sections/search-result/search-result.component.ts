import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DisposableComponent } from '../../core/disposable';
import { FilterService, SearchResult, SearchService } from '../../models';

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
		public search: SearchService,
		public filterService: FilterService
	) {
		super();
	}

	ngOnInit() {
		this.resultsFiltered$ = this.filterService.resultsFiltered;
	}

}
