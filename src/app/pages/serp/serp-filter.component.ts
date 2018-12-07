import { Component, EventEmitter, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DisposableComponent } from '../../core/disposable';
import { FilterService, Group, GroupType } from '../../models';

@Component({
	selector: 'section-filter',
	templateUrl: './serp-filter.component.html',
	styleUrls: ['./serp-filter.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class SerpFilterComponent extends DisposableComponent implements OnInit {

	groupTypes: any;
	groupsFiltered$: Observable<Group[]>;

	@Output()
	selectFilter: EventEmitter<any> = new EventEmitter();

	constructor(
		public filterService: FilterService,
	) {
		super();
		this.groupTypes = this.filterService.groupTypes;
		this.groupsFiltered$ = this.filterService.groupsFiltered;
	}

	ngOnInit() {

	}

	onToggle(id: number | string, groupType: GroupType) {
		this.filterService.onToggle(id, groupType);
		this.selectFilter.emit(this.filterService.valueSelected);
	}

	hasEnabledFilters(): Observable<boolean> {
		return this.groupsFiltered$.pipe(
			map(groups => {
				let has = false;
				groups.forEach(g => g.items.forEach(i => has = has || i.selected));
				return has;
			})
		);
	}

}
