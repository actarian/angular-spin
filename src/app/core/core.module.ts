import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injector, ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { ControlEditableComponent } from '../forms';
import { AuthService } from './auth';
import { CoreRouting } from './core.routing';
import { DisposableComponent } from './disposable';
import { ControlComponent, ControlService, FormService, MatchValidator } from './forms';
import { HighlightPipe } from './highlight';
import { HttpResponseInterceptor } from './http';
import { JsonFormatterComponent } from './json-formatter';
import { CustomMissingTranslationHandler, LabelPipe, LabelService } from './labels';
import { Logger, LoggerComponent } from './logger';
import { MenuService } from './models/menu.service';
import { OnceService } from './once';
import { PageComponent, PageOutletComponent, Pages, PageService } from './pages';
import { FacebookService, GoogleService, MapboxService } from './plugins';
import { GoogleTagManagerComponent } from './plugins/google/google-tag-manager.component';
import { AssetPipe, CustomAsyncPipe, ImagePipe, PublicPipe, RoutePipe, SegmentPipe, SlugAsyncPipe, SlugPipe } from './routes';
import { CookieStorageService, LocalStorageService, SessionStorageService, StorageService } from './storage';
import { SafeUrlPipe, TrustPipe } from './trust';
import { ClickOutsideDirective, FancyboxDirective, LazyImagesDirective } from './ui';
import { ModalContainerComponent, ModalService, ModalViewComponent } from './ui/modal';

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
	declarations: [
		PageOutletComponent, PageComponent, DisposableComponent,
		LabelPipe, AssetPipe, CustomAsyncPipe, ImagePipe, HighlightPipe, PublicPipe, RoutePipe, SegmentPipe, SlugPipe, SlugAsyncPipe, MatchValidator, TrustPipe, SafeUrlPipe,
		ControlComponent, JsonFormatterComponent,
		ModalContainerComponent, ModalViewComponent, LoggerComponent, FancyboxDirective, ClickOutsideDirective, LazyImagesDirective, ControlEditableComponent, GoogleTagManagerComponent
	],
	exports: [
		TranslatePipe, LabelPipe, AssetPipe, CustomAsyncPipe, ImagePipe, HighlightPipe, PublicPipe, RoutePipe, SegmentPipe, SlugPipe, SlugAsyncPipe, MatchValidator, TrustPipe, SafeUrlPipe,
		ControlComponent, JsonFormatterComponent,
		ModalContainerComponent, ModalViewComponent, LoggerComponent, FancyboxDirective, ClickOutsideDirective, LazyImagesDirective, ControlEditableComponent, GoogleTagManagerComponent
	],
	providers: [
		{ provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true },
		LabelService,
		AuthService,
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
		ControlService,
		FormService,
		ModalService,
		MenuService,
		// pipes
		TranslatePipe, LabelPipe, AssetPipe, CustomAsyncPipe, ImagePipe, HighlightPipe, PublicPipe, RoutePipe, SegmentPipe, SlugPipe, SlugAsyncPipe, MatchValidator, TrustPipe, SafeUrlPipe,
	],
})

export class CoreModule {

	constructor(
		@Optional() @SkipSelf() parentModule: CoreModule
	) {
		if (parentModule) {
			throw new Error('CoreModule is already loaded. Import it in the AppModule only');
		}
	}

	public static forRoot(pages: any): ModuleWithProviders {
		return {
			ngModule: CoreModule,
			providers: [
				{ provide: Pages, useValue: pages ? pages : {} }
			]
		};
	}
}
