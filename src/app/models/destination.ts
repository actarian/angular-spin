import { Document } from '../core/models';

export enum DestinationTypes {
	Category = 0,
	Promotion = 1,
	Region = 2,
	Country = 3,
	Destination = 4,
	Facility = 5,
}

export class Destination implements Document {
	abstract?: string;
	code?: string;
	icon?: string;
	id: number;
	name: string;
	slug?: string;
	texts: string[];
	type: DestinationTypes;
	// area?: string;
	// country?: string;
	// place?: string;
	// validity?: string;
	constructor(options?: Destination) {
		if (options) {
			this.code = options.code;
			this.icon = options.code;
			this.id = options.id;
			this.name = options.name;
			this.slug = options.slug;
			this.texts = options.texts;
			this.type = options.type;
			this.abstract = this.texts.join(', ');
		}
	}
}

export class DestinationAutocomplete extends Destination {
	autocomplete?: string;
}
