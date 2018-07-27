
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import localeIt from '@angular/common/locales/it';
import { Injector, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { SwiperConfigInterface, SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';
// import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';
// import { PrebootModule } from 'preboot';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { SpinnerModule } from 'primeng/spinner';
import { AppComponent } from './app.component';
import { AppPages } from './app.pages';
import { AppRouting } from './app.routing';
import { AuthAttribute } from './core/guards';
import { CustomMissingTranslationHandler, LabelService } from './core/labels';
import { Logger } from './core/logger';
import { MemoryService } from './core/memory';
import { RouteService } from './core/routes';
import { CategoryService, DestinationService, FilterService, HotelService, PromotionService, RegionService, SearchService, TagService, WishlistService } from './models';
import { AuthComponent, AuthForgottenComponent, AuthSignInComponent, AuthSignUpComponent, SignComponent, SignForgottenComponent, SignInComponent, SignUpComponent } from './pages/auth';
import { HomeCategoriesComponent, HomeComponent, HomePromotionsComponent, HomeSearchComponent } from './pages/home';
import { HotelComponent, HotelDatepickerComponent, HotelFeaturePipe, HotelGalleryPipe, HotelTaxonomyPipe } from './pages/hotel';
import { ProfileComponent } from './pages/profile';
import { RegionDetailComponent, RegionsComponent } from './pages/regions';
import { SerpComponent, SerpFilterComponent, SerpItemComponent, SerpListComponent, SerpMapComponent } from './pages/serp';
import { FooterComponent, HeaderComponent, NotFoundComponent, RegionSearchComponent, SvgComponent, TrustPilotComponent, ValuePropositionComponent } from './sections';
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
		HttpClientModule,
		TransferHttpCacheModule,
		BrowserTransferStateModule,
		// PrebootModule.withConfig({ appRoot: 'app-component' }),
		FormsModule, ReactiveFormsModule,
		CalendarModule, DialogModule, SpinnerModule, GalleriaModule, AccordionModule, SwiperModule,
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
			apiBase: 'api/', passThruUnknownUrl: true, dataEncapsulation: false, delay: 0
		}),
	],
	declarations: [
		AppComponent,
		HeaderComponent, FooterComponent, NotFoundComponent, SvgComponent,
		AuthComponent, AuthForgottenComponent, AuthSignInComponent, AuthSignUpComponent,
		SignComponent, SignForgottenComponent, SignInComponent, SignUpComponent, ProfileComponent,
		HomeComponent, HomeCategoriesComponent, HomePromotionsComponent, HomeSearchComponent,
		SerpComponent, SerpItemComponent, SerpListComponent, SerpMapComponent,
		HotelComponent, HotelDatepickerComponent, HotelTaxonomyPipe, HotelGalleryPipe, HotelFeaturePipe,
		RegionsComponent, RegionDetailComponent, RegionSearchComponent,
		MainSearchComponent, DestinationTypePipe, DestinationHintComponent, SerpFilterComponent, TrustPilotComponent, ValuePropositionComponent,
	],
	providers: [
		{ provide: LOCALE_ID, useValue: 'it' },
		{ provide: SWIPER_CONFIG, useValue: DEFAULT_SWIPER_CONFIG },
		// { provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true },
		AuthAttribute,
		Logger, TranslateService, RouteService,
		DestinationTypePipe, HotelTaxonomyPipe, HotelGalleryPipe, HotelFeaturePipe, SearchService, RegionService, CategoryService, PromotionService, FilterService, WishlistService, DestinationService, TagService, HotelService,
		// { provide: RouteService, useClass: RouteService, deps: [TranslateService, Location, Router] },
	],
	entryComponents: [
		AuthComponent, AuthForgottenComponent, AuthSignInComponent, AuthSignUpComponent,
		SignComponent, SignForgottenComponent, SignInComponent, SignUpComponent,
		HomeComponent, HotelComponent, ProfileComponent, RegionDetailComponent, RegionsComponent, SerpComponent],
	bootstrap: [AppComponent]
})

export class AppModule {
	constructor(
		private injector: Injector
	) {
		RouteService.injector = this.injector;
	}
}
