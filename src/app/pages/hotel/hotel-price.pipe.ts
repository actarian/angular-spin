import { Injectable, Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'price'
})

@Injectable({
	providedIn: 'root'
})
export class HotelPricePipe implements PipeTransform {

	transform(value: number | string, currency: string = ''): string {
		return `${Number(value).toFixed(2)}${currency}`;
	}

}
