import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Label } from '../../core/labels';
import { RouteService } from '../../core/routes';

@Component({
	selector: 'section-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {

	dropdown: boolean;
	languages: Label[];
	currentLanguage: Label;

	constructor(
		private translateService: TranslateService,
		private routeService: RouteService,
	) {
		console.log('HeaderComponent', this.routeService);
	}

	ngOnInit() {
		// console.log('HeaderComponent', this.translateService, this.translateService.currentLang);
		this.languages = this.translateService.store.langs.map((x: string, i: number) => {
			return {
				id: i + 1,
				name: x,
				lang: x,
			}
		})
		this.currentLanguage = {
			id: 1,
			name: this.translateService.currentLang,
			lang: this.translateService.currentLang,
		}
	}

	setLanguage(language: Label) {
		// console.log('setLanguage', language);
		this.currentLanguage = language;
		this.translateService.use(language.lang);
	}

}
