import { Component, OnInit } from '@angular/core';
import { Category, CategoryService } from '../../models';

@Component({
	selector: 'section-categories',
	templateUrl: './home-categories.component.html',
	styleUrls: ['./home-categories.component.scss']
})

export class HomeCategoriesComponent implements OnInit {

	categories: Category[] = [];

	constructor(
		private categoryService: CategoryService,
	) { }

	ngOnInit() {
		this.getCategories();
	}

	getCategories(): void {
		this.categoryService.getList().subscribe(x => this.categories = x.slice(0, 6));
	}
}
