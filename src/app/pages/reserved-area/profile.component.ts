import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { DisposableComponent } from '../../core/disposable';
import { DataService, Nation } from '../../models/data.service';
import { User } from '../../models/user';
import { UserService } from '../../models/user.service';

export class BirthDateOptions {
	value: number;
	name: string;
}

export class BirthDate {

	_year: number;
	_month: number;
	_day: number;

	years: BirthDateOptions[];
	months: BirthDateOptions[];
	days: BirthDateOptions[];

	date: Date;

	constructor(
		private datePipe: DatePipe,
	) {
		this.setDate();
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

	setDate(date?: Date) {
		date = date ? new Date(date) : null;
		const today: Date = new Date();
		const count: number = 100;
		const from: number = today.getFullYear() - count;
		this.years = new Array(count).fill(0).map((x, i: number) => {
			return { value: from + i, name: (from + i).toString() };
		});
		this._year = date ? date.getFullYear() : today.getFullYear() - 20;
		this.months = new Array(12).fill(0).map((x, i: number) => {
			const month: Date = new Date(this._year, i, 1);
			return { value: i, name: this.datePipe.transform(month, 'MMM') };
		});
		this.month = date ? date.getMonth() : 0;
	}

}

@Component({
	selector: 'profile-component',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class ProfileComponent extends DisposableComponent implements OnInit {

	nations: Nation[];
	birth: BirthDate;

	user: User;
	model: any = {};

	busy: boolean = false;

	constructor(
		private route: ActivatedRoute,
		private dataService: DataService,
		private userService: UserService,
		private datePipe: DatePipe,
	) {
		super();
	}

	ngOnInit() {
		this.user = this.route.snapshot.data['user'];
		Object.assign(this.model, this.user);
		this.dataService.nations().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(nations => {
			this.nations = nations;
			const italy: Nation = nations.find(x => x.code === 'ITA');
			this.model.country = this.model.country || italy;
			this.model.birthCountry = this.model.birthCountry || italy;
			this.model.gender = this.model.gender || 'M';
		});
		this.birth = new BirthDate(this.datePipe);
	}

	onCountryChanged() {
		console.log('ProfileComponent.onCountryChanged', this.model.country);
	}

	onBirthCountryChanged() {
		console.log('ProfileComponent.onCountryChanged', this.model.birthCountry);
	}

	onBirthDateChanged() {
		this.model.birthDate = this.birth.date;
		console.log('ProfileComponent.onBirthDateChanged', this.datePipe.transform(this.model.birthDate, 'yyyy-MM-dd'));
	}

	onGenderChanged() {
		console.log('ProfileComponent.onGenderChanged', this.model.gender);
	}

	onSubmit() {
		this.userService.update(this.model).pipe(
			takeUntil(this.unsubscribe)
		).subscribe(user => {
			this.user = user;
			Object.assign(this.model, this.user);
		});
	}

}
