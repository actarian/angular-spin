import { Entity } from './entity';

export class Option extends Entity {
	selected?: boolean;
	visible?: boolean = true;
	count?: number = 0;
}
