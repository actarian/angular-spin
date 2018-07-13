import { enableProdMode } from '@angular/core';
import { createTransferScript, IEngineOptions, ngAspnetCoreEngine } from '@nguniversal/aspnetcore-engine';
import { createServerRenderer } from 'aspnet-prerendering';
import 'zone.js/dist/zone-node';
// Grab the (Node) server-specific NgModule
import { AppModuleServer } from './app/app.module.server';
import './polyfills/server.polyfills';

enableProdMode();

export default createServerRenderer((params) => {

	// Platform-server provider configuration
	const setupOptions: IEngineOptions = {
		appSelector: '<app-component></app-component>',
		ngModule: AppModuleServer,
		request: params,
		providers: [
			// Optional - Any other Server providers you want to pass
			// (remember you'll have to provide them for the Browser as well)
		]
	};

	return ngAspnetCoreEngine(setupOptions).then(response => {

		// Apply your transferData to response.globals
		response.globals.transferData = createTransferScript({
			someData: 'Transfer this to the client on the window.TRANSFER_CACHE {} object',
			fromDotnet: params.data.thisCameFromDotNET // example of data coming from dotnet, in HomeController
		});

		return ({
			html: response.html, // our <app-root> serialized
			globals: response.globals // all of our styles/scripts/meta-tags/link-tags for aspnet to serve up
		});
	});
});

/*
import { APP_BASE_HREF } from '@angular/common';
import { ApplicationRef, enableProdMode, NgZone } from '@angular/core';
import { INITIAL_CONFIG, platformDynamicServer, PlatformState } from '@angular/platform-server';
import { BootFuncParams, createServerRenderer, RenderResult } from 'aspnet-prerendering';
import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import { AppModuleServer } from './app/app.module.server';
import { environment } from './environments/environment';

// export { AppModuleServer } from './app/app.module.server';

if (environment.production) {
	enableProdMode();
}

export default createServerRenderer((params: BootFuncParams) => {

	const providers = [
		{ provide: INITIAL_CONFIG, useValue: { document: params.data.originalHtml, url: params.url } },
		{ provide: APP_BASE_HREF, useValue: params.baseUrl }
	];

	// console.log(params, providers);
	// throw (new Error(JSON.stringify(params)), new Error(JSON.stringify(providers)));

	return platformDynamicServer(providers).bootstrapModule(AppModuleServer).then(module => {
		const application = module.injector.get(ApplicationRef);
		const state = module.injector.get(PlatformState);
		const zone = module.injector.get(NgZone);

		return new Promise<RenderResult>((resolve, reject) => {
			const result = state.renderToString(); // `<h1>Hello, ${params.data.userName}</h1>`;
			zone.onError.subscribe(errorInfo => reject(errorInfo));
			application.isStable.subscribe(() => {
				// .first(isStable => isStable)
				// Because 'onStable' fires before 'onError', we have to delay slightly before
				// completing the request in case there's an error to report
				// setImmediate(() => {
				//	resolve({
				//		html: state.renderToString()
				//	});
				//	module.destroy();
				// });
				setImmediate(() => {
					resolve({
						html: result,
						globals: {
							postList: [
								'Title Title Title',
								'Lorem ipsum dolor sit amet'
							]
						}
					});
					module.destroy();
				});
			});
		});
	});

// 	const { AppServerModule, AppServerModuleNgFactory, LAZY_MODULE_MAP } = (module as any).exports;
// 	const options = {
// 		document: params.data.originalHtml,
// 		url: params.url,
// 		extraProviders: [
// 			provideModuleMap(LAZY_MODULE_MAP),
// 			{ provide: APP_BASE_HREF, useValue: params.baseUrl },
// 			{ provide: 'BASE_URL', useValue: params.origin + params.baseUrl }
// 		]
// 	};
// 	console.log('options', options);
// 	const renderPromise = AppServerModuleNgFactory
// 		? renderModuleFactory(AppServerModuleNgFactory, options)
// 		: renderModule(AppServerModule, options);
// 	console.log('renderPromise', renderPromise);
// 	// AoT : dev
// 	return renderPromise.then(html => ({ html }));
// });
*/
