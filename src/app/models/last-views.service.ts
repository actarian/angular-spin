import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of, timer } from 'rxjs';
import { map, mergeMap, switchMap } from 'rxjs/operators';
import { EntityService } from '../core/models';
import { LocalStorageService, StorageService } from '../core/storage';
import { SearchResult } from './search';
import { User } from './user';
import { UserService } from './user.service';

const LAST_VIEWS: string = 'lastViews';

@Injectable({
	providedIn: 'root',
})
export class LastViewsService extends EntityService<SearchResult> {

	get collection(): string {
		return ''; // /api/user/views
	}

	hasLogged: boolean;
	storage: StorageService;
	private lastview$ = new BehaviorSubject<SearchResult[]>([]);

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		protected injector: Injector,
		private storageService: LocalStorageService,
		private userService: UserService,
	) {
		super(injector);
		this.storage = this.storageService.tryGet();
	}

	get count(): number {
		return this.lastview$.getValue().length;
	}

	get storageItems(): SearchResult[] {
		const items = this.storage.get(LAST_VIEWS);
		return items ? items.map(i => new SearchResult(i)) : [];
	}

	set storageItems(items: SearchResult[]) {
		this.storage.set(LAST_VIEWS, items);
	}

	storageToUser(): Observable<SearchResult[]> {
		const items = this.storageItems;
		if (!this.hasLogged && items.length) {
			this.hasLogged = true;
			return timer(100).pipe(
				map(() => {
					return items;
				})
			);
			// !!! return this.patch(`/api/user/views`, items);
		} else {
			return of([]);
		}
	}

	getFromUser(): Observable<SearchResult[]> {
		return timer(100).pipe(
			mergeMap(() => {
				return this.getFromStorage();
			})
		);
		/*
		// !!!
		return this.get(`/api/user/views`).pipe(
			tap((items: SearchResult[]) => {
				this.storageItems = items;
				this.lastview$.next(items);
			}),
			switchMap((items: SearchResult[]) => {
				return this.lastview$;
			})
		);
		*/
	}

	getFromStorage(): Observable<SearchResult[]> {
		this.hasLogged = false;
		const items = this.storageItems || [];
		this.lastview$.next(items.map(i => new SearchResult(i)));
		return this.lastview$;
	}

	items(): Observable<SearchResult[]> {
		return this.userService.user$.pipe(
			switchMap((user: User) => {
				if (user) {
					return this.storageToUser().pipe(
						switchMap(items => this.getFromUser())
					);
				} else {
					return this.getFromStorage();
				}
			})
		);
	}

	doAdd(item: SearchResult): Observable<SearchResult> {
		if (this.userService.isLoggedIn()) {
			return timer(100).pipe(
				map(() => {
					this.addToStorage(item);
					return item;
				})
			);
			/*
			// !!!
			return this.post(`/api/user/views`, { id: item.id }).pipe(
				tap((item: SearchResult) => {
					this.addToStorage(item);
				})
			);
			*/
		} else {
			this.addToStorage(item);
			return of(item);
		}
	}

	private ArrayIndexOfKeyValue(array: any[], key: string, value: any) {
		let index: number = -1;
		array.forEach((item: any, i: number) => {
			if (item[key] === value) {
				index = i;
			}
		});
		return index;
	}

	private addToStorage(item: SearchResult) {
		const items = this.lastview$.getValue();
		if (this.ArrayIndexOfKeyValue(items, 'id', item.id) === -1) {
			items.push(item);
		}
		this.storageItems = items;
		this.lastview$.next(items);
	}

	private addToStorageMany(items: SearchResult[]) {
		this.storageItems = items;
		this.lastview$.next(items);
	}

}
