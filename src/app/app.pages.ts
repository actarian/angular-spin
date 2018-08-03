import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { Pages } from './core/pages';
import { GenericComponent, GiftCardComponent, HomeComponent, HotelComponent, LandingComponent, PaymentComponent, ProfileComponent, RegionDetailComponent, RegionsComponent, SearchComponent, SerpComponent, SignComponent, SignForgottenComponent, SignInComponent, SignUpComponent } from './pages';

const pages: Pages = {
	'38': GenericComponent,
	'1': HomeComponent,
	'9': HotelComponent,
	'30': LandingComponent,
	'44': GiftCardComponent,
	'21': PaymentComponent,
	SearchComponent: SearchComponent,
	SerpComponent: SerpComponent,
	SignComponent: SignComponent,
	SignUpComponent: SignUpComponent,
	SignInComponent: SignInComponent,
	SignForgottenComponent: SignForgottenComponent,
	ProfileComponent: ProfileComponent,
	PaymentComponent: PaymentComponent,
	RegionDetailComponent: RegionDetailComponent,
	RegionsComponent: RegionsComponent
};

@NgModule({
	imports: [CoreModule.forRoot(pages)],
	exports: [CoreModule]
})

export class AppPages { }

