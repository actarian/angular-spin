import { Inject, Injectable, Injector } from '@angular/core';
import { makeStateKey, Meta, MetaDefinition, Title } from '@angular/platform-browser';
import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { EntityService, Image, ImageType } from '../models';
import { LinkDefinition, LinkService } from './link.service';
import { Page } from './page';

@Injectable({
	providedIn: 'root'
})
export class PageService extends EntityService<Page> {

	get collection(): string {
		return '';
	}

	constructor(
		@Inject(ORIGIN_URL) private originUrl: string,
		protected injector: Injector,
		private titleService: Title,
		private metaService: Meta,
		private linkService: LinkService,
	) {
		super(injector);
	}

	getStatePageBySlug(slug: string): Observable<Page> {
		slug = slug.split('?')[0];
		if (slug.indexOf('/') === 0) {
			slug = slug.substr(1);
		}
		const key = `PAGE_${slug.replace('/', '_')}`;
		const STATE_KEY = makeStateKey<Page>(key);
		const state = this.state.hasKey(STATE_KEY);
		if (state) {
			return of(this.state.get<Page>(STATE_KEY, null));
		} else {
			return this.post(`/api/page/slug`, `"${slug}"`).pipe(
				map(x => new Page(x)),
				catchError(() => of(null)), // !!!
				tap(page => this.state.set(STATE_KEY, page)),
			);
		}
	}

	getPageById(id: number | string): Observable<Page> {
		return this.get(`/api/page/${id}`).pipe(
			map(x => new Page(x)),
			catchError(error => {
				console.log('PageService.getPageById.error', error);
				return of(new Page()); // returning default page
			})
		);
	}

	getPageBySlug(slug: string): Observable<Page> {
		slug = slug.split(';')[0];
		// console.log('PageService.getPageBySlug', slug);
		return this.get(`/api/page/slug/${slug}`).pipe(
			map(x => new Page(x)),
			// tap(x => this.logger.log(`found pages matching "${slug}"`))
			// tap(x => console.log('PageService.getPageBySlug', x, slug))
			catchError(error => {
				console.log('PageService.getPageBySlug.error', error);
				return of(new Page()); // returning default page
			})
		);
	}

	addOrUpdateMetaData(page: Page) {
		// console.log('PageService.addOrUpdateMetaData', page);
		if (!page) {
			return;
		}
		const fbAppId: string = environment['plugins'] && environment['plugins']['facebook'] ? environment.plugins.facebook.appId.toString() : '';
		this.titleService.setTitle(page.title);
		this.addOrUpdateMeta({ property: 'og:title', content: page.title });
		this.addOrUpdateMeta({ property: 'og:image', content: this.getSocialImage(page).url });
		this.addOrUpdateMeta({ property: 'og:image:width', content: '1200' });
		this.addOrUpdateMeta({ property: 'og:image:height', content: '630' });
		this.addOrUpdateMeta({ property: 'fb:app_id', content: fbAppId });
		this.addOrUpdateMeta({ property: 'og:url', content: page.url || this.originUrl });
		const meta = page.meta;
		if (meta) {
			this.addOrUpdateMeta({ name: 'description', content: meta.description || 'Servizio di qualità senza costi aggiuntivi con i convenienti pacchetti viaggio Eurospin. Prenota comodamente online!' });
			this.addOrUpdateMeta({ name: 'keywords', content: meta.keywords || 'viaggi,viaggi eurospin' });
			this.addOrUpdateMeta({ name: 'robots', content: meta.robots || 'index,follow' });
			this.addOrUpdateMeta({ property: 'og:locale', content: meta.locale || 'it_IT' });
			this.addOrUpdateMeta({ property: 'og:type', content: meta.type || 'article' });
			this.addOrUpdateMeta({ property: 'og:author', content: meta.author || 'Eurospin Viaggi' });
			this.addOrUpdateLink({ rel: 'canonical', href: meta.canonical || (this.originUrl.indexOf(page.url) === 0 ? null : page.url) });
		}
		// console.log('PageOutletComponent.addOrUpdateMetaData', page.id, page.title, page.url);
	}

	private getSocialImage(page: Page): Image {
		return page.images ? (
			page.images.find(i => i.type === ImageType.Share) ||
			page.images.find(i => i.type === ImageType.Default) ||
			page.images.find(i => i.type === ImageType.Gallery)
		) : {
			url: 'https://s-static.ak.fbcdn.net/images/devsite/attachment_blank.png'
		} as Image;
	}

	private addOrUpdateMeta(definition: MetaDefinition) {
		const selector = definition.name ? `name="${definition.name}"` : `property="${definition.property}"`;
		if (this.metaService.getTag(selector)) {
			if (definition.content) {
				this.metaService.updateTag(definition, selector);
			} else {
				this.metaService.removeTag(selector);
			}
		} else if (definition.content) {
			this.metaService.addTag(definition);
		}
	}

	private addOrUpdateLink(definition: LinkDefinition) {
		const selector = definition.id ? `#${definition.id}` : `[rel="${definition.rel}"]`;
		if (this.linkService.getTag(selector)) {
			if (definition.href) {
				this.linkService.updateTag(selector, definition);
			} else {
				this.linkService.removeTag(selector);
			}
		} else if (definition.href) {
			this.linkService.addTag(definition);
		}
	}

}
