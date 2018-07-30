import { Document } from '../core/models';

export class Category implements Document {
	id: number;
	name: string;
	slug?: string;
	image?: string = 'https://picsum.photos/480/360/?random';
}
