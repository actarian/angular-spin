import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModuleBrowser } from './app/app.module.browser';
import { environment } from './environments/environment';

if (environment.production) {
	enableProdMode();
}

const providers = [{ provide: 'ServerParams', useValue: { origin: '' } }
	// { provide: INITIAL_CONFIG, useValue: { document: '<app></app>', url: params.url } },
];

platformBrowserDynamic(providers).bootstrapModule(AppModuleBrowser)
	.then(success => console.log(`Bootstrap success`))
	.catch(err => console.error(err));
