

export class BookingAccomodation {
	price?: 770.00;
	type?: 1;
	code?: 'D01';
	name?: 'MONOLOCALE 2 PERSONE';
	checked?: boolean = false;
}

export class BookingAccomodationDetail {
	code?: string;
	rate?: number;
	xPaxAmount?: number;
	xPaxTax?: number;
	acceptTitle?: string;
	acceptText?: string;
	country?: string;
}

export class BookingExtraQuote extends BookingAccomodation {
	description?: string;
	detail?: BookingAccomodationDetail;
}

export class BookingOptions {
	accomodations: BookingAccomodation[];
	extraQuotes: BookingExtraQuote[];

	constructor(options: any) {
		if (options) {
			this.accomodations = options.accomodations || options.accomodation;
			this.extraQuotes = options.extraQuotes;
		}
		if (this.accomodations && this.accomodations.length) {
			this.accomodations[0].checked = true;
		}
		if (this.extraQuotes && this.extraQuotes.length) {
			this.extraQuotes[0].checked = true;
		}
	}
}

export class Booking {
	adults?: number = 2;
	children?: any[] = [];
	childrenCount?: number = 0;
	checkIn?: string | Date;
	checkOut?: string | Date;
	options?: BookingOptions;
	accomodation?: any = null;
	extraQuotes?: any[] = [];
	supplements?: any[] = [];
	privacy?: boolean = false;
	treatment?: any = null;
	principal?: any = null;
	duration?: number = 0;
	flexibleDate?: boolean = true;

	constructor(options?: Booking) {
		if (options) {
			Object.assign(this, options);
		}
	}

	getPayload(): Booking {
		const payload = new Booking(this);
		payload.checkIn = this.getPayloadDate(payload.checkIn);
		return payload;
	}

	getPayloadDate(date: string | Date) {
		if (date instanceof Date) {
			date = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
		}
		return date;
	}

	get daysTotal(): number {
		const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
		return Math.round(Math.abs((this.getDate(this.checkIn).getTime() - this.getDate(this.checkOut).getTime()) / (oneDay)));
	}

	get paxTotal(): number {
		return this.adults + this.children.length;
	}

	get priceTotal(): number {
		let total = 0;
		if (this.options) {
			this.options.accomodations.forEach(a => total += (a.checked ? a.price : 0));
			this.options.extraQuotes.forEach(e => total += (e.checked ? e.price : 0));
		}
		return total;
	}

	getDate(date: string | Date): Date {
		if (typeof (date) === 'string') {
			return new Date(date);
		} else {
			return date;
		}
	}
}

export class BookingAvailability {
	date: Date | string;
	cssClass: string;
	availability: boolean;

	constructor(options: BookingAvailability) {
		if (options) {
			Object.assign(this, options);
			this.date = this.getDate();
		}
	}

	getDate(): Date {
		if (typeof (this.date) === 'string') {
			return new Date(this.date);
		} else {
			return this.date;
		}
	}
}

export class BookingCalendar {
	checkins: BookingAvailability[] = [];
	checkouts: BookingAvailability[] = [];
}
