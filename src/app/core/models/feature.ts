

export enum FeatureType {
	Description = 2,
}

export class Feature {
	id: number | string;
	title?: string;
	description?: string;
	type?: FeatureType;
}
