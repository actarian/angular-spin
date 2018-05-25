import { Document } from '../core/models';

export class SearchResult implements Document {
	abstract: string;
	accomodation: string;
	advice: number;
	category: string;
	created: string;
	destinationDescription: string;
	destinationNation: string;
	destinationProvince: string;
	destinationRegion: string;
	earlyBookingText?: string;
	earlyBooking?: string; // '28/05'
	exactPrice: boolean;
	from: string; // "27/05",
	name: string;
	id: number;
	latitude: number; // "40.551733",
	longitude: number; // "14.905204",
	overlayCoverImage: string;
	overlayCoverText: string;
	photo: string;
	price: number;
	rating?: string; // "****",
	structureID: number;
	tags: number[];
	to: string; // "15/06"
	topDestinationDescription: string;
	totalPrice: number;
	trustPilot_averageStars: number;
	trustPilot_nReviews: number;
	type: string;
	slug: string;
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
			this.structureID = options.structureID;
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
