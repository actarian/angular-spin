import { Document } from '../models';

export class Page implements Document {
	id: number;
	name: string;
	title?: string;
	description?: string;
	author?: string;
	slug?: string;
	component?: string;
}
