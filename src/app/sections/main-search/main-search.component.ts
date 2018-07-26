import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { fromEvent } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core/disposable';
import { SearchService } from '../../models';


@Component({
	selector: 'main-search',
	templateUrl: './main-search.component.html',
	styleUrls: ['./main-search.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class MainSearchComponent extends DisposableComponent implements AfterViewInit {

	active: ElementRef;
	destinationDirty: boolean = false;

	constructor(
		private changeDetector: ChangeDetectorRef,
		public search: SearchService
	) {
		super();
	}

	@ViewChild('query') query;
	query$;

	@ViewChild('searchLocation') searchLocation;

	@Output()
	doSearch: EventEmitter<any> = new EventEmitter();

	ngAfterViewInit() {
		this.addListeners();
	}

	onDestinationSet(item: any) {
		this.search.onDestinationSet(item);
		this.changeDetector.detectChanges();
	}

	onSubmit() {
		this.active = null;
		this.doSearch.emit();
	}

	addListeners() {
		// input query keyup listener
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
			this.destinationDirty = true;
			this.search.onDestinationQuery(query);
		});
	}
}
