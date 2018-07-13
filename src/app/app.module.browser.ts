import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';
import { ApiService } from './core/api';
import { ServerParams } from './core/models';

@NgModule({
	imports: [
		BrowserAnimationsModule,
		AppModule
	],
	bootstrap: [AppComponent]
})
export class AppModuleBrowser {
	constructor(
		private params: ServerParams,
	) {
		ApiService.domain = params.origin;
		console.log('params', params);
		/*
		if (Zone.current.get('domain')) {
			ApiService.domain = Zone.current.get('domain');
		} else {
			ApiService.domain = (<any>window).domain;
		}
		*/
	}
}
