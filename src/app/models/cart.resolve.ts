import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { Cart } from './cart';
import { CartService } from './cart.service';

@Injectable()
export class CartResolve implements Resolve<Cart> {

	constructor(
		private cartService: CartService
	) { }

	resolve(route: ActivatedRouteSnapshot) {
		return this.cartService.current();
	}

}
