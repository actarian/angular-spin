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
		{ provide: APP_BASE_HREF, useValue: params.baseUrl },
		{ provide: 'ORIGIN_URL', useValue: params.origin },
	];

	// console.log(params, providers);
	// throw (new Error(JSON.stringify(params)), new Error(JSON.stringify(providers)));

	return platformDynamicServer(providers).bootstrapModule(AppModuleServer).then(module => {
		const application = module.injector.get(ApplicationRef);
		const state = module.injector.get(PlatformState);
		const zone = module.injector.get(NgZone);

		return new Promise<RenderResult>((resolve, reject) => {
			zone.onError.subscribe(errorInfo => reject(errorInfo));
			application.isStable.subscribe(() => {
				// .first(isStable => isStable)
				// Because 'onStable' fires before 'onError', we have to delay slightly before
				// completing the request in case there's an error to report
				setImmediate(() => {
					resolve({
						html: state.renderToString(), // `<h1>Hello, ${params.data.userName}</h1>`;
					});
					module.destroy();
				});
			});
		});
	});

});

