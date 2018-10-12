import { Component, ViewEncapsulation } from '@angular/core';
import { of } from 'rxjs';
import { catchError, finalize, first } from 'rxjs/operators';
import { PageComponent, RouteService } from '../../core';
import { Operator, OperatorService } from './operator.service';

@Component({
	selector: 'operator-component',
	templateUrl: './operator.component.html',
	styleUrls: ['./operator.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class OperatorComponent extends PageComponent {

	model: Operator = { passwordReveal: true };
	requestTypes: any[] = [];
	error: any;
	busy: boolean = false;
	submitted: boolean = false;
	sent: boolean = false;
	exists$: Function;

	constructor(
		protected routeService: RouteService,
		private operatorService: OperatorService,
	) {
		super(routeService);
	}

	onSubmit(): void {
		this.error = null;
		this.submitted = true;
		this.busy = true;
		this.operatorService.login(this.model).pipe(
			first(),
			catchError(error => of(null)),
			finalize(() => this.busy = false),
		).subscribe(
			operator => {
				if (operator) {
					this.sent = true;
				} else {
					this.error = { message: 'Operatore inesistente' };
				}
			},
			error => {
				this.error = error;
				this.submitted = false;
			}
		);
	}

}
