import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { DisposableComponent } from '../../core/disposable';
import { SearchService } from '../../models';


@Component({
	selector: 'main-search',
	templateUrl: './main-search.component.html',
	styleUrls: ['./main-search.component.scss']
})

export class MainSearchComponent extends DisposableComponent implements OnInit, AfterViewInit {

	active: ElementRef;
	destinationDirty: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private renderer: Renderer2,
		private elementRef: ElementRef,
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
		// this.renderer.listen(this.searchLocation.nativeElement, 'click', () => { console.log('cliccato'); });
	}

	ngOnInit() {
		// console.log('MainSearchComponent.OnInit');
	}

	onDestinationSet(item: any) {
		this.search.onDestinationSet(item);
		this.changeDetector.detectChanges();
	}

	onSubmit() {
		this.active = null;
		this.doSearch.emit();
		/*
		console.log('MainSearch.onSubmit', this.route.snapshot.data.pageResolver.page.component);
		if (this.route.snapshot.data.pageResolver.page.component === 'SearchComponent') {
			this.search.onSearchIn();
		} else {
			this.search.onSearch();
		}
		*/
	}

	addListeners() {
		// input query keyup listener
		this.query$ = fromEvent(this.query.nativeElement, 'keyup')
			.debounceTime(250)
			.map((event: any) => {
				return event.target.value; // input value
			})
			.distinctUntilChanged();
		this.query$
			.takeUntil(this.unsubscribe)
			.subscribe(query => {
				if (!query && !query.trim()) {
					return;
				}
				this.destinationDirty = true;
				this.search.onDestinationQuery(query);
			});
	}
}
