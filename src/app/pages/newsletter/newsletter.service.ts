import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityService } from '../../core/models';

export class Newsletter {
	firstName?: string;
	lastName?: string;
	email?: string;
	preferences?: string[];
	//
	privacy?: string;
}

@Injectable({
	providedIn: 'root',
})
export class NewsletterService extends EntityService<any> {

	get collection(): string {
		return '';
	}

	subscribe(model: Newsletter): Observable<any> {
		return this.post(`/api/User/NewsletterSubscribe`, model);
	}

}
