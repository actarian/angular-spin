import { Document, Feature, Image, Taxonomy } from '../models';

export class PageMeta {
	description?: string;
	keywords?: string;
	type?: string;
	author?: string;
	locale?: string;
	robots?: string;
	appId?: string;
}

export class Page implements Document {
	id: number;
	name: string;
	title?: string;
	description?: string;
	slug?: string;
	url?: string;
	component?: string;
	meta?: PageMeta;
	images?: Image[];
	features?: Feature[];
	taxonomies?: Taxonomy[];
}
