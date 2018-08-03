import { Injectable } from '@angular/core';
import { PageIndex } from '../core';
import { EntityService } from '../core/models';

@Injectable({
	providedIn: 'root',
})
export class LandingService extends EntityService<PageIndex> {

	get collection(): string {
		return '/api/landing';
	}

}
