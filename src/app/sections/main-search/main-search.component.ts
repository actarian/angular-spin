import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core/disposable';
import { Destination, MainSearch, SearchService } from '../../models';


@Component({
	selector: 'main-search',
	templateUrl: './main-search.component.html',
	styleUrls: ['./main-search.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	// changeDetection: ChangeDetectionStrategy.OnPush
})

export class MainSearchComponent extends DisposableComponent implements AfterViewInit {

	model: MainSearch;
	active: ElementRef;

	@ViewChild('query') query;
	query$;

	@ViewChild('searchLocation') searchLocation;

	@Output()
	doSearch: EventEmitter<any> = new EventEmitter();

	constructor(
		private changeDetector: ChangeDetectorRef,
		public search: SearchService
	) {
		super();
		// cloniamo il modello per emettere la modifica solo al click sulla cta search
		this.search.model$.subscribe(model => this.model = new MainSearch(model));
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

	onDestinationSet(item: Destination) {
		this.model.destination = item;
		this.model.query = item.name;
	}

	onSubmit() {
		this.active = null;
		this.doSearch.emit(this.model);
	}

	onChildsChanged() {
		while (this.model.childrens.length < this.model.childs) {
			this.model.childrens.push({ age: 0 });
		}
		this.model.childrens.length = Math.min(this.model.childs, this.model.childrens.length);
	}

}
