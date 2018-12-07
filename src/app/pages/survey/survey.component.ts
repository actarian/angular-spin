import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, first } from 'rxjs/operators';
import { PageComponent, RouteService } from '../../core';
import { DataService } from '../../models/data.service';
import { LoadingType } from '../../sections/loading/loading.component';
import { Survey, SurveyResponse, SurveyService } from './survey.service';

@Component({
	selector: 'survey-component',
	templateUrl: './survey.component.html',
	styleUrls: ['./survey.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class SurveyComponent extends PageComponent implements OnInit {

	page: any = {};
	model: Survey;
	response: SurveyResponse;
	name: string;
	data: any = {
		source: [],
		type: []
	};
	feedback: any = {
		support: [1, 2, 3, 4, 5],
		pets: [true, false],
		position: [1, 2, 3, 4, 5],
		staff: [1, 2, 3, 4, 5],
		services: [1, 2, 3, 4, 5, 0],
		restaurant: [1, 2, 3, 4, 5, 0],
		clean: [1, 2, 3, 4, 5],
		room: [1, 2, 3, 4, 5],
		report: [1, 2, 3, 4, 5],
		wellness: [1, 2, 3, 4, 5, 0]
	};
	loadingTypes: any = LoadingType;
	rating: number = 0;
	error: any;
	busy: boolean = false;
	submitted: boolean = false;
	sent: boolean = false;
	filled: boolean = false;

	constructor(
		protected routeService: RouteService,
		private router: Router,
		private dataService: DataService,
		private surveyService: SurveyService,
	) {
		super(routeService);
	}

	ngOnInit() {
		this.dataService.survey().pipe(
			first()
		).subscribe(data => {
			this.data = data;
		});

		// https://eurospin-viaggi.wslabs.it/questionario_trustpilot?customerCode=000223&bookingFile=18/021174&startDate=14/10/2018&endDate=16/10/2018

		const queryParams = this.router.parseUrl(this.router.url).queryParams;
		const customerCode = queryParams.customerCode; // '000223';
		const bookingFile = queryParams.bookingFile; // '18/021174';
		const startDate = queryParams.startDate; // '14/10/2018';
		const endDate = queryParams.endDate; // '16/10/2018';

		this.surveyService.data(customerCode, bookingFile, startDate, endDate).pipe(
			first(),
		).subscribe((response: SurveyResponse) => {
			this.response = response;
			this.name = response.file ? response.file.customerName.split('  ')[1] : 'Cliente';
			this.filled = response.filled;
			if (!response.filled) {
				this.model = new Survey({
					customerCode,
					bookingCode: bookingFile,
					startDate,
					endDate,
					idDoc: response.service.id,
					struttura: response.service.frontEndName
				});
			}
		});
	}

	onSubmit(): void {
		this.error = null;
		this.submitted = true;
		this.busy = true;
		this.surveyService.survey(this.model).pipe(
			first(),
			finalize(() => this.busy = false),
		).subscribe(
			() => {
				this.sent = true;
				setTimeout(() => {
					window.location.href = this.response.trustpilotUrl;
				}, 3000);
			},
			error => {
				this.error = error;
				this.submitted = false;
			}
		);
	}

	onChange() {
		this.calculateAverage();
	}

	calculateAverage() {
		const parameters = [
			'posizione',
			'staff',
			'servizi',
			'ristorazione',
			'pulizia',
			'camera',
			'qualitaPrezzo',
			'areaBenessere'
		];
		let numP: number = 0;
		let rating: number = 0;
		parameters.forEach(p => {
			if (this.model[p] && this.model[p] !== 0) {
				numP++;
				rating += this.model[p];
			}
		});
		this.rating = numP > 0 ? (rating / numP) * 2 : null;
	}

	isMandatory(type: number): boolean {
		return false; // this.requestTypes.find(x => x.id === Number(type) && x.mandatoryBookFile === true);
	}
}
