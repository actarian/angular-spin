import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CodiceFiscale } from 'codice-fiscale-js';
import { finalize, takeUntil } from 'rxjs/operators';
import { Entity } from '../../core';
import { DisposableComponent } from '../../core/disposable';
import { DataService, Nation } from '../../models/data.service';
import { User } from '../../models/user';
import { UserService } from '../../models/user.service';


@Component({
	selector: 'profile-component',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class ProfileComponent extends DisposableComponent implements OnInit {

	nations: Nation[];
	counties: Entity[];
	user: User;
	model: any = {};
	calculatedFiscalCode: string;

	busy: boolean = false;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private route: ActivatedRoute,
		private dataService: DataService,
		private userService: UserService,
	) {
		super();
	}

	ngOnInit() {
		this.dataService.nationsAndCounties().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(data => {
			this.nations = data.nations;
			this.counties = data.counties;
			this.setUser(this.route.snapshot.data['user']);
		});
	}

	getDefaultCountry(code: string): string {
		return code ? this.nations.map(x => x.code).find(x => x === code) : 'ITA';
	}

	setUser(user: User) {
		this.user = user;
		Object.assign(this.model, this.user);
		const italy: Nation = this.nations.find(x => x.code === 'ITA');
		this.model.stateCode = this.getDefaultCountry(this.model.stateCode);
		this.model.nationality = this.getDefaultCountry(this.model.nationality);
		this.model.gender = this.model.gender || 'M';
		console.log('PofileComponent.setUser', this.user, this.model);
	}

	onSubmit() {
		this.busy = true;
		this.userService.edit(this.model).pipe(
			takeUntil(this.unsubscribe),
			finalize(() => this.busy = false),
		).subscribe(
			user => this.setUser(user),
			error => console.log(error)
		);
	}

	onNameChanged() {
		console.log('ProfileComponent.onNameChanged', this.model.firstName, this.model.lastName);
		this.doCalcFiscalCode();
	}

	onProvinceChanged() {
		console.log('ProfileComponent.onProvinceChanged', this.model.countyCode);
	}

	onCountryChanged() {
		console.log('ProfileComponent.onCountryChanged', this.model.stateCode);
	}

	onNationalityChanged() {
		console.log('ProfileComponent.onNationalityChanged', this.model.nationality);
	}

	onBirthCityChanged() {
		console.log('ProfileComponent.onBirthCityChanged', this.model.birthCity);
		this.doCalcFiscalCode();
	}

	onBirthCountyChanged() {
		console.log('ProfileComponent.onBirthCountyChanged', this.model.birthCounty);
	}

	onInputDateChanged(date: Date) {
		console.log('ProfileComponent.onInputDateChanged', date);
		this.doCalcFiscalCode();
	}

	onGenderChanged() {
		console.log('ProfileComponent.onGenderChanged', this.model.gender);
		this.doCalcFiscalCode();
	}

	doCalcFiscalCode() {
		if (isPlatformBrowser(this.platformId)) {
			// console.log('ProfileComponent.doCalcFiscalCode', this.model.fiscalCode, this.calculatedFiscalCode);
			if ((!this.model.fiscalCode || this.model.fiscalCode === this.calculatedFiscalCode) &&
				this.model.firstName && this.model.lastName && this.model.gender && this.model.birthCity
			) {
				const fiscalCode: any = new CodiceFiscale({
					name: this.model.firstName,
					surname: this.model.lastName,
					gender: this.model.gender,
					day: this.model.birthDate ? new Date(this.model.birthDate).getDate() : 1,
					month: this.model.birthDate ? new Date(this.model.birthDate).getMonth() + 1 : 1,
					year: this.model.birthDate ? new Date(this.model.birthDate).getFullYear() : 1970,
					birthplace: this.model.birthCity,
					// birthplaceProvincia: string // Optional
				});
				console.log('ProfileComponent.doCalcFiscalCode', fiscalCode);
				if (fiscalCode) {
					this.model.fiscalCode = fiscalCode.code;
					this.calculatedFiscalCode = fiscalCode.code;
				}
			}
		}
	}

}
