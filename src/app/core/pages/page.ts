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
	id: number | string;
	name?: string;
	title?: string;
	abstract?: string;
	description?: string;
	slug?: string;
	url?: string;
	type?: number | string;
	component?: number | string;
	meta?: PageMeta;
	images?: Image[];
	features?: Feature[];
	taxonomies?: Taxonomy[];
	active?: boolean;
}

export class PageIndex implements Document {
	id: number | string;
	name?: string;
	title?: string;
	abstract?: string;
	slug?: string;
	url?: string;
	type?: number | string;
	images?: Image[];
}
