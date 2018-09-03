import { Entity } from './entity';

export class Document implements Entity {
	id: number | string;
	name?: string;
	title?: string;
	description?: string;
	slug?: string;
}

export class DocumentIndex implements Entity {
	id: number | string;
	mnemonic?: string;
	slug?: string;
}
