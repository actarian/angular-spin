import { Entity } from '../models';

export class Label implements Entity {
	id: number;
	name: string;
	lang: string;
	labels?: any;
}
