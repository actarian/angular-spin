

import { Inject } from '@angular/core';
import { DefaultUrlSerializer, UrlSerializer, UrlTree } from '@angular/router';

class CustomUrlSerializer implements UrlSerializer {

	constructor(
		@Inject(DefaultUrlSerializer) private serializer: DefaultUrlSerializer
	) { }

	parse(url: string): UrlTree {
		console.log('CustomUrlSerializer.parse', url);
		return this.serializer.parse(url);
	}

	serialize(tree: UrlTree): string {
		console.log('CustomUrlSerializer.serialize', tree);
		return this.serializer.serialize(tree);
	}

}
