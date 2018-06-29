
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import { Injector, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { SwiperConfigInterface, SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';
import { PrebootModule } from 'preboot';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { GalleriaModule } from 'primeng/galleria';
import { SpinnerModule } from 'primeng/spinner';
import { AppComponent } from './app.component';
import { AppPages } from './app.pages';
import { AppRouting } from './app.routing';
import { AuthAttribute } from './core/guards';
import { CustomMissingTranslationHandler, LabelService } from './core/labels';
import { Logger, LoggerComponent } from './core/logger';
import { MemoryService } from './core/memory';
import { PageDirective } from './core/pages';
import { RouteService } from './core/routes';
import { ClickOutsideDirective } from './core/ui';
import { ControlEditableComponent } from './forms';
import { ProfileComponent, SignComponent, SignForgottenComponent, SignInComponent, SignUpComponent } from './pages';
import { HomeCategoriesComponent, HomeComponent, HomePromotionsComponent, HomeSearchComponent } from './pages/home';
import { FancyboxDirective, HotelComponent, HotelTagsPipe } from './pages/hotel';
import { RegionDetailComponent, RegionsComponent } from './pages/regions';
import { SerpComponent, SerpFilterComponent, SerpListComponent, SerpMapComponent } from './pages/serp';
import { FooterComponent, HeaderComponent, NotFoundComponent, RegionSearchComponent, SvgComponent, ValuePropositionComponent } from './sections';
import { DestinationHintComponent, DestinationTypePipe, MainSearchComponent } from './sections/main-search';

const DEFAULT_SWIPER_CONFIG: SwiperConfigInterface = {
	direction: 'horizontal',
	slidesPerView: 'auto',
	spaceBetween: 8,
	grabCursor: true,
	navigation: {
		nextEl: '.swiper-button-next',
		prevEl: '.swiper-button-prev',
	},
	// pagination: {
	// 	el: '.swiper-pagination',
	// 	type: 'bullets',
	// 	clickable: true
	// }
};

registerLocaleData(localeIt, 'it');

@NgModule({
	imports: [
		BrowserModule.withServerTransition({ appId: 'app' }),
		PrebootModule.withConfig({ appRoot: 'app-component' }),
		HttpClientModule, FormsModule, ReactiveFormsModule,
		CalendarModule, SpinnerModule, GalleriaModule, AccordionModule, NoopAnimationsModule, SwiperModule,
		// The HttpClientInMemoryWebApiModule module intercepts HTTP requests
		// and returns simulated server responses.
		// Remove it when a real server is ready to receive requests.
		AppRouting,
		AppPages,
		TranslateModule.forRoot({
			loader: { provide: TranslateLoader, useClass: LabelService, deps: [Injector] },
			missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler },
		}),
		HttpClientInMemoryWebApiModule.forRoot(MemoryService, {
			apiBase: 'api/', dataEncapsulation: false, delay: 0, passThruUnknownUrl: true
		}),
	],
	declarations: [
		AppComponent,
		SignComponent, SignForgottenComponent, SignInComponent, SignUpComponent, ProfileComponent,
		HomeComponent, HomeCategoriesComponent, HomePromotionsComponent, HomeSearchComponent,
		SerpComponent, SerpListComponent, SerpMapComponent,
		HotelComponent, HotelTagsPipe,
		RegionsComponent, RegionDetailComponent, RegionSearchComponent,
		HeaderComponent, DestinationHintComponent, FooterComponent, SerpFilterComponent, NotFoundComponent, SvgComponent, ValuePropositionComponent,
		ClickOutsideDirective, ControlEditableComponent, DestinationTypePipe, FancyboxDirective, MainSearchComponent, PageDirective, LoggerComponent
	],
	providers: [
		{ provide: LOCALE_ID, useValue: 'it' },
		{ provide: SWIPER_CONFIG, useValue: DEFAULT_SWIPER_CONFIG },
		// { provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true },
		AuthAttribute,
		Logger, TranslateService, RouteService,
		DestinationTypePipe, HotelTagsPipe,
		// { provide: RouteService, useClass: RouteService, deps: [TranslateService, Location, Router] },
	],
	entryComponents: [HomeComponent, HotelComponent, ProfileComponent, RegionDetailComponent, RegionsComponent, SerpComponent, SignComponent, SignForgottenComponent, SignInComponent, SignUpComponent],
	bootstrap: [AppComponent]
})

export class AppModule { }
