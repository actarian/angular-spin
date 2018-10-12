import { FormGroup } from '@angular/forms';
import { GiftCard } from './gift-card';
import { Hotel } from './hotel';
import { User } from './user';

export enum CartPaymentType {
	None = 0, // Nessuno
	Cheque = 1, // Contrassegno
	CreditTransfer = 2, // Bonifico
	PayPal = 3, // PayPal
	CreditCard = 4, // Carta di Credito
	MyBank = 5 // MyBank
}

export enum CartDocumentType {
	None = 0, // Non richiesti
	Car = 1000, // Dati Automobile
	PassportOrIdentityCard = 2000, // Qualsiasi (Passaporto o CI)
	PassportOrIdentityCardAndCar = 3000, // Qualsiasi (Passaporto o CI), Dati Automobile
	Passport = 4000, // Passaporto
	PassportAndCar = 5000// Passaporto, Dati Automobile
}

export class CartTotalAmount {
	balance?: number;
	currencyCode?: string;
	dueAmount?: number;
	paiedAmount?: number;
	totalAmountAfterDiscount?: number;
	totalAmountBeforeDiscount?: number;
	totalAmountWithoutVat?: number;
	totalDiscount?: number;
}

export class CartDetail {
	totalAmountDetail?: CartTotalAmount;
}

export class CartPassengerDocument {
	idType: string;
	idCode: string;
	idIssueLocation: string;
	idIssueCounty: string;
	idIssueDate: Date | string;
	idExpireDate: Date | string;

	constructor(options?: any) {
		if (options) {
			Object.assign(this, options);
		}
		if (this.idExpireDate === '0001-01-01T00:00:00') {
			this.idExpireDate = null;
		}
		if (this.idIssueDate === '0001-01-01T00:00:00') {
			this.idIssueDate = null;
		}
	}

}

export class CartPassenger {
	address?: string;
	areaCode?: string;
	birthCounty?: string;
	birthDate?: Date | string;
	birthPlace?: string;
	categoryCode?: string;
	citizenshipCode?: string;
	cityName?: string;
	countyCode?: string;
	docExpireDate?: Date | string;
	docIssueDate?: Date | string;
	email?: string;
	firstName?: string;
	fiscalCode?: string;
	gender?: string;
	group?: FormGroup;
	hasDefaultValue?: boolean;
	idDocInfo?: CartPassengerDocument;
	lastName?: string;
	name?: string;
	nationCode?: string;
	nationality?: string;
	password?: string;
	roomRPH?: string;
	rph?: string;
	stateCode?: string;
	vatCode?: string;
	verifyDiscount?: boolean;
	zipCode?: string;

	ageRequired?: number = 18;

	get ageRequiredLabel(): string {
		if (this.ageRequired < 13) {
			return 'BAMBINO';
		} else if (this.ageRequired < 18) {
			return 'RAGAZZO';
		} else {
			return 'ADULTO';
		}
	}

	get ageRequiredError(): string {
		if (this.ageRequired < 18) {
			return `L'età richiesta è ${this.ageRequired} anni`;
		} else {
			return 'Il passeggero deve essere maggiorenne';
		}
	}

	/*
	birthDate?: Date | string;
	categoryCode?: string;
	citizenshipCode?: string;
	firstName?: string;
	fiscalCode?: string;
	hasDefaultValue: boolean;
	lastName?: string;
	name?: string;
	roomRPH?: string;
	rph?: string;

	billingHolder?: string;
	birthPlace?: string;
	eMail?: string;
	embassyRefCode?: string;
	flagStatus?: string;
	masterRecordCode?: string;
	nationCode?: string;
	note?: string;
	notes?: any[];
	offerCode?: string;
	phoneNumber?: string;
	roomingNote?: string;
	sex?: string;
	*/

	constructor(options?: any) {
		if (options) {
			Object.assign(this, options);
		}
		if (this.birthDate && String(this.birthDate).indexOf('0001-01-01') === 0) {
			this.firstName = null;
			this.lastName = null;
			this.birthDate = null;
			this.docIssueDate = null;
			this.docExpireDate = null;
			this.hasDefaultValue = false;
		}
		this.idDocInfo = new CartPassengerDocument(this.idDocInfo);
	}
}

export class CartDocumentCar {
	enable?: boolean;
	plate?: string;
	model?: string;
	description?: string;
}

export class CartDocument {
	type: CartDocumentType;
	name?: string;
	car?: CartDocumentCar;
}

export class CartPaymentAdvance {
	amount?: number;
	balance?: number;
	daysBalance?: number;
	daysLimit?: number;
	dueDateTime?: Date | string;
	enable?: boolean;
	percentage?: number;
}

export class CartServiceItem {
	accomodation?: string;
	accomodationDescription?: string;
	adults?: number;
	amount?: number;
	checkIn?: Date | string;
	checkOut?: Date | string;
	children?: any[];
	code?: string;
	extraQuotes?: any[];
	id?: number;
	mandatoryDocument?: CartDocument;
	principal?: string;
	supplements?: any[];
}

export class CartContact {
	lastName?: string;
	name?: string;
	phoneNumber?: string;
}

export class CartAvesService {
	code?: string;
	description?: string;
	detail?: any;
	extraCode?: string;
	name?: string;
	price?: number;
	type?: number;
}

export class CartPayment {
	payment?: any; // {asIFrame: false, paymentData: {amount: 166.77, bookingFileCode: "18/021125", advance: 0, method: 0,…},…}
	asIFrame?: boolean; //
	booking?: any; // {customerRecordCode: "000223", customerName: "Di Paolo Massimo",…}
	extraField?: string; //
	ga?: any[]; //
	method?: number; //
	paymentData?: any; // {amount: 166.77, bookingFileCode: "18/021125", advance: 0, method: 0,…}
	toBOM?: boolean; //
	url?: string; // "https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&useraction=commit&token=EC-65659499U9213344S"
}

export class Cart {
	availablePayments?: CartPaymentType[];
	avesExtraQuotes?: CartAvesService[];
	avesServices?: CartAvesService[];
	checkIn?: Date;
	checkOut?: Date;
	code?: string;
	contact?: CartContact;
	customer?: User;
	detail?: CartDetail;
	dinnerShift?: number;
	giftCards?: GiftCard[] = [];
	mandatoryDocument?: CartDocument;
	passengers?: CartPassenger[] = [];
	paxNumber?: number;
	payment?: CartPayment;
	paymentAdvance?: CartPaymentAdvance;
	paymentMethod?: CartPaymentType;
	serviceDetail?: Hotel;
	services?: CartServiceItem[];

	privacy?: boolean;
	advertising?: boolean;
	condizioni?: boolean;

	notifyUrl?: any;

	static dateToKey(date: Date): string {
		return date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : null;
	}

	static getDate(date: string | Date): Date {
		if (typeof (date) === 'string') {
			return new Date(date);
		} else {
			return date;
		}
	}

	static getNights(a: Date, b: Date) {
		const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
		const diff = Cart.getDate(a).getTime() - Cart.getDate(b).getTime();
		const nights = Math.round(Math.abs(diff / oneDay));
		return nights;
	}

	// static cfPattern = /[a-z]{6}\d{2}[abcdehlmprst]\d{2}[a-z]\d{3}[a-z]/i;

	constructor(options?: any) {
		if (options) {
			Object.assign(this, options);
			this.giftCards = options.giftCards ? options.giftCards.map(x => new GiftCard(x)) : [];
			this.serviceDetail = new Hotel(options.serviceDetail);
			if (this.service && options.passengers) {
				this.passengers = options.passengers.map((item, i: number) => {
					const passenger = new CartPassenger(item);
					const ageRequired = i >= this.service.adults ? this.service.children[i - this.service.adults] : 18;
					passenger.ageRequired = ageRequired;
					return passenger;
				});
			}
			this.contact = this.contact || new CartContact();
		}
	}

	getPayload?(): any {
		return {
			checkIn: Cart.dateToKey(this.checkIn),
			checkOut: Cart.dateToKey(this.checkOut),
			paxNumber: this.paxNumber,
			passengers: this.passengers,
			giftCards: this.giftCards,
			code: this.code,
			paymentMethod: this.paymentMethod,
			mandatoryDocument: this.mandatoryDocument,
			customer: this.customer,
		};
	}

	get service(): CartServiceItem {
		return this.services && this.services.length ? this.services[0] : null;
	}

	get accomodation(): any {
		return this.service ? this.service.accomodationDescription : '';
	}

	get daysTotal(): number {
		return Cart.getNights(this.checkIn, this.checkOut);
	}

	get paxTotal(): number {
		return this.paxNumber;
	}

	get priceTotal(): number {
		return this.detail.totalAmountDetail.totalAmountAfterDiscount;
	}

	get paymentPaidAmount(): number {
		let credit: number = 0;
		this.giftCards.forEach(c => credit += c.credits);
		return credit;
	}

	get paymentDueAmount(): number {
		const paid: number = this.paymentPaidAmount;
		const due: number = (this.paymentAdvance && this.paymentAdvance.enable) ? this.paymentAdvance.amount : this.detail.totalAmountDetail.totalAmountAfterDiscount;
		return Math.max(Math.round((due - paid) * 100) / 100, 0);
	}

}
