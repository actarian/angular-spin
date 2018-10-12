import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Identity, IdentityService } from '../core/models';
import { LocalStorageService, StorageService } from '../core/storage';
import { ModalCloseEvent, ModalCompleteEvent, ModalEvent, ModalService } from '../core/ui/modal';
import { AuthComponent } from '../pages/auth/auth.component';
import { SearchResult } from './search';
import { UserService } from './user.service';

@Injectable({
	providedIn: 'root',
})
export class WishlistService extends IdentityService<Identity> {

	get collection(): string {
		return ''; // /api/wishlist
	}

	storage: StorageService;
	private wishlist$ = new BehaviorSubject<Identity[]>([]);

	get count(): number {
		return this.wishlist$.getValue().length;
	}

	set wishlist(items: Identity[]) {
		this.storage.set('wishlist', items);
		this.wishlist$.next(items);
	}

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		protected injector: Injector,
		private storageService: LocalStorageService,
		private modalService: ModalService,
		private userService: UserService,
	) {
		super(injector);
		this.storage = this.storageService.tryGet();
		const storedItems = this.storage.get('wishlist');
		if (storedItems) {
			this.wishlist$.next(storedItems);
		}
	}

	observe(): Observable<Identity[]> {
		return this.userService.user$.pipe(
			switchMap(user => {
				if (user) {
					return this.get(`/api/wishlist`).pipe(
						map((items: any) => items ? items : []),
						tap((items: Identity[]) => this.wishlist = items)
					);
				} else {
					this.wishlist = [];
					return of([]);
				}
			})
		);
	}

	items(): Observable<SearchResult[]> {
		if (this.userService.isLoggedIn()) {
			return this.get(`/api/wishlist/detail`).pipe(
				map((items: any) => items ? items : []),
				// map((items: any) => this.toCamelCase(items)),
				map((items: any) => items.map(item => SearchResult.newCompatibleSearchResult(item))),
			);
		} else {
			return of([]);
		}
	}

	doToggle(identity: Identity): void {
		if (this.userService.isLoggedIn()) {
			this.toggle(identity).subscribe(items => console.log('WishlistService.doToggle', items));
		} else {
			this.modalService.open({ component: AuthComponent }).subscribe((e: ModalEvent<ModalCompleteEvent | ModalCloseEvent>) => {
				// console.log('WishlistService.addItem', e);
				if (e instanceof ModalCompleteEvent) {
					// console.log('WishlistService.ModalCompleteEvent', e);
					this.toggle(identity).subscribe(items => console.log('WishlistService.doToggle', items));
				} else if (e instanceof ModalCloseEvent) {
					// console.log('WishlistService.ModalCloseEvent', e);
				}
			});
		}
	}

	has(identity: Identity): boolean {
		return Boolean(this.wishlist$.getValue().find(x => x.id === identity.id));
	}

	private addItem(identity: Identity): Observable<any> {
		return this.post(`/api/wishlist`, identity).pipe(
			tap(result => {
				const items = this.wishlist$.getValue();
				items.push({
					id: identity.id
				});
				this.wishlist = items;
			})
		);
	}

	private removeItem(identity: Identity): Observable<any> {
		return this.delete(`/api/wishlist/${identity.id}`).pipe(
			tap(result => {
				const items = this.wishlist$.getValue();
				const instance = items.find(x => x.id === identity.id);
				const index = items.indexOf(instance);
				items.splice(index, 1);
				this.wishlist = items;
			})
		);
	}

	private toggle(identity: Identity): Observable<any> {
		if (this.has(identity)) {
			return this.removeItem(identity);
		} else {
			return this.addItem(identity);
		}
	}

}
