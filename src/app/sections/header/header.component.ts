import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { MenuItem, MenuService } from '../../core';
import { DisposableComponent } from '../../core/disposable';
import { Label } from '../../core/labels';
import { RouteService } from '../../core/routes';
import { ModalCompleteEvent, ModalService } from '../../core/ui/modal';
import { CartService, UserService, WishlistService } from '../../models';
import { OperatorService } from '../../pages';
import { AuthComponent } from '../../pages/auth/auth.component';

@Component({
	selector: 'section-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	animations: [
		trigger('fadeIn', [
			state('in', style({ opacity: 1, transform: 'scaleY(1)' })),
			transition('void => *', [
				style({ opacity: 0, transform: 'scaleY(0)' }),
				animate('.5s cubic-bezier(.57, 0.08, .18, .99)')
			]),
			transition('* => void', [
				animate('.3s cubic-bezier(.57, 0.08, .18, .99)', style({ opacity: 0, transform: 'scaleY(0)' }))
			])
		])
	],

	// encapsulation: ViewEncapsulation.Emulated
	// encapsulation: ViewEncapsulation.Emulated is default
})

export class HeaderComponent extends DisposableComponent implements OnInit {

	public dropdown: boolean;
	public languages: any[];
	public currentLanguage: any;
	public navToggle: boolean;
	public subnavActive: string;
	public menu: MenuItem[];

	constructor(
		public routeService: RouteService,
		private modalService: ModalService,
		private menuService: MenuService,
		public userService: UserService,
		public operatorService: OperatorService,
		public wishlist: WishlistService,
		public cartService: CartService,
	) {
		super();
	}

	ngOnInit() {
		this.menuService.get().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(menu => {
			this.menu = menu;
		});
		this.routeService.languages.pipe(
			takeUntil(this.unsubscribe)
		).subscribe(x => {
			// console.log('HeaderComponent.getLanguages', x);
			this.languages = x;
		});
		this.routeService.language.pipe(
			takeUntil(this.unsubscribe)
		).subscribe(x => {
			// console.log('HeaderComponent.getLanguage', x);
			this.currentLanguage = x;
		});

		// observe current user
		this.userService.observe().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(user => {
			// console.log('HeaderComponent.user', user);
		});

		// observe current operator
		this.operatorService.observe().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(operator => {
			// console.log('HeaderComponent.operator', operator);
		});

		// observe wishlist
		this.wishlist.observe().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(wishlist => {
			// console.log('HeaderComponent.wishlist', wishlist);
		});

		// current cart
		this.cartService.observe().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(cart => {
			// console.log('HeaderComponent.cart', cart);
		});
	}

	setLanguage(language: Label) {
		console.log('HeaderComponent.setLanguage', language);
		const silent: boolean = true;
		this.routeService.setLanguage(language.lang, silent);
	}

	onSign(): void {
		this.modalService.open({ component: AuthComponent }).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(e => {
			if (e instanceof ModalCompleteEvent) {
				console.log('signed');
			}
		});
	}

	onOperatorLogout(): void {
		this.operatorService.logout().pipe(
			first(),
		).subscribe();
	}

}
