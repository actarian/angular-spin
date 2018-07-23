import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { EntityService } from '../core/models';
import { FacebookUser, GoogleUser } from '../core/plugins';
import { User, UserAuth, UserSignForgotten } from './user';

@Injectable({
	providedIn: 'root',
})
export class UserService extends EntityService<User> {

	get collection(): string {
		return '/memory/user';
	}

	isLoggedIn(): Observable<User> {
		return this.getDetailById(1) as Observable<User>;
	}

	tryLogin(user: UserAuth): Observable<UserAuth[]> {
		if (!user.password.trim()) {
			return of([]);
		}
		return this.get(`?email=${user.email}&password=${user.password}`);
		/*.pipe(
			tap(x => this.log(`tryLogin "${user.email}"`))
		);*/
	}

	signForgotten(userSignForgotten: UserSignForgotten): Observable<any> {
		if (!userSignForgotten.email.trim()) {
			return of([]);
		}
		return this.post(`/forgotten`, userSignForgotten);
		/*.pipe(
			tap(x => this.log(`tryLogin "${user.email}"`))
		);*/
	}

	tryFacebook(user: FacebookUser): Observable<UserAuth[]> {
		if (!user.facebookToken.trim()) {
			return of([]);
		}
		return this.post(`/facebook`, user); // ?email=${user.email}&facebookToken=${user.facebookToken}`
		/*.pipe(
			tap(x => this.log(`tryFacebook "${user.email}"`))
		);*/
	}

	tryGoogle(user: GoogleUser): Observable<UserAuth[]> {
		if (!user.googleToken.trim()) {
			return of([]);
		}
		return this.post(`/google`, user); // ?email=${user.email}&googleToken=${user.googleToken}`
		/*.pipe(
			tap(x => this.log(`tryGoogle "${user.email}"`))
		);*/
	}

}

