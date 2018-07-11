import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ServerModule } from '@angular/platform-server';
import { ModuleMapLoaderModule } from '@nguniversal/module-map-ngfactory-loader';
import { getInlinePrebootCode } from 'preboot';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

const prebootOptions = { appRoot: 'app-component' };  // see PrebootRecordOptions section below
const inlineCode = getInlinePrebootCode(prebootOptions);

// now simply insert the inlineCode into the HEAD section of your server view

@NgModule({
	imports: [
		// by the ServerModule from @angular/platform-server.
		NoopAnimationsModule,
		AppModule,
		ServerModule,
		ModuleMapLoaderModule, // <-- *Important* to have lazy-loaded routes work
		// ServerPrebootModule.recordEvents({ appRoot: 'app-root' }),
		// HttpTransferCacheModule still needs fixes for 5.0
		//   Leave this commented out for now, as it breaks Server-renders
		//   Looking into fixes for this! - @MarkPieszak
		// ServerTransferStateModule // <-- broken for the time-being with ASP.NET
	],
	bootstrap: [AppComponent],
})

export class AppModuleServer { }
