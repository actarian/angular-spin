import { Component, OnInit } from '@angular/core';
import { Category, CategoryService } from '../../models';

@Component({
	selector: 'section-categories',
	templateUrl: './categories.component.html',
	styleUrls: ['./categories.component.scss']
})

export class CategoriesComponent implements OnInit {

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
