import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModuleBrowser } from './app/app.module.browser';
import { environment } from './environments/environment';

if (environment.production) {
	enableProdMode();
}

document.addEventListener('DOMContentLoaded', () => {
	platformBrowserDynamic().bootstrapModule(AppModuleBrowser)
		.then(success => console.log(`Bootstrap success`))
		.catch(err => console.log(err));
});
