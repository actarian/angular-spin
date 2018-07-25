import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { PrebootModule } from 'preboot';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

// const prebootOptions = { appRoot: 'app-component' };  // see PrebootRecordOptions section below
// const inlineCode = getInlinePrebootCode(prebootOptions);
// now simply insert the inlineCode into the HEAD section of your server view

@NgModule({
	bootstrap: [AppComponent],
	imports: [
		ModuleMapLoaderModule, // <-- *Important* to have lazy-loaded routes work
		NoopAnimationsModule,
		AppModule,

		ServerModule,
		PrebootModule.withConfig({ appRoot: 'app-component' }),

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
