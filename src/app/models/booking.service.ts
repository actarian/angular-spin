import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { LocalStorageService, StorageService } from '../core';
import { DocumentService } from '../core/models';
import { Booking, BookingAvailability, BookingOptions } from './booking';
import { Hotel } from './hotel';
import { SearchService } from './search.service';

@Injectable({
	providedIn: 'root',
})
export class BookingService extends DocumentService<Hotel> {

	public storage: StorageService;
	public booking$: BehaviorSubject<Booking> = new BehaviorSubject<Booking>(null);

	get collection(): string {
		return ''; // '/www/api';
	}

	constructor(
		protected injector: Injector,
		private storageService: LocalStorageService,
		private search: SearchService
	) {
		super(injector);
		this.storage = this.storageService.tryGet();
		const stored = this.storage.get('booking');
		if (stored) {
			this.booking$.next(new Booking(stored));
		}
	}

	public current(): Observable<Booking> {
		const booking: Booking = this.booking$.getValue();
		if (booking) {
			return of(booking);
		} else {
			// return from api session
			return of(null);
		}
	}

	getTopServiceDetailById(id: number | string): Observable<Hotel> {
		return this.get(`/api/data/topservicedetail/${id}`).pipe(
			catchError((response: HttpErrorResponse) => {
				// console.log('BookingService.getTopServiceDetailById', response);
				if (response.status === 410) {
					const hotel = new Hotel(response.error);
					hotel.active = false; // expired;
					return of(hotel);
				} else {
					return of(null);
				}
			}),
			// map((x: any) => this.toCamelCase(x)),
			map((data: any) => new Hotel(data)),
			// tap(x => console.log('BookingService.getTopServiceDetailsById', id, x)),
		);
	}

	getBookingCheckInById(id: number | string, payload: Booking): Observable<BookingAvailability[]> {
		// !!!
		return this.post(`/api/booking/checkin/${id}`, payload).pipe(
			// map((x: any) => this.toCamelCase(x)),
			// map((x: any) => new Hotel(x)), // mapping to hotel
			// tap(x => console.log('BookingService.getBookingCheckInById', id, x)),
		);
	}

	getBookingCheckOutById(id: number | string, payload: Booking): Observable<BookingAvailability[]> {
		// !!!
		return this.post(`/api/booking/checkout/${id}`, payload).pipe(
			// map((x: any) => this.toCamelCase(x)),
			// map((x: any) => new Hotel(x)), // mapping to hotel
			// tap(x => console.log('BookingService.getBookingCheckOutById', id, x)),
		);
	}

	getBookingOptionsById(id: number | string, payload: Booking): Observable<BookingOptions> {
		// !!!
		return this.post(`/api/booking/solution/${id}`, payload).pipe(
			// map((x: any) => this.toCamelCase(x)),
			map((x: any) => new BookingOptions(x)), // mapping to BookingOptions
			// tap(x => console.log('BookingService.getBookingOptionsById', id, x)),
		);
	}

}
