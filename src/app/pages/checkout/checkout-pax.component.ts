import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, takeUntil } from 'rxjs/operators';
import { DisposableComponent, Entity, Page, PageService } from '../../core';
import { CartService, FeatureEnum, Hotel, HotelType, User } from '../../models';
import { Cart, CartDocumentType, CartPassenger, CartServiceItem } from '../../models/cart';
import { DataService, Nation } from '../../models/data.service';

@Component({
	selector: 'checkout-pax-component',
	templateUrl: './checkout-pax.component.html',
	styleUrls: ['./checkout-pax.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class CheckoutPaxComponent extends DisposableComponent implements OnInit {

	nations: Nation[] = [];
	counties: Entity[] = [];
	user: User;
	cart: Cart;
	model: Cart;
	hotel: Hotel;
	service: CartServiceItem;
	page: Page;
	hotelTypes: any = HotelType;
	features: any = FeatureEnum;

	error: any;
	submitted: boolean = false;
	busy: boolean = false;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private formBuilder: FormBuilder,
		private dataService: DataService,
		private cartService: CartService,
		private pageService: PageService,
	) {
		super();
	}

	ngOnInit() {
		this.user = this.route.snapshot.data['user'];
		this.cart = this.route.snapshot.data['cart'];
		this.hotel = this.cart.serviceDetail;
		this.service = this.cart.services[0];
		this.model = new Cart(this.cart);
		this.model.passengers = this.cart.passengers.map((pax: CartPassenger, i: number) => {
			if (i === 0) {
				pax.firstName = this.user.firstName;
				pax.lastName = this.user.lastName;
				pax.birthDate = this.user.birthDate;
				pax.birthPlace = this.user.birthCity;
				pax.birthCounty = this.user.birthCounty;
				pax.nationality = this.user.stateCode;
				console.log(pax);
			}
			return pax;
		});
		this.dataService.nationsAndCounties().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(data => {
			this.nations = data.nations;
			this.counties = data.counties;
			this.setPassengers(this.model.passengers);
		});
		this.pageService.getPageById(this.hotel.id).pipe(
			takeUntil(this.unsubscribe),
		).subscribe(page => {
			this.page = page;
		});
	}

	getDefaultCountry(code: string): string {
		return code ? this.nations.map(x => x.code).find(x => x === code) : 'ITA';
	}

	setPassengers(passengers: CartPassenger[]) {
		const italy: Nation = this.nations.find(x => x.code === 'ITA');
		passengers.forEach(x => {
			x.nationCode = this.getDefaultCountry(x.nationCode);
		});
	}

	onPax(): void {
		// return this.onNextStep();
		this.busy = true;
		this.cartService.updateCart(this.model).pipe(
			takeUntil(this.unsubscribe),
			finalize(() => this.busy = false),
		).subscribe(
			cart => this.onNextStep(),
			error => console.log(error)
		);
	}

	onNextStep(): void {
		this.router.navigate(['../pagamento'], { relativeTo: this.route });
	}

	onPrevStep(): void {
		this.router.navigate(['../i_tuoi_dati'], { relativeTo: this.route });
	}

	onDinnerShiftChanged() {
		console.log('CheckoutPaxComponent.onDinnerShiftChanged', this.model.dinnerShift);
	}

	onDocumentTypeChanged() {
		console.log('CheckoutPaxComponent.onDocumentTypeChanged');
	}

	carInfoNeeded(): boolean {
		const cart = this.cart;
		return cart && (cart.mandatoryDocument.type === CartDocumentType.Car ||
			cart.mandatoryDocument.type === CartDocumentType.PassportOrIdentityCardAndCar ||
			cart.mandatoryDocument.type === CartDocumentType.PassportAndCar);
	}

}
