import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { finalize, first, takeUntil } from 'rxjs/operators';
import { Entity, PageComponent, RouteService } from '../../core';
import { DataService, Nation } from '../../models/data.service';
import { Structure, StructureService } from './structure.service';

@Component({
	selector: 'structure-component',
	templateUrl: './structure.component.html',
	styleUrls: ['./structure.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class StructureComponent extends PageComponent implements OnInit {

	model: Structure;
	types: Entity[] = [];
	nations: Nation[] = [];
	counties: Entity[] = [];
	error: any;
	busy: boolean = false;
	submitted: boolean = false;
	sent: boolean = false;

	constructor(
		protected routeService: RouteService,
		private dataService: DataService,
		private structureService: StructureService,
	) {
		super(routeService);
	}

	ngOnInit() {
		this.dataService.typesNationsAndCounties().pipe(
			takeUntil(this.unsubscribe)
		).subscribe(data => {
			this.types = data.types;
			this.nations = data.nations;
			this.counties = data.counties;
			this.model = {};
		});
	}

	onSubmit(): void {
		this.error = null;
		this.submitted = true;
		this.busy = true;
		this.structureService.structure(this.model).pipe(
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

}
