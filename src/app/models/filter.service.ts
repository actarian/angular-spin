import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Option } from '../core/models';
import { Tag } from './tag';
import { TagService } from './tag.service';

export enum AccordionItemType {
	Tipology = 0,
	Destination = 1,
	Service = 2,
	Treatment = 3,
	Rating = 4
}

export class AccordionItem<T> {
	type?: AccordionItemType = AccordionItemType.Tipology;
	name?: string;
	items?: T[];
	selected?: boolean = false;
	constructor(options?: AccordionItem<T>) {
		if (options) {
			this.type = options.type || AccordionItemType.Tipology;
			this.name = options.name || 'AccordionItem';
			this.items = options.items || [];
			this.selected = options.selected || false;
		}
	}
}

export class Treatment extends Option {
	selected?: boolean = false;
}

export const treatments: Treatment[] = [{
	id: 1, name: 'All Inclusive'
}, {
	id: 2, name: 'Solo pernottamento'
}, {
	id: 3, name: 'Pernottamento e colazione'
}, {
	id: 4, name: 'Pensione completa'
}, {
	id: 5, name: 'Pensione completa con bevande'
}, {
	id: 6, name: 'Mezza pensione'
}, {
	id: 7, name: 'Mezza pensione con bevande'
}, {
	id: 8, name: 'Mezza pensione più soft drink'
}, {
	id: 9, name: 'Pernottamento e colazione / Mezza pensione'
}, {
	id: 11, name: 'Mezza pensione / Pensione completa'
}, {
	id: 12, name: 'Mezza pensione con bevande / Pensione completa con bevande'
}, {
	id: 13, name: 'Soft All Inclusive'
}, {
	id: 14, name: 'Come da programma'
}, {
	id: 15, name: 'Mezza pensione + light lunch'
}, {
	id: 16, name: 'Mezza pensione / All Inclusive'
}, {
	id: 17, name: 'Mezza pensione + Open Bar'
}];

export class Rating extends Option { }

export const categories: Rating[] = [{
	id: 1, name: '*'
}, {
	id: 2, name: '*S'
}, {
	id: 3, name: '**'
}, {
	id: 4, name: '**S'
}, {
	id: 5, name: '***'
}, {
	id: 6, name: '***S'
}, {
	id: 7, name: '****'
}, {
	id: 8, name: '****S'
}, {
	id: 9, name: '*****'
}, {
	id: 10, name: '*****S'
}];

@Injectable()
export class FilterService {

	groupTypes: any = AccordionItemType;

	constructor(
		private tagService: TagService,
	) { }

	getGroups(): Observable<AccordionItem<Option>[]> {
		return this.tagService.get().pipe(
			map((tags: Tag[]) => {
				return [
					new AccordionItem<Tag>({
						type: AccordionItemType.Tipology,
						name: 'Tipologia',
						items: tags.filter(tag => tag.category === 0).sort((a, b) => a.category - b.category),
						selected: true
					}),
					new AccordionItem<Tag>({
						type: AccordionItemType.Destination,
						name: 'Destinazione',
						items: tags.filter(tag => tag.category === 2 || tag.category === 3).sort((a, b) => a.category - b.category)
					}),
					new AccordionItem<Tag>({
						type: AccordionItemType.Service,
						name: 'Servizio',
						items: tags.filter(tag => tag.category === 1).sort((a, b) => a.category - b.category)
					}),
					new AccordionItem<Treatment>({
						type: AccordionItemType.Treatment,
						name: 'Trattamento',
						items: treatments,
					}),
					new AccordionItem<Rating>({
						type: AccordionItemType.Rating,
						name: 'Categoria',
						items: categories.sort((a, b) => b.id - a.id)
					})
				];
			})
		);
	}

}
