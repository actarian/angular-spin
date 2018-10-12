import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first, map } from 'rxjs/operators';
import { Option } from '../core';
import { DestinationTypes } from './destination';
import { Group, GroupSelectionType, GroupType, ratings, Sorting, sortings, treatments } from './filter';
import { GtmService } from './gtm.service';
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
		private tagService: TagService,
		private gtm: GtmService,
	) {
		this.onReset();
	}

	// setting params from querystring
	public setParams(params: Params) {
		this.sorting = this.sortings[0];
		if (params.order) {
			const sorting = sortings.find(sorting => sorting.id === params.order);
			this.sorting = sorting;
			this.sortings$.next(sorting);
		}
		params.filters = params.filters || [];
		if (params.search && params.search.destination) {
			switch (params.search.destination.type) {
				case DestinationTypes.Category:
					params.filters.push({ type: GroupType.Tipology, id: params.search.destination.id, unique: true });
					break;
				case DestinationTypes.Region:
					params.filters.push({ type: GroupType.Destination, id: params.search.destination.id, unique: true });
					break;
				case DestinationTypes.Promotion:
					params.filters.push({ type: GroupType.Service, id: params.search.destination.id, unique: true });
					break;
			}
		}
		this.getGroups().pipe(
			first(),
		).subscribe(groups => {
			groups.forEach(group => {
				group.selected = false;
				group.active = false;
				const g = params.filters.find(g => g.type === group.type);
				group.items.forEach(item => {
					const has = g ? g.id === item.id : false;
					item.selected = has;
					group.selected = has || group.selected;
					group.active = has || group.active;
				});
			});
			this.groups$.next(groups);
		});
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

	private getGroups(): Observable<Group[]> {
		return this.tagService.getTags().pipe(
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
						selectionType: GroupSelectionType.Or,
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
						items: ratings.sort((a, b) => Number(b.id) - Number(a.id)),
						match: function (result, option) {
							return result.rating === option.name;
						}
					})
				];
				return groups;
			})
		);
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
				option.visible = option.count > 0; // || group.selectionType === GroupSelectionType.Multiple;
				group.visible = group.visible || option.visible;
			});
		});
		this.groupsFiltered$.next(groups);
	}

	onReset() {
		// console.log('FilterService.onReset');
		this.sorting = this.sortings[0];
		this.getGroups().pipe(
			first(),
		).subscribe(groups => {
			// console.log('FilterService.getGroups', groups);
			this.groups$.next(groups);
		});
	}

	onSort() {
		this.sortings$.next(this.sorting);
	}

	// gtm.search('Filter', 'Categoria', newValue.filter.Rating);
	// gtm.search('Filter', 'Trattamento', newValue.filter.Accomodation);
	// gtm.search('Filter', 'Tipologia', tag.Name);
	// gtm.search('Filter', 'Destinazione', tag.Name);
	// gtm.search('Filter', 'Servizio', tag.Name);
	onToggle(id: number | string, groupType: GroupType) {
		const groups = this.groups$.getValue();
		const group = groups.find(group => group.type === groupType);
		if (group) {
			const item: Option = group.items.find(item => item.id === id);
			if (item) {
				switch (groupType) {
					case GroupType.Destination:
						this.gtm.onSearch('Filter', 'Destinazione', item.name);
						break;
					case GroupType.Rating:
						this.gtm.onSearch('Filter', 'Categoria', item.name);
						break;
					case GroupType.Service:
						this.gtm.onSearch('Filter', 'Servizio', item.name);
						break;
					case GroupType.Tipology:
						this.gtm.onSearch('Filter', 'Tipologia', item.name);
						break;
					case GroupType.Treatment:
						this.gtm.onSearch('Filter', 'Trattamento', item.name);
						break;
				}
			}
			if (group.type === groupType) {
				if (group.selectionType === GroupSelectionType.Or) {
					group.items.forEach(item => {
						if (item.id !== id) {
							item.selected = false;
						}
					});
				}
			}
			/*
			const item = group.items.find(item => item.id === id);
			console.log('FilterService.onToggle', item, group);
			*/
		}
	}

	onSet(id: number | string, groupType: GroupType) {
		const groups = this.groups$.getValue();
		const group = groups.find(group => group.type === groupType);
		if (group) {
			if (group.selectionType === GroupSelectionType.Or) {
				group.items.forEach(item => {
					if (item.id !== id) {
						item.selected = false;
					}
				});
			}
			const item = group.items.find(item => item.id === id);
			item.selected = true;
			group.selected = true;
			group.active = true;
			// console.log('FilterService.setPromotion', item, group);
		}
	}

	setGroups(): void {
		const groups = this.groups$.getValue();
		this.groups$.next(groups);
	}

}
