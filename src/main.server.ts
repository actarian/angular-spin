// import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode } from '@angular/core';
// import { renderModule, renderModuleFactory } from '@angular/platform-server';
// import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
// import { createServerRenderer } from 'aspnet-prerendering';
// import 'reflect-metadata';
// import 'zone.js/dist/zone-node';
import { environment } from './environments/environment';

export { AppModuleServer } from './app/app.module.server';

if (environment.production) {
	enableProdMode();
}

/*
export default createServerRenderer(params => {

	const { AppServerModule, AppServerModuleNgFactory, LAZY_MODULE_MAP } = (module as any).exports;

	const options = {
		document: params.data.originalHtml,
		url: params.url,
		extraProviders: [
			provideModuleMap(LAZY_MODULE_MAP),
			{ provide: APP_BASE_HREF, useValue: params.baseUrl },
			{ provide: 'BASE_URL', useValue: params.origin + params.baseUrl }
		]
	};

	const renderPromise = AppServerModuleNgFactory
		? renderModuleFactory(AppServerModuleNgFactory, options)
		: renderModule(AppServerModule, options);
	// AoT : dev
	return renderPromise.then(html => ({ html }));
});
*/
