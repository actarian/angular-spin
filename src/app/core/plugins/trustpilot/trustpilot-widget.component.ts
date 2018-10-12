import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import { ORIGIN_URL } from '@nguniversal/aspnetcore-engine/tokens';
import { takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../disposable';
import { TrustPilotConfig, TrustPilotService } from './trustpilot.service';

@Component({
	selector: 'trustpilot-widget-component',
	template: `
	<div class="trustpilot-comments">
		<div class="trustpilot-widget"
			[attr.data-template-id]="options.templateId"
			[attr.data-businessunit-id]="options.businessunitId"
			[attr.data-sku]="sku"
			[attr.data-locale]="'it-IT'"
			[attr.data-style-height]="'250px'"
			[attr.data-style-width]="'100%'"
			[attr.data-theme]="'light'"
			style="margin: 30px 0; max-width: 750px;">
			<a href="https://it.trustpilot.com/review/{{options.businessunitName}}" target="_blank">Trustpilot</a>
		</div>
	</div>`,
})

export class TrustPilotWidgetComponent extends DisposableComponent {

	@Input() sku: string;
	options: TrustPilotConfig;
	loaded: boolean;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		@Inject(ORIGIN_URL) private originUrl: string,
		private trustPilot: TrustPilotService,
	) {
		super();
		this.options = this.trustPilot.options;
		if (isPlatformBrowser(this.platformId)) {
			if (!this.loaded) {
				this.trustPilot.once().pipe(
					takeUntil(this.unsubscribe)
				).subscribe(Trustpilot => {
					this.loaded = true;
				});
			}
		}
	}

}
