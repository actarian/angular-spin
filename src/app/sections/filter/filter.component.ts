import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { DisposableComponent } from '../../core/disposable';
import { Option } from '../../core/models';
import { FilterService, Group, GroupType } from '../../models';

@Component({
	selector: 'section-filter',
	templateUrl: './filter.component.html',
	styleUrls: ['./filter.component.scss']
})

export class FilterComponent extends DisposableComponent implements OnInit {

	groupTypes: any;
	groupsFiltered$: Observable<Group<Option>[]>;
	private groupsFiltered: Group<Option>[];

	@Output()
	selectFilter: EventEmitter<any> = new EventEmitter();

	constructor(
		private filterService: FilterService,
	) {
		super();
		this.groupTypes = this.filterService.groupTypes;
		this.groupsFiltered$ = this.filterService.groupsFiltered;
	}

	ngOnInit() {

	}

	onToggle(id: number, groupType: GroupType) {
		this.filterService.onToggle(id, groupType);
		this.selectFilter.emit(this.filterService.valueSelected);
	}

}
