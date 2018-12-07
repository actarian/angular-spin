import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityService } from '../../core/models';

export class Survey {
	bookingCode?: string;
	customerCode?: string;
	startDate?: string;
	endDate?: string;
	idDoc?: number;
	struttura?: string;
	titolo?: string;

	assistenza?: number;
	fonte?: number;
	tipologia?: number;
	animali?: boolean;
	posizione?: number;
	staff?: number;
	servizi?: number;
	ristorazione?: number;
	pulizia?: number;
	camera?: number;
	qualitaPrezzo?: number;
	areaBenessere?: number;

	piaciuto?: string;
	nonPiaciuto?: string;

	constructor(options?: Survey) {
		if (options) {
			Object.assign(this, options);
		}
	}
}

export class SurveyResponse {
	file: any; // {customerRecordCode: "000223", customerName: "Di Paolo Massimo",…}
	filled: boolean;
	service: any; // {key: "HTL0001218", idOffer: 0, name: "HOTEL VILLA FRANCA", active: true,…}
	trustpilotUrl: string; //  "https://products.trustpilot.com/#evaluate/76cc224482ced0603a87fb7c10405a8d"
}

@Injectable({
	providedIn: 'root',
})
export class SurveyService extends EntityService<any> {

	get collection(): string {
		return '/api';
	}

	data(customerCode: string, bookingFile: string, startDate: string, endDate: string): Observable<SurveyResponse> {
		return this.get(`/survey/${customerCode}/${bookingFile}?startDate=${startDate}&endDate=${endDate}`);
	}

	survey(model: Survey): Observable<any> {
		return this.post(`/survey`, model);
	}

}
