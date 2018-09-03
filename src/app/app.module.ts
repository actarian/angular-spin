
import { DatePipe, registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import LOCALE_IT from '@angular/common/locales/it';
import { Injector, LOCALE_ID, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { TransferHttpCacheModule } from '@nguniversal/common';
import { MissingTranslationHandler, TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { SwiperModule, SWIPER_CONFIG } from 'ngx-swiper-wrapper';
// import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';
// import { PrebootModule } from 'preboot';
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { SpinnerModule } from 'primeng/spinner';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppPages } from './app.pages';
import { AppRouting } from './app.routing';
import { AuthAttribute } from './core/guards';
import { CustomMissingTranslationHandler, LabelService } from './core/labels';
import { Logger } from './core/logger';
import { MemoryService } from './core/memory';
import { RouteService, SlugService } from './core/routes';
import { BookingService, CategoryService, DestinationService, FilterService, LandingService, PromotionService, RegionService, SearchService, TagService, UserGuard, UserResolve, UserService, WishlistService } from './models';
import { DataService } from './models/data.service';
import { OrderHistoryComponent, OrderDetailComponent, ProfileComponent, ReservedAreaComponent, WishlistComponent } from './pages';
import { AuthComponent, AuthForgottenComponent, AuthSignInComponent, AuthSignUpComponent, SignComponent, SignForgottenComponent, SignInComponent, SignUpComponent } from './pages/auth';
import { GenericComponent } from './pages/generic';
import { GiftCardComponent } from './pages/gift-card';
import { HomeCategoriesComponent, HomeComponent, HomePromotionsComponent, HomeSearchComponent } from './pages/home';
import { HotelComponent, HotelDatepickerComponent, HotelFeaturePipe, HotelGalleryPipe, HotelMapComponent, HotelTaxonomyPipe } from './pages/hotel';
import { LandingComponent } from './pages/landing';
import { PaymentComponent } from './pages/payment';
// import { ProfileComponent } from './pages/profile';
import { RegionDetailComponent, RegionsComponent } from './pages/regions';
import { SearchComponent } from './pages/search';
import { SerpComponent, SerpFilterComponent, SerpItemComponent, SerpListComponent, SerpMapComponent } from './pages/serp';
import { FooterComponent, HeaderComponent, NotFoundComponent, RegionSearchComponent, SvgComponent, TrustPilotComponent, ValuePropositionComponent } from './sections';
import { DestinationHintComponent, DestinationTypePipe, MainSearchComponent } from './sections/main-search';

registerLocaleData(LOCALE_IT, 'it');

@NgModule({
	imports: [
		BrowserModule.withServerTransition(environment.transition),
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
		HttpClientInMemoryWebApiModule.forRoot(MemoryService, environment.api),
	],
	declarations: [
		AppComponent,
		HeaderComponent, FooterComponent, NotFoundComponent, SvgComponent,
		AuthComponent, AuthForgottenComponent, AuthSignInComponent, AuthSignUpComponent,
		SignComponent, SignForgottenComponent, SignInComponent, SignUpComponent, PaymentComponent,
		GenericComponent, GiftCardComponent,
		HomeComponent, HomeCategoriesComponent, HomePromotionsComponent, HomeSearchComponent,
		SearchComponent, LandingComponent,
		SerpComponent, SerpItemComponent, SerpListComponent, SerpMapComponent,
		HotelComponent, HotelMapComponent, HotelDatepickerComponent, HotelTaxonomyPipe, HotelGalleryPipe, HotelFeaturePipe,
		RegionsComponent, RegionDetailComponent, RegionSearchComponent,
		MainSearchComponent, DestinationTypePipe, DestinationHintComponent, SerpFilterComponent, TrustPilotComponent, ValuePropositionComponent,
		ReservedAreaComponent, ProfileComponent, WishlistComponent, OrderHistoryComponent, OrderDetailComponent
	],
	providers: [
		{ provide: LOCALE_ID, useValue: environment.defaultLanguage },
		{ provide: SWIPER_CONFIG, useValue: environment.plugins.swiper },
		// { provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true },
		AuthAttribute,
		Logger, TranslateService, RouteService, SlugService, UserService,
		DatePipe, DestinationTypePipe, HotelTaxonomyPipe, HotelGalleryPipe, HotelFeaturePipe,
		UserGuard, UserResolve,
		DataService, LandingService, SearchService, RegionService, CategoryService, PromotionService, FilterService, WishlistService, DestinationService, TagService, BookingService,
		// { provide: RouteService, useClass: RouteService, deps: [TranslateService, Location, Router] },
	],
	entryComponents: [
		AuthComponent, AuthForgottenComponent, AuthSignInComponent, AuthSignUpComponent,
		SignComponent, SignForgottenComponent, SignInComponent, SignUpComponent,
		GenericComponent, GiftCardComponent,
		HomeComponent, HotelComponent,
		SearchComponent, LandingComponent,
		HotelMapComponent, PaymentComponent, RegionDetailComponent, RegionsComponent, SerpComponent],
	bootstrap: [AppComponent]
})

export class AppModule {
	constructor(
		private injector: Injector
	) {
		RouteService.injector = this.injector;
	}
}
