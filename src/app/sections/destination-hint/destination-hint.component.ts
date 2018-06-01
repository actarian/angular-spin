// posts.component.ts

import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, Renderer2, SimpleChanges, ViewChild } from '@angular/core';
// import { fromEvent } from 'rxjs';
import { DisposableComponent } from '../../core/disposable/disposable.component';
import { Destination } from '../../models/destination';

@Component({
	selector: 'destination-hint',
	templateUrl: './destination-hint.component.html',
	styleUrls: ['./destination-hint.component.scss']
})
export class DestinationHintComponent extends DisposableComponent implements OnInit, AfterViewInit, OnChanges {

	@Input()
	destinations: Destination[];

	@Input()
	query: string;

	@Input()
	height: number;

	@Output()
	selectDestination: EventEmitter<any> = new EventEmitter();

	maxVisibleItems: number = 30;
	visibleItems: number = this.maxVisibleItems;
	active: number = -1;

	@ViewChild('scrollable') scrollable;
	scrollable$;

	constructor(
		private renderer: Renderer2,
		private elementRef: ElementRef
	) {
		super();
	}

	ngOnInit() {
		// console.log('DestinationHintComponent.onInit');
		this.height = this.height || 46;
	}

	ngAfterViewInit() {
		this.addListeners();
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes['destinations']) {
			this.maxVisibleItems = 30;
			this.setVisibleItems();
		}
	}

	setVisibleItems(active: number = -1) {
		// console.log('DestinationHintComponent.setVisibleItems');
		this.active = active;
		if (this.maxVisibleItems - this.active < 10) {
			this.maxVisibleItems = 30 + active;
		}
		if (this.destinations) {
			this.visibleItems = Math.min(this.maxVisibleItems, this.destinations.length);
		} else {
			this.visibleItems = 0;
		}
		const height = this.scrollable.nativeElement.offsetHeight;
		const scrollTop = this.scrollable.nativeElement.scrollTop;
		// const scrollHeight = this.scrollable.nativeElement.scrollHeight;
		if (active * this.height > height + scrollTop ||
			active * this.height < scrollTop) {
			// this.scrollable.nativeElement.scrollTop = active * this.height;
			this.renderer.setProperty(this.scrollable.nativeElement, 'scrollTop', active * this.height);
		}
		// console.log(active * this.height, scrollTop);
		// console.log(this.maxVisibleItems, this.destinations.length);
	}

	onClick(item: Destination) {
		this.selectDestination.emit(item);
	}

	onMouseOver(index: number) {
		this.active = index;
	}

	@HostListener('document:keyup', ['$event'])
	onKeyup(e: KeyboardEvent) {
		// console.log('DestinationHintComponent.document:keyup', e);
		switch (e.key) {
			case 'ArrowUp':
				this.active = this.active === -1 ? this.visibleItems : this.active;
				this.active--;
				break;
			case 'ArrowDown':
				this.active++;
				break;
			case 'Enter':
				if (this.destinations && this.active !== undefined) {
					this.onClick(this.destinations[this.active]);
				}
		}
		this.active = this.active % this.visibleItems;
		this.setVisibleItems(this.active);
	}

	addListeners() {
		this.renderer.listen(this.scrollable.nativeElement, 'scroll', () => {
			this.setVisibleItems(this.active);
		});
		/*
		// scrollable scroll listener
		this.scrollable$ = fromEvent(this.scrollable.nativeElement, 'scroll')
			.debounceTime(250)
			.map((event: any) => {
				return event;
			});
		this.scrollable$
			.takeUntil(this.unsubscribe)
			.subscribe(e => {
				// console.log('DestinationHintComponent.scroll', e);
				this.setVisibleItems(this.active);
			});
			*/
	}

}
