import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'page-not-found-component',
	templateUrl: './page-not-found.component.html',
	styleUrls: ['./page-not-found.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class PageNotFoundComponent {

	public url: string;

	constructor(
		private router: Router
	) {
		this.url = router.url;
	}

}
