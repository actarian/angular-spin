
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import 'rxjs/add/observable/throw';
import { Observable } from 'rxjs/Observable';
import { catchError, tap } from 'rxjs/operators';
import { Logger } from '../logger';
import { RouteService } from '../routes';

@Injectable()
export class HttpResponseInterceptor implements HttpInterceptor {

	private _logger: Logger;
	get logger() {
		if (!this._logger) {
			this._logger = this.injector.get(Logger);
		}
		return this._logger;
	}

	private _router: Router;
	get router() {
		if (!this._router) {
			this._router = this.injector.get(Router);
		}
		return this._router;
	}

	private _routeService: RouteService;
	get routeService() {
		if (!this._routeService) {
			this._routeService = this.injector.get(RouteService);
		}
		return this.routeService;
	}

	constructor(
		private injector: Injector
	) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// injecting request
		// parsing response
		return next.handle(request).pipe(
			tap((event: HttpEvent<any>) => {
				// console.log('HttpResponseInterceptor', event);
				this.logger.httpError = null;
				this.logger.log(event);
				/*
				if (event instanceof HttpResponse) {
					console.log('event instanceof HttpResponse');
					// do stuff with response if you want
				}
				*/
			}),
			catchError((error: any) => {
				// console.warn('HttpResponseInterceptor', error);
				if (error instanceof HttpErrorResponse) {
					switch (error.status) {
						case 401:
							// unauthorized
							this.logger.http(error);
							break;
						default:
							this.logger.http(error);
							break;
					}
				}
				return Observable.throw(error);
			})
		);
	}

}
