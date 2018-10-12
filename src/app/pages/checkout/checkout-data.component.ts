import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CodiceFiscale } from 'codice-fiscale-js';
import { finalize, first, mergeMap, takeUntil, tap } from 'rxjs/operators';
import { DisposableComponent, Entity, ModalCompleteEvent, ModalService } from '../../core';
import { Cart, CartService, User, UserService } from '../../models';
import { DataService, Nation } from '../../models/data.service';
import { AuthComponent } from '../auth/auth.component';

@Component({
	selector: 'checkout-data-component',
	templateUrl: './checkout-data.component.html',
	styleUrls: ['./checkout-data.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class CheckoutDataComponent extends DisposableComponent implements OnInit {

	nations: Nation[] = [];
	counties: Entity[] = [];
	cart: Cart;
	user: User;
	model: any = { passwordReveal: true };
	skipUser: boolean;
	calculatedFiscalCode: string;

	error: any;
	submitted: boolean = false;
	busy: boolean = false;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private router: Router,
		private route: ActivatedRoute,
		private dataService: DataService,
		private modalService: ModalService,
		private userService: UserService,
		private cartService: CartService,
	) {
		super();
	}

	ngOnInit() {
		this.user = this.route.snapshot.data['user'];
		this.cart = this.route.snapshot.data['cart'];
		this.dataService.nationsAndCounties().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(data => {
			this.nations = data.nations;
			this.counties = data.counties;
			this.setUser(this.user);
			this.userService.user$.pipe(
				takeUntil(this.unsubscribe),
			).subscribe(user => {
				this.setUser(user);
			});
		});
	}

	getDefaultCountry(code: string): string {
		return code ? this.nations.map(x => x.code).find(x => x === code) : 'ITA';
	}

	setUser(user: User) {
		this.user = user;
		if (user) {
			Object.assign(this.model, this.user);
			const italy: Nation = this.nations.find(x => x.code === 'ITA');
			this.model.stateCode = this.getDefaultCountry(this.model.stateCode);
			this.model.nationality = this.getDefaultCountry(this.model.nationality);
			this.model.gender = this.model.gender || 'M';
			// !!!
			this.calculatedFiscalCode = this.model.fiscalCode;
			console.log('CheckoutDataComponent.setUser', this.model);
		}
	}

	onSign(): void {
		this.modalService.open({ component: AuthComponent }).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(e => {
			if (e instanceof ModalCompleteEvent) {
				console.log('CheckoutDataComponent.ModalCompleteEvent');
				// this.setUser(e.data);
			}
		});
	}

	onSignUp(): void {
		if (!this.model.password) {
			this.skipUser = true;
		} else {
			this.error = null;
			this.busy = true;
			this.userService.signUp(this.model).pipe(
				first(),
				finalize(() => this.busy = false),
			).subscribe(
				user => console.log(user),
				error => this.error = error
			);
		}
	}

	onUserData(): void {
		// return this.onNextStep();
		this.error = null;
		this.busy = true;
		this.userService.edit(this.model).pipe(
			takeUntil(this.unsubscribe),
			mergeMap(user => {
				this.cart.customer = user;
				return this.cartService.updateCart(this.cart);
			}),
			tap(cart => Object.assign(this.cart, cart)),
			finalize(() => this.busy = false),
		).subscribe(
			user => this.onNextStep(),
			error => this.error = error
		);
	}

	onNextStep(): void {
		// !!!
		setTimeout(() => {
			this.router.navigate(['../dati_passeggeri'], { relativeTo: this.route });
		}, 350);
	}

	onNameChanged() {
		console.log('CheckoutDataComponent.onNameChanged', this.model.firstName, this.model.lastName);
		this.doCalcFiscalCode();
	}

	onProvinceChanged() {
		console.log('CheckoutDataComponent.onProvinceChanged', this.model.countyCode);
	}

	onCountryChanged() {
		console.log('CheckoutDataComponent.onCountryChanged', this.model.stateCode);
	}

	onNationalityChanged() {
		console.log('CheckoutDataComponent.onNationalityChanged', this.model.nationality);
	}

	onBirthCityChanged() {
		console.log('CheckoutDataComponent.onBirthCityChanged', this.model.birthCity);
		this.doCalcFiscalCode();
	}

	onBirthCountyChanged() {
		console.log('CheckoutDataComponent.onBirthCountyChanged', this.model.birthCounty);
	}

	onInputDateChanged(date: Date) {
		console.log('CheckoutDataComponent.onInputDateChanged', date);
		this.doCalcFiscalCode();
	}

	onGenderChanged() {
		console.log('CheckoutDataComponent.onGenderChanged', this.model.gender);
		this.doCalcFiscalCode();
	}

	doCalcFiscalCode() {
		if (isPlatformBrowser(this.platformId)) {
			// console.log('CheckoutDataComponent.doCalcFiscalCode', this.model.fiscalCode, this.calculatedFiscalCode);
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
				console.log('CheckoutDataComponent.doCalcFiscalCode', fiscalCode);
				if (fiscalCode) {
					this.model.fiscalCode = fiscalCode.code;
					this.calculatedFiscalCode = fiscalCode.code;
				}
			}
		}
	}

}
