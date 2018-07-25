import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { Pages } from './core/pages';
import { HomeComponent, HotelComponent, ProfileComponent, RegionDetailComponent, RegionsComponent, SerpComponent, SignComponent, SignForgottenComponent, SignInComponent, SignUpComponent } from './pages';

const pages: Pages = {
<<<<<<< HEAD
	// HomeComponent: HomeComponent,
=======
>>>>>>> 6e4d1f497d1dd86c36d11555c878eb012ca75a12
	'1': HomeComponent,
	SerpComponent: SerpComponent,
	'9': HotelComponent,
	SignComponent: SignComponent,
	SignUpComponent: SignUpComponent,
	SignInComponent: SignInComponent,
	SignForgottenComponent: SignForgottenComponent,
	ProfileComponent: ProfileComponent,
	RegionDetailComponent: RegionDetailComponent,
	RegionsComponent: RegionsComponent
};

@NgModule({
	imports: [CoreModule.forRoot(pages)],
	exports: [CoreModule]
})

export class AppPages { }

