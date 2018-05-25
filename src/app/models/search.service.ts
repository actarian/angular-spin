import { Inject, Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { map } from 'rxjs/operators';
import { EntityService } from '../core/models';
import { RouteService } from '../core/routes';
import { LocalStorageService, StorageService } from '../core/storage';
import { Destination } from './destination';
import { DestinationService } from './destination.service';
import { SearchResult } from './search-result';

export class Duration {
	id: number;
	name: string;
}

const durations: Duration[] = [
	{ id: 1, name: 'Qualsiasi durata' },
	{ id: 2, name: '1-3 notti' },
	{ id: 3, name: '4-6 notti' },
	{ id: 4, name: '7 notti' },
	{ id: 5, name: '8-13 notti' },
	{ id: 6, name: '14 notti o più' }
];

export class MainSearch {
	query?: string;
	destination?: Destination;
	startDate?: Date;
	flexibleDates: boolean = false;
	duration: Duration = durations[0];
	adults: number = 2;
	childs: number = 0;
	childrens: any[] = [];

	constructor(options?: MainSearch) {
		if (options) {
			this.query = options.query || null;
			this.destination = options.destination as Destination;
			this.startDate = options.startDate ? new Date(options.startDate) : null;
			this.flexibleDates = !options.flexibleDates;
			this.duration = options.duration ? durations.find(x => x.id === options.duration.id) : durations[0];
			this.adults = options.adults || 2;
			this.childs = options.childs || 0;
			this.childrens = options.childrens || [];
		}
	}
}

export class CalendarOption {
	it: any = {
		firstDayOfWeek: 1,
		dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
		dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Giov', 'Ven', 'Sab'],
		dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
		monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
		dateFormat: 'dd/mm/yy',
		monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
		today: 'Oggi',
		clear: 'Resetta'
	};
	minDate: Date;
	maxDate: Date;
	minYear: number;
	maxYear: number;
	active: string;

	constructor() {
		this.minDate = new Date();
		this.maxDate = new Date();
		this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
		this.minYear = this.minDate.getFullYear();
		this.maxYear = this.maxDate.getFullYear();
	}
}

@Injectable()
export class SearchService extends EntityService<SearchResult> {

	model: MainSearch = new MainSearch();

	calendar: CalendarOption = new CalendarOption();

	destinations: Destination[];

	durations: Duration[] = durations;

	ages: number[] = new Array(18).fill(0).map((x, i) => i); // 0 - 17

	storage: StorageService;
	lastDestinations: Destination[];

	constructor(
		protected injector: Injector,
		@Inject(PLATFORM_ID) private platformId: string,
		private storageService: LocalStorageService,
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
			.take(1)
			.subscribe(model => {
				// console.log('SearchService.constructor', model);
				this.model = new MainSearch(model as MainSearch);
			});
		/*
		// TODO subscribe to routeService page params
		const params = this.route.params.concatMap(x => {
			return of(this.routeService.toData(x));
		});
		params.subscribe(model => {
			if (model) {
				console.log('SearchComponent.model', model);
				this.model = model;
			}
		});
		*/
	}

	get collection(): string {
		return 'searchResult';
	}

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
		const previous: Destination = this.lastDestinations.find(x => x.name === destination.name);
		if (previous) {
			const index = this.lastDestinations.indexOf(previous);
			this.lastDestinations.splice(index, 1);
		}
		this.lastDestinations.unshift(destination);
		this.storage.set('lastDestinations', this.lastDestinations);
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
		console.log(this.model);
		const segments = this.routeService.toRoute(['/search']);
		segments.push(this.routeService.toParams(this.model));
		this.router.navigate(segments);
	}

	onDestinationReset() {
		this.model.query = null;
		this.model.destination = null;
	}

	isDestinationEmpty() {
		return !this.model.query && !this.model.destination;
	}

	onStartDateReset() {
		this.model.startDate = null;
	}

	isStartDateEmpty() {
		return !this.model.startDate;
	}

	onSearchIn(params: Observable<MainSearch>): Observable<any[]> {
		return this.get().pipe(
			map((x: SearchResult[]) => {
				return x
					/*
					.map((x: SearchResult) => {
						return new SearchResult(x);
					})
					.filter((x: SearchResult) => {
						return x.name.toLowerCase().indexOf(query) !== -1 ||
							// x.texts.join(', ').toLowerCase().indexOf(query) !== -1;
							x.abstract.toLowerCase().indexOf(query) !== -1;
					})
					.sort((a, b) => a.type > b.type ? 1 : -1)
					*/
					;
			})
		);
	}

}
