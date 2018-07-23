import { EventEmitter, Injectable, Injector } from '@angular/core';
import { TranslateLoader } from '@ngx-translate/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
// import { BehaviorSubject, Observable, interval } from 'rxjs';
// import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ApiService } from '../api';
import { Label } from './label';

@Injectable()
export class LabelService<T extends Label> extends ApiService<T> implements TranslateLoader {

	get collection(): string {
		return '/memory/label';
	}

	private _language: any = new BehaviorSubject({});
	public readonly language: Observable<any> = this._language.asObservable();

	private _languages: BehaviorSubject<Array<any>> = new BehaviorSubject(environment.languages);
	public readonly languages: Observable<any[]> = this._languages.asObservable();

	private _lang: string = environment.defaultLanguage;
	public get lang(): string {
		return this._lang;
	}
	public set lang(lang: string) {
		if (lang !== this._lang) {
			this._lang = lang;
			const language = this._languages.getValue().find(x => x.lang === lang);
			this._language.next(language);
		}
	}

	public events: EventEmitter<any> = new EventEmitter();

	public missingHandler?: Function;

	public cache: {} = {};

	constructor(
		protected injector: Injector
	) {
		super(injector);
		this.getTranslation(this.lang).subscribe(x => {
			// console.log(x);
		});
	}

	public getTranslation(lang: string): Observable<{}> {
		if (!lang || !lang.trim()) {
			return of(null);
		}
		this.lang = lang;
		if (this.cache[lang]) {
			return of(this.cache[lang]);
		} else {
			return this.get(`/?lang=${lang}`).pipe(
				take(1),
				map((x: Label[]) => {
					if (x[0]) {
						const labels = x[0].labels;
						this.cache[lang] = labels;
						this.events.emit(labels);
						return labels;
					} else {
						return of(null);
					}
				}),
				tap(x => {
					this.logger.log(`found label matching "${lang}"`);
				})
			);
		}
	}

	public getLabel(key: string, params?: any): string | any {
		let value: string | null = null;
		let labels: any = this.cache[this.lang];
		if (labels) {
			const keys: string[] = key.split('.');
			let k = keys.shift();
			while (keys.length > 0 && labels[k]) {
				labels = labels[k];
				k = keys.shift();
			}
			value = labels[k] || `{${k}}`;
		}
		return this.parseLabel(value, key, params);
	}

	private parseLabel(value: string | null, key: string, params?: any): string | any {
		if (value == null) {
			return this.missingLabel(key);
		} else if (params) {
			return this.parseParams(value, params);
		}
		return value;
	}

	private missingLabel(key: string): string {
		if (this.missingHandler) {
			return typeof this.missingHandler === 'function' ?
				this.missingHandler(key) :
				this.missingHandler;
		}
		return key;
	}

	private parseParams(value: string, params: any): string {
		const TEMPLATE_REGEXP: RegExp = /{{\s?([^{}\s]*)\s?}}/g;
		return value.replace(TEMPLATE_REGEXP, (text: string, key: string) => {
			const replacer: string = params[key] as string;
			return typeof replacer !== 'undefined' ? replacer : text;
		});
	}

}

export function CustomTranslateLoader(injector: Injector) {
	return new LabelService(injector);
}

