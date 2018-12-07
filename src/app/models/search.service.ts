import { isPlatformBrowser, Location } from '@angular/common';
import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { DefaultUrlSerializer, Params, Router } from '@angular/router';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, first, map, switchMap, tap } from 'rxjs/operators';
import { EntityService, EventDispatcherService, Option } from '../core/models';
import { RouteService } from '../core/routes';
import { LocalStorageService, StorageService } from '../core/storage';
import { CalendarOptions } from './calendar-options';
import { Destination, DestinationTypes } from './destination';
import { DestinationService } from './destination.service';
import { Group, GroupSelectionType, GroupType, Sorting } from './filter';
import { FilterService } from './filter.service';
import { GtmService } from './gtm.service';
import { Duration, durations, MainSearch, SearchResult } from './search';

const QUERY_ENABLED = true;

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
	model: MainSearch = new MainSearch();
	public model$ = new BehaviorSubject<MainSearch>(this.model);
	private results$ = new BehaviorSubject<SearchResult[]>(null);
	resultsFiltered$ = new BehaviorSubject<SearchResult[]>([]);
	queryParams: any;
	busy: boolean = false;
	totalResults: number;
	maxVisibleItems: number = 20;
	visibleItems: number = this.maxVisibleItems;

	constructor(
		@Inject(PLATFORM_ID) private platformId: string,
		protected injector: Injector,
		private routeService: RouteService,
		private storageService: LocalStorageService,
		private router: Router,
		private location: Location,
		private dispatcher: EventDispatcherService,
		private destinationService: DestinationService,
		private filterService: FilterService,
		private gtm: GtmService,
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
		this.results$.next(null);
		return combineLatest(this.filterService.groups$, this.filterService.sortings$, this.results$).pipe(
			filter((data: any[]) => {
				return data[0] !== null && data[1] !== null && data[2] !== null;
			}), // added for gtm
			map((data: any[]): SearchResult[] => {
				const groups: Group[] = data[0];
				const sorting: Sorting = data[1];
				const results: SearchResult[] = data[2];
				groups.forEach(group => {
					group.matches = {};
					group.selected = group.items.find(option => option.selected) !== undefined;
					group.items.forEach(option => option.count = 0);
				});
				results.forEach(result => {
					result.visible = true;
					groups.forEach(group => {
						if (group.selected) {
							let visible;
							group.matches[result.id] = false;
							if (group.selectionType === GroupSelectionType.Or) {
								visible = group.matches[result.id] = false;
								group.items.filter(x => x.selected).forEach(option => {
									if (!visible && group.match(result, option)) {
										visible = group.matches[result.id] = true;
									}
								});
							} else {
								visible = group.matches[result.id] = true;
								group.items.filter(x => x.selected).forEach(option => {
									if (visible && !group.match(result, option)) {
										visible = group.matches[result.id] = false;
									}
								});
							}
							group.matches[result.id] = visible;
							result.visible = result.visible && visible;
						} else {
							group.matches[result.id] = true;
						}
					});
				});
				const filteredResults = results.filter(result => result.visible);
				switch (sorting.id) {
					case 1:
						filteredResults.sort((a, b) => a.advice - b.advice);
						break;
					case 2:
						filteredResults.sort((a, b) => a.price - b.price);
						break;
					case 3:
						filteredResults.sort((a, b) => b.price - a.price);
						break;
				}
				this.filterService.onUpdateGroups(groups, filteredResults, results);
				this.doSerialize(this.model, groups, sorting);
				return filteredResults;
			}),
			distinctUntilChanged((a, b) => a.map(x => x.id).join(',') === b.map(x => x.id).join(',')), // added for gtm
			tap(filteredResults => {
				this.resultsFiltered$.next(filteredResults);
				this.visibleItems = this.maxVisibleItems;
				if (filteredResults.length) {
					this.gtm.onImpressions(filteredResults.slice(0, this.visibleItems));
					/*
					this.dispatcher.emit({
						type: 'onImpressions',
						data: { results: results, }
					});
					*/
				}
			})
		);
	}

	public viewMore(count: number = 20) {
		const filteredResults = this.resultsFiltered$.getValue();
		const from = Math.min(this.visibleItems, filteredResults.length - 1);
		const to = Math.min(this.visibleItems + count, filteredResults.length - 1);
		this.gtm.onImpressions(filteredResults.slice(from, to), 'Search Results', this.visibleItems);
		/*
		this.dispatcher.emit({
			type: 'onImpressions',
			data: { results: results, }
		});
		*/
		this.visibleItems += count;
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
			debounceTime(200),
			first(),
		).subscribe(x => {
			this.destinations = x;
		});
	}

	onDestinationTrySearch(query: string): Observable<Destination> {
		return this.destinationService.autocomplete(query).pipe(
			tap(items => this.destinations = items),
			switchMap(items => {
				if (items.length) {
					const exact = items.find(item => item.name.toLowerCase() === query.toLowerCase());
					if (exact) {
						return of(exact);
					} else {
						items = items.filter(item => item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1);
						return of(items.length ? items[0] : null);
					}
				}
				return of(null);
			})
		);
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
		this.model.startDate = this.model.startDate; // || new Date();
		this.queryParams = {};
		this.queryParams.search = this.routeService.serialize(this.model);
		this.filterService.onReset();
		this.model$.next(this.model);
		if (this.model.destination && this.model.destination.type === DestinationTypes.Hotel) {
			const segments = this.routeService.toRoute([this.model.destination.slug]);
			this.router.navigate(segments);
		} else {
			const segments = this.routeService.toRoute(['/search']);
			if (QUERY_ENABLED) {
				this.router.navigate(segments, { queryParams: this.queryParams });
			} else {
				this.router.navigate(segments);
			}
		}
	}

	onSearchIn(model) {
		this.doStoreDestination(model.destination);
		Object.assign(this.model, model);
		this.model.startDate = this.model.startDate; // || new Date();
		this.queryParams = {};
		this.queryParams.search = this.routeService.serialize(this.model);
		this.setParams(this.routeService.parseParams(this.queryParams));
		this.filterService.onReset();
		this.model$.next(this.model);
		if (this.model.destination && this.model.destination.type === DestinationTypes.Hotel) {
			const segments = this.routeService.toRoute([this.model.destination.slug]);
			this.router.navigate(segments);
		} else {
			this.doSearch();
		}
	}

	getResults(tags?: number[], landing: boolean = false): Observable<SearchResult[]> {
		const searchType: string = landing ? 'Landing' : 'Search';
		if (this.model.destination) {
			switch (this.model.destination.type) {
				case DestinationTypes.Category:
					this.gtm.onSearch(searchType, 'Categoria', this.model.destination.name, this.model.startDate, this.model.duration.name, this.model.adults, this.model.childs);
					break;
				case DestinationTypes.Promotion:
					this.gtm.onSearch(searchType, 'Promozione', this.model.destination.name, this.model.startDate, this.model.duration.name, this.model.adults, this.model.childs);
					this.filterService.onSet(this.model.destination.id, GroupType.Service);
					break;
				case DestinationTypes.Country:
					this.gtm.onSearch(searchType, 'Paese', this.model.destination.name, this.model.startDate, this.model.duration.name, this.model.adults, this.model.childs);
					break;
				case DestinationTypes.Region:
					this.gtm.onSearch(searchType, 'Regione', this.model.destination.name, this.model.startDate, this.model.duration.name, this.model.adults, this.model.childs);
					break;
				case DestinationTypes.Touristic:
					this.gtm.onSearch(searchType, 'Area Turistica', this.model.destination.name, this.model.startDate, this.model.duration.name, this.model.adults, this.model.childs);
					break;
				case DestinationTypes.Province:
					this.gtm.onSearch(searchType, 'Provincia', this.model.destination.name, this.model.startDate, this.model.duration.name, this.model.adults, this.model.childs);
					break;
				case DestinationTypes.Destination:
					this.gtm.onSearch(searchType, 'Località', this.model.destination.name, this.model.startDate, this.model.duration.name, this.model.adults, this.model.childs);
					break;
				case DestinationTypes.Hotel:
					this.gtm.onSearch(searchType, 'Struttura', this.model.destination.name, this.model.startDate, this.model.duration.name, this.model.adults, this.model.childs);
					break;
			}
		} else {
			this.gtm.onSearch(searchType, 'Nessuna', '', this.model.startDate, this.model.duration.name, this.model.adults, this.model.childs);
		}
		/*
		Paolo Zupin (email 30/11/2018)
		SearchType				Search; Filter, Menu
		searchTypology			[Search]   “Categoria”; “Promozione”; “Paese”; “Regione”; **Area Turistica**; “Provincia”; “Località”; “Struttura”; “Nessuna”;
								[Filter]   “Promozione”; **Destinazione**; **Aree turistiche**; “Provincia”; “Categoria”; “Stelle”; “Trattamento” ; **Servizi**; **Sistemazione**; -“Regione”; -“Paese”;
								[Menu]     “Categoria”; “Regione”; “Paese”; **Area Turistica**;
		searchTerm				'Abruzzo' 'Bimbo Gratis' 'Terme & Benessere etc...
		dateFrom				‘01-01-2018’
		travelTime				‘Qualsiasi durata’; ‘1-3 notti’; ‘4-6 notti’; ‘7 notti’; ‘8-13 notti’; ‘14 o più notti’.
		pax						(adulti + bambini)
		chld					Numero bambini
		*/
		return this.post('/api/booking/search/in', this.model.getPayload(tags)).pipe(
			// map((x: any) => this.toCamelCase(x)),
			map((x: any) => {
				return x ? x.map(o => SearchResult.newCompatibleSearchResult(o)) : [];
				/*
				.filter((x: SearchResult) => {
				if (!this.model.destination) {
					return true;
				}
				let has: boolean = false;
				switch (this.model.destination.type) {
					case DestinationTypes.Hotel:
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
				})
				*/
			}),
			/*
			tap((results: SearchResult[]) => {
				this.gtm.onImpressions(results);
				this.dispatcher.emit({
					type: 'onImpressions',
					data: { results: results, }
				});
			})
			*/
		);
	}

	doSearch(tags?: number[], landing: boolean = false) {
		this.busy = true;
		this.getResults(tags, landing).pipe(
			first(),
		).subscribe(x => {
			this.results$.next(x);
			this.totalResults = x.length;
			this.busy = false;
		});
	}

	public setViewParams(viewType) {
		if (isPlatformBrowser(this.platformId) && QUERY_ENABLED) {
			const url = this.router.url.split('?')[0];
			const queryParams = this.routeService.parseParams(this.queryParams);
			queryParams.viewType = viewType;
			this.queryParams = this.routeService.serializeParams(queryParams);
			/*
			this.router.navigate([url], {
				queryParams: this.queryParams
			});
			*/
			// console.log('setViewParams', this.queryParams);
			const replaceUrl: string = this.router.serializeUrl(this.router.createUrlTree([url], {
				queryParams: this.queryParams
			})); // , replaceUrl: true
			this.location.replaceState(replaceUrl);
			/*
			const goUrl: string = this.router.serializeUrl(this.router.createUrlTree([url], {
				queryParams: this.queryParams
			}));
			this.location.go(goUrl);
			*/
		}
	}

	private doSerialize(model: MainSearch, groups: Group[], sorting: Sorting) {
		if (isPlatformBrowser(this.platformId) && QUERY_ENABLED) {
			const url = this.router.url.split('?')[0];
			const filters = groups.filter(group => group.selected).map((group) => {
				return {
					type: group.type,
					items: group.items.filter(item => item.selected).map(item => {
						return { id: item.id } as Option;
					})
				} as Group;
			});
			this.queryParams = this.routeService.serializeParams({
				search: model,
				filters: filters,
				order: sorting ? sorting.id : null,
			});
			// if (filters.length || model.destination || model.startDate || model.adults !== 2 || model.childs > 0) {
			/*
			this.router.navigate([url], {
				queryParams: this.queryParams
			});
			*/
			const replaceUrl: string = this.router.serializeUrl(this.router.createUrlTree([url], {
				queryParams: this.queryParams
			})); // , replaceUrl: true
			this.location.replaceState(replaceUrl);
			// }
		}
	}

	public getPageParams(): Observable<Params> {
		if (this.queryParams) {
			return of(this.routeService.parseParams(this.queryParams));
		}
		const serializer = new DefaultUrlSerializer();
		const url = this.router.url;
		const queryParams = serializer.parse(url).queryParams;
		if (queryParams) {
			return of(this.routeService.parseParams(queryParams));
		} else {
			return of(null);
		}
		// return this.routeService.getPageParams();
	}

}
