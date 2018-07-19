import { Document, Feature, Image } from '../models';

export class PageMeta {
	description?: string;
	keywords?: string;
	type?: string;
	author?: string;
	locale?: string;
	robots?: string;
	url?: string;
	appId?: string;
}

export class Page implements Document {
	id: number;
	name: string;
	title?: string;
	description?: string;
	slug?: string;
	component?: string;
	meta?: PageMeta;
	images?: Image[];
	features?: Feature[];
}
