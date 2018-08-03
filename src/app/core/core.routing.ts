import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PageOutletComponent, PageResolverService } from './pages';
import { RouteService } from './routes';

const routes: Routes = [
	{ path: 'page/:id', component: PageOutletComponent, resolve: { pageResolver: PageResolverService } },
	{ path: '**', component: PageOutletComponent, resolve: { pageResolver: PageResolverService } },
];

@NgModule({
	imports: [
		RouterModule.forChild(routes),
	],
	exports: [
		RouterModule,
	],
	providers: [
		PageResolverService,
		{ provide: RouteService, useClass: RouteService, deps: [TranslateService] },
	]
})

export class CoreRouting { }
