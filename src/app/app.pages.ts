import { NgModule } from '@angular/core';
import { CoreModule } from './core/core.module';
import { Pages } from './core/pages';
import { CheckoutComponent, DestinationComponent, DestinationDetailComponent, GenericComponent, GiftCardComponent, HomeComponent, HotelComponent, LandingComponent, LeafletComponent, LeafletDetailComponent, SearchComponent, StructureComponent, SupportComponent, SurveyComponent } from './pages';
import { NewsletterComponent } from './pages/newsletter';
import { NotFoundComponent } from './sections';

const pages: Pages = {
	'1': HomeComponent,
	'2': StructureComponent,
	'9': HotelComponent,
	'10': SearchComponent,
	'17': NewsletterComponent,
	'21': CheckoutComponent,
	'30': LandingComponent,
	'36': SupportComponent,
	'37': LeafletComponent,
	'38': GenericComponent,
	'44': GiftCardComponent,
	'45': LeafletDetailComponent,
	'49': SurveyComponent,
	'54': DestinationComponent,
	'55': DestinationDetailComponent,
};

@NgModule({
	imports: [CoreModule.forRoot(pages, GenericComponent, NotFoundComponent)],
	exports: [CoreModule]
})

export class AppPages { }
