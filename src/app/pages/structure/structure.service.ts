import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityService } from '../../core/models';

export class Structure {
	altro?: string;
	cameredoppie?: number;
	camerequadruple?: number;
	camerequintuple?: number;
	cameretotali?: number;
	cameretriple?: number;
	cap?: string;
	categoria?: string;
	descTipologia?: string;
	email?: string;
	id?: number;
	indirizzo?: string;
	localita?: string;
	nomestruttura?: string;
	orari?: string;
	provincia?: string;
	provinciafreetext?: string;
	referente?: string;
	regione?: number;
	stato?: string;
	telcell?: string;
	telfisso?: string;
	tipostruttura?: string;
}

@Injectable({
	providedIn: 'root',
})
export class StructureService extends EntityService<any> {

	get collection(): string {
		return '/api/action';
	}

	structure(model: Structure): Observable<any> {
		return this.post(`/structure`, model);
	}

}
