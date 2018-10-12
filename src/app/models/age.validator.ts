import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

export class AgeValidatorOptions {
	age?: number;
	date?: Date | string;
}

@Directive({
	selector: '[age][formControlName],[age][formControl],[age][ngModel]',
	providers: [
		{ provide: NG_VALIDATORS, useExisting: forwardRef(() => AgeValidator), multi: true }
	]
})
export class AgeValidator implements Validator {

	@Input() age?: AgeValidatorOptions;

	validate(control: AbstractControl): ValidationErrors | null {
		const options = this.age;
		if (!options || !options.age) {
			return null;
		}
		if (!control.value) {
			return null;
		}
		const date = control.value instanceof Date ? control.value : new Date(control.value);
		if (!date) {
			return null;
		}
		const age = this.age.age;
		const from = this.age.date ? new Date(String(this.age.date)) : new Date();
		const past = from > new Date(from.getFullYear(), date.getMonth(), date.getDate());
		const years = (from.getFullYear() - date.getFullYear()) - (past ? 0 : 1);
		// console.log('AgeValidator.validate', this.age, date.toLocaleDateString(), age, from.toLocaleDateString(), years, past);
		if (age < 18 && years !== age) {
			return { age: true };
		} else if (years < age) {
			return { age: true };
		} else {
			return null;
		}
	}

}
