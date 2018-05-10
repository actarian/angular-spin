import { Injectable } from '@angular/core';
import { EntityService } from '../core/models';
import { Promotion } from './promotion';

@Injectable()
export class PromotionService extends EntityService<Promotion> {

	getCollection(): string {
		return 'promotion';
	}

}
