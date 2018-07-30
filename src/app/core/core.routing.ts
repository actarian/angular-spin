import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PageHosterComponent, PageResolverService } from './pages';
import { RouteService } from './routes';

const routes: Routes = [
	{ path: '**', component: PageHosterComponent, resolve: { pageResolver: PageResolverService } },
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
