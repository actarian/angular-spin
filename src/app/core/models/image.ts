
export enum ImageType {
	Default = 1,
	Gallery = 2,
	Share = 3,
}

export class Image {
	id: number;
	url: string;
	title?: string;
	fileName?: string;
	type?: ImageType;
}
