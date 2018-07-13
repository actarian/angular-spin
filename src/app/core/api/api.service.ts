import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Logger } from '../logger';
import { Identity } from '../models/identity';

export class ApiRequestOptions {
	headers?: HttpHeaders;
	params?: HttpParams;
	constructor(options?: {}) {
		this.headers = new HttpHeaders({
			'Content-Type': 'application/json'
		});
		this.params = options ? new HttpParams(options) : null;
	}
}

export class ApiService<T extends Identity> {

	public static domain: string = '';

	private _logger: Logger;
	get logger() {
		if (!this._logger) {
			this._logger = this.injector.get(Logger);
		}
		return this._logger;
	}

	private _http: HttpClient;
	get http() {
		if (!this._http) {
			this._http = this.injector.get(HttpClient);
		}
		return this._http;
	}

	get collection(): string {
		return 'api';
	}

	get url(): string {
		let base: string = ApiService.domain;
		const collection = this.collection.toLowerCase();
		if (collection.indexOf('http') === 0) {
			base = '';
		}
		return `${base}${collection}`;
	}

	constructor(
		protected injector: Injector
	) { }

	getUrl(method: string = ''): string {
		return `${this.url}${method}`;
	}

	get(first?: string | {}, second?: {}): Observable<any> {
		const method: string = (typeof first === 'string' ? first : '');
		const params: {} = (typeof first === 'object' ? first : second);
		const url: string = this.getUrl(method);
		const options = new ApiRequestOptions(params);
		return this.http.get<T>(url, options).pipe(tap(x => this.logger.log(url)));
	}

	post(first: string | {}, second?: {}, third?: {}): Observable<any> {
		const method: string = (typeof first === 'string' ? first : '');
		const model: {} = (typeof first === 'object' ? first : second);
		const params: {} = (typeof second === 'object' ? second : third);
		const url: string = this.getUrl(method);
		const options = new ApiRequestOptions(params);
		return this.http.post<T>(url, model, options).pipe(tap(x => this.logger.log(url)));
	}

	put(first: string | T, second?: T | {}, third?: {}): Observable<any> {
		const method: string = (typeof first === 'string' ? first : '');
		const model: T = (typeof first === 'object' ? first : second) as T;
		const params: {} = (typeof second === 'object' ? second : third);
		const url: string = this.getUrl(method);
		const options = new ApiRequestOptions(params);
		return this.http.put<T>(url, model, options).pipe(tap(x => this.logger.log(url)));
	}

	delete(first: string | T | number, second?: T | number | {}, third?: {}): Observable<any> {
		const method: string = (typeof first === 'string' ? first : '');
		const identity: T | number = (typeof first !== 'string' ? first : second) as T | number;
		const id = typeof identity === 'number' ? identity : identity.id;
		const params: {} = (typeof second === 'object' ? second : third);
		const url: string = this.getUrl(`${method}/${id}`);
		const options = new ApiRequestOptions(params);
		return this.http.delete<T[]>(url, options).pipe(tap(x => this.logger.log(url)));
	}

	toCamelCase(input: any): any {
		let output, key, keyCamelCase, value;
		if (input instanceof Array) {
			return input.map((value: any) => {
				if (typeof value === 'object') {
					value = this.toCamelCase(value);
				}
				return value;
			});
		} else {
			output = {};
			for (key in input) {
				if (input.hasOwnProperty(key)) {
					keyCamelCase = (key.charAt(0).toLowerCase() + key.slice(1) || key).toString();
					keyCamelCase = keyCamelCase === 'url' ? 'slug' : keyCamelCase; // !!!
					value = input[key];
					if (value instanceof Array || (value !== null && value.constructor === Object)) {
						value = this.toCamelCase(value);
					}
					output[keyCamelCase] = value;
				}
			}
		}
		return output;
	}
}
