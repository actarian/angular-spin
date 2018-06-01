import { Document } from '../core/models';

export class Region implements Document {
	id: number;
	name: string;
	slug?: string;
}
