import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanDeactivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { RouteService } from '../routes/route.service';

@Injectable()
export class PageGuard implements CanActivate, CanDeactivate<any> {

	constructor(
		private router: Router,
		private routeService: RouteService
	) { }

	private match(route: ActivatedRouteSnapshot): boolean {
		const lastPath = route.url.length ? route.url[route.url.length - 1].path : '';
		const pattern = /\.([0-9a-z]+)(?:[\?#]|$)/i;
		const match = (lastPath).match(pattern);
		if (match !== null) {
			// this.router.navigate(this.routeService.toRoute(['not-found']));
			return false;
		} else {
			return true;
		}
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		return this.match(route);
	}

	canDeactivate(
		component: any,
		currentRoute: ActivatedRouteSnapshot,
		currentState: RouterStateSnapshot,
		nextState?: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean {
		return this.match(currentRoute);
	}

}
