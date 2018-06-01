import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { environment } from '../environments/environment';
import { HomeComponent, RegionDetailComponent } from './pages';
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
	{ path: 'region/:id', component: RegionDetailComponent },
	{ path: ':lang/region/:id', component: RegionDetailComponent },
	{ path: 'not-found', component: NotFoundComponent },
	{ path: ':lang/not-found', component: NotFoundComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(
		routes,
		{
			enableTracing: environment.enableTracing,
			useHash: environment.useHash,
		}
	)],
	exports: [RouterModule]
})

export class AppRouting { }

