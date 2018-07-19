import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { DocumentService } from '../core/models';
import { Booking, BookingAvailability, BookingOptions } from './booking';
import { Hotel } from './hotel';
import { SearchService } from './search.service';

@Injectable({
	providedIn: 'root',
})
export class HotelService extends DocumentService<Hotel> {

	constructor(
		protected injector: Injector,
		private search: SearchService
	) {
		super(injector);
	}

	get collection(): string {
		return ''; // '/proxy/api';
	}

	getTopServiceDetailsById(id: number): Observable<Hotel> {
		return this.get(`/proxy/api/data/topservicedetails/${id}`).pipe(
			map((x: any) => this.toCamelCase(x)),
			map((x: any) => new Hotel(x)), // mapping to hotel
			tap(x => console.log(id, x)),
		);
	}

	getBookingCheckInById(id: number, payload: Booking): Observable<BookingAvailability[]> {
		return this.post(`/proxy/api/booking/checkin/${id}`, payload).pipe(
			map((x: any) => this.toCamelCase(x)),
			// map((x: any) => new Hotel(x)), // mapping to hotel
			tap(x => console.log('HotelService.getBookingCheckInById', id, x)),
		);
	}

	getBookingCheckOutById(id: number, payload: Booking): Observable<BookingAvailability[]> {
		return this.post(`/proxy/api/booking/checkout/${id}`, payload).pipe(
			map((x: any) => this.toCamelCase(x)),
			// map((x: any) => new Hotel(x)), // mapping to hotel
			tap(x => console.log('HotelService.getBookingCheckOutById', id, x)),
		);
	}

	getBookingOptionsById(id: number, payload: Booking): Observable<BookingOptions> {
		return this.post(`/proxy/api/booking/solution/${id}?state=true`, payload).pipe(
			map((x: any) => this.toCamelCase(x)),
			map((x: any) => new BookingOptions(x)), // mapping to BookingOptions
			tap(x => console.log('HotelService.getBookingOptionsById', id, x)),
		);
	}

}
