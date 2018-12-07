
export class BirthPlace {

	code: string;
	name: string;
	province: string;

	static normalizeString(text) {
		return text.trim()
			.replace(new RegExp(/[àá]/g), 'a\'')
			.replace(new RegExp(/[èé]/g), 'e\'')
			.replace(new RegExp(/[ìí]/g), 'i\'')
			.replace(new RegExp(/[òó]/g), 'o\'')
			.replace(new RegExp(/[ùú]/g), 'u\'')
			.toUpperCase();
	}

	constructor(
		options: any
	) {
		if (options) {
			Object.assign(this, options);
		}
	}

}

