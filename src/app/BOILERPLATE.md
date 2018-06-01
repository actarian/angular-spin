
// app.routing

import * as Layouts from './layouts';

import * as Attributes from './attributes';

const publicRoutes: Routes = [
	{ path: '', redirectTo: 'home', pathMatch: 'full' },
	{ path: 'home', component: HomeComponent, data: { title: 'Homepage' } },
	{ path: 'region/:id', component: RegionDetailComponent, data: { title: 'Region Detail' } },
	{ path: 'regions', component: RegionsComponent, data: { title: 'Regions' } }
];

const authRoutes: Routes = [
	{ path: 'profile', component: ProfileComponent, canActivate: [Attributes.AuthAttribute], data: { title: 'Profile' } },
];

const layoutRoutes: Routes = [
	{ path: '', redirectTo: 'login', pathMatch: 'full' },
	{ path: '', component: Layouts.PublicLayout, data: { title: 'Public Pages' }, children: publicRoutes },
	{ path: '', component: Layouts.AuthLayout, canActivate: [Attributes.AuthAttribute], data: { title: 'Secure Pages' }, children: authRoutes },
	{ path: '**', redirectTo: 'login' }
];
