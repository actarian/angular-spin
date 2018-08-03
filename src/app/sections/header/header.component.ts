import { Component, OnInit, ViewEncapsulation, ElementRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core/disposable';
import { Label } from '../../core/labels';
import { RouteService } from '../../core/routes';
import { ModalCompleteEvent, ModalService } from '../../core/ui/modal';
import { AuthComponent } from '../../pages/auth/auth.component';

@Component({
	selector: 'section-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	// encapsulation: ViewEncapsulation.Emulated
	// encapsulation: ViewEncapsulation.Emulated is default
})

export class HeaderComponent extends DisposableComponent implements OnInit {
	// public clock$: Observable<any>;
	public dropdown: boolean;
	public languages: any[];
	public currentLanguage: any;
	public navToggle: boolean;
	public subnavActive: string;

	constructor(
		public routeService: RouteService,
		private modalService: ModalService,
	) {
		super();
	}

	ngOnInit() {
		this.routeService.languages.pipe(
			takeUntil(this.unsubscribe)
		).subscribe(x => {
			// console.log('HeaderComponent.getLanguages', x);
			this.languages = x;
		});
		this.routeService.language.pipe(
			takeUntil(this.unsubscribe)
		).subscribe(x => {
			// console.log('HeaderComponent.getLanguage', x);
			this.currentLanguage = x;
		});
		/*
	this.routeService.clock.pipe(
			takeUntil(this.unsubscribe)
		).subscribe(x => this.clock$ = x);
		*/
	}

	setLanguage(language: Label) {
		console.log('HeaderComponent.setLanguage', language);
		const silent: boolean = true;
		this.routeService.setLanguage(language.lang, silent);
	}

	onSign(): void {
		this.modalService.open({ component: AuthComponent }).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(e => {
			if (e instanceof ModalCompleteEvent) {
				console.log('signed');
			}
		});
	}

}
