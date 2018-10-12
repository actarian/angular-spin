import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { finalize, first } from 'rxjs/operators';
import { PageComponent, RouteService } from '../../core';
import { DataService } from '../../models/data.service';
import { Support, SupportService } from './support.service';

@Component({
	selector: 'support-component',
	templateUrl: './support.component.html',
	styleUrls: ['./support.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class SupportComponent extends PageComponent implements OnInit {

	model: Support = {};
	requestTypes: any[] = [];
	error: any;
	busy: boolean = false;
	submitted: boolean = false;
	sent: boolean = false;
	exists$: Function;

	constructor(
		protected routeService: RouteService,
		private dataService: DataService,
		private supportService: SupportService,
	) {
		super(routeService);
	}

	ngOnInit() {
		this.dataService.support().pipe(
			first()
		).subscribe(requestTypes => {
			this.requestTypes = requestTypes;
			this.model = {};
		});
	}

	onSubmit(): void {
		this.error = null;
		this.submitted = true;
		this.busy = true;
		this.supportService.support(this.model).pipe(
			first(),
			finalize(() => this.busy = false),
		).subscribe(
			() => this.sent = true,
			error => {
				this.error = error;
				this.submitted = false;
			}
		);
	}

	isMandatory(type: number): boolean {
		return this.requestTypes.find(x => x.id === Number(type) && x.mandatoryBookFile === true);
	}

}
