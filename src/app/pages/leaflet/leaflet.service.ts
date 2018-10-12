import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityService } from '../../core/models';

@Injectable({
	providedIn: 'root',
})
export class LeafletService extends EntityService<any> {

	get collection(): string {
		return '/api/page/data';
	}

	items(): Observable<any> {
		return this.get(`/promotion`);
	}

}
