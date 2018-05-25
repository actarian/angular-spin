import { Document, Option } from '../core/models';

export class Tag extends Option implements Document {
	abstract?: string;
	category: number;
	icon?: string;
	slug?: string;
}
