import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PageComponent } from '../../core/pages';
import { FilterService, SearchService, SerpViewTypes } from '../../models';

@Component({
	selector: 'page-search',
	templateUrl: './serp.component.html',
	styleUrls: ['./serp.component.scss']
})

export class SerpComponent extends PageComponent {

	viewTypes: any = SerpViewTypes;
	viewType: SerpViewTypes = SerpViewTypes.List;

	active: ElementRef;

	constructor(
		route: ActivatedRoute,
		public search: SearchService,
		public filterService: FilterService,
	) {
		super(route);
	}
}
