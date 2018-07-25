import { APP_BASE_HREF } from '@angular/common';
import { ApplicationRef, enableProdMode, NgZone } from '@angular/core';
import { INITIAL_CONFIG, platformDynamicServer, PlatformState } from '@angular/platform-server';
import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';
import { BootFuncParams, createServerRenderer, RenderResult } from 'aspnet-prerendering';
import 'reflect-metadata';
import { first } from 'rxjs/operators';
import 'zone.js/dist/zone-node';
import { AppModuleServer } from './app/app.module.server';
import { environment } from './environments/environment';

// export { AppModuleServer } from './app/app.module.server';

if (environment.production) {
	enableProdMode();
}

// node -e "console.log(require('./dist/server/main.js').default((e, result) => console.log('error', e, 'result', result !== null), '/', {}, 'http://localhost:40000/', '/', { originalHtml: '<app-component></app-component>' }))"

export default createServerRenderer((params: BootFuncParams) => {

	const providers = [
		{ provide: INITIAL_CONFIG, useValue: { document: params.data.originalHtml, url: params.url } },
		{ provide: APP_BASE_HREF, useValue: params.baseUrl },
		{ provide: ORIGIN_URL, useValue: params.origin },
	];

	// console.log(params, providers);
	// throw (new Error(JSON.stringify(params)), new Error(JSON.stringify(providers)));

	return platformDynamicServer(providers).bootstrapModule(AppModuleServer).then(module => {
		const application = module.injector.get(ApplicationRef);
		const state = module.injector.get(PlatformState);
		const zone = module.injector.get(NgZone);
		return new Promise<RenderResult>((resolve, reject) => {
			zone.onError.subscribe((error) => {
				reject(error);
			});
			application.isStable.pipe(
				first(isStable => isStable)
			).subscribe(() => {
				// Because 'onStable' fires before 'onError', we have to delay slightly before
				// completing the request in case there's an error to report
				setImmediate(() => {
					const html = state.renderToString(); // `<h1>Hello, ${params.data.userName}</h1>`;
					// console.log('html', html);
					resolve({
						html: html,
					});
					// module.destroy();
				});
			});
		});
	});

});

