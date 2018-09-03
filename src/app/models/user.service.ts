import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EntityService } from '../core/models';
import { FacebookUser, GoogleUser } from '../core/plugins';
import { LocalStorageService, StorageService } from '../core/storage';
import { ModalService } from '../core/ui/modal';
import { User, UserAuth, UserSignForgotten, UserSignUp } from './user';

@Injectable({
	providedIn: 'root',
})
export class UserService extends EntityService<User> {

	get collection(): string {
		return '/api/user';
	}

	storage: StorageService;
	public user$: BehaviorSubject<User> = new BehaviorSubject<User>(null);

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		protected injector: Injector,
		private storageService: LocalStorageService,
		private modalService: ModalService,
	) {
		super(injector);
		this.storage = this.storageService.tryGet();
		const storedItem = this.storage.get('user');
		if (storedItem) {
			this.user$.next(storedItem);
		}
	}

	public current(): Observable<User> {
		const user: User = this.user$.getValue();
		if (user) {
			return of(user);
		} else {
			// return from api session
			return of(null);
		}
	}

	public update(user: User): Observable<User> {
		// post
		this.storage.set('user', user);
		this.user$.next(user);
		console.log('UserService.update.success', user);
		return of(user);
	}

	public isLoggedIn(): boolean {
		const user: User = this.user$.getValue();
		return Boolean(user);
		// return this.getDetailById(1) as Observable<User>;
	}

	public tryLogin(user: UserAuth): Observable<UserAuth[]> {
		if (!user.password.trim()) {
			return of([]);
		}
		// return this.get(`?email=${user.email}&password=${user.password}`);
		return this.get(`?password=${user.password}`).pipe(
			tap(users => {
				if (users.length) {
					const user = users[0];
					this.storage.set('user', user);
					this.user$.next(user);
					console.log('UserService.tryLogin.success', user);
				}
			})
		);
	}

	public signForgotten(userSignForgotten: UserSignForgotten): Observable<any> {
		if (!userSignForgotten.email.trim()) {
			return of([]);
		}
		return this.post(`/forgotten`, userSignForgotten);
		/*.pipe(
			tap(x => this.log(`tryLogin "${user.email}"`))
		);*/
	}

	public signUp(userSignUp: UserSignUp): Observable<UserAuth> {
		return this.add(userSignUp).pipe(
			tap(user => {
				this.storage.set('user', user);
				this.user$.next(user);
			})
		);
	}

	public tryFacebook(user: FacebookUser): Observable<UserAuth[]> {
		if (!user.facebookToken.trim()) {
			return of([]);
		}
		return this.post(`/facebook`, user).pipe(
			tap(user => {
				this.storage.set('user', user);
				this.user$.next(user);
			})
		); // ?email=${user.email}&facebookToken=${user.facebookToken}`
	}

	public tryGoogle(user: GoogleUser): Observable<UserAuth[]> {
		if (!user.googleToken.trim()) {
			return of([]);
		}
		return this.post(`/google`, user).pipe(
			tap(user => {
				this.storage.set('user', user);
				this.user$.next(user);
			})
		); // ?email=${user.email}&googleToken=${user.googleToken}`
	}

}

