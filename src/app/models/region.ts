import { Document } from '../core/models';

export class Region implements Document {
	id: number | string;
	name: string;
	slug?: string;
}
