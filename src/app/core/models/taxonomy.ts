
export enum TaxonomyType {
	Special = -1,
	Category = 0,
	Promotion = 1,
	Region = 2,
	Country = 3,
	Destination = 4,
	Facility = 5,
}

export class Taxonomy {
	id: number;
	name?: string;
	type?: TaxonomyType;
}
