

export class InputDateOptions {
	value: number;
	name: string;
}

export class InputDate {

	_year: number;
	_month: number;
	_day: number;

	years: InputDateOptions[];
	months: InputDateOptions[];
	days: InputDateOptions[];

	date: Date;

	constructor(date?: Date) {
		this.setDate(date);
	}

	get year(): number {
		return this._year;
	}

	set year(n: number) {
		this._year = Number(n || 1970);
		this.month = this._month || 0;
	}

	get month(): number {
		return this._month;
	}

	set month(n: number) {
		this._month = Number(n || 0);
		const count: number = new Date(this._year, this._month + 1, 0).getDate();
		this.days = new Array(count).fill(0).map((x, i: number) => {
			return { value: i + 1, name: (i + 1).toString() };
		});
		this.day = this._day || 1;
	}

	get day(): number {
		return this._day;
	}

	set day(n: number) {
		this._day = Number(n || 1);
		this.date = new Date(this._year, this._month, this._day);
	}

	setDate(date?: Date, futureDate?: boolean) {
		date = date ? new Date(date) : null;
		const today: Date = new Date();
		const count: number = 100;
		const from: number = futureDate ? today.getFullYear() : today.getFullYear() - count;
		this.years = new Array(count).fill(0).map((x, i: number) => {
			return { value: from + i, name: (from + i).toString() };
		});
		this._year = date ? date.getFullYear() : today.getFullYear() - 20;
		this.months = new Array(12).fill(0).map((x, i: number) => {
			const month: Date = new Date(this._year, i, 1);
			return { value: i, name: month.toISOString() };
		});
		this.month = date ? date.getMonth() : (futureDate ? today.getMonth() : 0);
		this.day = date ? date.getDate() : (futureDate ? today.getDate() : 1);
	}

}
