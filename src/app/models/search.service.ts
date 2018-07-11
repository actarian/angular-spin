import { Location } from '@angular/common';
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { debounceTime, tap } from 'rxjs/operators';
import { EntityService } from '../core/models';
import { RouteService } from '../core/routes';
import { LocalStorageService, StorageService } from '../core/storage';
import { Destination, DestinationTypes } from './destination';
import { DestinationService } from './destination.service';
import { Group, Sorting } from './filter';
import { FilterService } from './filter.service';
import { CalendarOption, Duration, durations, MainSearch, SearchResult } from './search';

@Injectable({
	providedIn: 'root',
})
export class SearchService extends EntityService<SearchResult> {

	get collection(): string {
		return '/api/searchResult';
	}

	calendar: CalendarOption = new CalendarOption();

	destinations: Destination[];

	durations: Duration[] = durations;

	ages: number[] = new Array(18).fill(0).map((x, i) => i); // 0 - 17

	storage: StorageService;
	lastDestinations: Destination[];

	maxVisibleItems: number = 20;
	visibleItems: number = this.maxVisibleItems;

	model: MainSearch = new MainSearch();
	private model$ = new BehaviorSubject<MainSearch>(this.model);

	private results$ = new BehaviorSubject<SearchResult[]>([]);
	results = this.results$.asObservable();

	resultsFiltered$ = new BehaviorSubject<SearchResult[]>([]);

	constructor(
		protected injector: Injector,
		@Inject(PLATFORM_ID) private platformId: string,
		private storageService: LocalStorageService,
		private location: Location,
		private router: Router,
		private routeService: RouteService,
		private destinationService: DestinationService,
		private filterService: FilterService,
	) {
		super(injector);
		this.storage = this.storageService.tryGet();
		const search = this.storage.get('search');
		if (search) {
			this.model = new MainSearch(search as MainSearch);
			this.model$.next(this.model);
		}
		const lastDestinations = this.storage.get('lastDestinations');
		this.lastDestinations = lastDestinations || [];
		this.routeService.params
			// .take(1)
			.subscribe(model => {
				// console.log('SearchService.constructor', model);
				this.model = new MainSearch(model as MainSearch);
				this.model$.next(this.model);
				this.onSearchIn();
			});
		this.beginObserveModel();
		this.beginObserveResults();
	}

	// RESULTS
	private beginObserveResults() {
		combineLatest(this.filterService.groups$, this.filterService.sortings$, this.results)
			.subscribe((data: any[]): void => {
				const groups: Group[] = data[0];
				const sorting: Sorting = data[1];
				let results: SearchResult[] = data[2];
				groups.forEach(group => group.clear());
				results.forEach(result => {
					result.visible = true;
					groups.forEach(group => {
						if (group.selected) {
							group.filter(result);
							result.visible = result.visible && group.matches[result.id];
						}
					});
				});
				results = results.filter(result => result.visible);
				switch (sorting.id) {
					case 1:
						results.sort((a, b) => a.advice - b.advice);
						break;
					case 2:
						results.sort((a, b) => a.price - b.price);
						break;
					case 3:
						results.sort((a, b) => b.price - a.price);
						break;
				}
				this.resultsFiltered$.next(results);
				// const sliced = results.slice(0, Math.min(this.visibleItems, results.length));
				this.filterService.onUpdateGroups(groups, results);
				this.visibleItems = this.maxVisibleItems;
				this.doUpdateLocation();
			});
	}

	private beginObserveModel() {
		// todo check deep comparison // .distinctUntilChanged((a, b) => a.destination === b.destination).
		this.model$.subscribe(model => {
			let params = '';
			if (model.destination) {
				switch (model.destination.type) {
					case DestinationTypes.Facility:
						params = `?name=${model.destination.name}`;
						break;
					case DestinationTypes.Country:
						params = `?destinationNation=${model.destination.name}`;
						break;
					case DestinationTypes.Region:
						params = `?destinationRegion=${model.destination.name}`;
						break;
					case DestinationTypes.Destination:
						params = `?destinationDescription=${model.destination.name}`;
						break;
					case DestinationTypes.Category:
						params = '';
						// params = `?destinationNation=${model.destination.name}`;
						break;
					case DestinationTypes.Promotion:
						params = '';
						// params = `?destinationNation=${model.destination.name}`;
						break;
				}
			}
			// console.log('SearchService.onSearchIn', params, model);
			this.get(params).pipe(
				tap(x => {
					// console.log('SearchService.onSearchIn.tap', x[0]);
				})
			).subscribe(x => {
				this.results$.next(x);
			});
			// this.get().subscribe(x => this.results$.next(x));
			// import {Location} from '@angular/common';
			// this.location.replaceState("/some/newstate/");
		});
	}

	private doUpdateLocation() {
		// console.log(this.model);
		const segments = this.routeService.toRoute(['/search']);
		segments.push(this.routeService.toParams(this.model));
		const path = this.router.serializeUrl(this.router.createUrlTree(segments));
		this.location.replaceState(path);
	}

	// DESTINATION
	onDestinationQuery(query: string) {
		this.model.query = query;
		this.destinationService.autocomplete(query).pipe(
			// takeUntil(this.unsubscribe)
			debounceTime(200)
		).subscribe(x => {
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
		this.model$.next(this.model);

	}

}
