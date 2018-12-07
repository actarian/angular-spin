import { Document } from '../core/models';
import { Destination, DestinationTypes } from './destination';
import { Hotel } from './hotel';
import { TrustPilot } from './trustPilot';

export class Duration {
	id: number;
	name: string;
	value: number[];
}

export const durations: Duration[] = [
	{ id: 1, name: 'Qualsiasi durata', value: [1, 21] },
	{ id: 2, name: '1-3 notti', value: [1, 3] },
	{ id: 3, name: '4-6 notti', value: [4, 6] },
	{ id: 4, name: '7 notti', value: [7] },
	{ id: 5, name: '8-13 notti', value: [8, 13] },
	{ id: 6, name: '14 notti o più', value: [14, 21] }
];

export class MainSearch {
	query?: string;
	destination?: Destination;
	startDate?: Date;
	flexibleDates: boolean = true;
	duration: Duration = durations[0];
	adults: number = 2;
	childs: number = 0;
	childrens: any[] = [];

	constructor(options?: MainSearch) {
		if (options) {
			this.query = options.query || null;
			this.destination = options.destination as Destination;
			this.startDate = options.startDate ? new Date(options.startDate) : null;
			this.flexibleDates = options.flexibleDates;
			this.duration = options.duration ? durations.find(x => x.id === options.duration.id) : durations[0];
			this.adults = options.adults || 2;
			this.childs = options.childs || 0;
			this.childrens = options.childrens || [];
		}
	}

	static getPayload?(options?: MainSearch): any {
		return new MainSearch(options).getPayload();
	}

	getPayload?(tags?: number[]): any {
		// console.log('MainSearch.getPayload', this.destination);
		const payload = {
			adults: this.adults,
			children: this.childrens.map(ch => ch.age),
			destinations: (this.destination && this.destination.type === DestinationTypes.Destination) ? [this.destination.code] : [],
			duration: this.duration.value || durations[0],
			flexibleDate: this.flexibleDates,
			from: this.startDate,
			tags: (this.destination && this.destination.type !== DestinationTypes.Destination) ? [this.destination.id] : []
		};
		if (tags) {
			// console.log('MainSearch.getPayload', tags);
			payload.tags = payload.tags.concat(tags);
		}
		return payload;
	}

}

export class SearchResult implements Document {
	id: number | string;
	abstract: string;
	accomodation: string;
	advice: number;
	category?: string;
	created: string;
	destinationDescription?: string;
	destinationNation?: string;
	destinationProvince?: string;
	destinationRegion?: string;
	earlyBooking?: string; // '28/05'
	earlyBookingText?: string;
	exactPrice: boolean;
	from: string; // "27/05",
	latitude?: number; // "40.551733",
	longitude?: number; // "14.905204",
	name: string;
	overlayCoverImage: string;
	overlayCoverText: string;
	photo: string;
	price: number;
	rating?: string; // "****",
	selected?: boolean = false;
	slug: string;
	structureID?: number;
	tags: number[];
	to: string; // "15/06"
	topDestinationDescription?: string;
	totalPrice: number;
	trustPilot?: TrustPilot;
	type: string;
	visible?: boolean = true;
	// compatibility
	frontEndName?: string;
	trustPilot_averageStars?: number;
	trustPilot_nReviews?: number;
	url?: string;

	constructor(options?: SearchResult) {
		if (options) {
			Object.assign(this, options);
		}
	}

	public static newCompatibleSearchResult(options: SearchResult): SearchResult {
		const item: SearchResult = new SearchResult(options);
		item.name = options.frontEndName;
		item.photo = options.photo && options.photo.indexOf('/media/immagini/') !== 0 ? '/media/immagini/' + options.photo : (options.photo || null);
		item.trustPilot = new TrustPilot({ averageStars: options.trustPilot_averageStars, totalReviews: options.trustPilot_nReviews });
		return item;
	}

	public static newSearchResultFromHotel(hotel: Hotel): SearchResult {
		const item: SearchResult = new SearchResult();
		item.id = hotel.id;
		item.frontEndName = hotel.frontEndName;
		item.rating = hotel.rating;
		item.trustPilot = hotel.trustPilot;
		item.destinationDescription = hotel.destinationDescription;
		item.destinationProvince = hotel.destinationProvince;
		item.photo = hotel.photo;
		item.overlayCoverImage = hotel.overlayCoverImage;
		item.overlayCoverText = hotel.overlayCoverText;
		item.slug = hotel.slug;
		item.url = hotel.slug;
		// x GtmService
		item.price = hotel.price;
		item.type = hotel.esType;
		item.accomodation = hotel.accomodation;
		item.destinationRegion = hotel.destinationRegion;
		item.destinationNation = hotel.destinationNation;
		item.category = hotel.category;
		/*
		item.destinationRegion = hotel.destinationRegion;
		item.destinationNation = hotel.destinationNation;
		item.category = hotel.category;
		*/
		return item;
	}

}
