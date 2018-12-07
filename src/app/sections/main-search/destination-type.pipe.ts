import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { Destination, DestinationTypes } from '../../models/destination';

@Pipe({
	name: 'destinationType',
	// pure: false
})

@Injectable({
	providedIn: 'root'
})
export class DestinationTypePipe implements PipeTransform {

	transform(destination: Destination): string {
		let type = '';
		if (destination) {
			switch (destination.type) {
				case DestinationTypes.Category:
					type = 'Categoria';
					break;
				case DestinationTypes.Promotion:
					type = 'Promozione';
					break;
				case DestinationTypes.Country:
					type = 'Paese';
					break;
				case DestinationTypes.Region:
					type = 'Regione';
					break;
				case DestinationTypes.Touristic:
					type = 'Area Turistica';
					break;
				case DestinationTypes.Province:
					type = 'Provincia';
					break;
				case DestinationTypes.Destination:
					type = 'Località';
					break;
				case DestinationTypes.Hotel:
					type = 'Struttura';
					break;
			}
		}
		return type;
	}

}
