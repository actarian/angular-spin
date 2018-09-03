import { Injectable } from '@angular/core';
import { EntityService } from './entity.service';
import { MenuItem } from './menu';

@Injectable({
	providedIn: 'root'
})
export class MenuService extends EntityService<MenuItem> {

	get collection(): string {
		return '/api/menu';
	}

}
