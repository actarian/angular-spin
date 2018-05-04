import { NgModule, Optional, SkipSelf, Type, ModuleWithProviders } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { CoreRouting } from './core.routing';
import { PageConfig, PageService, PageComponent, PageHosterComponent } from './pages';

// import { IdentityService, EntityService } from './models';
// import { Logger, LoggerComponent } from './logger';
// import { MemoryService } from './memory';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CoreRouting
	],
	declarations: [
		PageHosterComponent, PageComponent,
	],
	providers: [
		PageService, // IdentityService, EntityService, Logger, MemoryService,
	],
})

export class CoreModule {

	constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
		if (parentModule) {
			throw new Error('CoreModule is already loaded. Import it in the AppModule only');
		}
	}

	public static forRoot(pages: any): ModuleWithProviders {
		const corePages = new PageConfig(pages);
		return {
			ngModule: CoreModule,
			providers: [
				{ provide: PageConfig, useValue: corePages }
			]
		};
	}

}
