import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { RouteService } from '../../core/routes';
import { Region, RegionService } from '../../models';

@Component({
	selector: 'app-region-search',
	templateUrl: './region-search.component.html',
	styleUrls: ['./region-search.component.scss']
})

export class RegionSearchComponent implements OnInit {
	regions$: Observable<Region[]>;

	private searchByName = new Subject<string>();

	constructor(
		private regionService: RegionService,
		public routeService: RouteService,
	) { }

	// Push a search term into the observable stream.
	search(name: string): void {
		this.searchByName.next(name);
	}

	ngOnInit(): void {
		this.regions$ = this.searchByName.pipe(
			// wait 300ms after each keystroke before considering the term
			debounceTime(300),

			// ignore new term if same as previous term
			distinctUntilChanged(),

			// switch to new search observable each time the term changes
			switchMap((name: string) => this.regionService.getDetailByName(name)),
		);
	}
}
