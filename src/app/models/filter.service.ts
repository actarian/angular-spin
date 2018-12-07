import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { first, map } from 'rxjs/operators';
import { Option } from '../core';
import { DestinationTypes } from './destination';
import { Group, GroupSelectionType, GroupType, ratings, Sorting, sortings, treatments } from './filter';
import { GtmService } from './gtm.service';
import { Tag, TagType } from './tag';
import { TagService } from './tag.service';

@Injectable({
	providedIn: 'root',
})

export class FilterService {
	groupTypes: any = GroupType;
	groupSelectionTypes: any = GroupSelectionType;

	public groups$ = new BehaviorSubject<Group[]>(null);
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
		// this.onReset();
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
		this.getGroups().subscribe(groups => {
			const keys = {};
			params.filters.forEach(g => {
				keys[g.type] = {};
				if (g.items) {
					g.items.forEach(i => {
						keys[g.type][i.id] = true;
					});
				}
			});
			groups.forEach(group => {
				group.selected = false;
				if (params.filters.length) {
					group.active = keys[group.type];
					if (group.active) {
						group.items.forEach(item => {
							item.selected = keys[group.type][item.id];
						});
					}
				} else {
					group.active = true;
				}
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

	/*
	export enum GroupType {
		Promotion = 0, // Promozioni e sconti  4
		Destination = 1, // Destinazioni Italia / Estero
		Touristic = 2, // Aree turistiche 5
		Province = 3, // Province 9
		Tipology = 4, // Categoria
		Rating = 5, // Stelle
		Treatment = 6, // Trattamento
		Service = 7, // Servizi (6,1)
		Accomodation = 8, // Sistemazione (7)
		Plus = 9, // Plus ???
	}

	OR - GroupType.Destination     - Destinazione (le regioni, se ci fossero altri filtri es. province sarebbero in OR)
	OR - GroupType.Tipology         - Categoria (mare italia, montagna)
	AND - GroupType.Service         - Servizi (bimbo gratis, prenota prima, lastminute)
	AND - GroupType.Plus              - I Plus (i cosiddetti “plus”, non ancora inseriti a db)
	OR - GroupType.Treatment       - Trattamento
	OR - GroupType.Rating             - Stelle
	*/

	private getGroups(): Observable<Group[]> {
		return this.tagService.getTags().pipe(
			map((tags: Tag[]) => {
				const groups = [
					new Group({
						name: 'Promozione o sconto',
						type: GroupType.Promotion,
						selectionType: GroupSelectionType.Or,
						items: tags.filter(tag => tag.category === TagType.Promotion).sort((a, b) => a.category - b.category),
						active: true,
						match: function (result, option) {
							return result.tags.indexOf(option.id) !== -1;
						}
					}),
					new Group({
						name: 'Destinazione',
						type: GroupType.Destination,
						selectionType: GroupSelectionType.Or,
						items: tags.filter(tag => tag.category === TagType.Region || tag.category === TagType.Country).sort((a, b) => a.category - b.category),
						active: true,
						match: function (result, option) {
							return result.tags.indexOf(option.id) !== -1;
						}
					}),
					new Group({
						name: 'Area turistica',
						type: GroupType.Touristic,
						selectionType: GroupSelectionType.Or,
						items: tags.filter(tag => tag.category === TagType.Touristic).sort((a, b) => a.category - b.category),
						active: true,
						match: function (result, option) {
							return result.tags.indexOf(option.id) !== -1;
						}
					}),
					new Group({
						name: 'Provincia',
						type: GroupType.Province,
						selectionType: GroupSelectionType.Or,
						items: tags.filter(tag => tag.category === TagType.Province).sort((a, b) => a.category - b.category),
						active: true,
						match: function (result, option) {
							return result.tags.indexOf(option.id) !== -1;
						}
					}),
					new Group({
						name: 'Categoria',  // (in origine) Tipologia --> (diventa) Categoria
						type: GroupType.Tipology,
						selectionType: GroupSelectionType.Or,
						items: tags.filter(tag => tag.category === TagType.Category).sort((a, b) => a.category - b.category),
						active: true,
						match: function (result, option) {
							return result.tags.indexOf(option.id) !== -1;
						}
					}),
					new Group({
						name: 'Stelle', // (in origine) Categoria --> (diventa) Stelle
						type: GroupType.Rating,
						selectionType: GroupSelectionType.Or,
						items: ratings.sort((a, b) => Number(b.id) - Number(a.id)),
						active: true,
						match: function (result, option) {
							return result.rating === option.name;
						}
					}),
					new Group({
						name: 'Trattamento',
						type: GroupType.Treatment,
						selectionType: GroupSelectionType.Or,
						items: treatments,
						active: true,
						match: function (result, option) {
							return result.accomodation === option.name;
						}
					}),
					new Group({
						name: 'Servizi', // (in origine) Servizio --> (diventa) Servizi
						type: GroupType.Service,
						selectionType: GroupSelectionType.And,
						items: tags.filter(tag => tag.category === TagType.Service).sort((a, b) => a.category - b.category),
						active: true,
						match: function (result, option) {
							return result.tags.indexOf(option.id) !== -1;
						}
					}),
					/*new Group({
						name: 'Plus',
						type: GroupType.Plus,
						selectionType: GroupSelectionType.And,
						items: tags.filter(tag => tag.category === TagType.Plus).sort((a, b) => a.category - b.category),
						active: true,
						match: function (result, option) {
							return result.tags.indexOf(option.id) !== -1;
						}
					}),*/
					new Group({
						name: 'Sistemazione',
						type: GroupType.Accomodation,
						selectionType: GroupSelectionType.Or,
						items: tags.filter(tag => tag.category === TagType.Accomodation).sort((a, b) => a.category - b.category),
						active: true,
						match: function (result, option) {
							return result.tags.indexOf(option.id) !== -1;
						}
					})
				];
				return groups;
			})
		);
	}

	onReset() {
		this.sorting = this.sortings[0];
		this.getGroups().pipe(
			first(),
		).subscribe(groups => {
			groups.forEach(g => g.items.forEach(i => i.selected = false));
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
			if (item && item.selected) {
				switch (groupType) {
					case GroupType.Promotion:
						this.gtm.onSearch('Filter', 'Promozione', item.name);
						break;
					case GroupType.Destination:
						this.gtm.onSearch('Filter', (item as Tag).category === TagType.Region ? 'Regione' : 'Paese', item.name);
						// this.gtm.onSearch('Filter', 'Destinazione', item.name);
						break;
					case GroupType.Touristic:
						this.gtm.onSearch('Filter', 'Aree turistiche', item.name);
						break;
					case GroupType.Province:
						this.gtm.onSearch('Filter', 'Provincia', item.name);
						break;
					case GroupType.Tipology:
						this.gtm.onSearch('Filter', 'Categoria', item.name); // (in origine) Tipologia --> (diventa) Categoria
						break;
					case GroupType.Rating:
						this.gtm.onSearch('Filter', 'Stelle', item.name); // (in origine) Categoria --> (diventa) Stelle
						break;
					case GroupType.Treatment:
						this.gtm.onSearch('Filter', 'Trattamento', item.name);
						break;
					case GroupType.Service:
						this.gtm.onSearch('Filter', 'Servizi', item.name); // (in origine) Servizio --> (diventa) Servizi
						break;
					case GroupType.Accomodation:
						this.gtm.onSearch('Filter', 'Sistemazione', item.name);
						break;
					case GroupType.Plus:
						this.gtm.onSearch('Filter', 'Plus', item.name);
						break;
				}
			}
			// [Filter]   “Promozione”; **Destinazione**; **Aree turistiche**; “Provincia”; “Categoria”; “Stelle”; “Trattamento” ; **Servizi**; **Sistemazione**; -“Regione”; -“Paese”;
			/*
			if (group.type === groupType) {
				if (group.selectionType === GroupSelectionType.And) {
					group.items.forEach(item => {
						if (item.id !== id) {
							item.selected = false;
						}
					});
				}
			}
			*/
		}
	}

	onSet(id: number | string, groupType: GroupType) {
		const groups = this.groups$.getValue();
		const group = groups.find(group => group.type === groupType);
		if (group) {
			/*
			if (group.selectionType === GroupSelectionType.And) {
				group.items.forEach(item => {
					if (item.id !== id) {
						item.selected = false;
					}
				});
			}
			*/
			const item = group.items.find(item => item.id === id);
			item.selected = true;
			group.selected = true;
			group.active = true;
		}
	}

	setGroups(): void {
		const groups = this.groups$.getValue();
		this.groups$.next(groups);
	}

	onUpdateGroups(groups, filteredResults, results) {
		groups.forEach(group => {
			group.visible = false;
			let searchResults = filteredResults;
			// OR SUBSET RESULT
			if (group.selectionType === GroupSelectionType.Or) {
				const matches = {};
				results.forEach(r => matches[r.id] = true);
				groups.filter(g => g !== group).forEach(g => {
					Object.keys(g.matches).forEach(k => matches[k] = matches[k] && g.matches[k]);
				});
				searchResults = results.filter(r => matches[r.id]);
			}
			// OR SUBSET RESULT
			group.items.forEach(option => {
				option.count = 0;
				searchResults.forEach(result => {
					if (group.match(result, option)) {
						option.count++;
					}
				});
				option.visible = option.count > 0;
				group.visible = group.visible || option.visible;
			});
			// console.log('onUpdateGroups', group.name, group.visible);
		});
		this.groupsFiltered$.next(groups);
	}

}
