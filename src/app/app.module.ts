
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
import { AccordionModule } from 'primeng/accordion';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { GalleriaModule } from 'primeng/galleria';
import { SpinnerModule } from 'primeng/spinner';
import { TabViewModule } from 'primeng/tabview';
import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppPages } from './app.pages';
import { AppRouting } from './app.routing';
import { AuthGuard } from './core/auth';
import { CustomMissingTranslationHandler, LabelService } from './core/labels';
import { Logger } from './core/logger';
import { MemoryService } from './core/memory';
import { RouteService } from './core/routes';
import { SlugService } from './core/slugs';
import { BookingService, CartResolve, CartService, CategoryService, DestinationService, FilterService, GiftCardService, GtmService, LandingService, LastViewsService, OrderService, SearchService, TagService, UserGuard, UserResolve, UserService, WishlistService } from './models';
import { AgeValidator } from './models/age.validator';
import { DataService } from './models/data.service';
import { UserExistsValidator } from './models/user-exists.validator';
import { OrderDetailComponent, OrderHistoryComponent, OrderHistoryItemComponent, ProfileComponent, ReservedAreaComponent, WishlistComponent } from './pages';
import { AuthComponent, AuthForgottenComponent, AuthSignInComponent, AuthSignUpComponent } from './pages/auth';
import { CheckoutCanceledComponent, CheckoutComponent, CheckoutDataComponent, CheckoutPaxComponent, CheckoutPaymentComponent, CheckoutSuccessComponent, InputDateComponent } from './pages/checkout';
import { DestinationComponent, DestinationDetailComponent } from './pages/destination';
import { GenericComponent } from './pages/generic';
import { GiftCardComponent } from './pages/gift-card';
import { HomeCategoriesComponent, HomeComponent, HomeLastViewsComponent, HomeLastViewsItemComponent, HomePromotionsComponent, HomeSearchComponent, HomeSlideshowComponent } from './pages/home';
import { FeaturedHotelsComponent, FeaturedHotelsItemComponent, HotelBComponent, HotelComponent, HotelDatepickerComponent, HotelFeaturePipe, HotelGalleryPipe, HotelMapComponent, HotelPricePipe, HotelTaxonomyPipe, HotelVariantsComponent, HotelVariantsItemComponent } from './pages/hotel';
import { LandingBreadcrumbComponent, LandingComponent } from './pages/landing';
import { LeafletComponent, LeafletService } from './pages/leaflet';
import { NewsletterComponent } from './pages/newsletter';
import { OperatorComponent, OperatorService } from './pages/operator';
import { SearchComponent } from './pages/search';
import { SerpComponent, SerpFilterComponent, SerpItemComponent, SerpListComponent, SerpMapComponent } from './pages/serp';
import { StructureComponent, StructureService } from './pages/structure';
import { SupportComponent, SupportService } from './pages/support';
import { FooterComponent, HeaderComponent, NotFoundComponent, ShopReminderComponent, SvgComponent, TrustPilotComponent, ValuePropositionComponent } from './sections';
import { LoadingTransitionComponent } from './sections/loading-transition/loading-transition.component';
import { DestinationHintComponent, DestinationTypePipe, MainSearchComponent } from './sections/main-search';

registerLocaleData(LOCALE_IT, 'it');

@NgModule({
	imports: [
		BrowserModule.withServerTransition(environment.transition),
		HttpClientModule,
		TransferHttpCacheModule,
		BrowserTransferStateModule,
		FormsModule, ReactiveFormsModule,
		CalendarModule, TabViewModule, DialogModule, SpinnerModule, GalleriaModule, AccordionModule, SwiperModule,
		AppRouting,
		AppPages,
		TranslateModule.forRoot({
			loader: { provide: TranslateLoader, useClass: LabelService, deps: [Injector] },
			missingTranslationHandler: { provide: MissingTranslationHandler, useClass: CustomMissingTranslationHandler },
		}),
		// The HttpClientInMemoryWebApiModule module intercepts HTTP requests
		// and returns simulated server responses.
		// !!! Remove it when a real server is ready to receive requests.
		HttpClientInMemoryWebApiModule.forRoot(MemoryService, environment.memoryApi),
	],
	declarations: [
		AppComponent,
		HeaderComponent, FooterComponent, NotFoundComponent, ShopReminderComponent, SvgComponent,
		AuthComponent, AuthForgottenComponent, AuthSignInComponent, AuthSignUpComponent,
		InputDateComponent, CheckoutComponent, CheckoutCanceledComponent, CheckoutDataComponent, CheckoutPaxComponent, CheckoutPaymentComponent, CheckoutSuccessComponent,
		DestinationComponent, DestinationDetailComponent,
		GenericComponent,
		NewsletterComponent,
		GiftCardComponent,
		HomeComponent, HomeCategoriesComponent, HomePromotionsComponent, HomeSearchComponent, HomeLastViewsComponent, HomeLastViewsItemComponent, HomeSlideshowComponent,
		HotelComponent, HotelBComponent, HotelMapComponent, HotelDatepickerComponent, HotelTaxonomyPipe, HotelFeaturePipe, HotelGalleryPipe, HotelPricePipe, FeaturedHotelsComponent, HotelVariantsComponent, FeaturedHotelsItemComponent,
		LandingComponent, LandingBreadcrumbComponent,
		LeafletComponent,
		SearchComponent,
		SerpComponent, SerpItemComponent, SerpListComponent, SerpMapComponent,
		OperatorComponent, SupportComponent, StructureComponent,
		HotelVariantsItemComponent,
		MainSearchComponent, DestinationTypePipe, DestinationHintComponent, SerpFilterComponent, TrustPilotComponent, ValuePropositionComponent,
		ReservedAreaComponent, ProfileComponent, WishlistComponent, OrderHistoryComponent, OrderDetailComponent, OrderHistoryItemComponent,
		AgeValidator, UserExistsValidator,
		LoadingTransitionComponent,
	],
	providers: [
		{ provide: LOCALE_ID, useValue: environment.defaultLanguage },
		{ provide: SWIPER_CONFIG, useValue: environment.plugins.swiper },
		// { provide: HTTP_INTERCEPTORS, useClass: HttpResponseInterceptor, multi: true },
		AuthGuard,
		Logger, TranslateService, RouteService, SlugService, UserService,
		DatePipe, DestinationTypePipe, HotelTaxonomyPipe, HotelFeaturePipe, HotelGalleryPipe, HotelPricePipe, LeafletService, OperatorService, SupportService, StructureService,
		UserGuard, UserResolve, CartResolve,
		BookingService, CartService, CategoryService, DataService, DestinationService, FilterService, GiftCardService, GtmService, LandingService, LastViewsService, OrderService, SearchService, TagService, WishlistService,
		// { provide: RouteService, useClass: RouteService, deps: [TranslateService, Location, Router] },
	],
	entryComponents: [
		AuthComponent, AuthForgottenComponent, AuthSignInComponent, AuthSignUpComponent,
		CheckoutComponent,
		DestinationComponent, DestinationDetailComponent,
		GenericComponent,
		NewsletterComponent,
		GiftCardComponent,
		HomeComponent,
		HotelComponent,
		LeafletComponent,
		LandingComponent,
		OperatorComponent,
		SearchComponent,
		SupportComponent,
		StructureComponent,
		HotelMapComponent, SerpComponent],
	bootstrap: [AppComponent]
})

export class AppModule {
	constructor(
		private injector: Injector
	) {
		RouteService.injector = this.injector;
	}
}
