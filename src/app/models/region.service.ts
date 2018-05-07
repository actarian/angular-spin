import { Injectable } from '@angular/core';
import { EntityService } from '../core/models';
import { Region } from './region';

@Injectable()
export class RegionService extends EntityService<Region> {

	getCollection(): string {
		return 'region';
	}

}
