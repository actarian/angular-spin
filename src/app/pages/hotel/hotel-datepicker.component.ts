import { Component, EventEmitter, forwardRef, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NgModel, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BookingAvailability } from '../../models/booking';
import { CalendarOptions } from '../../models/calendar-options';

/*
template: `
    <button (click)="increase()">+</button> {{date}} <button (click)="decrease()">-</button>
  `,
*/

@Component({
	selector: 'hotel-datepicker',
	templateUrl: './hotel-datepicker.component.html',
	styleUrls: ['./hotel-datepicker.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
	providers: [
		{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => HotelDatepickerComponent), multi: true },
		{ provide: NG_VALIDATORS, useExisting: forwardRef(() => HotelDatepickerComponent), multi: true }
	]
})

export class HotelDatepickerComponent implements ControlValueAccessor, OnChanges {

	@Output()
	doSelect: EventEmitter<any> = new EventEmitter();

	@Input() ngModel: NgModel;
	@Input() availableDates: BookingAvailability[];
	@Input() disabled: boolean;

	@Input() dateMin: Date;
	@Input() dateMax: Date;
	@Input() dateValue: Date;
	@Input() active: boolean = false;

	calendar: CalendarOptions = new CalendarOptions();

	validator: any = () => { };
	propagateChange: any = () => { };

	writeValue(value) {
		if (value) {
			this.date = value;
		}
	}

	validate(c: FormControl) {
		return this.validator(c);
	}

	registerOnChange(callback) {
		this.propagateChange = callback;
	}

	registerOnTouched() { }

	ngOnChanges(inputs) {
		if (inputs.dateMin || inputs.dateMax) {
			this.validator = createDateValidator(this.dateMin, this.dateMax);
			this.propagateChange(this.date);
		}
	}

	get date() {
		return this.dateValue;
	}

	set date(value) {
		this.dateValue = value;
		this.calendar.month = this.date.getMonth() + 1;
		this.calendar.year = this.date.getFullYear();
		this.propagateChange(value);
	}

	get disabledDates(): Date[] {
		const year: number = this.calendar.year;
		const month: number = this.calendar.month - 1;
		const monthdays: number = new Date(year, month, 0).getDate();
		const availableDates: string[] = this.availableDates.map((a: BookingAvailability) => this.dateToKey(a.getDate())) || [];
		let disabledDates: Date[] = new Array(monthdays + 60).fill(new Date()).map((d: Date, i: number) => {
			return new Date(year, month, i - 30 + 1);
		});
		disabledDates = disabledDates.filter(d => availableDates.indexOf(this.dateToKey(d)) === -1);
		// console.log('availableDates', availableDates, 'disabledDates', disabledDates.map(d => this.dateToKey(d)));
		return disabledDates;
	}

	onMonthChange(value: any) {
		this.calendar.month = value.month;
		this.calendar.year = value.year;
		// console.log('HotelDatepickerComponent.onMonthChange', value);
	}

	onSelect(value: Date) {
		console.log('HotelDatepickerComponent.onSelect', value, value.toISOString());
		this.date = value;
		this.doSelect.emit();
	}

	dateToKey(date: Date): string {
		return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
	}

}

export function createDateValidator(minValue: Date, maxValue: Date) {
	return (c: FormControl) => {
		/*
		const error = {
			rangeError: {
				given: c.value,
				max: maxValue || 10,
				min: minValue || 0
			}
		};
		return (c.value < +minValue || c.value > +maxValue) ? error : null;
		*/
		return null;
	};
}
