import { isPlatformBrowser, Location } from '@angular/common';
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { Params, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { debounceTime, map, tap } from 'rxjs/operators';
import { EntityService, Option } from '../core/models';
import { RouteService } from '../core/routes';
import { LocalStorageService, StorageService } from '../core/storage';
import { CalendarOptions } from './calendar-options';
import { Destination, DestinationTypes } from './destination';
import { DestinationService } from './destination.service';
import { Group, GroupSelectionType, GroupType, Sorting } from './filter';
import { FilterService } from './filter.service';
import { Duration, durations, MainSearch, SearchResult } from './search';

@Injectable({
	providedIn: 'root',
})
export class SearchService extends EntityService<SearchResult> {

	get collection(): string {
		return ''; // '/api/searchResult';
	}

	calendar: CalendarOptions = new CalendarOptions();
	destinations: Destination[];
	durations: Duration[] = durations;
	ages: number[] = new Array(18).fill(0).map((x, i) => i); // 0 - 17
	storage: StorageService;
	lastDestinations: Destination[];
	maxVisibleItems: number = 20;
	visibleItems: number = this.maxVisibleItems;
	model: MainSearch = new MainSearch();
	public model$ = new BehaviorSubject<MainSearch>(this.model);
	private results$ = new BehaviorSubject<SearchResult[]>([]);
	results = this.results$.asObservable();
	resultsFiltered$ = new BehaviorSubject<SearchResult[]>([]);
	queryParams: any;
	busy: boolean = false;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		protected injector: Injector,
		private routeService: RouteService,
		private storageService: LocalStorageService,
		private router: Router,
		private location: Location,
		private destinationService: DestinationService,
		private filterService: FilterService,
	) {
		super(injector);
		this.storage = this.storageService.tryGet();
		/*
		const search = this.storage.get('search');
		if (search) {
			this.model = new MainSearch(search as MainSearch);
			this.model$.next(this.model);
		}
		*/
		const lastDestinations = this.storage.get('lastDestinations');
		this.lastDestinations = lastDestinations || [];
	}
	// RESULTS
	public connect(): Observable<SearchResult[]> {
		return combineLatest(this.filterService.groups$, this.filterService.sortings$, this.results).pipe(
			map((data: any[]): SearchResult[] => {
				const groups: Group[] = data[0];
				const sorting: Sorting = data[1];
				let results: SearchResult[] = data[2];
				groups.forEach(group => {
					// group.clear();
					group.matches = {};
					group.selected = group.items.find(option => option.selected) !== undefined;
					group.items.forEach(option => option.count = 0);
				});
				results.forEach(result => {
					result.visible = true;
					groups.forEach(group => {
						if (group.selected) {
							// group.filter(result);
							let visible = true;
							group.matches[result.id] = false;
							group.items.forEach(option => {
								if (option.selected) {
									let match = group.match(result, option);
									if (group.selectionType === GroupSelectionType.Multiple) {
										match = match || group.matches[result.id];
									}
									group.matches[result.id] = match;
									visible = visible && match;
								}
							});
							result.visible = result.visible && visible;
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
				this.filterService.onUpdateGroups(groups, results);
				this.visibleItems = this.maxVisibleItems;
				this.doSerialize(this.model, groups, sorting);
				return results;
			})
		);
	}

	public setParams(params: Params) {
		if (params.search) {
			this.model = new MainSearch(params.search as MainSearch);
			this.model$.next(this.model);
		}
		this.filterService.setParams(params);
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

	doStoreDestination(destination: Destination) {
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

	onSearch(model) {
		this.doStoreDestination(model.destination);
		Object.assign(this.model, model);
		this.model.startDate = this.model.startDate || new Date();
		this.queryParams = this.queryParams || {};
		this.queryParams.search = JSON.stringify(this.model);
		this.model$.next(this.model);
		if (this.model.destination && this.model.destination.type === DestinationTypes.Facility) {
			console.log('SearchService.onSearch DestinationTypes.Facility ->', this.model.destination.slug);
			const segments = this.routeService.toRoute([this.model.destination.slug]);
			this.router.navigate(segments);
		} else {
			const segments = this.routeService.toRoute(['/search']);
			this.router.navigate(segments, { queryParams: this.queryParams });
		}
	}

	onSearchIn(model) {
		this.doStoreDestination(model.destination);
		Object.assign(this.model, model);
		this.model.startDate = this.model.startDate || new Date();
		this.queryParams = this.queryParams || {};
		this.queryParams.search = JSON.stringify(this.model);
		this.setParams(this.routeService.parseParams(this.queryParams));
		this.filterService.onReset();
		this.model$.next(this.model);
		this.doSearch();
	}

	getResults(): Observable<SearchResult[]> {
		let params = '';
		if (this.model.destination) {
			switch (this.model.destination.type) {
				/*
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
					*/
				case DestinationTypes.Promotion:
					params = '';
					// params = `?destinationNation=${this.model.destination.name}`;
					this.filterService.onSet(this.model.destination.id, GroupType.Service);
					break;
			}
		}
		// !!!
		this.model.duration = null;
		return this.post('/api/booking/search/in', this.model).pipe(
			map((x: any) => this.toCamelCase(x)),
			map((x: any) => x.map(o => SearchResult.newCompatibleSearchResult(o)).filter((x: SearchResult) => {
				if (!this.model.destination) {
					return true;
				}
				let has: boolean = false;
				switch (this.model.destination.type) {
					case DestinationTypes.Facility:
						has = x.name === this.model.destination.name;
						break;
					case DestinationTypes.Country:
						has = x.destinationNation === this.model.destination.name;
						break;
					case DestinationTypes.Region:
						has = x.destinationRegion === this.model.destination.name;
						break;
					case DestinationTypes.Destination:
						has = x.destinationDescription === this.model.destination.name;
						break;
					case DestinationTypes.Category:
					case DestinationTypes.Promotion:
						has = true;
						break;
				}
				return has;
			})),
		);
	}

	doSearch() {
		this.busy = true;
		this.getResults().subscribe(x => {
			this.results$.next(x);
			this.busy = false;
		});
	}

	private doSerialize(model: MainSearch, groups: Group[], sorting: Sorting) {
		if (isPlatformBrowser(this.platformId)) {
			// console.log(this.model);
			const url = this.router.url.split('?')[0];
			const filters = groups.filter(group => group.selected).map((group) => {
				return {
					type: group.type,
					items: group.items.filter(item => item.selected).map(item => {
						return { id: item.id } as Option;
					})
				} as Group;
			});
			this.queryParams = {
				search: JSON.stringify(model),
				filters: JSON.stringify(filters),
				order: sorting ? sorting.id : null,
			};
			/*
			this.router.navigate([url], {
				queryParams: this.queryParams, replaceUrl: true
			});
			*/
			const replaceUrl: string = this.router.serializeUrl(this.router.createUrlTree([url], {
				queryParams: this.queryParams, replaceUrl: true
			}));
			this.location.replaceState(replaceUrl);
			// this.routeService.toRoute
			/*
			// Set our navigation extras object
			// that contains our global query params and fragment
			let navigationExtras = {
			queryParams: { 'session_id': sessionId },
			fragment: 'anchor'
			};
			// Navigate to the login page with extras
			this.router.navigate(['/login'], navigationExtras);
			*/
		}
	}

	// rimovibile
	private beginObserveModel() {
		// todo check deep comparison // .distinctUntilChanged((a, b) => a.destination === b.destination).
		this.model$.subscribe(model => {
			// console.log('model.destination', model.destination);
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
						// this.filterService.onSet(model.destination.id, GroupType.Service);
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

}
