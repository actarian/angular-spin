import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { PageComponent } from '../../core/pages';
import { SearchService } from '../../models';

@Component({
	selector: 'page-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.scss']
})

export class SearchComponent extends PageComponent {

	active: ElementRef;

	constructor(
		route: ActivatedRoute,
		public search: SearchService,
	) {
		super(route);
	}

}
