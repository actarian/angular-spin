import { Component, EventEmitter, forwardRef, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NgModel, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { InputDate } from '../../models';

@Component({
	selector: 'input-date',
	templateUrl: './input-date.component.html',
	styleUrls: ['./input-date.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => InputDateComponent), multi: true },
		{ provide: NG_VALIDATORS, useExisting: forwardRef(() => InputDateComponent), multi: true }
	]
})

export class InputDateComponent implements ControlValueAccessor, OnChanges {

	@Output() doInputDate: EventEmitter<any> = new EventEmitter();

	@Input() ngModel: NgModel;
	@Input() disabled: boolean;
	@Input() futureDate: boolean;
	@Input() dateValue: Date;

	model: InputDate = new InputDate();

	validator: any = () => { };
	propagateChange: any = () => { };

	get date() {
		return this.dateValue;
	}

	set date(value) {
		this.dateValue = value;
		this.model.setDate(value, this.futureDate);
		this.propagateChange(value);
	}

	writeValue(value) {
		// console.log('InputDateComponent.writeValue', value);
		if (value) {
			this.date = value;
		}
	}

	validate(control: FormControl) {
		return this.validator(control);
	}

	registerOnChange(callback) {
		this.propagateChange = callback;
	}

	registerOnTouched() { }

	ngOnChanges(inputs) {
		/*
		if (inputs.dateMin || inputs.dateMax) {
			this.validator = createDateValidator(this.dateMin, this.dateMax);
			this.propagateChange(this.date);
		}
		*/
	}

	onInputDateChanged() {
		// console.log('InputDateComponent.onInputDateChanged', this.model.date, this.model.date.toISOString());
		this.date = this.model.date;
		this.doInputDate.emit(this.dateValue);
	}

	/*
	dateToKey(date: Date): string {
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
	}
	*/

}

/*
export function createDateValidator(minValue: Date, maxValue: Date) {
	return (c: FormControl) => {
		return null;
	};
}
*/
