import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { takeUntil, tap } from 'rxjs/operators';
import { DisposableComponent, PageService } from '../../core';
import { UserService } from '../../models';

@Component({
	selector: 'reserved-area-component',
	templateUrl: './reserved-area.component.html',
	styleUrls: ['./reserved-area.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class ReservedAreaComponent extends DisposableComponent {

	constructor(
		private router: Router,
		private userService: UserService,
		private pageService: PageService,
	) {
		super();
		/*
		// !!!
		this.pageService.getPageBySlug('/area_riservata').pipe(
			first()
		).subscribe(page => {
			// console.log('ReservedAreaComponent', page);
			this.pageService.addOrUpdateMetaData(page);
		});
		*/
	}

	SignOut(): void {
		this.userService.signOut().pipe(
			takeUntil(this.unsubscribe),
			tap(x => this.router.navigate(['/']))
		).subscribe();
	}

}
