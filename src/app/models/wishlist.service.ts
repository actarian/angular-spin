import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Identity, IdentityService } from '../core/models';
import { LocalStorageService, StorageService } from '../core/storage';
import { ModalCloseEvent, ModalCompleteEvent, ModalEvent, ModalService } from '../core/ui/modal';
import { AuthComponent } from '../pages/auth/auth.component';
import { SearchResult } from './search';

@Injectable({
	providedIn: 'root',
})
export class WishlistService extends IdentityService<SearchResult> {

	get collection(): string {
		return '/memory/wishlist';
	}

	storage: StorageService;
	private wishlist$ = new BehaviorSubject<Identity[]>([]);

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		protected injector: Injector,
		private storageService: LocalStorageService,
		private modalService: ModalService,
	) {
		super(injector);
		this.storage = this.storageService.tryGet();
		const storedItems = this.storage.get('wishlist');
		if (storedItems) {
			this.wishlist$.next(storedItems);
		}
		this.get().subscribe((items: Identity[]) => {
			if (items.length) {
				this.wishlist$.next(items);
			} else if (storedItems && storedItems.length) {
				this.doAddMany(storedItems);
			}
		});
	}

	has(identity: Identity) {
		return this.wishlist$.getValue().find(x => x.id === identity.id);
	}

	doAddMany(identities: Identity[]) {
		this.post('/many', identities).subscribe((items: Identity[]) => {
			this.storage.set('wishlist', items);
			this.wishlist$.next(items);
		});
	}

	doAdd(identity: Identity) {
		this.modalService.open({ component: AuthComponent }).subscribe((e: ModalEvent<ModalCompleteEvent | ModalCloseEvent>) => {
			console.log(e);
			if (e instanceof ModalCompleteEvent) {
				console.log('ModalCompleteEvent', e);
			} else if (e instanceof ModalCloseEvent) {
				console.log('ModalCloseEvent', e);
			}
		});
		this.post(identity).subscribe(result => {
			const items = this.wishlist$.getValue();
			items.push({ id: identity.id });
			this.storage.set('wishlist', items);
			this.wishlist$.next(items);
		});
	}

	doRemove(identity: Identity) {
		this.delete(identity.id).subscribe(result => {
			const items = this.wishlist$.getValue();
			const instance = items.find(x => x.id === identity.id);
			const index = items.indexOf(instance);
			items.splice(index, 1);
			this.storage.set('wishlist', items);
			this.wishlist$.next(items);
		});
	}

	doToggle(identity: Identity) {
		if (this.has(identity)) {
			this.doRemove(identity);
		} else {
			this.doAdd(identity);
		}
	}

}
