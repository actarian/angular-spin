import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injector, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { AuthService } from './auth';
import { CoreRouting } from './core.routing';
import { DisposableComponent } from './disposable';
import { ControlComponent, ControlService, FormService, MatchValidator } from './forms';
import { HighlightPipe } from './highlight';
import { HttpResponseInterceptor } from './http';
import { JsonFormatterComponent } from './json-formatter';
import { CustomMissingTranslationHandler, LabelPipe, LabelService } from './labels';
import { Logger } from './logger';
import { OnceService } from './once';
import { PageComponent, PageHosterComponent, PageService, Pages } from './pages';
import { FacebookService, GoogleService, MapboxService } from './plugins';
import { AssetPipe, PublicPipe, RoutePipe, SegmentPipe, SlugPipe } from './routes';
import { CookieStorageService, LocalStorageService, SessionStorageService, StorageService } from './storage';
import { TrustPipe } from './trust';
import { ClickOutsideDirective } from './ui';

// import { AuthService, AuthTokenInterceptor } from './auth';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TranslateModule.forChild({
			loader: { provide: TranslateLoader, useClass: LabelService, deps: [Injector] },
			missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler },
		}),
		CoreRouting,
	],
	exports: [
		TranslatePipe, LabelPipe, AssetPipe, HighlightPipe, PublicPipe, RoutePipe, SegmentPipe, SlugPipe, MatchValidator, TrustPipe,
		ControlComponent, JsonFormatterComponent,
	],
	declarations: [
		PageHosterComponent, PageComponent, DisposableComponent, JsonFormatterComponent,
		LabelPipe, AssetPipe, HighlightPipe, PublicPipe, RoutePipe, SegmentPipe, SlugPipe, MatchValidator, TrustPipe,
		ControlComponent, ClickOutsideDirective
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true },
		TranslatePipe,
		LabelPipe,
		LabelService,
		AssetPipe,
		AuthService,
		HighlightPipe,
		CookieStorageService,
		LocalStorageService,
		SessionStorageService,
		StorageService,
		FacebookService,
		MapboxService,
		GoogleService,
		Logger,
		OnceService,
		PageService,
		PublicPipe,
		RoutePipe,
		SegmentPipe,
		ControlService,
		FormService,
		TrustPipe,
	],
})

export class CoreModule {
	constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
		if (parentModule) {
			throw new Error('CoreModule is already loaded. Import it in the AppModule only');
		}
	}

	public static forRoot(config: any): ModuleWithProviders {
		return {
			ngModule: CoreModule,
			providers: [
				{ provide: Pages, useValue: config ? config : {} }
			]
		};
	}
}
