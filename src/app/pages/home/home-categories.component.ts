import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PageIndex } from '../../core';
import { Category, CategoryService, LandingService } from '../../models';

@Component({
	selector: 'section-categories',
	templateUrl: './home-categories.component.html',
	styleUrls: ['./home-categories.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class HomeCategoriesComponent implements OnInit {

	@Input() type: number;
	items$: Observable<PageIndex[]>; // type, destination, time

	categories: Category[] = [];

	constructor(
		private landingService: LandingService,
		private categoryService: CategoryService,
	) {

	}

	ngOnInit() {
		this.items$ = this.landingService.get().pipe(
			map(x => x.filter((p: PageIndex) => p.type === this.type))
		);
		// this.getCategories();
	}

	getCategories(): void {
		this.categoryService.getList().subscribe(x => this.categories = x.slice(0, 6));
	}
}
