import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { HomeComponent, HotelComponent, RegionDetailComponent, SerpComponent, SerpListComponent, SerpMapComponent, PaymentComponent } from './pages';
import { NotFoundComponent } from './sections';

export function getRoutes(routes: Routes): Routes {
	return routes.map(route => {
		if (route.path) {
			if (environment.useMarket) {
				route.path = `:market/${route.path}`;
			}
			if (environment.useLang) {
				route.path = `:lang/${route.path}`;
			}
		}
		return route;
	});
}

const routes: Routes = [
	{ path: '', component: HomeComponent, pathMatch: 'full' },
	{
		path: 'search', component: SerpComponent, children: [
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
			{ path: 'list', component: SerpListComponent },
			{ path: 'map', component: SerpMapComponent },
		]
	},
	{
		path: ':lang/search', component: SerpComponent, children: [
			{ path: '', redirectTo: 'list', pathMatch: 'full' },
			{ path: 'list', component: SerpListComponent },
			{ path: 'map', component: SerpMapComponent },
		]
	},
	{ path: 'hotel/:id/:slug', component: HotelComponent },
	{ path: ':lang/hotel/:id/:slug', component: HotelComponent },
	{ path: 'region/:id', component: RegionDetailComponent },
	{ path: ':lang/region/:id', component: RegionDetailComponent },
	{ path: 'payment', component: PaymentComponent },
	{ path: ':lang/payment', component: PaymentComponent },
	{ path: 'not-found', component: NotFoundComponent },
	{ path: ':lang/not-found', component: NotFoundComponent },
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

