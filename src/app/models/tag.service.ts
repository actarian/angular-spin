import { Injectable } from '@angular/core';
import { EntityService } from '../core/models';
import { Tag } from './tag';

@Injectable()
export class TagService extends EntityService<Tag> {

	get collection(): string {
		return 'tag';
	}

}
