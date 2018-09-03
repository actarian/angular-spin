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

	public fancyboxOptions: any = {
		selector: '[data-fancybox="gallery"]',
		loop: true,
		buttons: ['close'],
		thumbs: {
			autoStart: true
		},
		idleTime: 9999,
		btnTpl: {
			close: `<button data-fancybox-close class="fancybox-button fancybox-button--close" title="{{CLOSE}}">
						<svg viewBox="0 0 40 40">
							<use xlink:href="#ico-close"></use>
						</svg>
						<span>Torna all'offerta</span>
					</button>`,
			arrowLeft: `<a data-fancybox-prev class="fancybox-button fancybox-button--arrow_left" title="{{PREV}}" href="javascript:;"></a>`,
			arrowRight: `<a data-fancybox-next class="fancybox-button fancybox-button--arrow_right" title="{{NEXT}}" href="javascript:;"></a>`
		},
	};

	card: any = null;
	success: boolean = false;
	error: boolean = false;

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
