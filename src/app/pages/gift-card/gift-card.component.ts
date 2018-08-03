import { Component, ViewEncapsulation } from '@angular/core';
import { first, takeUntil } from 'rxjs/operators';
import { PageComponent, PageInit, RouteService } from '../../core';

@Component({
	selector: 'gift-card-component',
	templateUrl: './gift-card.component.html',
	styleUrls: ['./gift-card.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class GiftCardComponent extends PageComponent implements PageInit {

	constructor(
		protected routeService: RouteService
	) {
		super(routeService);
	}

	PageInit(): void {
		console.log('GiftCardComponent.PageInit', this.page);
		this.routeService.getPageParams().pipe(
			takeUntil(this.unsubscribe),
			first()
		).subscribe(params => {
			console.log('GiftCardComponent.params', params);
		});
	}

}
