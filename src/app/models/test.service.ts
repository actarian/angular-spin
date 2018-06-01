import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api';
import { Identity } from '../core/models';

@Injectable({
	providedIn: 'root',
})
export class TestService extends ApiService<Identity> {

	get collection(): string {
		return 'test';
	}

	all(): Observable<Identity[]> {
		return this.get();
	}

}
