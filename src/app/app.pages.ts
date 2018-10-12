import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { Pages } from './core/pages';
import { CheckoutComponent, DestinationComponent, DestinationDetailComponent, GenericComponent, GiftCardComponent, HomeComponent, HotelComponent, LandingComponent, SearchComponent, SerpComponent, StructureComponent, SupportComponent } from './pages';
import { NewsletterComponent } from './pages/newsletter';

const pages: Pages = {
	'1': HomeComponent,
	'17': NewsletterComponent,
	'2': StructureComponent,
	'21': CheckoutComponent,
	'30': LandingComponent,
	'36': SupportComponent,
	'38': GenericComponent,
	'44': GiftCardComponent,
	'54': DestinationComponent,
	'55': DestinationDetailComponent,
	'9': HotelComponent,
	SearchComponent: SearchComponent,
	SerpComponent: SerpComponent,
};

@NgModule({
	imports: [CoreModule.forRoot(pages)],
	exports: [CoreModule]
})

export class AppPages { }

