import { ApplicationRef, enableProdMode, NgZone } from '@angular/core';
import { platformDynamicServer, PlatformState } from '@angular/platform-server';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import { AppModuleServer } from './app/app.module.server';
import { environment } from './environments/environment';

// export { AppModuleServer } from './app/app.module.server';

if (environment.production) {
	enableProdMode();
}

export default createServerRenderer(params => {

	const providers = [{ provide: 'ServerParams', useValue: params }];
	// { provide: INITIAL_CONFIG, useValue: { document: '<app></app>', url: params.url } }];

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
				/*
				setImmediate(() => {
					resolve({
						html: state.renderToString()
					});
					module.destroy();
				});
				*/
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

	/*
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
	console.log('options', options);
	const renderPromise = AppServerModuleNgFactory
		? renderModuleFactory(AppServerModuleNgFactory, options)
		: renderModule(AppServerModule, options);
	console.log('renderPromise', renderPromise);
	// AoT : dev
	return renderPromise.then(html => ({ html }));
	*/
});

