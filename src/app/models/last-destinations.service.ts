import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { EntityService } from '../core/models';
import { LocalStorageService, StorageService } from '../core/storage';
import { SearchResult } from './search';
import { User } from './user';
import { UserService } from './user.service';

const LAST_DESTINATIONS: string = 'lastDestinations';

@Injectable({
	providedIn: 'root',
})
export class LastDestinationsService extends EntityService<SearchResult> {

	get collection(): string {
		return '';
	}

	hasLogged: boolean;
	storage: StorageService;
	private lastDestinations$ = new BehaviorSubject<SearchResult[]>([]);

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
		return this.lastDestinations$.getValue().length;
	}

	get storageItems(): SearchResult[] {
		const items = this.storage.get(LAST_DESTINATIONS);
		return items ? items.map(i => new SearchResult(i)) : [];
	}

	set storageItems(items: SearchResult[]) {
		this.storage.set(LAST_DESTINATIONS, items);
	}

	storageToUser(): Observable<SearchResult[]> {
		const items = this.storageItems;
		if (!this.hasLogged && items.length) {
			this.hasLogged = true;
			return this.patch(`/api/user/destinations`, items);
		} else {
			return of([]);
		}
	}

	getFromUser(): Observable<SearchResult[]> {
		return this.get(`/api/user/destinations`).pipe(
			tap((items: SearchResult[]) => {
				this.storageItems = items;
				this.lastDestinations$.next(items);
			}),
			switchMap((items: SearchResult[]) => {
				return this.lastDestinations$;
			})
		);
	}

	getFromStorage(): Observable<SearchResult[]> {
		this.hasLogged = false;
		const items = this.storageItems || [];
		this.lastDestinations$.next(items.map(i => new SearchResult(i)));
		return this.lastDestinations$;
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
			return this.post(`/api/user/destinations`, { id: item.id }).pipe(
				tap((item: SearchResult) => {
					this.addToStorage(item);
				})
			);
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
		const items = this.lastDestinations$.getValue();
		if (this.ArrayIndexOfKeyValue(items, 'id', item.id) === -1) {
			items.push(item);
		}
		this.storageItems = items;
		this.lastDestinations$.next(items);
	}

	private addToStorageMany(items: SearchResult[]) {
		this.storageItems = items;
		this.lastDestinations$.next(items);
	}

}
