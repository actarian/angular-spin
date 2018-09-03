import { Injectable, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
	public booking$: BehaviorSubject<Booking>;

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
		const storedBooking = this.storage.get('booking');
		this.booking$ = new BehaviorSubject<Booking>(storedBooking ? new Booking(storedBooking) : null);
	}

	getTopServiceDetailsById(id: number | string): Observable<Hotel> {
		return this.get(`/api/data/topservicedetails/${id}`).pipe(
			map((x: any) => this.toCamelCase(x)),
			map((x: any) => new Hotel(x)), // mapping to hotel
			tap(x => console.log('BookingService.getTopServiceDetailsById', id, x)),
		);
	}

	getBookingCheckInById(id: number | string, payload: Booking): Observable<BookingAvailability[]> {
		// !!!
		return this.post(`/www/api/booking/checkin/${id}`, payload).pipe(
			map((x: any) => this.toCamelCase(x)),
			// map((x: any) => new Hotel(x)), // mapping to hotel
			tap(x => console.log('BookingService.getBookingCheckInById', id, x)),
		);
	}

	getBookingCheckOutById(id: number | string, payload: Booking): Observable<BookingAvailability[]> {
		// !!!
		return this.post(`/www/api/booking/checkout/${id}`, payload).pipe(
			map((x: any) => this.toCamelCase(x)),
			// map((x: any) => new Hotel(x)), // mapping to hotel
			tap(x => console.log('BookingService.getBookingCheckOutById', id, x)),
		);
	}

	getBookingOptionsById(id: number | string, payload: Booking): Observable<BookingOptions> {
		// !!!
		return this.post(`/www/api/booking/solution/${id}?state=true`, payload).pipe(
			map((x: any) => this.toCamelCase(x)),
			map((x: any) => new BookingOptions(x)), // mapping to BookingOptions
			tap(x => console.log('BookingService.getBookingOptionsById', id, x)),
		);
	}

	setBookingOptionsById(id: number | string, payload: Booking): Observable<BookingOptions> {
		return this.post(`/api/booking/book/${id}?state=true`, payload).pipe(
			map((x: any) => this.toCamelCase(x)),
			map((x: any) => new BookingOptions(x)), // mapping to BookingOptions
			tap(x => console.log('BookingService.setBookingOptionsById', id, x)),
		);
	}

	doBook(id: number | string, payload: Booking): void {
		this.storage.set('booking', payload);
		this.booking$.next(payload);
	}

	/*
	getCoupon: function () {
		return _this._get('/api/booking/coupon?state=true');
	},
	addCoupon: function (code) {
		return _this._post('/api/booking/coupon?state=true', '"' + code + '"');
	},
	reserve: function (data) {
		return _this._post('/api/booking/reserve/?state=true', this.getFilter(data));
	},
	quote: function (code, data) {
		return _this._post('/api/booking/quote/' + code + '?state=true', this.getFilter(data));
	},
	complete: function (data) {
		return _this._post('/api/booking/complete/?state=true', this.getFilter(data));
	},
	*/

}
