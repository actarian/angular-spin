import { Document } from '../core/models';
import { SearchResult } from './search';
import { Tag } from './tag';
import { TrustPilot } from './trustPilot';

export enum HotelType {
	Hotel = 'HOTEL',
	Cruise = 'CROCIERA',
	TourOperator = 'PACCHETTOT',
	HotelAndFerry = 'TRAGHTL',
}

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
	id: number | string;
	slug: string;
	idOffer: number;
	name: string;
	active: boolean;
	category?: string;
	destinationDescription: string;
	destinationProvince: string;
	destinationRegion?: string;
	destinationNation?: string;
	structureID: number;
	overlayCoverImage: string;
	overlayCoverText: string;
	frontEndName: string;
	trustPilot?: TrustPilot;
	accomodation: string;
	rating: string;
	abstract: string;
	photo: string;
	cover: string;
	excludeFeed: boolean;
	from: Date | string;
	to: Date | string;
	created: Date | string;
	bookFrom: Date | string;
	bookTo: Date | string;
	price: number;
	advice: number;
	mandatoryDocument: number;
	avesDstCode: string;
	avesNationCode: string;
	esType: string;
	minStay: number;
	weekDaysIn: number;
	weekDaysOut: number;
	key: string;
	relatedSearch?: any;
	//
	location: HotelLocation;
	address: HotelAddress;
	tagList: Tag[];
	statisticCodes: any;
	//
	trustPilot_averageStars?: number;
	trustPilot_nReviews?: number;

	constructor(options?: Hotel) {
		if (options) {
			// this.url = options.url;
			this.cover = options.cover && options.cover.indexOf('/media/immagini/') !== 0 ? '/media/immagini/' + options.cover : options.cover;
			this.photo = options.photo && options.photo.indexOf('/media/immagini/') !== 0 ? '/media/immagini/' + options.photo : options.photo;
			this.slug = options.slug;
			this.id = options.id;
			this.idOffer = options.idOffer;
			this.name = options.name;
			this.active = options.active;
			this.category = options.category;
			this.destinationDescription = options.destinationDescription;
			this.destinationProvince = options.destinationProvince;
			this.destinationRegion = options.destinationRegion;
			this.destinationNation = options.destinationNation;
			this.structureID = options.structureID;
			this.overlayCoverImage = options.overlayCoverImage;
			this.overlayCoverText = options.overlayCoverText;
			this.frontEndName = options.frontEndName;
			this.trustPilot = new TrustPilot({ averageStars: options.trustPilot_averageStars, totalReviews: options.trustPilot_nReviews });

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
			this.esType = options.esType;
			this.minStay = options.minStay;
			this.weekDaysIn = options.weekDaysIn;
			this.weekDaysOut = options.weekDaysOut;
			this.key = options.key;
			//
			this.location = options.location;
			this.address = options.address;
			this.tagList = options.tagList;
			this.statisticCodes = options.statisticCodes;
			this.relatedSearch = options.relatedSearch;
			if (this.relatedSearch) {
				this.relatedSearch.sameStructure = this.relatedSearch.sameStructure ? this.relatedSearch.sameStructure.map(x => SearchResult.newCompatibleSearchResult(x)) : [];
				this.relatedSearch.suggested = this.relatedSearch.suggested ? this.relatedSearch.suggested.map(x => SearchResult.newCompatibleSearchResult(x)) : [];
			}
		}
	}

}
