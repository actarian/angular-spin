import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DisposableComponent } from '../../core/disposable';
import { Option } from '../../core/models';
import { AccordionItem, FilterService } from '../../models';

@Component({
	selector: 'section-filter',
	templateUrl: './filter.component.html',
	styleUrls: ['./filter.component.scss']
})

export class FilterComponent extends DisposableComponent implements OnInit {

	groupTypes: any;
	groups: AccordionItem<Option>[];

	@Output()
	selectFilter: EventEmitter<any> = new EventEmitter();

	constructor(
		private filterService: FilterService,
	) {
		super();
		this.groupTypes = this.filterService.groupTypes;
		this.filterService.getGroups()
			.takeUntil(this.unsubscribe)
			.subscribe(groups => this.groups = groups);
	}

	ngOnInit() {
	}

	onToggle(item: Option) {
		console.log('FilterComponent.onToggle', item);
		this.selectFilter.emit(item);
	}

}
