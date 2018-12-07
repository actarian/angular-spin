import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injector, ModuleWithProviders, NgModule, Optional, SkipSelf, Type } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { MarkdownModule, MarkedOptions } from 'ngx-markdown';
import { ControlEditableComponent } from '../forms';
import { AuthService } from './auth';
import { CoreRouting } from './core.routing';
import { DisposableComponent } from './disposable';
import { EditorComponent } from './editor';
import { ControlComponent, ControlService, ExistsValidator, FormService, MatchValidator } from './forms';
import { HighlightPipe } from './highlight';
import { HttpResponseInterceptor } from './http';
import { JsonFormatterComponent } from './json-formatter';
import { CustomMissingTranslationHandler, LabelAsyncPipe, LabelDirective, LabelPipe, LabelService } from './labels';
import { Logger, LoggerComponent } from './logger';
import { EventDispatcherService } from './models/event-dispatcher.service';
import { MenuService } from './models/menu.service';
import { OnceService } from './once';
import { DefaultPage, NotFoundPage, PageComponent, PageGuard, PageNotFoundComponent, PageOutletComponent, Pages, PageService, StaticGuard } from './pages';
import { AssetPipe, CustomAsyncPipe, ImagePipe, PublicPipe, SegmentPipe } from './pipes';
import { FacebookService, GoogleService, GoogleTagManagerComponent, GoogleTagManagerService, MapboxService, PayPalService, PayPalWidgetComponent, TrustPilotService, TrustPilotWidgetComponent } from './plugins';
import { RoutePipe } from './routes';
import { SlugAsyncPipe, SlugPipe } from './slugs';
import { CookieStorageService, LocalStorageService, SessionStorageService, StorageService } from './storage';
import { SafeStylePipe, SafeUrlPipe, TrustPipe } from './trust';
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
		MarkdownModule.forRoot({
			markedOptions: {
				provide: MarkedOptions,
				useValue: {
					/*
					gfm: true,
					tables: true,
					breaks: true,
					pedantic: true,
					sanitize: true,
					smartLists: true,
					smartypants: true,
					*/
				},
			},
		}),
		CoreRouting,
	],
	declarations: [
		PageOutletComponent, PageComponent, PageNotFoundComponent, DisposableComponent,
		AssetPipe, CustomAsyncPipe, ImagePipe, HighlightPipe, LabelAsyncPipe, LabelPipe, PublicPipe, RoutePipe, SegmentPipe, SlugPipe, SlugAsyncPipe, ExistsValidator, MatchValidator, TrustPipe, SafeStylePipe, SafeUrlPipe,
		EditorComponent,
		ControlComponent, ControlEditableComponent, JsonFormatterComponent, LoggerComponent,
		ModalContainerComponent, ModalViewComponent,
		GoogleTagManagerComponent, PayPalWidgetComponent, TrustPilotWidgetComponent,
		ClickOutsideDirective, FancyboxDirective, LabelDirective, LazyImagesDirective,
	],
	exports: [
		TranslatePipe, AssetPipe, CustomAsyncPipe, ImagePipe, HighlightPipe, LabelAsyncPipe, LabelPipe, PublicPipe, RoutePipe, SegmentPipe, SlugPipe, SlugAsyncPipe, ExistsValidator, MatchValidator, TrustPipe, SafeStylePipe, SafeUrlPipe,
		EditorComponent,
		ControlComponent, ControlEditableComponent, JsonFormatterComponent, LoggerComponent,
		GoogleTagManagerComponent, PayPalWidgetComponent, TrustPilotWidgetComponent,
		ModalContainerComponent, ModalViewComponent,
		ClickOutsideDirective, FancyboxDirective, LabelDirective, LazyImagesDirective,
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
		GoogleService,
		GoogleTagManagerService,
		MapboxService,
		PayPalService,
		TrustPilotService,
		Logger,
		OnceService,
		PageService,
		ControlService,
		FormService,
		ModalService,
		MenuService,
		EventDispatcherService,
		PageGuard, StaticGuard,
		// pipes
		TranslatePipe, LabelPipe, AssetPipe, CustomAsyncPipe, ImagePipe, HighlightPipe, PublicPipe, RoutePipe, SegmentPipe, SlugPipe, SlugAsyncPipe, ExistsValidator, MatchValidator, TrustPipe, SafeUrlPipe,
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

	public static forRoot(pages: any, defaultPage: Type<PageComponent> = null, notFoundPage: Type<PageComponent> = null): ModuleWithProviders {
		return {
			ngModule: CoreModule,
			providers: [
				{ provide: Pages, useValue: pages ? pages : {} },
				{ provide: DefaultPage, useValue: defaultPage ? defaultPage : null },
				{ provide: NotFoundPage, useValue: notFoundPage ? notFoundPage : PageNotFoundComponent }
			]
		};
	}
}
