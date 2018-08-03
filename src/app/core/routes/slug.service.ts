import { EventEmitter, Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
import { first, map, tap } from 'rxjs/operators';
import { DocumentIndex, EntityService } from '../models';

@Injectable({
	providedIn: 'root'
})
export class SlugService extends EntityService<DocumentIndex> {

	private collectedKeys: { [key: string]: string; } = {};
	private cache: { [key: string]: string; } = {};
	private slugs$: Subject<{ [key: string]: string; }> = new Subject();
	private emitter: EventEmitter<any> = new EventEmitter();

	get collection(): string {
		return '/api/slug';
	}

	getSlugsByKeys(keys: string[]): Observable<DocumentIndex> {
		keys = keys || [];
		return this.get().pipe(
			map(x => x.filter((s: DocumentIndex) => keys.indexOf(s.mnemonic) !== -1))
		);
	}

	public addKey(key: string): Observable<string> {
		if (this.cache[key]) {
			return of(this.cache[key]);
		} else if (!this.collectedKeys.hasOwnProperty(key)) {
			// console.log('SlugService.addKey', key);
			Object.defineProperty(this.collectedKeys, key, {
				value: key,
				enumerable: true,
				writable: false,
			});
		}
		return this.slugs$.pipe(
			map(items => items[key])
		);
	}

	public getKeys(): string[] {
		return Object.keys(this.collectedKeys);
	}

	public register(): Observable<any> {
		return this.emitter.pipe(
			// throttleTime(500),
			tap((e) => {
				this.collectKeys().subscribe((results) => {
					// console.log('SlugService.collected', results);
				});
			})
		);
	}

	public collect(): void {
		if (this.getKeys().length) {
			this.emitter.emit();
		}
	}

	public collectKeys(): Observable<{ [key: string]: string; }> {
		const keys = this.getKeys();
		this.collectedKeys = {};
		return this.getSlugsByKeys(keys).pipe(
			map((results: DocumentIndex[]) => {
				const items = {};
				results.forEach(d => items[d.mnemonic] = d.slug);
				return items;
			}),
			first(),
			tap((items: { [key: string]: string; }) => {
				Object.assign(this.cache, items);
				this.slugs$.next(this.cache);
			})
		);
	}

}
