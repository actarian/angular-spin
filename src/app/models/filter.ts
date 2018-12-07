import { Option } from '../core/models';

export enum SerpViewTypes {
	List = 0,
	Map = 1,
	Order = 2,
	Filter = 3,
	MainSearch = 4,
}

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

export enum GroupSelectionType {
	And = 0,
	Or = 1,
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
}, {
	id: 18, name: 'Mezza pensione con bevande + lunch box'
}, {
	id: 19, name: 'Mezza pensione con bevande + light lunch'
}, {
	id: 20, name: 'Hard All Inclusive'
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
