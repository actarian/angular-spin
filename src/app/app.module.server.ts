import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { PrebootModule } from 'preboot';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

@NgModule({
	bootstrap: [AppComponent],
	imports: [
		ModuleMapLoaderModule, // <-- *Important* to have lazy-loaded routes work
		NoopAnimationsModule,
		AppModule,
		ServerModule,
		PrebootModule.withConfig(environment.preboot),
		ServerTransferStateModule // <-- broken for the time-being with ASP.NET
		// HttpTransferCacheModule still needs fixes for 5.0
		//   Leave this commented out for now, as it breaks Server-renders
		//   Looking into fixes for this! - @MarkPieszak
		// ServerTransferStateModule // <-- broken for the time-being with ASP.NET
		/*
		// ServerPrebootModule.recordEvents({ appRoot: 'app-root' }),
		// HttpTransferCacheModule still needs fixes for 5.0
		//   Leave this commented out for now, as it breaks Server-renders
		//   Looking into fixes for this! - @MarkPieszak
		// ServerTransferStateModule // <-- broken for the time-being with ASP.NET
		*/
	],
})

export class AppModuleServer { }
