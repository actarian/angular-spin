import { Document } from '../core/models';
import { Destination } from './destination';
import { TrustPilot } from './trustPilot';

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
	startDate?: Date = new Date();
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
	structureId?: number;
	tags: number[];
	to: string; // "15/06"
	topDestinationDescription?: string;
	totalPrice: number;
	trustPilot?: TrustPilot;
	type: string;
	visible?: boolean = true;
	// compatibility
	frontEndName?: string;
	structureID?: number;
	trustPilot_averageStars?: number;
	trustPilot_nReviews?: number;
	url?: string;

	constructor(options?: SearchResult) {
		if (options) {
			Object.assign(this, options);
		}
	}

	public static newCompatibleSearchResult(options: SearchResult): SearchResult {
		const searchResult: SearchResult = new SearchResult(options);
		searchResult.name = options.frontEndName;
		searchResult.photo = options.photo ? '/media/immagini/' + options.photo : null;
		searchResult.structureId = options.structureID;
		searchResult.trustPilot = new TrustPilot({ averageStars: options.trustPilot_averageStars, totalReviews: options.trustPilot_nReviews });
		// !!!
		if (searchResult.slug) {
			searchResult.slug = searchResult.slug.replace('http://eurospin-viaggi2.wslabs.it/', '/');
			searchResult.slug = searchResult.slug.replace('https://eurospin-viaggi2.wslabs.it/', '/');
		}
		return searchResult;
	}

}
