
export class CalendarOptions {

	it: any = {
		firstDayOfWeek: 1,
		dayNames: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'],
		dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mer', 'Giov', 'Ven', 'Sab'],
		dayNamesMin: ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'],
		monthNames: ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'],
		dateFormat: 'dd/mm/yy',
		monthNamesShort: ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'],
		today: 'Oggi',
		clear: 'Resetta'
	};

	month?: number;
	year?: number;

	minDate: Date;
	maxDate: Date;

	minYear: number;
	maxYear: number;

	active: string;

	constructor(
		minDate?: Date,
		maxDate?: Date
	) {
		this.minDate = minDate ? minDate : new Date();
		if (maxDate) {
			this.maxDate = maxDate;
		} else {
			this.maxDate = new Date();
			this.maxDate.setFullYear(this.maxDate.getFullYear() + 1);
		}
		this.minYear = this.minDate.getFullYear();
		this.maxYear = this.maxDate.getFullYear();
	}
}
