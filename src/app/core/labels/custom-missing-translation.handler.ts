import { Injectable } from '@angular/core';
import { MissingTranslationHandler, MissingTranslationHandlerParams } from '@ngx-translate/core';

@Injectable({
	providedIn: 'root'
})
export class CustomMissingTranslationHandler implements MissingTranslationHandler {
	handle(params: MissingTranslationHandlerParams) {
		// console.log('CustomMissingTranslationHandler', params);
		return `{${params.key}}`;
	}
}
