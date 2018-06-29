import { Document } from '../core/models';
import { Tag } from './tag';

export class HotelLocation {
	cityCode: string;
	nationCode: string;
	avesDstCode: string;
	latitude: number;
	longitude: number;
}

export class HotelAddress {
	description: string;
	city: string;
	cap: string;
	provinceCode: string;
	countryCode: string;
	phone: string;
}

export class BaseTag {
	key: string;
}

export class Hotel implements Document {
	// url: string;
	slug: string;
	id: number;
	idOffer: number;
	name: string;
	active: boolean;
	destinationDescription: string;
	destinationProvince: number;
	structureID: number;
	overlayCoverImage: string;
	overlayCoverText: string;
	frontEndName: string;
	trustPilot_nReviews: number;
	trustPilot_averageStars: number;
	accomodation: string;
	rating: string;
	abstract: string;
	photo: string;
	cover: string;
	excludeFeed: boolean;
	from: Date;
	to: Date;
	created: Date;
	bookFrom: Date;
	bookTo: Date;
	price: number;
	advice: number;
	mandatoryDocument: number;
	avesDstCode: string;
	avesNationCode: string;
	eSType: string;
	minStay: number;
	weekDaysIn: number;
	weekDaysOut: number;
	key: string;
	//
	location: HotelLocation;
	address: HotelAddress;
	baseTags: BaseTag[];
	tagList: Tag[];
	statisticCodes: any;
	//
	constructor(options?: Hotel) {
		if (options) {
			// this.url = options.url;
			this.cover = 'https://www.eurospin-viaggi.it/media/immagini/' + options.cover;
			this.photo = 'https://www.eurospin-viaggi.it/media/immagini/' + options.photo;
			this.slug = options.slug;
			this.id = options.id;
			this.idOffer = options.idOffer;
			this.name = options.name;
			this.active = options.active;
			this.destinationDescription = options.destinationDescription;
			this.destinationProvince = options.destinationProvince;
			this.structureID = options.structureID;
			this.overlayCoverImage = options.overlayCoverImage;
			this.overlayCoverText = options.overlayCoverText;
			this.frontEndName = options.frontEndName;
			this.trustPilot_nReviews = options.trustPilot_nReviews;
			this.trustPilot_averageStars = options.trustPilot_averageStars;
			this.accomodation = options.accomodation;
			this.rating = options.rating;
			this.abstract = options.abstract;
			this.excludeFeed = options.excludeFeed;
			this.from = options.from;
			this.to = options.to;
			this.created = options.created;
			this.bookFrom = options.bookFrom;
			this.bookTo = options.bookTo;
			this.price = options.price;
			this.advice = options.advice;
			this.mandatoryDocument = options.mandatoryDocument;
			this.avesDstCode = options.avesDstCode;
			this.avesNationCode = options.avesNationCode;
			this.eSType = options.eSType;
			this.minStay = options.minStay;
			this.weekDaysIn = options.weekDaysIn;
			this.weekDaysOut = options.weekDaysOut;
			this.key = options.key;
			//
			this.location = options.location;
			this.address = options.address;
			this.baseTags = options.baseTags;
			this.tagList = options.tagList;
			this.statisticCodes = options.statisticCodes;
			//
		}
	}
}
