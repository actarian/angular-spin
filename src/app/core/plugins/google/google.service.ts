


import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/concatMap';
import { fromPromise } from 'rxjs/observable/fromPromise';
import { environment } from '../../../../environments/environment';
import { OnceService } from '../../once';
import { RouteService } from '../../routes';
import { LocalStorageService, StorageService } from '../../storage';

export class GoogleConfig {
	public apiKey: string;
	public clientId: string;
	public cookiepolicy?: string = 'single_host_origin';
	public scope?: string = 'profile email';
	public fetch_basic_profile?: boolean = true;
	public ux_mode?: string = 'popup';
}

export class GoogleAuthResponse {
	token_type: string;
	access_token: string;
	scope: string;
	login_hint: string;
	expires_in: number;
	expires_at: number;
	first_issued_at: number;
	id_token: string;
	idpId: string;
	signedRequest: string;
	userID: string;
}

export class GoogleUser {
	email: string;
	firstName: string;
	id: string;
	lastName: string;
	name: string;
	picture: string;
	authResponse?: GoogleAuthResponse;
	googleToken?: string;
}

@Injectable()
export class GoogleService {

	public authResponse: GoogleAuthResponse;
	public storage: StorageService;
	private options: GoogleConfig;
	private gapi: any;
	private auth2: any;
	private instance: any;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		private storageService: LocalStorageService,
		private onceService: OnceService,
		private routeService: RouteService,
	) {
		this.init();
	}

	init(): void {
		if (!environment['plugins'] && !environment['plugins']['google']) {
			throw new Error('GoogleService.error missing config object in environment.plugins.google');
		}
		this.options = Object.assign(new GoogleConfig(), environment['plugins']['google'] as GoogleConfig);
		this.storage = this.storageService.tryGet();
		this.authResponse = this.storage.get('google');
		// console.log('GoogleService.authResponse', this.authResponse);
	}

	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	*  call GoogleService.google on component OnInit to avoid popup blockers via asyncronous loading *
	* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */

	private google(): Observable<any> {
		if (isPlatformBrowser(this.platformId)) {
			return new Observable().pipe(x => {
				if (this.gapi) {
					return of(this.gapi);
				} else {
					return this.once();
				}
			});
		} else {
			return of(null);
		}
	}

	getMe() {
		return this.login().concatMap(x => {
			const profile = this.instance.currentUser.get().getBasicProfile();
			const user = {
				id: profile.getId(),
				name: profile.getName(),
				firstName: profile.getGivenName(),
				lastName: profile.getFamilyName(),
				picture: profile.getImageUrl(),
				email: profile.getEmail(),
				authResponse: this.authResponse,
				googleToken: this.authResponse.access_token,
			} as GoogleUser;
			return of(user);
		});
	}

	login() {
		return this.auth2Instance().concatMap(x => {
			return this.signin();
		});
	}

	logout() {
		return this.auth2Instance().concatMap(x => {
			return fromPromise(
				new Promise((resolve, reject) => {
					if (this.instance.isSignedIn && this.instance.isSignedIn.get()) {
						this.instance.signOut().then((signed) => {
							resolve();
						}, reject);
					} else {
						resolve();
					}
				})
			);
		});
	}

	private once(): Observable<any> {
		return this.onceService.script('https://apis.google.com/js/api:client.js?onload={{callback}}', true).concatMap(x => {
			this.gapi = window['gapi'];
			return of(this.gapi);
		});
	}

	private getAuth2() {
		return new Observable().pipe(x => {
			if (this.auth2) {
				return of(this.auth2);
			} else {
				return this.google().concatMap(x => {
					if (this.gapi.auth2) {
						return this.auth2init();
					} else {
						return fromPromise(
							new Promise((resolve, reject) => {
								this.gapi.load('auth2', () => {
									setTimeout(() => {
										resolve();
									}, 200);
								}, reject);
							})
						).concatMap(x => {
							return this.auth2init();
						});
					}
				});
			}
		});
	}

	private signin() {
		return fromPromise(
			new Promise((resolve, reject) => {
				const readAccessToken = () => {
					// console.log('GoogleLogin.readAccessToken');
					try {
						const user = this.instance.currentUser.get().getAuthResponse(true);
						// console.log('GoogleLogin.readAccessToken.success', user);
						this.authResponse = user;
						this.storage.set('google', user);
						resolve({
							code: user.access_token,
						});
					} catch (error) {
						console.log('GoogleLogin.readAccessToken.error', error);
						this.storage.delete('google');
						reject(error);
					}
				};
				if (this.instance.isSignedIn && this.instance.isSignedIn.get()) {
					readAccessToken();
				} else {
					this.instance.signIn({
						scope: 'profile email',

					}).then((signed) => {
						readAccessToken();

					}, (error) => {
						this.storage.delete('google');
						reject(error);
					});
				}
			})
		);
	}

	private auth2init() {
		return fromPromise(
			new Promise((resolve, reject) => {
				this.gapi.auth2.init({
					client_id: environment.plugins.google.clientId,
					cookiepolicy: 'single_host_origin',
					scope: 'profile email',
					fetch_basic_profile: true,
					ux_mode: 'popup',
				}).then(() => {
					this.auth2 = this.gapi.auth2;
					// console.log('Auth2Init.success', this.auth2);
					resolve(this.auth2);
				}, reject);
			})
		);
	}

	public auth2Instance() {
		if (this.instance) {
			return of(this.instance);
		} else {
			return this.getAuth2().concatMap(x => {
				this.instance = this.auth2.getAuthInstance();
				return of(this.instance);
			});
		}
	}

}
