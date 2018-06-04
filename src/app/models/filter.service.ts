import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';
import { map } from 'rxjs/operators';
import { Option } from '../core/models';
import { Group, GroupType, Rating, Sorting, Treatment, ratings, sortings, treatments } from './filter';
import { Tag } from './tag';
import { TagService } from './tag.service';

@Injectable({
	providedIn: 'root',
})
export class FilterService {

	groupTypes: any = GroupType;

	public groups$ = new BehaviorSubject<Group<Option>[]>([]);
	groups = this.groups$.asObservable();

	private groupsFiltered$ = new BehaviorSubject<Group<Option>[]>([]);
	groupsFiltered = this.groupsFiltered$.asObservable();

	sortings: Sorting[] = sortings;
	sorting: Sorting = sortings[0];
	public sortings$ = new BehaviorSubject<Sorting>(this.sorting);

	constructor(
		private tagService: TagService
	) {
		this.onReset();
	}

	private getGroups(): Observable<Group<Option>[]> {
		return this.tagService.get().pipe(
			map((tags: Tag[]) => {
				const groups = [
					new Group<Tag>({
						type: GroupType.Tipology,
						name: 'Tipologia',
						items: tags.filter(tag => tag.category === 0).sort((a, b) => a.category - b.category),
						selected: true
					}),
					new Group<Tag>({
						type: GroupType.Destination,
						name: 'Destinazione',
						items: tags.filter(tag => tag.category === 2 || tag.category === 3).sort((a, b) => a.category - b.category)
					}),
					new Group<Tag>({
						type: GroupType.Service,
						name: 'Servizio',
						items: tags.filter(tag => tag.category === 1).sort((a, b) => a.category - b.category)
					}),
					new Group<Treatment>({
						type: GroupType.Treatment,
						name: 'Trattamento',
						items: treatments,
					}),
					new Group<Rating>({
						type: GroupType.Rating,
						name: 'Categoria',
						items: ratings.sort((a, b) => b.id - a.id)
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
					// if (result.visible || result.visible === undefined) {
					switch (group.type) {
						case GroupType.Treatment:
							option.count += result.accomodation === option.name ? 1 : 0;
							break;
						case GroupType.Rating:
							option.count += result.rating === option.name ? 1 : 0;
							break;
						default:
							option.count += ((result.visible || result.visible === undefined) && result.tags.indexOf(option.id) !== -1) ? 1 : 0;
					}
					// }
				});
				/*
				switch (group.type) {
					case GroupType.Treatment:
					case GroupType.Rating:
						option.visible = true;
						break;
					default:
						option.visible = option.count > 0;
				}
				*/
				option.visible = option.count > 0;
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
				if (item.selected && (groupType === GroupType.Treatment || groupType === GroupType.Rating)) {
					group.items.forEach(item => {
						if (item.id !== id) {
							item.selected = false;
						}
					});
				}
			}
		});
	}

	setGroups(): void {
		this.groups$.next(this.groups$.getValue());
	}

}
