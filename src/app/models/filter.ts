import { Option } from '../core/models';

export enum GroupType {
	Tipology = 0,
	Destination = 1,
	Service = 2,
	Treatment = 3,
	Rating = 4
}

export class Group<T> {
	type?: GroupType = GroupType.Tipology;
	name?: string;
	items?: T[];
	selected?: boolean = false;
	visible?: boolean = false;
	constructor(options?: Group<T>) {
		if (options) {
			this.type = options.type || GroupType.Tipology;
			this.name = options.name || 'Group';
			this.items = options.items || [];
			this.selected = options.selected || false;
			this.visible = options.visible || false;
		}
	}
}

export class Treatment extends Option { }

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

export const ratings: Rating[] = [{
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
