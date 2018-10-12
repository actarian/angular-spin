import { Component, Input, ViewEncapsulation } from '@angular/core';
import { TrustPilot } from '../../models';

@Component({
	selector: '[trustPilot]',
	templateUrl: './trust-pilot.component.html',
	styleUrls: ['./trust-pilot.component.scss'],
	encapsulation: ViewEncapsulation.Emulated,
})

export class TrustPilotComponent {

	@Input() trustPilot: TrustPilot;

}
