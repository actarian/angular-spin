import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/takeUntil';
import { DisposableComponent } from '../../core/disposable';
import { Label } from '../../core/labels';
import { RouteService } from '../../core/routes';

@Component({
	selector: 'section-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})

export class HeaderComponent extends DisposableComponent implements OnInit {
	// public clock$: Observable<any>;
	public dropdown: boolean;
	public languages: any[];
	public currentLanguage: any;

	constructor(
		public routeService: RouteService
	) {
		super();
	}

	ngOnInit() {
		this.routeService.languages
			.takeUntil(this.unsubscribe)
			.subscribe(x => {
				// console.log('HeaderComponent.getLanguages', x);
				this.languages = x;
			});
		this.routeService.language
			.takeUntil(this.unsubscribe)
			.subscribe(x => {
				// console.log('HeaderComponent.getLanguage', x);
				this.currentLanguage = x;
			});
		/*
	this.routeService.clock
		.takeUntil(this.unsubscribe)
		.subscribe(x => this.clock$ = x);
		*/
	}

	setLanguage(language: Label) {
		console.log('HeaderComponent.setLanguage', language);
		const silent: boolean = true;
		this.routeService.setLanguage(language.lang, silent);
	}

}
