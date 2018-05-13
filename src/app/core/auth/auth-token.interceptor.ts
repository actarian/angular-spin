
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { RouteService } from '../routes';
import { AuthService } from './auth.service';

@Injectable()
export class AuthTokenInterceptor implements HttpInterceptor {

	constructor(
		private router: Router,
		private routeService: RouteService,
		private authService: AuthService,
	) { }

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// injecting request
		const authToken = this.authService.getToken();
		if (this.authService.isValid(authToken)) {
			request = request.clone({
				setHeaders: {
					Authorization: `Bearer ${authToken.accessToken}`
				}
			});
		}
		// parsing response
		return next.handle(request).do((event: HttpEvent<any>) => {
			if (event instanceof HttpResponse) {
				// do stuff with response if you want
				console.log('AuthTokenInterceptor.success', event.status);
			}
		}, (error: any) => {
			if (error instanceof HttpErrorResponse) {
				if (error.status === 401) {
					console.log('AuthTokenInterceptor.unautorized', error.status);
					this.authService.collectFailedRequest(request);
					const segments = this.routeService.toRoute(['/login']);
					this.router.navigate(segments);
					// redirect to the login route
					// or show a modal
				}
			}
		});
	}

}
