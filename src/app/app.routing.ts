import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { CartResolve } from './models/cart.resolve';
import { UserGuard } from './models/user.guard';
import { UserResolve } from './models/user.resolve';
import { DestinationComponent, DestinationDetailComponent, HomeComponent, HotelComponent, LeafletComponent, NewsletterComponent, OperatorComponent, OrderDetailComponent, OrderHistoryComponent, ProfileComponent, ReservedAreaComponent, SearchComponent, WishlistComponent } from './pages';
import { CheckoutCanceledComponent, CheckoutComponent, CheckoutDataComponent, CheckoutPaxComponent, CheckoutPaymentComponent, CheckoutSuccessComponent } from './pages/checkout';
import { NotFoundComponent } from './sections';

const routes: Routes = [
	{
		path: 'cassa', component: CheckoutComponent, resolve: { cart: CartResolve }, children: [
			{ path: '', redirectTo: 'i_tuoi_dati', pathMatch: 'full' },
			{ path: 'i_tuoi_dati', component: CheckoutDataComponent, resolve: { user: UserResolve, cart: CartResolve } },
			{ path: 'dati_passeggeri', component: CheckoutPaxComponent, resolve: { user: UserResolve, cart: CartResolve }, canActivate: [UserGuard] },
			{ path: 'pagamento', component: CheckoutPaymentComponent, resolve: { user: UserResolve, cart: CartResolve }, canActivate: [UserGuard] },
			{ path: 'completato', component: CheckoutSuccessComponent, resolve: { user: UserResolve, cart: CartResolve }, canActivate: [UserGuard] },
			{ path: 'annullato', component: CheckoutCanceledComponent, resolve: { user: UserResolve, cart: CartResolve }, canActivate: [UserGuard] },
		]
	},
	{
		path: 'area_riservata', component: ReservedAreaComponent, children: [
			{ path: '', redirectTo: 'i_tuoi_dati', pathMatch: 'full' },
			{ path: 'i_tuoi_dati', component: ProfileComponent, resolve: { user: UserResolve } },
			{ path: 'riepilogo_ordini', component: OrderHistoryComponent, resolve: { user: UserResolve }, },
			{ path: 'riepilogo_ordini/:orderYear/:orderNum', component: OrderDetailComponent, resolve: { user: UserResolve }, },
			{ path: 'preferiti', component: WishlistComponent, resolve: { user: UserResolve }, }
		], canActivate: [UserGuard]
	},
	{ path: 'search', component: SearchComponent },
	{ path: 'not-found', component: NotFoundComponent },
	{ path: 'hotel/:id/:slug', component: HotelComponent },
	{ path: 'destinations', component: DestinationComponent },
	{ path: 'destinations/:category', component: DestinationDetailComponent },
	{ path: 'volantini', component: LeafletComponent },
	{ path: 'volantini/:id', component: LeafletComponent },
	{ path: 'newsletter', component: NewsletterComponent },
	{ path: 'newsletter/:email', component: NewsletterComponent },
	{ path: 'bom/login/operator', component: OperatorComponent },
	{ path: 'homepage', component: HomeComponent, pathMatch: 'full' },
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {
			initialNavigation: 'enabled',
			enableTracing: environment.enableTracing,
			useHash: environment.useHash,
		})
	],
	exports: [RouterModule]
})

export class AppRouting { }

