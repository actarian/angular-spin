import { Option } from '../core/models';

export enum SerpViewTypes {
	List = 0,
	Map = 1,
}

export enum GroupType {
	Tipology = 0,
	Destination = 1,
	Service = 2,
	Treatment = 3,
	Rating = 4
}

export enum GroupSelectionType {
	And = 0,
	Or = 1,
	Multiple = 2
}

export class Group {
	type?: GroupType = GroupType.Tipology;
	selectionType?: GroupSelectionType = GroupSelectionType.And;
	name?: string = 'Group';
	items?: Option[] = [];
	active?: boolean = false;
	selected?: boolean = false;
	visible?: boolean = false;
	matches?: any = {};
	constructor(options?: Group) {
		if (options) {
			this.type = options.type || this.type;
			this.selectionType = options.selectionType || this.selectionType;
			this.name = options.name || this.name;
			this.items = options.items || this.items;
			this.active = options.active || this.active;
			this.selected = options.selected || this.selected;
			this.visible = options.visible || this.visible;
			this.match = typeof options.match === 'function' ? options.match : this.match;
		}
	}
	match?(result: any, option: Option) {
		return true;
	}
	/*
	clear?() {
		this.matches = {};
		this.selected = this.items.find(option => option.selected) !== undefined;
		this.items.forEach(option => option.count = 0);
	}
	filter?(result: any) {
		let visible = true;
		this.matches[result.id] = false;
		this.items.forEach(option => {
			if (option.selected) {
				let match = this.match(result, option);
				if (this.selectionType === GroupSelectionType.Multiple) {
					match = match || this.matches[result.id];
				}
				if (match) {
					this.matches[result.id] = true;
				}
				visible = visible && match;
			}
		});
	}
	*/
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

export class Sorting extends Option { }

export const sortings: Rating[] = [{
	id: 1, name: 'Consigliati da Eurospin'
}, {
	id: 2, name: 'Prezzo crescente'
}, {
	id: 3, name: 'Prezzo decrescente'
}];
