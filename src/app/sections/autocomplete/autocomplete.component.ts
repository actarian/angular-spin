import { AfterViewInit, ChangeDetectorRef, Component, EventEmitter, forwardRef, HostListener, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { fromEvent, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { Entity } from '../../core';
import { DisposableComponent } from '../../core/disposable/disposable.component';

export interface AutocompleteProvider {
	items?: Entity[];
	search?(query: string): Observable<Entity[]>;
}

@Component({
	selector: 'autocomplete-component',
	templateUrl: './autocomplete.component.html',
	styleUrls: ['./autocomplete.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	providers: [{
		provide: NG_VALUE_ACCESSOR,
		useExisting: forwardRef(() => AutocompleteComponent),
		multi: true,
	}],
})
export class AutocompleteComponent extends DisposableComponent implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor {

	@Input() provider?: AutocompleteProvider;
	@Input() items?: Entity[];
	@Input() search?: Function;
	@Input() height: number;
	@Input() placeholder: string;

	@ViewChild('scrollable') scrollable;
	@ViewChild('query') query;
	autocomplete$: Observable<Entity[]>;
	filteredItems: Entity[] = [];

	maxVisibleItems: number = 30;
	visibleItems: number = this.maxVisibleItems;
	disabled: boolean = false;
	active: number = -1;
	value: string = '';
	storedValue: string;

	@Output() selectItem: EventEmitter<any> = new EventEmitter();
	@Output() cancel: EventEmitter<any> = new EventEmitter();

	constructor(
		private renderer: Renderer2,
		private changeDetector: ChangeDetectorRef,
	) {
		super();
	}

	ngOnInit() {
		// console.log('AutocompleteComponent.onInit');
		this.height = this.height || 46;
	}

	ngAfterViewInit() {
		this.autocomplete$ = fromEvent(this.query.nativeElement, 'keyup').pipe(
			map((event: any) => {
				return event.target.value; // input value
			}),
			filter(query => query && query.trim() !== ''),
			debounceTime(100),
			distinctUntilChanged(),
			switchMap(query => {
				query = query.toLowerCase();
				if (this.provider && this.provider.items && Array.isArray(this.provider.items)) {
					return of(this.items.filter((x: Entity) => {
						return x.name.toLowerCase().indexOf(query) !== -1;
					}).sort((a, b) => a.name > b.name ? 1 : -1));
				} else if (this.provider && this.provider.search && typeof this.provider.search === 'function') {
					const search$ = this.provider.search(query);
					return search$.pipe(
						map(x => x.sort((a, b) => a.name > b.name ? 1 : -1))
					);
				} else {
					return of([]);
				}
			}),
		);
		this.autocomplete$.pipe(
			takeUntil(this.unsubscribe)
		).subscribe(items => {
			this.filteredItems = items;
			// this.changeDetector.markForCheck();
		});
		this.addListeners();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['items']) {
			this.maxVisibleItems = 30;
			this.setVisibleItems();
		}
	}

	setVisibleItems(active: number = -1) {
		this.active = active;
		if (this.maxVisibleItems - this.active < 10) {
			this.maxVisibleItems = 30 + active;
		}
		if (this.filteredItems) {
			this.visibleItems = Math.min(this.maxVisibleItems, this.filteredItems.length);
		} else {
			this.visibleItems = 0;
		}
		const height = this.scrollable.nativeElement.offsetHeight;
		const scrollTop = this.scrollable.nativeElement.scrollTop;
		if (active * this.height > height + scrollTop ||
			active * this.height < scrollTop) {
			this.renderer.setProperty(this.scrollable.nativeElement, 'scrollTop', active * this.height);
		}
	}

	onFocus() {
		this.storedValue = this.value;
	}

	onClick(item: Entity) {
		// console.log('onClick', item);
		this.writeValue(item.name); // !!!
		this.storedValue = null;
		this.selectItem.emit(item);
		this.filteredItems = [];
	}

	onCancel() {
		// console.log('onCancel', this.storedValue);
		if (this.storedValue) {
			this.query.nativeElement.value = this.storedValue;
			this.writeValue(this.storedValue);
		}
		this.cancel.emit();
		this.filteredItems = [];
	}

	onMouseOver(index: number) {
		this.active = index;
	}

	@HostListener('document:keydown', ['$event']) onKeyDown(e: KeyboardEvent) {
		switch (e.key) {
			case 'ArrowUp':
				this.active = this.active === -1 ? this.visibleItems : this.active;
				this.active--;
				break;
			case 'ArrowDown':
				this.active++;
				break;
			case 'Enter':
				if (this.active >= 0 && this.filteredItems.length > this.active) {
					this.onClick(this.filteredItems[this.active]);
				}
				e.preventDefault();
				break;
		}
		this.active = this.active % this.visibleItems;
		this.setVisibleItems(this.active);
	}

	addListeners() {
		this.renderer.listen(this.scrollable.nativeElement, 'scroll', () => {
			this.setVisibleItems(this.active);
		});
	}

	writeValue(value: any): void {
		this.value = value || '';
		this.onChange(this.value);
	}

	pushChanges(value: any) {
		this.onChange(value);
	}

	registerOnChange(fn: (value: string) => void): void {
		this.onChange = fn;
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		this.disabled = isDisabled;
	}

	onChange = (value: string) => { };

	onTouched = (value: string) => { };

}
