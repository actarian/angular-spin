

import { isPlatformBrowser, isPlatformServer, Location } from '@angular/common';
import { ComponentFactory, ComponentFactoryResolver, Inject, Injector, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, ActivationEnd, NavigationStart, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { concatMap, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';
// import { BehaviorSubject, Observable, interval } from 'rxjs';
// import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Page, PageComponent } from '../pages';
import { SegmentPipe } from './segment.pipe';

export class RouteService {

	static injector: Injector;

	private urlStrategy: string = environment.urlStrategy;
	private _language: any = new BehaviorSubject({});
	public readonly language: Observable<any> = this._language.asObservable();

	private _languages: BehaviorSubject<Array<any>> = new BehaviorSubject(environment.languages);
	public readonly languages: Observable<any[]> = this._languages.asObservable();

	private _lang: string;
	private get lang(): string {
		return this._lang;
	}
	private set lang(lang: string) {
		if (lang !== this._lang) {
			let path = this.location.path();
			if (path.indexOf(`/${this._lang}`) === 0) {
				path = path.replace(`/${this._lang}`, `/${lang}`);
			} else if (path.indexOf(`/${lang}`) !== 0) {
				path = `/${lang}` + path;
			}
			this.path = path;
			this._lang = lang;
			const language = this._languages.getValue().find(x => x.lang === lang);
			this._language.next(language);
			this.translateService.use(lang);
		}
	}

	private path: string;

	public page: Page;
	public params: Observable<Params>;
	public queryParams: Observable<Params>;

	public get currentLang(): string {
		return this._lang;
	}

	public currentMarket: string = environment.defaultMarket;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private injector: Injector,
		private translateService: TranslateService,
		private location: Location,
		private route: ActivatedRoute,
		private router: Router,
		private segment: SegmentPipe,
		private componentFactoryResolver: ComponentFactoryResolver
	) {
		this.setLanguages();
		this.subscribeToRouter();
	}

	// PUBLIC METHODS
	public pageParams$: BehaviorSubject<Params> = new BehaviorSubject({});
	public getPageParams(): Observable<Params> {
		return this.route.queryParams.pipe(
			distinctUntilChanged(),
			switchMap(params => {
				const parsed = this.parseParams(params);
				this.pageParams$.next(parsed);
				return of(parsed);
			}),
			// tap(params => console.log('RouteService.getPageParams', params)),
		);
	}

	public parseParams(params: any) {
		const parsed = {};
		for (const key in params) {
			if (typeof (params[key]) === 'string') {
				parsed[key] = JSON.parse(params[key]);
			} else {
				parsed[key] = params[key];
			}
		}
		return parsed;
	}

	public getId(): number {
		return +this.route.snapshot.paramMap.get('id');
	}

	public getSlug(): string {
		return this.route.snapshot.paramMap.get('slug');
	}

	public toRoute(data: any[] | string): any[] {
		const segments = this.segment.transform(data);
		if (environment.useMarket) {
			const market: string = this.currentMarket;
			const marketIndex = this.urlStrategy.split('/').indexOf(':market');
			segments.splice(marketIndex, 0, market);
		}
		if (environment.useLang) {
			const lang: string = this._lang;
			const langIndex = this.urlStrategy.split('/').indexOf(':lang');
			segments.splice(langIndex, 0, lang);
		}
		// console.log('RouteService.toRoute', segments);
		return segments;
	}

	public toSlug(data: any[] | string): any[] {
		const segments = this.segment.transform(data);
		let paths = segments.filter(x => {
			return typeof x === 'string';
		});
		const datas = segments.filter(x => {
			return typeof x !== 'string';
		});
		if (environment.useMarket) {
			const marketIndex = this.urlStrategy.split('/').indexOf(':market');
			if (paths.length > marketIndex) {
				paths[marketIndex] = '*';
			}
		}
		if (environment.useLang) {
			const langIndex = this.urlStrategy.split('/').indexOf(':lang');
			if (paths.length > langIndex) {
				paths[langIndex] = '*';
			}
		}
		paths = paths.join('/').replace(/\/\*/gi, '').split('/');
		// console.log('RouteService.toSlug', paths);
		return paths.concat(datas);
	}

	public toParams(data: any): any {
		return {
			data: window.btoa(JSON.stringify(data))
		};
	}

	public toData(params: any): any {
		if (params && params.data) {
			return JSON.parse(window.atob(params.data));
		}
	}

	public getParams(): Observable<ComponentFactory<PageComponent>> {
		return this.router.events.pipe(
			filter(event => event instanceof ActivationEnd),
			map(() => this.route),
			distinctUntilChanged(),
			map(route => route.firstChild),
			switchMap(route => route.params),
			/*
			tap((params) => {
				console.log('getParams', params);
			}),
			*/
			concatMap(x => {
				return of(this.toData(x));
			})
		);
	}

	public _unused_getPageComponentFactory(): Observable<ComponentFactory<PageComponent>> {
		return this.router.events.pipe(
			filter(event => event instanceof ActivationEnd),
			/*
			tap((event) => {
				console.log('ActivationEnd', event);
			}),
			*/
			map(() => this.route),
			distinctUntilChanged(),
			map(route => route.firstChild),
			tap((route) => {
				this.params = route.params.pipe(
					concatMap(x => {
						return of(this.toData(x));
					})
				);
				this.queryParams = route.queryParams.pipe(
					tap(x => console.log(x)),
					concatMap(x => {
						return of(this.toData(x));
					})
				);
				// console.log('params', this.route.params);
			}),
			switchMap(route => route.data),
			map((data): ComponentFactory<PageComponent> => {
				if (data.pageResolver) {
					this.page = data.pageResolver.page;
					const factory: ComponentFactory<PageComponent> = this.componentFactoryResolver.resolveComponentFactory(data.pageResolver.component);
					return factory;
				} else {
					return null;
				}
			})
		);
	}

	public setLanguage(lang: string, silent?: boolean) {
		this.lang = lang;
		if (silent) {
			this.location.replaceState(this.path);
		} else {
			this.router.navigate([this.path]);
		}
		// console.log('RouteService.setLanguage', this.path, this._lang, lang, silent);
	}

	// PRIVATE METHODS

	private setLanguages() {
		this.translateService.addLangs(environment.languages.map(x => x.lang));
		this.translateService.setDefaultLang(environment.defaultLanguage);
		// this.setLanguage(this.detectLanguage(), true);
		this.setLanguage(environment.defaultLanguage, true);
		/*
		this.translateService.onLangChange.subscribe((e: LangChangeEvent) => {
			console.log('RouteService.onLangChange', e);
		});
		*/
	}

	private subscribeToRouter() {
		this.router.events.pipe(
			filter(event => event instanceof NavigationStart)
		).subscribe((event: NavigationStart) => {
			const location = this.location.normalize(event.url).split('/');
			if (environment.useMarket) {
				const marketIndex = this.urlStrategy.split('/').indexOf(':market');
				const market = location[marketIndex];
				if (market !== this.currentMarket) {
					this.currentMarket = market;
					console.log('RouteService.setMarket', market, event.url);
				}
			}
			if (environment.useLang) {
				const langIndex = this.urlStrategy.split('/').indexOf(':lang');
				const lang = location[langIndex];
				if (lang !== this._lang) {
					const language = this._languages.getValue().find(x => x.lang === lang);
					this._language.next(language);
					this.translateService.use(lang);
					// console.log('RouteService.setLang', lang, this._lang, langIndex, location, event.url);
				}
			}
		});
	}

	private detectLanguage(): string {
		let acceptLanguage: string = null;
		if (isPlatformServer(this.platformId)) {
			/*
			// server side express engine
			app.engine('html',  (_, options, callback) => {
				let engine = ngExpressEngine({
					bootstrap: ServerAppModule,
					providers: [ { provide: 'request', useFactory: () => options.req } ]
				});
				engine(_, options, callback)
			})
			*/
			const request = this.injector.get('request');
			if (request) {
				acceptLanguage = request.headers['accept-language'];
				const languages: string[] = acceptLanguage.match(/[a-zA-Z\-]{2,10}/g) || [];
				if (languages.length > 0) {
					acceptLanguage = languages[0].split('-')[0];
				} else {
					acceptLanguage = null;
				}
				console.log('request', request, 'acceptLanguage', acceptLanguage);
			}
			console.log('RouteService.isPlatformServer', this.platformId, acceptLanguage);
		} else if (isPlatformBrowser(this.platformId)) {
			acceptLanguage = this.translateService.getBrowserLang();
			console.log('RouteService.isPlatformBrowser', this.platformId, acceptLanguage);
		}
		let detectedLanguage: string = environment.defaultLanguage;
		const regexp: RegExp = new RegExp(`(${environment.languages.map(x => x.lang).join('|')})`, 'gi');
		const match = (acceptLanguage || '').match(regexp);
		detectedLanguage = match ? match[0] : detectedLanguage;
		// console.log('RouteService.detectLanguage', detectedLanguage);
		return detectedLanguage;
	}

}
