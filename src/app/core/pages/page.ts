import { Document, Feature, Image, Taxonomy } from '../models';

export class PageMeta {
	appId?: string;
	author?: string;
	canonical?: string;
	description?: string;
	keywords?: string;
	locale?: string;
	robots?: string;
	type?: string;
}

export class PageIndex implements Document {
	id: number | string;
	abstract?: string;
	images?: Image[];
	name?: string;
	slug?: string;
	title?: string;
	type?: number | string;
	relationType?: number | string;
	url?: string;

	constructor(options?: PageIndex) {
		if (options) {
			Object.assign(this, options);
		}
	}
}

export class PageRelation implements Document {
	id: number | string;
	page: Page;
	type?: number | string;
}

export class Page implements Document {
	id: number | string;
	abstract?: string;
	active?: boolean;
	component?: number | string;
	description?: string;
	features?: Feature[];
	images?: Image[];
	meta?: PageMeta = {};
	name?: string;
	related?: any[];
	slug?: string;
	taxonomies?: Taxonomy[];
	title?: string;
	type?: number | string;
	url?: string;

	constructor(options?: Page) {
		if (options) {
			Object.assign(this, options);
			if (options.related) {
				const related: PageIndex[] = options.related.map((x: PageRelation) => {
					const item = new PageIndex(x.page);
					item.relationType = x.type;
					return item;
				});
				this.related = related;
			}
		}
	}

	getFeature?(id: number): Feature {
		return this.features.find(x => x.id === id) || null;
	}

	getFeatures?(type: number, n: number[]): Feature[] {
		return this.features.filter((x: Feature, i: number) => (
			n.indexOf(Number(x.id)) !== -1 && x.type === type
		)).sort((a: Feature, b: Feature) => a.type - b.type);
	}

}
