
export class BookingAvailability {
	date: Date | string;
	cssClass: string;
	availability: boolean;

	constructor(options?: BookingAvailability) {
		if (options) {
			Object.assign(this, options);
		}
		this.date = this.getDate();
	}

	getDate(): Date {
		if (typeof (this.date) === 'string') {
			return new Date(this.date);
		} else {
			return this.date;
		}
	}

	getKey(): string {
		if (typeof (this.date) === 'string') {
			return this.date;
		} else {
			return `${this.date.getFullYear()}-${this.date.getMonth() + 1}-${this.date.getDate()}`;
		}
	}
}

export class BookingCalendar {
	checkins: BookingAvailability[];
	checkouts: BookingAvailability[];
	nights?: number[];
}

export class BookingAccomodation {
	price?: number;
	type?: number;
	code?: string;
	name?: string;
	checked?: boolean = false;
}

export class BookingAccomodationDetail {
	acceptText?: string;
	acceptTitle?: string;
	code?: string;
	country?: string;
	policy?: string;
	rate?: number;
	xPaxAmount?: number;
	xPaxTax?: number;
}

export class BookingExtraQuote extends BookingAccomodation {
	description?: string;
	detail?: BookingAccomodationDetail;
}

export class BookingPrincipal extends BookingAccomodation { }

export class BookingSupplement extends BookingAccomodation { }

export class BookingTreatment extends BookingAccomodation { }

export class BookingOptions {
	accomodations: BookingAccomodation[];
	extraQuotes: BookingExtraQuote[];
	principals: BookingPrincipal[];
	supplements: BookingSupplement[];
	treatments: BookingTreatment[];

	principal?: string;
	accomodation?: string;
	supplement?: string;
	treatment?: string;

	constructor(options?: any) {
		if (options) {
			// radio required
			this.principals = options.principals || []; // options.principal;
			this.accomodations = options.accomodations || []; // options.accomodation;
			this.extraQuotes = options.extraQuotes || [];
			this.supplements = options.supplements || [];
			this.treatments = options.treatments || [];
		}
		if (this.principals && this.principals.length) {
			// radio required
			this.principals[0].checked = true;
			this.principal = this.principals[0].code;
		}
		if (this.accomodations && this.accomodations.length) {
			// radio required
			this.accomodations[0].checked = true;
			this.accomodation = this.accomodations[0].code;
		}
		if (this.treatments && this.treatments.length) {
			// radio required
			this.treatments[0].checked = true;
			this.treatment = this.treatments[0].code;
		}
		/*
		if (this.extraQuotes && this.extraQuotes.length) {
			// checkbox optionals
			this.extraQuotes[0].checked = true;
		}
		*/
	}
}

export class Booking {
	adults?: number = 2;
	children?: any[] = [];
	childrenCount?: number = 0;
	startDate?: Date;
	checkIn?: Date;
	checkOut?: Date;
	flexibleDate?: boolean = true;
	options?: BookingOptions;

	principals?: any[] = [];
	accomodations?: any[] = [];
	extraQuotes?: any[] = [];
	supplements?: any[] = [];
	treatments?: any[] = [];

	privacy?: boolean = false;
	treatment?: any = null;
	duration?: number = 0;
	nights?: number = 0;

	constructor(options?: any) {
		if (options) {
			Object.assign(this, options);
		}
	}

	getPayload?(): any {
		return {
			adults: this.adults,
			children: this.children.map(c => c.age),
			childrenCount: this.childrenCount,
			checkIn: this.dateToKey(this.checkIn),
			checkOut: this.dateToKey(this.checkOut),
			flexibleDate: this.flexibleDate,
			options: this.options,
		};
	}

	getPayloadWithKey?(key: string): any {
		const payload = {
			adults: this.adults,
			amount: this.priceTotal, // <- booking.priceTotal
			checkIn: this.dateToKey(this.checkIn),
			checkOut: this.dateToKey(this.checkOut),
			children: this.children.map(c => c.age),
			code: key, // <- hotel.key
			accomodation: this.options.accomodation, // this.options.accomodations ? this.options.accomodations.find(x => x.checked).code : null, // <- selectedItem.code
			extraQuotes: this.options.extraQuotes ? this.options.extraQuotes.filter(x => x.checked).map(x => x.code) : [], // [<- selectedItems.code]
			principal: this.options.principal, // this.options.principals ? this.options.principals.find(x => x.checked).code : null, // <- selectedItem.code
			supplements: this.options.supplements ? this.options.supplements.filter(x => x.checked).map(x => x.code) : [], // [<- selectedItems.code]
			treatment: this.options.treatment, // this.options.treatments ? this.options.treatments.find(x => x.checked).code : null, // <- selectedItem.code
		};
		console.log('Booking.getPayloadWithKey', Object.assign({}, this), payload);
		return payload;
	}

	dateToKey?(date: Date): string {
		return date ? `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` : null;
	}

	getNights(a: Date, b: Date) {
		const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
		const diff = this.getDate(a).getTime() - this.getDate(b).getTime();
		const nights = Math.round(Math.abs(diff / oneDay));
		return nights;
	}

	get daysTotal(): number {
		return this.getNights(this.checkIn, this.checkOut);
	}

	get paxTotal(): number {
		return this.adults + this.children.length;
	}

	get priceTotal(): number {
		return this.total + this.extra;
	}

	get total(): number {
		let total = 0;
		if (this.options) {
			// console.log('Booking.priceTotal', this.options.extraQuotes);
			if (this.options.accomodations) {
				this.options.accomodations.forEach(a => total += (a.checked ? a.price : 0));
			}
			if (this.options.principals) {
				this.options.principals.forEach(e => total += (e.checked ? e.price : 0));
			}
			if (this.options.supplements) {
				this.options.supplements.forEach(e => total += (e.checked ? e.price : 0));
			}
			if (this.options.treatments) {
				this.options.treatments.forEach(e => total += (e.checked ? e.price : 0));
			}
		}
		return total;
	}

	get extra(): number {
		let extra = 0;
		if (this.options) {
			if (this.options.extraQuotes) {
				this.options.extraQuotes.forEach(item => {
					extra += (item.checked ? item.price : 0);
					if (item.checked && item.detail) {
						if (item.detail.rate) {
							extra += this.total / 100 * item.detail.rate;
						}
						if (item.detail.xPaxAmount) {
							extra += this.paxTotal * item.detail.xPaxAmount;
						}
					}
				});
			}
		}
		return extra;
	}

	getDate?(date: string | Date): Date {
		if (typeof (date) === 'string') {
			return new Date(date);
		} else {
			return date;
		}
	}
}

