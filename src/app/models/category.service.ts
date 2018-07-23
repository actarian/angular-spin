import { Injectable } from '@angular/core';
import { EntityService } from '../core/models';
import { Category } from './category';

@Injectable({
	providedIn: 'root',
})
export class CategoryService extends EntityService<Category> {

	get collection(): string {
		return '/memory/category';
	}

}
