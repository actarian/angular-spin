import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
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
		this.get(`/api/wishlist`).subscribe((items: Identity[]) => {
			if (items.length) {
				this.wishlist$.next(items);
			} else if (storedItems && storedItems.length) {
				this.doAddMany(storedItems);
			}
		});
	}

	get count(): number {
		return this.wishlist$.getValue().length;
	}

	items(): Observable<SearchResult[]> {
		// !!!
		const payload: any = {
			startDate: new Date(),
			flexibleDates: true,
			adults: 2,
			childs: 0,
			childrens: [],
		};
		return this.post(`/api/booking/search/in`, payload).pipe(
			map((x: any) => this.toCamelCase(x)),
			map((x: any) => x.map(o => SearchResult.newCompatibleSearchResult(o)))
		);
	}

	has(identity: Identity) {
		return this.wishlist$.getValue().find(x => x.id === identity.id);
	}

	doAddMany(identities: Identity[]) {
		this.post(`/api/wishlist/many`, identities).subscribe((items: Identity[]) => {
			this.storage.set('wishlist', items);
			this.wishlist$.next(items);
		});
	}

	doAdd(identity: Identity) {
		this.post(`/api/wishlist`, identity).subscribe(result => {
			const items = this.wishlist$.getValue();
			items.push({ id: identity.id });
			this.storage.set('wishlist', items);
			this.wishlist$.next(items);
		});
	}

	doRemove(identity: Identity) {
		this.delete(`/api/wishlist`, identity.id).subscribe(result => {
			const items = this.wishlist$.getValue();
			const instance = items.find(x => x.id === identity.id);
			const index = items.indexOf(instance);
			items.splice(index, 1);
			this.storage.set('wishlist', items);
			this.wishlist$.next(items);
		});
	}

	doToggle(identity: Identity) {
		if (this.userService.isLoggedIn()) {
			this.toggle(identity);
		} else {
			this.modalService.open({ component: AuthComponent }).subscribe((e: ModalEvent<ModalCompleteEvent | ModalCloseEvent>) => {
				console.log('WishlistService.doAdd', e);
				if (e instanceof ModalCompleteEvent) {
					console.log('WishlistService.ModalCompleteEvent', e);
					this.toggle(identity);
				} else if (e instanceof ModalCloseEvent) {
					console.log('WishlistService.ModalCloseEvent', e);
				}
			});
		}
	}

	toggle(identity: Identity) {
		if (this.has(identity)) {
			this.doRemove(identity);
		} else {
			this.doAdd(identity);
		}
	}

}
