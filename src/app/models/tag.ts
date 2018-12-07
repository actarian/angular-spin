import { Document, Option } from '../core/models';

export enum TagType {
	Hotel = -1,
	OldService = 1,
	Category = 0,
	Region = 2,
	Country = 3,
	Promotion = 4,
	Touristic = 5,
	Service = 6,
	Accomodation = 7,
	Plus = 8,
	Province = 9,
}

/*
export enum TaxonomyType {
	Hotel = -1,
	Category = 0,
	Promotion = 1,
	Region = 2,
	Country = 3,
	Destination = 4,
	Touristic = 5,
	OtherServices = 6,
	Accomodation = 7,
	Plus = 8,
	Province = 9,
}
*/

export enum TagId {
	News = 63, // novità
	LastSecond = 58, // last second
	LastMinute = 56,
	EarlyBooking = 11, // prenota prima
	Pets = 9, // amici a 4 zampe
	FreeChild = 8, // bimbo gratis
	IncludedFlight = 118, // Volo incluso
	IncludedFerry = 119, // traghetto incluso
	BeachService = 38, // servizio spiaggia
	CardClub = 120, // tessera club
	Skipass = 121, // skipass
	Wellness = 122, // spa & centro benessere
	Pool = 123, // Utilizzo piscina
	MiniClub = 124, // mini club
	Animation = 125, // animazione
	NewYearsEveDinner = 155, // cenone di capodanno
	ChristmasDinner = 156, // cena di natale
	ChristmasLunch = 157, // pranzo di natale
	EasterLunch = 158, // pranzo di pasqua
	Voucher = 80, // buono spesa
	FreePets = 126 // animali gratis
}

export class Tag extends Option implements Document {
	abstract?: string;
	category: number;
	icon?: string;
	slug?: string;
}
