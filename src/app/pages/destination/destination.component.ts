import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { first, map, takeUntil } from 'rxjs/operators';
import { PageComponent } from '../../core/pages';
import { RouteService } from '../../core/routes';
import { SearchService, Tag, TagService } from '../../models';

@Component({
	selector: 'page-destination',
	templateUrl: './destination.component.html',
	styleUrls: ['./destination.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class DestinationComponent extends PageComponent implements OnInit {

	// private landings: Page[] = [];

	@Input() type: number;
	limit: number = 6;
	items: Tag[];

	/*
	0 Categorie (Mare italia etc...)
	2 Italia
	3 Estero
	4 Aree turistiche
	*/

	constructor(
		protected routeService: RouteService,
		private tagService: TagService,
		public search: SearchService,
	) {
		super(routeService);
		this.search.getPageParams().pipe(
			first()
		).subscribe(params => {
			this.search.setParams(params);
		});
	}

	ngOnInit() {
		this.getTagsByCategory(0).pipe(
			takeUntil(this.unsubscribe),
		).subscribe(items => this.items = items);
	}

	getTagsByCategory(category: number): Observable<Tag[]> {
		return this.tagService.getTags().pipe(
			map(tags => tags.filter(x => x.category === category))
		);
	}

}
