import { Injectable } from '@angular/core';
import { EntityService } from '../core/models';
import { Promotion } from './promotion';

@Injectable({
	providedIn: 'root',
})
export class PromotionService extends EntityService<Promotion> {

	get collection(): string {
		return 'promotion';
	}

}
