import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/combineLatest';
import { map } from 'rxjs/operators';
import { SearchResult } from '.';
import { Option } from '../core/models';
import { Group, GroupType, Rating, Treatment, ratings, treatments } from './filter';
import { SearchService } from './search.service';
import { Tag } from './tag';
import { TagService } from './tag.service';

@Injectable({
	providedIn: 'root',
})
export class FilterService {

	groupTypes: any = GroupType;

	private groups$ = new BehaviorSubject<Group<Option>[]>([]);
	groups = this.groups$.asObservable();

	private groupsFiltered$ = new BehaviorSubject<Group<Option>[]>([]);
	groupsFiltered = this.groupsFiltered$.asObservable();

	private resultsFiltered$ = new BehaviorSubject<SearchResult[]>([]);
	resultsFiltered = this.resultsFiltered$.asObservable();

	constructor(
		private tagService: TagService,
		private searchService: SearchService,
	) {
		this.getGroups().subscribe(groups => {
			// console.log('FilterService.getGroups', groups);
			this.groups$.next(groups);
		});
		Observable.combineLatest(this.groups$, this.searchService.results).subscribe((data: any[]): void => {
			const groups = data[0];
			const results = data[1];
			results.forEach(result => {
				result.visible = true;
				this.valueSelected.forEach(group => {
					group.forEach(option => {
						result.visible = result.visible && result.tags.indexOf(option.id) !== -1;
					});
				});
			});
			this.resultsFiltered$.next(results);
			groups.forEach(group => {
				group.visible = false;
				group.items.forEach(option => {
					option.count = 0;
					results.forEach(result => {
						if ((result.visible || result.visible === undefined) && result.tags.indexOf(option.id) !== -1) {
							option.count++;
						}
					});
					option.visible = option.count > 0;
					group.visible = group.visible || option.visible;
				});
			});
			this.groupsFiltered$.next(groups);
		});
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

	setGroups(): void {
		this.groups$.next(this.groups$.getValue());
	}

	public get value() {
		return this.groups$.getValue();
	}

	public get valueSelected() {
		return this.groups$.getValue().filter(group => group.items.find(item => item.selected)).map(group => group.items.filter(item => item.selected));
	}

}
