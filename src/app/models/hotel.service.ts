import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DocumentService } from '../core/models';
import { Hotel } from './hotel';

@Injectable({
	providedIn: 'root',
})
export class HotelService extends DocumentService<Hotel> {

	get collection(): string {
		return '/proxy/api';
	}

	getTopServiceDetailsById(id: number): Observable<Hotel> {
		return this.get(`/data/topservicedetails/${id}`).pipe(
			map((x: any) => this.toCamelCase(x)),
			map((x: any) => new Hotel(x)), // mapping to hotel
			tap(x => console.log(id, x)),
		);
	}

}
