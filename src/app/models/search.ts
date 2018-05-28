import { Document } from '../core/models';
import { Destination } from './destination';

export class Duration {
	id: number;
	name: string;
}

export const durations: Duration[] = [
	{ id: 1, name: 'Qualsiasi durata' },
	{ id: 2, name: '1-3 notti' },
	{ id: 3, name: '4-6 notti' },
	{ id: 4, name: '7 notti' },
	{ id: 5, name: '8-13 notti' },
	{ id: 6, name: '14 notti o più' }
];

export class MainSearch {
	query?: string;
	destination?: Destination;
	startDate?: Date;
	flexibleDates: boolean = false;
	duration: Duration = durations[0];
	adults: number = 2;
	childs: number = 0;
	childrens: any[] = [];

	constructor(options?: MainSearch) {
		if (options) {
			this.query = options.query || null;
			this.destination = options.destination as Destination;
			this.startDate = options.startDate ? new Date(options.startDate) : null;
			this.flexibleDates = !options.flexibleDates;
			this.duration = options.duration ? durations.find(x => x.id === options.duration.id) : durations[0];
			this.adults = options.adults || 2;
			this.childs = options.childs || 0;
			this.childrens = options.childrens || [];
		}
	}
}

export class CalendarOption {
	it: any = {
		firstDayOfWeek: 1,
		dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
		dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Giov', 'Ven', 'Sab'],
		dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
		monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
		dateFormat: 'dd/mm/yy',
		monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
		today: 'Oggi',
		clear: 'Resetta'
	};
	minDate: Date;
	maxDate: Date;
	minYear: number;
	maxYear: number;
	active: string;

	constructor() {
		this.minDate = new Date();
		this.maxDate = new Date();
		this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
		this.minYear = this.minDate.getFullYear();
		this.maxYear = this.maxDate.getFullYear();
	}
}

export class SearchResult implements Document {
	abstract: string;
	accomodation: string;
	advice: number;
	category?: string;
	created: string;
	destinationDescription?: string;
	destinationNation?: string;
	destinationProvince?: string;
	destinationRegion?: string;
	earlyBookingText?: string;
	earlyBooking?: string; // '28/05'
	exactPrice: boolean;
	from: string; // "27/05",
	name: string;
	id: number;
	structureId: number;
	latitude?: number; // "40.551733",
	longitude?: number; // "14.905204",
	overlayCoverImage: string;
	overlayCoverText: string;
	photo: string;
	price: number;
	rating?: string; // "****",
	tags: number[];
	to: string; // "15/06"
	topDestinationDescription?: string;
	totalPrice: number;
	trustPilot_averageStars: number;
	trustPilot_nReviews: number;
	type: string;
	slug: string;
	visible?: boolean = true;
	constructor(options?: SearchResult) {
		if (options) {
			this.abstract = options.abstract;
			this.accomodation = options.accomodation;
			this.advice = options.advice;
			this.category = options.category;
			this.created = options.created;
			this.destinationDescription = options.destinationDescription;
			this.destinationNation = options.destinationNation;
			this.destinationProvince = options.destinationProvince;
			this.destinationRegion = options.destinationRegion;
			this.earlyBooking = options.earlyBooking;
			this.earlyBookingText = options.earlyBookingText;
			this.exactPrice = options.exactPrice;
			this.from = options.from;
			this.name = options.name;
			this.id = options.id;
			this.latitude = options.latitude;
			this.longitude = options.longitude;
			this.overlayCoverImage = options.overlayCoverImage;
			this.overlayCoverText = options.overlayCoverText;
			this.photo = options.photo;
			this.price = options.price;
			this.rating = options.rating || '';
			this.structureId = options.structureId;
			this.tags = options.tags;
			this.to = options.to;
			this.topDestinationDescription = options.topDestinationDescription;
			this.totalPrice = options.totalPrice;
			this.trustPilot_averageStars = options.trustPilot_averageStars;
			this.trustPilot_nReviews = options.trustPilot_nReviews;
			this.type = options.type;
			this.slug = options.slug;
		}
	}
}
