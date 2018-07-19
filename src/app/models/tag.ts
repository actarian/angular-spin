import { Document, Option } from '../core/models';

export enum TagType {
	Special = -1,
	Category = 0,
	Promotion = 1,
	Region = 2,
	Country = 3,
	Destination = 4,
	Facility = 5,
}

export class Tag extends Option implements Document {
	abstract?: string;
	category: number;
	icon?: string;
	slug?: string;
}
