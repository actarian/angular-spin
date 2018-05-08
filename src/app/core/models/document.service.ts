import { Injectable } from '@angular/core';
import { Document } from './document';
import { EntityService } from './entity.service';

@Injectable()
export class DocumentService<T extends Document> extends EntityService<T> {

	getCollection(): string {
		return 'document';
	}

}
