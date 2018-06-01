import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { Pages } from './core/pages';
import { HomeComponent, HotelComponent, ProfileComponent, RegionDetailComponent, RegionsComponent, SearchComponent, SignComponent, SignForgottenComponent, SignInComponent, SignUpComponent } from './pages';

const pages: Pages = {
	HomeComponent: HomeComponent,
	SearchComponent: SearchComponent,
	HotelComponent: HotelComponent,
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

