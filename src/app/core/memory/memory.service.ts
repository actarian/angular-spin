import { InMemoryDbService, ParsedRequestUrl } from 'angular-in-memory-web-api';
import * as Datas from '../../datas';
import { Page } from '../pages';

export class MemoryService implements InMemoryDbService {

	createDb() {
		return Datas;
	}

    /*
    return new ParsedRequestUrl {
            apiBase: string;
            collectionName: string;
            id: string;
            query: Map<string, string[]>;
            resourceUrl: string;
        }
    */

	parseRequestUrl(url: string, service): ParsedRequestUrl {
		// console.log(url, service);
		let parsed: ParsedRequestUrl = service.parseRequestUrl(url);
		let wildcards: any[] = this.getWildcards(url);
		// console.log('wildcards', wildcards);
		if (wildcards.length) {
			// console.log('parsed', parsed, parsed.query);
			if (parsed.collectionName === 'page') {
				const query: Map<string, string[]> = parsed.query;
				let slug: string;
				query.forEach((value: string[], name: string) => {
					if (name === 'slug') {
						wildcards.forEach(w => {
							if (value[0].match(w.rx)) {
								// console.log(w);
								value[0] = w.slug;
							}
						})
					}
				});
				// console.log(query);
				console.log(url, parsed);
			}
		}
		return parsed;
	}

	getWildcards(url: string) {
		let pages: Page[] = Datas.page;
		let wildcards: any[] = pages.filter((page: Page) => {
			return page.slug && page.slug.indexOf('?') !== -1;
		}).map((page: Page) => {
			let slug: string = page.slug;
			if (slug.indexOf('/') === 0) {
				slug = slug.substr(1);
			}
			let reg = slug.replace('?', '');
			reg = '\/?(' + reg + ')(.*)';
			return { slug: slug, rx: new RegExp(reg), collections: Datas };
		});
		return wildcards;
	}
}
