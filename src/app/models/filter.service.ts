import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { map } from 'rxjs/operators';
import { Group, GroupSelectionType, GroupType, ratings, Sorting, sortings, treatments } from './filter';
import { Tag } from './tag';
import { TagService } from './tag.service';

@Injectable({
	providedIn: 'root',
})
export class FilterService {

	groupTypes: any = GroupType;
	groupSelectionTypes: any = GroupSelectionType;

	public groups$ = new BehaviorSubject<Group[]>([]);
	groups = this.groups$.asObservable();

	private groupsFiltered$ = new BehaviorSubject<Group[]>([]);
	groupsFiltered = this.groupsFiltered$.asObservable();

	sortings: Sorting[] = sortings;
	sorting: Sorting = sortings[0];
	public sortings$ = new BehaviorSubject<Sorting>(this.sorting);

	constructor(
		private tagService: TagService
	) {
		this.onReset();
	}

	private getGroups(): Observable<Group[]> {
		return this.tagService.get().pipe(
			map((tags: Tag[]) => {
				const groups = [
					new Group({
						type: GroupType.Tipology,
						selectionType: GroupSelectionType.And,
						name: 'Tipologia',
						items: tags.filter(tag => tag.category === 0).sort((a, b) => a.category - b.category),
						active: true,
						match: function (result, option) {
							return result.tags.indexOf(option.id) !== -1;
						}
					}),
					new Group({
						type: GroupType.Destination,
						selectionType: GroupSelectionType.And,
						name: 'Destinazione',
						items: tags.filter(tag => tag.category === 2 || tag.category === 3).sort((a, b) => a.category - b.category),
						match: function (result, option) {
							return result.tags.indexOf(option.id) !== -1;
						}
					}),
					new Group({
						type: GroupType.Service,
						selectionType: GroupSelectionType.And,
						name: 'Servizio',
						items: tags.filter(tag => tag.category === 1).sort((a, b) => a.category - b.category),
						match: function (result, option) {
							return result.tags.indexOf(option.id) !== -1;
						}
					}),
					new Group({
						type: GroupType.Treatment,
						selectionType: GroupSelectionType.Or,
						name: 'Trattamento',
						items: treatments,
						match: function (result, option) {
							return result.accomodation === option.name;
						}
					}),
					new Group({
						type: GroupType.Rating,
						selectionType: GroupSelectionType.Multiple,
						name: 'Categoria',
						items: ratings.sort((a, b) => b.id - a.id),
						match: function (result, option) {
							return result.rating === option.name;
						}
					})
				];
				return groups;
			})
		);
	}

	public get value() {
		return this.groups$.getValue();
	}

	public get valueSelected() {
		return this.groups$.getValue().filter(group => group.items.find(item => item.selected)).map(group => {
			group = Object.assign({}, group);
			group.items = group.items.filter(item => item.selected);
			return group;
		});
	}

	onUpdateGroups(groups, results) {
		groups.forEach(group => {
			group.visible = false;
			group.items.forEach(option => {
				option.count = 0;
				results.forEach(result => {
					if (group.match(result, option)) {
						option.count++;
					}
				});
				option.visible = option.count > 0 || group.selectionType === GroupSelectionType.Multiple;
				group.visible = group.visible || option.visible;
			});
		});
		this.groupsFiltered$.next(groups);
	}

	onReset() {
		this.sorting = this.sortings[0];
		this.getGroups().subscribe(groups => {
			// console.log('FilterService.getGroups', groups);
			this.groups$.next(groups);
		});
	}

	onSort() {
		this.sortings$.next(this.sorting);
	}

	onToggle(id: number, groupType: GroupType) {
		const groups = this.groups$.getValue();
		groups.forEach(group => {
			if (group.type === groupType) {
				const item = group.items.find(item => item.id === id);
				/*
				if (item.selected && (groupType === GroupType.Treatment || groupType === GroupType.Rating)) {
					group.items.forEach(item => {
						if (item.id !== id) {
							item.selected = false;
						}
					});
				}
				*/
			}
		});
	}

	setGroups(): void {
		this.groups$.next(this.groups$.getValue());
	}

}
