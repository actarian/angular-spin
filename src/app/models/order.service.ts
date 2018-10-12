import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { EntityService } from '../core/models';
import { SearchResult } from './search';

export enum OrderStatus {
	Undefined = 0, // Non definito
	Quoted = 1, // Preventivo
	Optioned = 2, // Opzionato
	Requested = 3, // In richiesta
	Working = 4, // In lavorazione
	Confirmed = 5, // Confermato
	Deleted = 6, // Annullato
	Canceled = 7, // Cancellato
}

export class Order {
	id: number | string; // !!!

	bookingFileStatus?: any;
	serviceDetail?: SearchResult;

	constructor(options) {
		if (options) {
			Object.assign(this, options);
			this.serviceDetail = options.serviceDetail ? SearchResult.newCompatibleSearchResult(options.serviceDetail) : null;
		}
	}

	get statusShort(): string {
		let status: string = 'Non definito';
		switch (this.bookingFileStatus.value) {
			case OrderStatus.Quoted:
				status = 'Preventivo';
				break;
			case OrderStatus.Optioned:
				status = 'Opzionato';
				break;
			case OrderStatus.Requested:
				status = 'In Richiesta';
				break;
			case OrderStatus.Working:
				status = 'In Lavorazione';
				break;
			case OrderStatus.Confirmed:
				status = 'Confermato';
				break;
			case OrderStatus.Deleted:
				status = 'Annullato';
				break;
			case OrderStatus.Canceled:
				status = 'Cancellato';
				break;
		}
		return status;
	}
}

@Injectable({
	providedIn: 'root',
})
export class OrderService extends EntityService<Order> {

	get collection(): string {
		return '';
	}

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		protected injector: Injector,
	) {
		super(injector);
	}

	getOrders(): Observable<Order[]> {
		if (isPlatformBrowser(this.platformId)) {
			const maxDate = new Date();
			const minDate = new Date();
			minDate.setFullYear(minDate.getFullYear() - 1);
			const payload = {
				createdDate: {
					minDate: minDate,
					maxDate: maxDate
				}
			};
			return this.post(`/api/user/bookingfiledetail`, payload).pipe(
				map(data => data ? data.map(x => new Order(x)) : [])
			);
		} else {
			return of(null);
		}
	}

	getOrderDetail(id: string): Observable<Order> {
		if (isPlatformBrowser(this.platformId)) {
			console.log('OrderService.getOrderDetail', id);
			return this.post(`/api/user/bookingfiledetail`, { bookingFileCode: id }).pipe(
				switchMap((data) => {
					return data && data.length ? of(new Order(data[0])) : of(null);
				})
			);
		} else {
			return of(null);
		}
	}

}
