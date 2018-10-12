import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { first, map, switchMap, tap } from 'rxjs/operators';
import { AuthStrategy, environment } from '../../../environments/environment';
import { LocalStorageService, StorageService } from '../../core';
import { EntityService } from '../../core/models';

export class Operator {
	id?: number;
	username?: string;
	password?: string;
	//
	passwordReveal?: boolean = true;
}

@Injectable({
	providedIn: 'root',
})
export class OperatorService extends EntityService<any> {

	operator$: BehaviorSubject<Operator> = new BehaviorSubject<Operator>(null);
	private storage: StorageService;

	get collection(): string {
		return '/api/operator';
	}

	get operator(): Operator {
		return this.operator$.getValue();
	}

	set operator(operator: Operator) {
		if (environment.authStrategy === AuthStrategy.Bearer) {
			this.storage.set('operator', operator);
		}
		this.operator$.next(operator);
	}

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		protected injector: Injector,
		private storageService: LocalStorageService,
	) {
		super(injector);
		this.storage = this.storageService.tryGet();
		if (isPlatformBrowser(this.platformId)) {
			if (environment.authStrategy === AuthStrategy.Bearer) {
				// initWithBearer
				const operator = this.storage.get('operator');
				if (operator) {
					this.operator = operator;
				}
			}
		}
	}

	observe(): Observable<Operator> {
		if (isPlatformBrowser(this.platformId)) {
			return this.me().pipe(
				first(),
				switchMap(operator => this.operator$)
			);
		} else {
			return of(null);
		}
	}

	login(model: Operator): Observable<Operator> {
		return this.post(`/login`, model).pipe(
			tap(operator => {
				if (operator) {
					this.operator = operator;
					console.log('OperatorService.login.success', operator);
				}
			})
		);
	}

	logout(): Observable<Operator> {
		return this.get(`/logout`).pipe(
			tap(() => this.operator = null)
		);
	}

	private me(): Observable<Operator> {
		const operator: Operator = this.operator$.getValue();
		if (operator) {
			return of(operator);
		} else {
			return this.get(`/me`).pipe(
				map(operator => operator || null),
				tap(operator => this.operator = operator)
			);
		}
	}

}
