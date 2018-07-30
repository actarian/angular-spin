import { Entity } from './entity';

export class Document implements Entity {
	id: number;
	name: string;
	title?: string;
	description?: string;
	author?: string;
	slug?: string;
}
