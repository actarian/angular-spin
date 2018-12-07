import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, HostListener, Inject, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { fromEvent, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core/disposable';
import { Destination, MainSearch, SearchService } from '../../models';

export enum SearchTab {
	None = 0,
	Destination = 1,
	Date = 2,
	Duration = 3,
	Adults = 4,
	Childs = 5,
}

@Component({
	selector: 'main-search',
	templateUrl: './main-search.component.html',
	styleUrls: ['./main-search.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	// changeDetection: ChangeDetectionStrategy.OnPush
})

export class MainSearchComponent extends DisposableComponent implements AfterViewInit {

	tab: SearchTab = SearchTab.None;
	tabs: any = SearchTab;
	model: MainSearch;
	query$: Observable<any>;
	@ViewChild('query') query;
	@ViewChild('searchLocation') searchLocation;
	@Input() useBreadcrumbs: boolean = false;
	@Output() doSearch: EventEmitter<any> = new EventEmitter();

	constructor(
		@Inject(DOCUMENT) private doc: any,
		private changeDetector: ChangeDetectorRef,
		public search: SearchService
	) {
		super();
		// cloniamo il modello per emettere la modifica solo al click sulla cta search
		this.search.model$.subscribe(model => {
			this.model = new MainSearch(model);
			this.model.query = this.model.destination ? this.model.destination.name : null;
		});
	}

	ngAfterViewInit() {
		this.query$ = fromEvent(this.query.nativeElement, 'keyup').pipe(
			debounceTime(250),
			map((event: any) => {
				return event.target.value; // input value
			}),
			distinctUntilChanged()
		);
		this.query$.pipe(
			takeUntil(this.unsubscribe)
		).subscribe(query => {
			if (!query || query.trim() === '') {
				return;
			}
			this.search.onDestinationQuery(query);
			this.changeDetector.markForCheck();
		});
	}

	@HostListener('document:keyup', ['$event'])
	onKeyup(e: KeyboardEvent) {
		switch (e.key) {
			case 'Enter':
			case 'Tab':
				if (this.tab === SearchTab.Destination) {
					const query: string = this.query.nativeElement.value;
					if (!query.trim()) {
						this.onTab();
					} else {
						this.onEnter(query);
					}
					// console.log('MainSearchComponent.document:keyup', query.trim());
				} else if (this.tab !== SearchTab.None) {
					this.onTab();
				}
				break;
		}
	}

	onEnter(query: string) {
		this.search.onDestinationTrySearch(query).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(item => {
			if (item) {
				this.model.destination = item;
				this.model.query = item.name;
				// console.log('MainSearchComponent.onEnter', item);
				this.onTab();
				// this.doSearch.emit(this.model);
			}
		});
	}

	onTab() {
		console.log('MainSearchComponent.onTab', this.tab);
		switch (this.tab) {
			case SearchTab.Destination:
				this.tab = SearchTab.Date;
				break;
			case SearchTab.Date:
				this.tab = SearchTab.Duration;
				break;
			case SearchTab.Duration:
				this.tab = SearchTab.Adults;
				break;
			case SearchTab.Adults:
				this.tab = SearchTab.Childs;
				break;
			case SearchTab.Childs:
				this.tab = SearchTab.Destination;
				break;
		}
	}

	onDestinationSet(item: Destination) {
		if (item) {
			this.model.destination = item;
			this.model.query = item.name;
			this.onTab();
		}
	}

	onDateSelected(event) {
		// console.log('onDateSelected', event);
		setTimeout(() => {
			this.onTab();
		}, 0);
	}

	onDurationSelected(event) {
		// console.log('onDurationSelected', event);
		this.tab = SearchTab.None;
	}

	onChildsChanged() {
		while (this.model.childrens.length < this.model.childs) {
			this.model.childrens.push({ age: 0 });
		}
		this.model.childrens.length = Math.min(this.model.childs, this.model.childrens.length);
	}

	onSubmit() {
		this.tab = SearchTab.None;
		this.doSearch.emit(this.model);
	}

}
