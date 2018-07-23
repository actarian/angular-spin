import { Injectable } from '@angular/core';
import { EntityService } from '../core/models';
import { Region } from './region';

@Injectable({
	providedIn: 'root',
})
export class RegionService extends EntityService<Region> {

	get collection(): string {
		return '/memory/region';
	}

}
