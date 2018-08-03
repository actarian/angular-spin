import { Entity } from '../models';

export class Label implements Entity {
	id: number | string;
	name: string;
	lang: string;
	labels?: any;
}
