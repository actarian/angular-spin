import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { finalize, first, takeUntil } from 'rxjs/operators';
import { PageComponent, PageInit, RouteService } from '../../core';
import { GtmService } from '../../models';
import { Newsletter, NewsletterService } from './newsletter.service';

@Component({
	selector: 'newsletter-component',
	templateUrl: './newsletter.component.html',
	styleUrls: ['./newsletter.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class NewsletterComponent extends PageComponent implements PageInit {

	model: Newsletter = new Newsletter();
	error: any;
	busy: boolean = false;
	submitted: boolean = false;
	sent: boolean = false;

	constructor(
		protected routeService: RouteService,
		private route: ActivatedRoute,
		private newsletterService: NewsletterService,
		private gtm: GtmService,
	) {
		super(routeService);
		const email = this.route.snapshot.params['email'];
		if (email !== 'undefined') {
			this.model.email = email;
		}
	}

	PageInit(): void {
		console.log('NewsletterComponent.PageInit', this.page);
		this.routeService.getPageParams().pipe(
			takeUntil(this.unsubscribe),
			first()
		).subscribe(params => {
			console.log('NewsletterComponent.params', params);
		});
	}

	onSubmit(): void {
		this.error = null;
		this.submitted = true;
		this.busy = true;
		this.newsletterService.subscribe(this.model).pipe(
			first(),
			finalize(() => this.busy = false),
		).subscribe(
			() => {
				this.sent = true;
				this.gtm.onEvent('newsletterSubscription');
			},
			error => {
				this.error = error;
				this.submitted = false;
			}
		);
	}

}
