import { Injectable, Injector } from '@angular/core';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { EntityService } from '../../core';
import { BirthPlace } from './birth-place';
import { BirthPlaceService } from './birth-place.service';
import { FiscalCode, MONTH_CODES } from './fiscal-code';

// Original code from "codice-fiscale-js": "2.1.0",

@Injectable({
	providedIn: 'root',
})
export class FiscalCodeService extends EntityService<any> {

	get collection(): string {
		return '';
	}

	constructor(
		protected injector: Injector,
		private birthPlaceService: BirthPlaceService,
	) {
		super(injector);
	}

	fiscalCodeWithOptions(options: any): Observable<FiscalCode> {
		if (typeof options === 'string') {
			return this.fiscalCodeReverse(options);
		} else if (typeof options === 'object') {
			return this.fiscalCodeCompute(options);
		} else {
			throw new Error(`Please submit either a string or a plain object.`);
		}
	}

	fiscalCodeReverse(options: string): Observable<FiscalCode> {
		const fiscalCode: FiscalCode = new FiscalCode();
		if (FiscalCode.check(options)) {
			const code = options;
			const birthPlaceCode = code.substr(11, 4);
			return this.birthPlaceService.findByCode(birthPlaceCode).pipe(
				switchMap(x => {
					fiscalCode.code = code;
					fiscalCode.name = code.substr(3, 3);
					fiscalCode.surname = code.substr(0, 3);
					const yearCode = code.substr(6, 2);
					const year19XX = parseInt(`19${yearCode}`, 10);
					const year20XX = parseInt(`20${yearCode}`, 10);
					const currentYear20XX = new Date().getFullYear();
					const year = year20XX > currentYear20XX ? year19XX : year20XX;
					const monthChar = code.substr(8, 1);
					const month = MONTH_CODES.indexOf(monthChar);
					fiscalCode.gender = 'M';
					let day = parseInt(code.substr(9, 2), 10);
					if (day > 31) {
						fiscalCode.gender = 'F';
						day = day - 40;
					}
					fiscalCode.birthDate = new Date(year, month, day, 0, 0, 0, 0);
					fiscalCode.birthPlace = x;
					return of(fiscalCode);
				})
			);
		} else {
			throw new Error(`Provided string is not a valid fiscal code`);
		}
	}

	fiscalCodeCompute(options: any): Observable<FiscalCode> {
		const fiscalCode: FiscalCode = new FiscalCode();
		let birthPlace$: Observable<BirthPlace>;
		if (options.birthPlace && options.province) {
			birthPlace$ = this.birthPlaceService.findByNameAndProvince(options.birthPlace, options.province);
		} else if (options.birthPlace) {
			birthPlace$ = this.birthPlaceService.findByName(options.birthPlace);
		} else if (options.birthPlaceCode) {
			birthPlace$ = this.birthPlaceService.findByCode(options.birthPlaceCode);
		}
		return birthPlace$.pipe(
			switchMap(x => {
				fiscalCode.name = options.name;
				fiscalCode.surname = options.surname;
				fiscalCode.gender = FiscalCode.getGender(options.gender);
				fiscalCode.birthDate = options.birthDate ? FiscalCode.getValidDate(options.birthDate) : FiscalCode.getValidDate(options.day, options.month, options.year);
				fiscalCode.birthPlace = x;
				fiscalCode.code = FiscalCode.compute(fiscalCode);
				return of(fiscalCode);
			})
		);
	}

}
