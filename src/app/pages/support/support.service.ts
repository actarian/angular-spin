import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityService } from '../../core/models';

export class Support {
	bookFileCode?: string;
	type?: number;
	firstName?: string;
	lastName?: string;
	phone?: string;
	email?: string;
	message?: string;
	//
	privacy?: string;
}

@Injectable({
	providedIn: 'root',
})
export class SupportService extends EntityService<any> {

	get collection(): string {
		return '/api/action';
	}

	support(model: Support): Observable<any> {
		return this.post(`/support`, model);
	}

}
