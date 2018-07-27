import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { Pages } from './core/pages';
import { HomeComponent, HotelComponent, ProfileComponent, PaymentComponent, RegionDetailComponent, RegionsComponent, SerpComponent, SignComponent, SignForgottenComponent, SignInComponent, SignUpComponent } from './pages';

const pages: Pages = {
	'1': HomeComponent,
	SerpComponent: SerpComponent,
	'9': HotelComponent,
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

