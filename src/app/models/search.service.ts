import { Location } from '@angular/common';
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { tap } from 'rxjs/operators';
import { EntityService } from '../core/models';
import { RouteService } from '../core/routes';
import { LocalStorageService, StorageService } from '../core/storage';
import { Destination, DestinationTypes } from './destination';
import { DestinationService } from './destination.service';
import { CalendarOption, Duration, MainSearch, SearchResult, durations } from './search';

@Injectable({
	providedIn: 'root',
})
export class SearchService extends EntityService<SearchResult> {

	get collection(): string {
		return 'searchResult';
	}

	model: MainSearch = new MainSearch();

	calendar: CalendarOption = new CalendarOption();

	destinations: Destination[];

	durations: Duration[] = durations;

	ages: number[] = new Array(18).fill(0).map((x, i) => i); // 0 - 17

	storage: StorageService;
	lastDestinations: Destination[];

	private results$ = new BehaviorSubject<SearchResult[]>([]);
	results = this.results$.asObservable();

	constructor(
		protected injector: Injector,
		@Inject(PLATFORM_ID) private platformId: string,
		private storageService: LocalStorageService,
		private location: Location,
		private router: Router,
		private routeService: RouteService,
		private destinationService: DestinationService
	) {
		super(injector);
		this.storage = this.storageService.tryGet();
		const search = this.storage.get('search');
		if (search) {
			this.model = search;
		}
		const lastDestinations = this.storage.get('lastDestinations');
		this.lastDestinations = lastDestinations || [];
		this.routeService.params
			// .take(1)
			.subscribe(model => {
				// console.log('SearchService.constructor', model);
				this.model = new MainSearch(model as MainSearch);
				this.onSearchIn();
			});
	}

	// DESSTINATION
	onDestinationQuery(query: string) {
		this.model.query = query;
		this.destinationService.autocomplete(query)
			// .takeUntil(this.unsubscribe)
			.debounceTime(200)
			.subscribe(x => {
				this.destinations = x;
			});
	}

	onDestinationSet(destination: Destination) {
		this.model.destination = destination;
		if (destination) {
			const previous: Destination = this.lastDestinations.find(x => x.name === destination.name);
			if (previous) {
				const index = this.lastDestinations.indexOf(previous);
				this.lastDestinations.splice(index, 1);
			}
			this.lastDestinations.unshift(destination);
			this.storage.set('lastDestinations', this.lastDestinations);
		}
	}

	onDestinationReset() {
		this.model.query = null;
		this.model.destination = null;
	}

	isDestinationEmpty() {
		return !this.model.query && !this.model.destination;
	}

	// START DATE
	onStartDateReset() {
		this.model.startDate = null;
	}

	isStartDateEmpty() {
		return !this.model.startDate;
	}

	// CHILDRENS
	onChildsChanged() {
		while (this.model.childrens.length < this.model.childs) {
			this.model.childrens.push({ age: 0 });
		}
		this.model.childrens.length = Math.min(this.model.childs, this.model.childrens.length);
	}

	// CERCA
	onSearch() {
		// console.log(this.model);
		const segments = this.routeService.toRoute(['/search']);
		segments.push(this.routeService.toParams(this.model));
		this.router.navigate(segments);
	}

	onSearchIn() {
		let params = '';
		if (this.model.destination) {
			switch (this.model.destination.type) {
				case DestinationTypes.Facility:
					params = `?name=${this.model.destination.name}`;
					break;
				case DestinationTypes.Country:
					params = `?destinationNation=${this.model.destination.name}`;
					break;
				case DestinationTypes.Region:
					params = `?destinationRegion=${this.model.destination.name}`;
					break;
				case DestinationTypes.Destination:
					params = `?destinationDescription=${this.model.destination.name}`;
					break;
				case DestinationTypes.Category:
					params = '';
					// params = `?destinationNation=${this.model.destination.name}`;
					break;
				case DestinationTypes.Promotion:
					params = '';
					// params = `?destinationNation=${this.model.destination.name}`;
					break;
			}
		}
		// console.log('SearchService.onSearchIn', params, this.model);
		this.get(params).pipe(
			tap(x => {
				console.log('SearchService.onSearchIn.tap', x[0]);
			})
		).subscribe(x => {
			this.results$.next(x);
			// console.log(this.model);
			const segments = this.routeService.toRoute(['/search']);
			segments.push(this.routeService.toParams(this.model));
			const path = this.router.serializeUrl(this.router.createUrlTree(segments));
			this.location.replaceState(path);
		});
		// this.get().subscribe(x => this.results$.next(x));
		// import {Location} from '@angular/common';
		// this.location.replaceState("/some/newstate/");
	}

}
