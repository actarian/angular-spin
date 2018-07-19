
export enum ImageType {
	Default = 0,
	Gallery = 1,
	Share = 2,
}

export class Image {
	id: number;
	slug: string;
	title?: string;
	type?: ImageType;
}
