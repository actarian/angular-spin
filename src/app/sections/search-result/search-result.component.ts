import { Component, Input, OnInit } from '@angular/core';
import { DisposableComponent } from '../../core/disposable';
import { SearchResult } from '../../models';


@Component({
	selector: 'section-search-result',
	templateUrl: './search-result.component.html',
	styleUrls: ['./search-result.component.scss']
})

export class SearchResultComponent extends DisposableComponent implements OnInit {

	@Input()
	public item: SearchResult;

	ngOnInit() {

	}

}
