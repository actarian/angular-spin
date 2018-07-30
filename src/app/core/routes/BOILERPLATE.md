
// RouteLinkWithHref

import { Directive, Input } from '@angular/core';
import { RouterLinkWithHref } from '@angular/router';
import { environment } from '../../../environments/environment';

@Directive({ selector: 'a[routeLink]' })
export class RouteLinkWithHref extends RouterLinkWithHref {

	@Input()
	set routeLink(commands: any[] | string) {
		if (commands != null) {
			commands = Array.isArray(commands) ? commands : [commands];
		} else {
			commands = [];
		}
		if (environment.useMarket) {
			const market: string = 'IT';
			commands.unshift(market);
		}
		if (environment.useLang) {
			const lang: string = 'it';
			commands.unshift(lang);
		}
		console.log('RouteLinkWithHref.routeLink', commands);
		this.routerLink = commands;
	}
}

// RouteLink

import { Directive, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Directive({ selector: ':not(a)[routeLink]' })
export class RouteLink extends RouterLink {

	@Input()
	set routeLink(commands: any[] | string) {
		if (commands != null) {
			commands = Array.isArray(commands) ? commands : [commands];
		} else {
			commands = [];
		}
		if (environment.useMarket) {
			const market: string = 'IT';
			commands.unshift(market);
		}
		if (environment.useLang) {
			const lang: string = 'it';
			commands.unshift(lang);
		}
		console.log('RouteLink.routeLink', commands);
		this.routerLink = commands;
	}

}
